
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            const lines = content.split('\n');
            for (const line of lines) {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
                }
            }
        }
    } catch (e) { console.error(e); }
}
loadEnv();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
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
