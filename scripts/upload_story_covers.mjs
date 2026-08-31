import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import {
  getStoryCoverPublicUrl,
  STORY_COVER_SCENE_INDEX,
} from '../services/storyCover.ts';

process.loadEnvFile('.env');

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(projectDir, '.work', 'story-covers', 'manifest.json');
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const storyIdArg = process.argv.indexOf('--story-id');
const requestedStoryIds = storyIdArg >= 0
  ? new Set(String(process.argv[storyIdArg + 1] || '').split(',').filter(Boolean))
  : null;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
}
if (!fs.existsSync(manifestPath)) {
  throw new Error('缺少封面清单，请先运行 sync_story_cover_manifest.mjs');
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const supabase = createClient(supabaseUrl, serviceRoleKey);
const candidates = manifest.stories.filter(story => {
  if (requestedStoryIds && !requestedStoryIds.has(story.storyId)) return false;
  return fs.existsSync(path.join(projectDir, story.localPath));
});

if (requestedStoryIds && candidates.length !== requestedStoryIds.size) {
  const candidateIds = new Set(candidates.map(story => story.storyId));
  const missing = [...requestedStoryIds].filter(storyId => !candidateIds.has(storyId));
  throw new Error(`找不到本地封面：${missing.join(', ')}`);
}

const results = [];
for (const story of candidates) {
  const localPath = path.join(projectDir, story.localPath);
  try {
    const image = fs.readFileSync(localPath);
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(story.remotePath, image, { contentType: 'image/png', upsert: true });
    if (uploadError) throw uploadError;

    const coverUrl = getStoryCoverPublicUrl(supabaseUrl, story.categoryId, story.storyId);
    const { error: databaseError } = await supabase.from('scene_images').upsert({
      story_id: story.storyId,
      scene_index: STORY_COVER_SCENE_INDEX,
      image_url: coverUrl,
    }, { onConflict: 'story_id,scene_index' });
    if (databaseError) throw databaseError;

    story.status = 'uploaded';
    story.coverUrl = coverUrl;
    delete story.error;
    results.push({ storyId: story.storyId, status: 'uploaded', coverUrl });
  } catch (error) {
    story.status = 'failed';
    story.error = error instanceof Error ? error.message : String(error);
    results.push({ storyId: story.storyId, status: 'failed', error: story.error });
  }
}

manifest.generatedAt = new Date().toISOString();
manifest.uploaded = manifest.stories.filter(story => story.status === 'uploaded').length;
manifest.generated = manifest.stories.filter(story => story.status === 'generated').length;
manifest.pending = manifest.stories.filter(story => story.status === 'pending').length;
manifest.failed = manifest.stories.filter(story => story.status === 'failed').length;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify({
  attempted: results.length,
  uploaded: results.filter(result => result.status === 'uploaded').length,
  failed: results.filter(result => result.status === 'failed').length,
  results,
}, null, 2));

if (results.some(result => result.status === 'failed')) process.exitCode = 1;
