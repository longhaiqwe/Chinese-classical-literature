
import { createClient } from '@supabase/supabase-js';
import { CATEGORIES } from '../data/stories';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY) must be set.');
    console.error('Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/generate_narrations.ts');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateNarrations() {
    console.log('Starting batch narration generation...');

    for (const category of CATEGORIES) {
        console.log(`Processing category: ${category.id} (${category.title})`);

        for (const story of category.stories) {
            console.log(`  Processing story: ${story.id} (${story.title})`);

            for (const scene of story.scenes) {
                console.log(`    Processing scene ${scene.id}: ${scene.title}`);

                try {
                    // 1. Request Generation
                    let { data, error } = await supabase.functions.invoke('request-narration', {
                        body: {
                            story_id: story.id,
                            scene_index: scene.id,
                            text: scene.narrative
                        }
                    });

                    if (error) {
                        console.error(`    [ERROR] Failed to invoke request-narration for scene ${scene.id}:`, error);
                        continue;
                    }

                    if (data?.status === 'success') {
                        console.log(`    [SUCCESS] Audio already exists: ${data.audio_url}`);
                        continue;
                    }

                    // 2. Poll for Completion
                    console.log(`    [PENDING] Generation initiated. Polling for completion...`);
                    let retries = 0;
                    const maxRetries = 20; // 20 * 5s = 100s timeout

                    while (retries < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s

                        const { data: statusData, error: statusError } = await supabase.functions.invoke('check-narration-status', {
                            body: {
                                story_id: story.id,
                                scene_index: scene.id
                            }
                        });

                        if (statusError) {
                            console.error(`    [WARN] Error checking status:`, statusError);
                            retries++;
                            continue;
                        }

                        if (statusData?.status === 'success') {
                            console.log(`    [SUCCESS] Audio generated and uploaded: ${statusData.audio_url}`);
                            break;
                        } else if (statusData?.status === 'failed') {
                            console.error(`    [FAILED] Generation failed: ${statusData.message}`);
                            break;
                        } else {
                            process.stdout.write('.'); // progress indicator
                            retries++;
                        }
                    }

                    if (retries >= maxRetries) {
                        console.error(`    [TIMEOUT] Timed out waiting for generation.`);
                    }

                } catch (err) {
                    // Check for rate limit error
                    if (JSON.stringify(err).includes("Too many requests")) {
                        console.log(`    [RATE LIMIT] Hit rate limit. Waiting 60s before retry...`);
                        await new Promise(resolve => setTimeout(resolve, 60000));
                        // Decrement loop counter or retry logic? 
                        // Simplified: just wait and let next iteration proceed (or maybe retry this scene?)
                        // For simplicity in this script, we'll just log and move to next, user can re-run.
                        // Ideally we should retry.
                    }
                    console.error(`    [EXCEPTION] Error processing scene ${scene.id}:`, err);
                }

                // Add delay to avoid rate limiting (3 requests per 60s => 1 req per 20s)
                // We add 25s padding to be safe.
                console.log(`    [WAIT] Waiting 25s to respect rate limit...`);
                await new Promise(resolve => setTimeout(resolve, 25000));
            }
        }
    }

    console.log('Batch generation completed.');
}

generateNarrations().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
