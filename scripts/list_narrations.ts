
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function listFiles() {
    const { data, error } = await supabase
        .storage
        .from('narrations')
        .list('', { limit: 100, search: 'sandabaigujing' });

    if (error) {
        console.error('Error listing files:', error);
    } else {
        console.log('Files in narrations bucket:', data);
    }
}

listFiles();
