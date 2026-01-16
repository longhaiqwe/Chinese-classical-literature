
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_KEY = process.env.VITE_GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_KEY) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
// Using the model from the app code check
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
// Note: 'gemini-3-pro-preview' might be specific to their project or a typo in their code, 
// usually 'gemini-1.5-pro' is the stable one. If 404 persists, I'll try a fallback.
// Actually, let's try 'gemini-1.5-flash' again but handle error.

async function main() {
    console.log('Fetching stories...');
    const { data: stories, error } = await supabase.from('stories').select('*');
    if (error) {
        console.error(error);
        return;
    }

    for (const story of stories) {
        let endingDesc = story.ending_description;

        // 1. Repair Description
        if (!endingDesc || endingDesc.trim() === '') {
            console.log(`Generating ending description for: ${story.title}`);
            try {
                const result = await model.generateContent(`
                    You are a historian of Chinese classical literature.
                    Story: ${story.title}
                    Description: ${story.description}
                    Generate a "Historian's Commentary" (ending_description) in Chinese (2-3 sentences).
                    Formal, profound style. No prefixes.
                `);
                endingDesc = result.response.text().trim();
                await supabase.from('stories').update({ ending_description: endingDesc }).eq('id', story.id);
                console.log(`Updated description for ${story.title}`);
            } catch (e) {
                console.error(`Failed generation for ${story.title}`, e);
                // Try fallback model if first fails ?
            }
        }

        // 2. Generate Audio
        if (endingDesc) {

            // Check if exists
            const { data: narrations } = await supabase
                .from('scene_narrations')
                .select('*')
                .eq('story_id', story.id)
                .eq('scene_index', -1)
                .maybeSingle(); // Use maybeSingle to avoid error if 0 rows

            if (narrations && narrations.status === 'success') {
                console.log(`Audio already exists for ${story.title}`);
                continue;
            }

            if (narrations && narrations.status === 'pending') {
                console.log(`Audio pending for ${story.title}, just polling...`);
            } else {
                console.log(`Requesting audio for ${story.title}...`);
                try {
                    const reqRes = await fetch(`${SUPABASE_URL}/functions/v1/request-narration`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        },
                        body: JSON.stringify({
                            story_id: story.id,
                            scene_index: -1,
                            text: endingDesc
                        })
                    });

                    if (!reqRes.ok) {
                        const errText = await reqRes.text();
                        console.error(`Request failed for ${story.title}: ${errText}`);
                        continue;
                    }
                } catch (e) {
                    console.error("Fetch error:", e);
                    continue;
                }
            }

            console.log(`Polling status for ${story.title}...`);

            // Poll
            let attempts = 0;
            while (attempts < 60) { // 2 mins max
                await new Promise(r => setTimeout(r, 2000));
                try {
                    const pollRes = await fetch(`${SUPABASE_URL}/functions/v1/check-narration-status`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${SUPABASE_KEY}`
                        },
                        body: JSON.stringify({
                            story_id: story.id,
                            scene_index: -1
                        })
                    });
                    if (!pollRes.ok) {
                        // Might be 404 if record not found yet?
                        continue;
                    }

                    const pollData = await pollRes.json();
                    if (pollData.status === 'success') {
                        console.log(`Audio SUCCESS for ${story.title}`);
                        break;
                    }
                    if (pollData.status === 'failed') {
                        console.error(`Audio FAILED for ${story.title}: ${pollData.message}`);
                        break;
                    }
                    process.stdout.write('.');
                } catch (e) {
                    // ignore
                }
                attempts++;
            }
            console.log('\n');
        }
    }
}

main();
