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
                ending_title: { type: SchemaType.STRING, description: "A 4-character idiom for the success ending title, e.g., '义薄云天'" },
                ending_description: { type: SchemaType.STRING, description: "A concluding message for the user upon success." },
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
You are a creative writer for a Chinese Classical Literature interactive story game.
Create a complete branching story based on the topic: "${topic}".

    Requirements:
1. ** Language **: All text must be in Chinese(Simplified).
2. ** Style **: Ancient rhyme(古韵), elegant, immersive.
3. ** Length **: The story MUST contain ** 4 to 6 scenes ** for the main plot path. 3 scenes is too short.
4. ** Perspective **: Third - person perspective. ** Do NOT use "you"(你) ** to refer to the protagonist.Use the historical figure's name or title directly (e.g., "Kong Ming", "Li Bai").
5. ** Structure **:
    * Return a JSON OBJECT with the following fields:
        * id: A unique string ID for the story in Pinyin(e.g., "huoshaochibi", "caochuanjiejian").
        * category_id: Choose the most appropriate category from: "sanguoyanyi"(Three Kingdoms), "xiyouji"(Journey to the West), "shanhaijing"(Classic of Mountains and Seas), "lunyu"(Analects), "shijing"(Book of Songs).
        * description: A brief summary of the story (1-2 sentences), suitable for a card preview.
        * ending_title: A 4-character idiom for the success ending title.
        * ending_description: A concluding message for the user upon success.
        * scenes: An ARRAY of Scene objects.
    * Each Scene has an 'id'(unique string).
    * 'narrative': Detailed description of the scene.
    * 'choices': Exactly 3 options.Keep texts ** very short ** (under 10 chars).
    * One option is CORRECT and leads to the next main plot scene(or the ending summary).
    * Two options are INCORRECT(traps / failures) and lead to failure endings.
    *   ** Final Scene **: The last scene provided in this JSON should be the ** CLIMAX ** of the story, not a post - game summary.It MUST still have 3 choices(1 Correct, 2 Incorrect).The correct choice should conceptually lead to the "Happy Ending".Do NOT create a scene with only 1 options or where all options are correct.Treat the finale as a gameplay challenge.
6. ** Failure handling **:
    * If a choice is incorrect, set 'is_correct' to false.
    *   ** MANDATORY **: You MUST provide a 'failure_message'(short feedback explaining why the choice was wrong) for ALL choices, even correct ones(as positive reinforcement or just blank).
    * For incorrect choices, this message is CRITICAL.
7. ** Content **:
    * Include a "start" scene.
    * Ensure the story has a satisfying conclusion.
    * Make the "failure" scenarios interesting(parallel timelines or poetic ends).
    * Scene titles should follow the format "第 X 章 · Title", where X starts from 1 (not 0).

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
