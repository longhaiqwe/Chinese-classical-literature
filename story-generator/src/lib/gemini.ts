import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('Missing Gemini API Key');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export const geminiModel = genAI.getGenerativeModel({
    model: 'gemini-3-pro-preview',
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    id: { type: SchemaType.STRING },
                    title: { type: SchemaType.STRING },
                    narrative: { type: SchemaType.STRING },
                    choices: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                text: { type: SchemaType.STRING },
                                next_scene_id: { type: SchemaType.STRING, nullable: true },
                                is_correct: { type: SchemaType.BOOLEAN },
                                failure_message: { type: SchemaType.STRING, nullable: true }
                            },
                            required: ["text", "is_correct"]
                        }
                    }
                },
                required: ["id", "title", "narrative", "choices"]
            }
        }
    }
});

export const imageModel = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview'
});

export const GENERATE_STORY_PROMPT = (topic: string) => `
You are a creative writer for a Chinese Classical Literature interactive story game.
Create a complete branching story based on the topic: "${topic}".

Requirements:
1.  **Language**: All text must be in Chinese (Simplified).
2.  **Style**: Ancient rhyme (古韵), elegant, immersive.
3.  **Structure**:
    *   Return an ARRAY of Scene objects.
    *   Each Scene has an 'id' (unique string).
    *   'narrative': Detailed description of the scene.
    *   'choices': Exactly 3 options.
    *   One option is CORRECT and leads to the next main plot scene (or the ending summary).
    *   Two options are INCORRECT (traps/failures) and lead to failure endings (or immediate failure messages).
    *   **Final Scene**: The last scene provided in this JSON should be the **CLIMAX** of the story, not a post-game summary. It MUST still have 3 choices (1 Correct, 2 Incorrect). The correct choice should conceptually lead to the "Happy Ending". Do NOT create a scene with only 1 options or where all options are correct. Treat the finale as a gameplay challenge.
4.  **Failure handling**:
    *   If a choice is incorrect, set 'is_correct' to false.
    *   You can either handle failure by providing a 'failure_message' (short feedback) or by routing to a specific failure scene (via next_scene_id). For this game, simpler is often better: providing a 'failure_message' is preferred for immediate feedback, but if the failure leads to an interesting parallel ending, create a new scene for it.
5.  **Content**:
    *   Include a "start" scene.
    *   Ensure the story has a satisfying conclusion.
    *   Make the "failure" scenarios interesting (parallel timelines or poetic ends).

Output JSON format only.
`;

export async function generateContent(prompt: string) {
    try {
        const result = await geminiModel.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
}
