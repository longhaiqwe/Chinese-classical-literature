
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser since we might not have dotenv
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            const lines = content.split('\n');
            for (const line of lines) {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                    process.env[key] = value;
                }
            }
            console.log('Loaded .env file');
        } else {
            console.warn('No .env file found at', envPath);
        }
    } catch (e) {
        console.error('Error loading .env:', e);
    }
}

loadEnv();

const SUBAPASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!SUBAPASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(SUBAPASE_URL, SUPABASE_KEY);

// Check if we are likely using the service role key
if (!SUPABASE_KEY.startsWith('eyJ') && !SUPABASE_KEY.startsWith('sb_') && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Just a warning, sb_ keys are fine too if permissions allow
}
console.warn('WARNING: It looks like you are using the Anon Key. Migration might fail due to RLS permissions.');
console.warn('Please run this script with the Service Role Key:');
console.warn('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key npx tsx scripts/migrate_audio.ts');
console.warn('---------------------------------------------------');


async function migrate() {
    console.log('Starting migration...');

    // 0. List all files in root to avoid "Object not found" errors
    console.log('Listing root files...');
    const { data: rootFiles, error: listError } = await supabase.storage.from('narrations').list('', { limit: 1000 });
    if (listError) {
        console.error('Error listing root files:', listError);
        return;
    }
    const rootFileNames = new Set(rootFiles?.map(f => f.name));
    console.log(`Found ${rootFileNames.size} files in root.`);

    // 1. Fetch all stories to build a map of story_id -> category_id
    const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('id, category_id');

    if (storiesError) {
        console.error('Error fetching stories:', storiesError);
        return;
    }

    const storyCategoryMap = new Map<string, string>();
    storiesData?.forEach((s: any) => {
        if (s.id && s.category_id) {
            storyCategoryMap.set(s.id, s.category_id);
        }
    });

    // 2. Get all successful narrations
    const { data: narrations, error: narrationsError } = await supabase
        .from('scene_narrations')
        .select(`
            id,
            story_id,
            scene_index,
            audio_url,
            status
        `)
        .eq('status', 'success');

    if (narrationsError) {
        console.error('Error fetching narrations:', narrationsError);
        return;
    }

    console.log(`Found ${narrations.length} narrations DB records to check.`);

    let movedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const narration of narrations) {
        const { story_id, scene_index, audio_url } = narration;
        const category_id = storyCategoryMap.get(story_id);

        if (!category_id) {
            console.warn(`Skipping narration ${narration.id} (story ${story_id}): Type unknown (no category_id)`);
            skippedCount++;
            continue;
        }

        const oldFileName = `${story_id}_${scene_index}.mp3`;
        const newPath = `${category_id}/${story_id}/${oldFileName}`;

        // Prepare new URL prefix for check
        const EXPECTED_PREFIX = `/${category_id}/${story_id}/`;

        if (audio_url && audio_url.includes(EXPECTED_PREFIX)) {
            // Already points to new structure
            skippedCount++;
            continue;
        }

        // Check if file is in root
        if (!rootFileNames.has(oldFileName)) {
            // Not in root. Maybe already in target but DB not updated?
            // Checking if file exists at newPath is an extra API call.
            // Let's assume if it's not in root and DB is wrong, we have a problem.
            // But we can verify target existence.
            console.log(`  File ${oldFileName} not in root. Checking destination...`);
            const { data: subListData } = await supabase.storage.from('narrations').list(`${category_id}/${story_id}`);
            const existsAtDest = subListData?.some(f => f.name === oldFileName);

            if (existsAtDest) {
                console.log(`  File found at destination ${newPath}. Updating DB...`);
                // Update DB
            } else {
                console.warn(`  File missing entirely: ${oldFileName}. Skipping.`);
                errorCount++;
                continue;
            }
        } else {
            // File IS in root. Try Copy then Delete (Move might fail due to RLS policies on 'move' op)
            console.log(`Migrating: ${oldFileName} -> ${newPath}`);
            const { error: copyError } = await supabase
                .storage
                .from('narrations')
                .copy(oldFileName, newPath);

            if (copyError) {
                console.error(`  Failed to copy file ${oldFileName}:`, copyError.message);
                errorCount++;
                continue;
            }

            // Copy success, now delete original
            const { error: deleteError } = await supabase
                .storage
                .from('narrations')
                .remove([oldFileName]);

            if (deleteError) {
                console.warn(`  Warning: Copied ${oldFileName} but failed to delete original:`, deleteError.message);
                // Not a fatal error, we can proceed to update DB
            }
        }

        // 3. Update DB (if moved or found at dest)
        const { data: publicUrlData } = supabase
            .storage
            .from('narrations')
            .getPublicUrl(newPath);

        const newUrl = publicUrlData.publicUrl;

        const { error: updateError } = await supabase
            .from('scene_narrations')
            .update({ audio_url: newUrl })
            .eq('id', narration.id);

        if (updateError) {
            console.error(`  Failed to update DB for ${narration.id}:`, updateError.message);
            errorCount++;
        } else {
            console.log(`  Success! Updated to ${newUrl}`);
            movedCount++;
        }
    }

    console.log('Migration complete.');
    console.log(`Moved/Updated: ${movedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
}

migrate();
