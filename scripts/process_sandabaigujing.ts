
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// CONFIG
const SUPABASE_URL = 'https://yvftzwxiiyhheaoykxgc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZnR6d3hpaXloaGVhb3lreGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNzA1NzIsImV4cCI6MjA4MjY0NjU3Mn0.s5tWDl76OAxd6lH9sRrE0eHzHwfv71GvWfEpvZfz7H0';
const BUCKET_NAME = 'images';

// Dirs
const SOURCE_DIR = path.join(process.cwd(), "public/assets/xiyouji/sandabaigujing");
const TEMP_DIR = path.join(process.cwd(), 'temp_assets');
const TARGET_SUBDIR = 'xiyouji/sandabaigujing';

// File Mapping (Source Filename -> Target Filename)
const IMAGE_MAP = [
    { src: '01.png', target: 'bg_01_girl.jpg' },
    { src: '02.png', target: 'bg_02_old_woman.jpg' },
    { src: '03.png', target: 'bg_03_old_man.jpg' },
    { src: '04.png', target: 'bg_04_parting.jpg' },
    { src: '05.png', target: 'bg_05_tiger.jpg' },
    { src: '06.png', target: 'bg_06_pleading.jpg' },
    { src: '07.png', target: 'bg_07_reunion.jpg' },
    { src: '08.png', target: 'bg_08_happy_team.jpg' }
];

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function findSourceFile(filename: string): string | null {
    const filePath = path.join(SOURCE_DIR, filename);
    if (fs.existsSync(filePath)) return filePath;
    return null;
}

async function uploadFile(filePath: string, storagePath: string) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        // Ensure forward slashes
        const normalizedStoragePath = storagePath.split(path.sep).join('/');

        console.log(`Uploading ${filePath} to ${normalizedStoragePath}...`);

        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(normalizedStoragePath, fileBuffer, {
                upsert: true,
                contentType: 'image/jpeg'
            });

        if (error) {
            console.error(`Failed to upload ${normalizedStoragePath}:`, error.message);
        } else {
            console.log(`Successfully uploaded: ${normalizedStoragePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

async function cleanup() {
    console.log('Cleaning up old files...');
    // We can list files in the folder to delete them or just overwrite.
    // Since we are upserting, we don't strictly need to delete, but it's good practice if names changed.
    // For now, let's just rely on upsert as we are replacing specific files.
}

async function main() {
    // 1. Prepare Temp Dir
    const targetDir = path.join(TEMP_DIR, TARGET_SUBDIR);
    if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetDir, { recursive: true });

    console.log(`Processing images from ${SOURCE_DIR} to ${targetDir}...`);

    // 2. Process Images
    for (const item of IMAGE_MAP) {
        const srcPath = findSourceFile(item.src);
        if (!srcPath) {
            console.error(`Could not find source image for ${item.src}`);
            continue;
        }

        const destPath = path.join(targetDir, item.target);
        console.log(`Processing ${item.src} -> ${item.target}`);

        // SIPS Command: Convert to jpg, Resample width to 1024, Crop to 1024x576 (16:9)
        // Adjust crop height to be 576
        try {
            execSync(`sips -s format jpeg --resampleWidth 1024 --cropToHeightWidth 576 1024 "${srcPath}" --out "${destPath}"`, { stdio: 'ignore' });
        } catch (e) {
            console.error(`Error using sips on ${srcPath}`, e);
        }
    }

    // 3. Upload Images
    console.log('Starting upload...');
    const processedFiles = fs.readdirSync(targetDir);
    for (const file of processedFiles) {
        if (file === '.DS_Store') continue;
        const localPath = path.join(targetDir, file);
        const storagePath = path.join(TARGET_SUBDIR, file); // xiyouji/sandabaigujing/filename.jpg
        await uploadFile(localPath, storagePath);
    }

    console.log('All operations complete.');
    // Cleanup
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

main().catch(console.error);
