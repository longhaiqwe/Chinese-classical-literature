
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser
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
                    const value = match[2].trim().replace(/^["']|["']$/g, '');
                    process.env[key] = value;
                }
            }
            console.log('Loaded .env file');
        }
    } catch (e) { console.error(e); }
}

loadEnv();

const SUBAPASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!SUBAPASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(SUBAPASE_URL, SUPABASE_KEY);

// Check permissions
if (!SUPABASE_KEY.startsWith('eyJ') && !SUPABASE_KEY.startsWith('sb_') && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // warning
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_KEY.includes('service_role')) {
    console.warn('WARNING: You might not have permission to list/move files without SERVICE_ROLE_KEY.');
    console.warn('RUN WITH: SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/migrate_images.ts');
}

const SOURCE_BUCKET = 'story-assets';
const TARGET_BUCKET = 'images';

async function migrate() {
    console.log(`Starting migration: ${SOURCE_BUCKET} -> ${TARGET_BUCKET}`);

    // 0. Ensure target bucket exists
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(TARGET_BUCKET);
    if (bucketError && bucketError.message.includes('not found')) {
        console.log(`Bucket '${TARGET_BUCKET}' not found. Creating...`);
        const { data: newBucket, error: createError } = await supabase.storage.createBucket(TARGET_BUCKET, {
            public: true,
            fileSizeLimit: undefined, // default
            allowedMimeTypes: ['image/*']
        });
        if (createError) {
            console.error(`Failed to create bucket '${TARGET_BUCKET}':`, createError);
            return;
        }
        console.log(`Bucket '${TARGET_BUCKET}' created successfully.`);
    } else if (bucketError) {
        console.error(`Error checking bucket '${TARGET_BUCKET}':`, bucketError);
        return;
    } else {
        console.log(`Bucket '${TARGET_BUCKET}' already exists.`);
    }

    // 1. List all files in source
    // Recursive listing is tricky. Storage API `list` only does one level unless we loop.
    // However, we know our structure: category/story/file.jpg.
    // Let's rely on data from DB or just crawl 3 levels deep?
    // DB is safer because we want to update what is used. 
    // BUT we should move everything.

    // Let's try shallow list first to see categories.
    const { data: categories, error: catError } = await supabase.storage.from(SOURCE_BUCKET).list();
    if (catError) {
        console.error('Error listing root:', catError);
        return;
    }

    let fileCount = 0;
    let errorCount = 0;

    for (const cat of categories || []) {
        if (!cat.id) { // It's a folder
            console.log(`Scanning category: ${cat.name}`);
            const { data: stories, error: storyError } = await supabase.storage.from(SOURCE_BUCKET).list(cat.name);

            for (const story of stories || []) {
                if (!story.id) { // It's a folder
                    console.log(`  Scanning story: ${story.name}`);
                    const { data: files, error: fileError } = await supabase.storage.from(SOURCE_BUCKET).list(`${cat.name}/${story.name}`);

                    for (const file of files || []) {
                        if (file.id) { // It's a file
                            const oldPath = `${cat.name}/${story.name}/${file.name}`;
                            const newPath = oldPath; // Same structure

                            console.log(`    Migrating: ${oldPath}`);

                            // Copy
                            const { error: copyError } = await supabase.storage.from(SOURCE_BUCKET).copy(oldPath, newPath, {
                                destinationBucket: TARGET_BUCKET
                            });

                            // Wait, `copy` across buckets? 
                            // Supabase JS client `copy` might NOT support cross-bucket copy elegantly in one call if `from` is bound to a bucket.
                            // Actually `from(BUCKET).copy(src, dest)` is usually within same bucket.
                            // Cross-bucket copy: `move`/`copy` with `destinationBucket` option? 
                            // Checking documentation/types: `copy(fromPath, toPath, options?: { destinationBucket: string })`?
                            // If not supported, we must Download -> Upload.

                            // Let's try simple copy first, if fails, download/upload.

                            // Method A: Download -> Upload (Safe)
                            const { data: blob, error: downloadError } = await supabase.storage.from(SOURCE_BUCKET).download(oldPath);
                            if (downloadError) {
                                console.error(`    Download failed: ${downloadError.message}`);
                                errorCount++;
                                continue;
                            }

                            const { error: uploadError } = await supabase.storage.from(TARGET_BUCKET).upload(newPath, blob!, {
                                contentType: file.metadata?.mimetype || 'image/jpeg',
                                upsert: true
                            });

                            if (uploadError) {
                                console.error(`    Upload failed: ${uploadError.message}`);
                                errorCount++;
                                continue;
                            }

                            // Update DB URL
                            // We need to find records that use this image.
                            // Since DB uses full URL, we search by partial match?
                            // Or we just update ALL scenes.

                            fileCount++;
                        }
                    }
                }
            }
        }
    }

    console.log(`Moved ${fileCount} files.`);
    console.log('Updating Database Records...');

    // Bulk update approach: replace substring in DB
    // SQL: UPDATE scenes SET image_url = REPLACE(image_url, '/story-assets/', '/images/')
    // Supabase JS doesn't do raw SQL easily unless rpc.
    // We will fetch all scenes and update locally.

    // Fetch all scenes with old URL
    const { data: scenes, error: scenesError } = await supabase
        .from('scenes')
        .select('id, image_url')
        .ilike('image_url', '%/story-assets/%');

    if (scenesError) {
        console.error('Error fetching scenes:', scenesError);
    } else {
        console.log(`Found ${scenes.length} scenes to update.`);
        for (const scene of scenes) {
            const newUrl = scene.image_url.replace('/story-assets/', '/images/');
            const { error: updateError } = await supabase
                .from('scenes')
                .update({ image_url: newUrl })
                .eq('id', scene.id);

            if (updateError) console.error(`  Failed to update scene ${scene.id}:`, updateError.message);
        }
    }

    console.log('Migration complete.');
}

migrate();
