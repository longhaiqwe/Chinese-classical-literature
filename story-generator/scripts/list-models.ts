
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('Please provide GEMINI_API_KEY env var');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('Fetching available models...');
        // Note: The client SDK doesn't always expose listModels directly on the main class in all versions, 
        // but usually it's manager.listModels or similar. 
        // Actually, for the JS SDK, there isn't a direct "listModels" helper on the top level class in widely used versions 
        // effectively without using the model manager or REST.
        // Let's try the direct REST call if SDK fails, but let's try to use the SDK first if possible.
        // Actually, checking docs/types implies likely need to just use a fetch to the endpoint for a raw list if the SDK doesn't expose it easily.

        // Fallback to fetch for certainty to avoid SDK version guessing
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach((m: any) => {
                console.log(`- ${m.name} (${m.displayName})`);
                if (m.supportedGenerationMethods) {
                    console.log(`  Methods: ${m.supportedGenerationMethods.join(', ')}`);
                }
            });
        } else {
            console.log('No models found or error:', data);
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
