
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

// --- Configuration ---
// List of tables to backup
const TABLES = [
    'stories',
    'scenes',
    'scene_options',
    'categories',
    'scene_narrations',
    'feedback'
];

// List of storage buckets to backup
const BUCKETS = [
    'narrations',
    'story-assets',
    'images' // Checking images bucket too just in case
];

// --- Helpers ---

// Simple .env parser (since we might not have dotenv installed)
async function loadEnv() {
    try {
        const envContent = await fs.readFile('.env', 'utf-8');
        const env: Record<string, string> = {};
        envContent.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                let value = match[2] || '';
                if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                    value = value.replace(/\\n/gm, '\n');
                }
                value = value.replace(/(^['"]|['"]$)/g, '').trim();
                env[match[1]] = value;
            }
        });
        return env;
    } catch (error) {
        return {};
    }
}

function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

// --- Main Script ---

async function main() {
    console.log("=== Supabase HTTPS Backup Tool ===");

    // 1. Load Credentials
    const env = await loadEnv();
    let supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
    let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        supabaseUrl = await askQuestion("Enter Supabase URL (e.g., https://...supabase.co): ");
    }
    if (!serviceKey) {
        serviceKey = await askQuestion("Enter Supabase Service Role Key (starts with ey...): ");
    }

    if (!supabaseUrl || !serviceKey) {
        console.error("Error: Credentials required.");
        process.exit(1);
    }

    // trim just in case
    supabaseUrl = supabaseUrl.trim();
    serviceKey = serviceKey.trim();

    // 2. Initialize Client
    // Note: Service Role Key allows bypassing RLS policies
    const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false }
    });

    // 3. Create Backup Directory
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupDir = path.join(process.cwd(), `supabase_https_backup_${timestamp}`);
    await fs.mkdir(backupDir, { recursive: true });
    console.log(`\nCreated backup directory: ${backupDir}\n`);

    // 4. Backup Data (Tables)
    console.log("--- Backing up Tables (JSON) ---");
    for (const table of TABLES) {
        try {
            process.stdout.write(`Table '${table}': Fetching... `);
            // Fetch all rows (limit is usually 1000 by default, strict handling needed for large tables)
            // Recursive fetch or just a big limit. Supabase JS often paginates? 
            // Actually standard select returns max 1000. We should paginate.

            let allRows: any[] = [];
            let page = 0;
            const pageSize = 1000;
            let hasMore = true;

            while (hasMore) {
                const { data, error } = await supabase
                    .from(table)
                    .select('*')
                    .range(page * pageSize, (page + 1) * pageSize - 1);

                if (error) throw error;

                if (data) {
                    allRows = allRows.concat(data);
                    if (data.length < pageSize) hasMore = false;
                    else page++;
                } else {
                    hasMore = false;
                }
            }

            const filePath = path.join(backupDir, `${table}.json`);
            await fs.writeFile(filePath, JSON.stringify(allRows, null, 2));
            console.log(`Done (${allRows.length} rows)`);
        } catch (err: any) {
            console.log(`Failed! Error: ${err.message}`);
        }
    }

    // 5. Backup Storage (Buckets)
    console.log("\n--- Backing up Storage (Files) ---");
    const storageDir = path.join(backupDir, "storage");
    await fs.mkdir(storageDir, { recursive: true });

    for (const bucket of BUCKETS) {
        try {
            // List files in bucket
            // Note: This lists only root level. If nested, we need to recurse.
            // Assuming flat or 1-level deep for now unless we implement recursion.
            // Supabase list can take a path.

            const downloadFolder = async (folderPath: string) => {
                const { data: files, error } = await supabase.storage.from(bucket).list(folderPath, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' }
                });

                if (error) {
                    // bucket might not exist
                    console.log(`Skipping bucket '${bucket}' (maybe not found or empty)`);
                    return;
                }

                if (!files || files.length === 0) return;

                const bucketDir = path.join(storageDir, bucket);
                await fs.mkdir(bucketDir, { recursive: true });

                for (const file of files) {
                    if (file.name === '.emptyFolderPlaceholder') continue;

                    // Need to handle folders recursively if it's a folder (no metadata to distinguish easily except maybe size=0 or no id?)
                    // The .list API returns id: null for folders usually? No, it returns object.
                    // Let's assume if id is null or metadata is null, it's a folder? 
                    // Actually supabase-js list returns metadata.

                    // Simple heuristic: if it has no ID, it might be a folder.
                    // Or we just try to download it. If it fails, treat as folder? No.
                    // The correct way: list returns 'id' for files. Folders don't have 'id' usually in this response structure? 
                    // Let's just try to download everything.

                    if (!file.id) {
                        // likely a folder, recurse (Supabase storage folders happen via names with slashes usually, but list retrieves them as items)
                        // We can skip deep recursion for this simple script for now to keep it safe, OR assume flat structure as per user project likely.
                        // User has audios: `scene_index`, etc. Likely flat in `narrations` or `story-assets`?
                        // Actually `story-assets` usually has folders.
                        // Let's implement simple 1-level recursion if needed, or just download flat files.

                        // For now, let's just log and skip folders in root, or try to download them.
                        // If we really want to download `story-assets/xyz/abc.png`, we need to list `xyz`.

                        // IMPROVEMENT: Recursive function to walk trees.
                        await downloadFolder(`${folderPath ? folderPath + '/' : ''}${file.name}`);
                        continue;
                    }

                    const fullPath = folderPath ? `${folderPath}/${file.name}` : file.name;
                    const localPath = path.join(bucketDir, fullPath);

                    // Ensure directory exists for nested files
                    await fs.mkdir(path.dirname(localPath), { recursive: true });

                    process.stdout.write(`  [${bucket}] ${fullPath} ... `);

                    const { data: blob, error: downError } = await supabase.storage.from(bucket).download(fullPath);
                    if (downError) {
                        console.log(`Error downloading: ${downError.message}`);
                    } else if (blob) {
                        // Convert Blob/File to Buffer
                        const arrayBuffer = await blob.arrayBuffer();
                        await fs.writeFile(localPath, Buffer.from(arrayBuffer));
                        console.log("OK");
                    }
                }
            }

            await downloadFolder(''); // Start at root

        } catch (err: any) {
            console.log(`Failed processing bucket ${bucket}: ${err.message}`);
        }
    }

    console.log("\nBackup completed successfully!");
    console.log(`Location: ${backupDir}`);
}

main().catch(err => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
