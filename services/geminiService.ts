
import { GoogleGenAI } from "@google/genai";
import { IGameScene } from "../types";
import { STORY_SCENES } from "../data/storyData";

// Initialize Gemini Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Returns the static, high-quality story structure.
 */
export const getStaticGameStory = (): IGameScene[] => {
  return JSON.parse(JSON.stringify(STORY_SCENES));
};

/**
 * Compresses a Base64 image string using HTML Canvas.
 * RESIZES to Max Width 800px and Quality 0.6 to ensure it fits in Firestore (Max 1MB).
 */
const compressImage = async (base64Str: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      // Resize Logic: Ensure Max Width is 800px
      // A 800px width image at 0.6 quality is usually ~100-200KB Base64, safe for Firestore.
      const MAX_WIDTH = 800;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG with 0.6 quality (High compression)
      const compressedData = canvas.toDataURL('image/jpeg', 0.6);
      
      const originalSize = base64Str.length;
      const compressedSize = compressedData.length;
      console.log(`Image compressed [${width}x${height}]: ${(originalSize/1024).toFixed(0)}KB -> ${(compressedSize/1024).toFixed(0)}KB`);
      
      resolve(compressedData);
    };
    img.onerror = (e) => {
      console.warn("Image compression failed to load source, using original.", e);
      resolve(base64Str);
    };
  });
};

/**
 * Generates an image for a specific scene.
 */
export const generateSceneImage = async (imagePrompt: string): Promise<string> => {
  const ai = getClient();
  
  const enhancedPrompt = `
    Masterpiece, Traditional Chinese Ink Wash Painting style, watercolors on rice paper.
    ${imagePrompt}
    High quality, artistic, historical atmosphere, soft lighting, brown and black ink tones.
  `;

  let rawBase64 = '';

  try {
    // Attempt 1: Gemini 3 Pro
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [
          { text: enhancedPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) {
      rawBase64 = `data:image/png;base64,${part.inlineData.data}`;
    } else {
      throw new Error("No image data found in Pro response");
    }

  } catch (error: any) {
    console.warn("Gemini 3 Pro generation failed, attempting fallback to Flash Image:", error);

    if (error.message && (error.message.includes("403") || error.message.includes("Requested entity was not found"))) {
      throw error; 
    }

    // Attempt 2: Gemini 2.5 Flash Image
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
             aspectRatio: "16:9"
          }
        }
      });

      const part = fallbackResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part?.inlineData) {
        rawBase64 = `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (fallbackError) {
      console.error("Fallback generation failed:", fallbackError);
    }
  }

  // Always compress before returning to ensure it fits in DB
  if (rawBase64) {
    try {
      return await compressImage(rawBase64);
    } catch (e) {
      console.warn("Compression failed, returning raw", e);
      return rawBase64;
    }
  }
    
  return `https://picsum.photos/800/450?grayscale&blur=2`; 
};
