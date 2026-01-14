
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yvftzwxiiyhheaoykxgc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZnR6d3hpaXloaGVhb3lreGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNzA1NzIsImV4cCI6MjA4MjY0NjU3Mn0.s5tWDl76OAxd6lH9sRrE0eHzHwfv71GvWfEpvZfz7H0';
const BUCKET_NAME = 'images';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log('Testing DELETE permission...');
    const { data, error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .remove(['shanhaijing/houyisheri/bg_01_ten_suns.jpg']);

    if (error) {
        console.error('DELETE failed:', error);
    } else {
        console.log('DELETE success:', data);
    }
}

main();
