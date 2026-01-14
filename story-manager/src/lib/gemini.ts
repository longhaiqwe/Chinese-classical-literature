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
            type: SchemaType.OBJECT,
            properties: {
                id: { type: SchemaType.STRING, description: "Unique story ID in pinyin, e.g., 'huoshaochibi'" },
                category_id: { type: SchemaType.STRING, description: "Category ID: 'sanguoyanyi', 'xiyouji', 'shanhaijing', 'lunyu', etc." },
                description: { type: SchemaType.STRING, description: "A brief summary of the story (1-2 sentences)." },
                ending_title: { type: SchemaType.STRING, description: "A 4-character idiom for the success ending title, e.g., '如鱼得水'" },
                ending_description: { type: SchemaType.STRING, description: "A specific summary of the story's outcome and historical significance (2-3 sentences). Do NOT use generic congratulations." },
                scenes: {
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
                                        failure_message: { type: SchemaType.STRING }
                                    },
                                    required: ["text", "is_correct", "failure_message"]
                                }
                            }
                        },
                        required: ["id", "title", "narrative", "choices"]
                    }
                }
            },
            required: ["id", "category_id", "description", "ending_title", "ending_description", "scenes"]
        }
    }
});


// Image model (for generation)
export const imageModel = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview'
});

// Generic model (specifically for prompts, no schema constraints)
export const promptModel = genAI.getGenerativeModel({
    model: 'gemini-3-pro-preview',
    generationConfig: {
        responseMimeType: "application/json"
    }
});

export const GENERATE_STORY_PROMPT = (topic: string) => `
You are a Master Storyteller of Chinese History (演义宗师), specializing in the "Romance of the Three Kingdoms" style.
Your words carry the weight of history and the vividness of a painting. You are weaving a tapestry of destiny based on: "${topic}".

    Requirements:
1. ** Language **: Chinese (Simplified).
    *   ** CRITICAL **: All text, especially the 'choices' options, MUST be in Chinese. ** NO English allowed in the final JSON content **.

2. ** Style & Tone (The Soul) **:
    *   ** Cinematic Vernacular (电影感白话) **: Blend the immersive storytelling of Ming/Qing fiction with modern clarity.
    *   ** Show, Don't Tell **: Do not say "he was angry". Say "Zhang Fei's eyes widened like brass bells, his whiskers bristling like steel wire." (张飞圆睁环眼，倒竖虎须，声若巨雷).
    *   ** Accessible Classical **: Maintain the "flavor" of ancient times (idioms, sentence structure) but ensure modern readers understand it instantly.

3. ** Scene Aesthetics (Immersion) **:
    *   ** Atmosphere First **: Start scenes by setting the mood (weather, lighting, sound). E.g., "The setting sun dyed the battlefield blood-red..." (残阳如血，荒草连天...).
    *   ** Character Presence **: When characters speak or act, describe their micro-expressions or posture. E.g., "Kong Ming waved his feather fan gently, a faint smile on his lips." (孔明轻摇羽扇，嘴角微扬).

4. ** Structure & Pacing **:
    *   ** Length **: ** 5 to 7 scenes **.
    *   ** Flow **: Scenes must flow logically like a movie reel. Use transitional phrases.
    *   ** POV **: Third-person historical.

5. ** The Weight of Choice (Interaction) **:
    *   ** Format **: Exactly 3 options per scene.
    *   ** Content **: MUST be Chinese. Under 12 chars.
    *   ** Style **: Natural, immersive action or dialogue.
        *   ** FORBIDDEN **: Do NOT use bracketed tags like [Attack] or [强攻]. Do NOT use game-like labels.
        *   ** GOOD **: "Order the archers to fire!" (令弓弩手万箭齐发) or "Frown and remain silent" (以此皱眉，默然不语).
        *   ** BAD **: "[Attack] Shoot arrows" ([强攻] 射箭).

6. ** Feedback Mechanism (Instant Karma) **:
    *   The 'failure_message' is ** Narrative Feedback **.
    *   ** Incorrect **: Instant regret or tragic consequence. "He rushed in, but an ambush awaited." (刚冲入阵中，只听一声炮响，乱箭齐发...)
    *   ** Correct **: Smooth transition ensuring continuity. "He nodded and devised a plan." (点头应允，心生一计...)

7. ** The Ending (Historical Resonance) **:
    *   The final scene is the Climax.
    *   ** ending_description **: MUST include a "Historian's Commentary" (千古评说). End with a poetic summary or deep reflection on the event's significance.
    
    *   Return a JSON OBJECT matching the schema.
    *   ** Scene titles **: 4-character idioms (e.g., "单刀赴会").

Output JSON format only.
`;

export const REFINE_STORY_PROMPT = (originalStory: any, instructions: string) => `
You are a creative editor for a Chinese Classical Literature interactive story game.
Your task is to REFINE the existing story based on the user's instructions.

Original Story JSON:
${JSON.stringify(originalStory, null, 2)}

User Instructions for Refinement:
    "${instructions}"

Requirements:
1. ** Strict JSON Output **: Return the FULL, corrected story JSON.Do NOT return a diff or partial update.The output must be valid JSON matching the original schema.
2. ** Language **: Keep everything in Chinese(Simplified) and maintain the ancient rhyme style unless asked otherwise.
3. ** Perspective **: Third - person perspective. ** Do NOT use "you"(你) **.Use the historical figure's name directly.
4. ** Concise Choices **: Keep choice texts ** very short ** (under 10 chars).
5. ** Preserve Structure **: Keep the same Scene IDs if possible, unless the user wants to fetchingly restructure the plot.
6. ** No Explanations **: Output ONLY the JSON.
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

export async function refineStory(currentStory: any, instructions: string) {
    const prompt = REFINE_STORY_PROMPT(currentStory, instructions);
    return generateContent(prompt);
}

export const GENERATE_IMAGE_PROMPTS_PROMPT = (story: any) => `
You are an expert art director for a Chinese Classical Literature graphic novel.
Your task is to generate English image generation prompts for EACH scene in the provided story.

Story JSON:
${JSON.stringify(story, null, 2)}

Requirements:
1. ** Output Format **: JSON ARRAY of objects.Each object must have:
    * scene_id: The exact ID of the scene from the story.
    * prompt_en: The English prompt for image generation.
    * prompt_cn: A Chinese translation of the prompt for the user to review.
2. ** Style Constraint **: The 'prompt_en' MUST start with "Gritty Chinese Manhua style. " and end with " no text --ar 16:9".
3. ** Content **:
    * Analyze the 'narrative' of each scene.
    * Extract key visual elements: characters(appearance, clothing), setting(era, environment, lighting), action, and mood.
    * Translate these visualization details into precise English keyphrases.
    * Avoid abstract concepts; describe what is visually present.
4. ** Completeness **: Generate a prompt for EVERY scene in the story.

Output JSON format only.
`;

export async function generateImagePrompts(story: any) {
    const prompt = GENERATE_IMAGE_PROMPTS_PROMPT(story);
    try {
        const result = await promptModel.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating image prompts:', error);
        throw error;
    }
}
