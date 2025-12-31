
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yvftzwxiiyhheaoykxgc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZnR6d3hpaXloaGVhb3lreGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNzA1NzIsImV4cCI6MjA4MjY0NjU3Mn0.s5tWDl76OAxd6lH9sRrE0eHzHwfv71GvWfEpvZfz7H0';
const BUCKET_NAME = 'story-assets';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log('Listing files in shanhaijing/houyisheri...');
    const { data: data1, error: error1 } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list('shanhaijing/houyisheri');

    if (error1) console.error(error1);
    else console.log('houyisheri:', data1);

    console.log('Listing files in shanhaijing/houyisheri_v2...');
    const { data: data2, error: error2 } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list('shanhaijing/houyisheri_v2');

    if (error2) console.error(error2);
    else console.log('houyisheri_v2:', data2);
}

main();
