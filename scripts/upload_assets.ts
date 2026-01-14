
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// CONFIG
const SUPABASE_URL = 'https://yvftzwxiiyhheaoykxgc.supabase.co';
// Using the anon key found in services/supabase.ts
// NOTE: We need to enable "Anon Upload" policy temporarily for this to work without service_role key
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZnR6d3hpaXloaGVhb3lreGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNzA1NzIsImV4cCI6MjA4MjY0NjU3Mn0.s5tWDl76OAxd6lH9sRrE0eHzHwfv71GvWfEpvZfz7H0';

const BUCKET_NAME = 'images';
const ASSETS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/assets');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadFile(filePath: string, storagePath: string) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileBuffer, {
                upsert: true,
                contentType: getContentType(filePath)
            });

        if (error) {
            console.error(`Failed to upload ${storagePath}:`, error.message);
        } else {
            console.log(`Uploaded: ${storagePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

function getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.gif': return 'image/gif';
        default: return 'application/octet-stream';
    }
}

async function processDirectory(dir: string, baseDir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (file === '.DS_Store') continue;

        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await processDirectory(fullPath, baseDir);
        } else {
            const relativePath = path.relative(baseDir, fullPath);
            // Ensure we use forward slashes for storage paths
            const storagePath = relativePath.split(path.sep).join('/');
            await uploadFile(fullPath, storagePath);
        }
    }
}

async function main() {
    console.log(`Starting upload from ${ASSETS_DIR} to bucket ${BUCKET_NAME}...`);

    if (!fs.existsSync(ASSETS_DIR)) {
        console.error(`Assets directory not found: ${ASSETS_DIR}`);
        return;
    }

    await processDirectory(ASSETS_DIR, ASSETS_DIR);
    console.log('Upload complete.');
}

main().catch(console.error);
