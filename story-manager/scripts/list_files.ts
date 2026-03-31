
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { loadRuntimeEnv } from '../src/core/env-loader.js';
import { readRequiredSupabaseKey, readRequiredSupabaseUrl } from '../src/core/env.js';

const runtimeCwd = fileURLToPath(new URL('..', import.meta.url));

try {
    loadRuntimeEnv({ cwd: runtimeCwd });
} catch (e) { console.error(e); }

let supabaseUrl: string;
let supabaseKey: string;

try {
    supabaseUrl = readRequiredSupabaseUrl();
    supabaseKey = readRequiredSupabaseKey();
} catch {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(
    supabaseUrl,
    supabaseKey
);

async function listFiles() {
    console.log('Listing files in "narrations" bucket root...');
    const { data, error } = await supabase.storage.from('narrations').list();
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Files:', data);

    // Check inside a folder if any
    for (const item of data || []) {
        if (!item.id) { // Folder often doesn't have ID or specific metadata, but here it's `id`, `name`, `metadata`.
            // Supabase storage list returns objects with `name`.
            console.log('Checking contents of:', item.name);
            const { data: subData } = await supabase.storage.from('narrations').list(item.name);
            console.log(`Contents of ${item.name}:`, subData);
        }
    }
}

listFiles();
