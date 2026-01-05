
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function deleteNarrations() {
    console.log('Searching for sandabaigujing files...');
    const { data: files, error: listError } = await supabase
        .storage
        .from('narrations')
        .list('', { limit: 100, search: 'sandabaigujing' });

    if (listError) {
        console.error('Error listing files:', listError);
        return;
    }

    if (!files || files.length === 0) {
        console.log('No files found matching "sandabaigujing".');
        return;
    }

    const filesToDelete = files.map(f => f.name);
    console.log(`Found ${filesToDelete.length} files to delete:`, filesToDelete);

    const { data, error } = await supabase
        .storage
        .from('narrations')
        .remove(filesToDelete);

    if (error) {
        console.error('Error deleting files:', error);
    } else {
        console.log('Successfully deleted files:', data);
    }
}

deleteNarrations();
