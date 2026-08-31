import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { buildStoryCoverPrompt } from '../services/storyCoverPrompt.ts';

process.loadEnvFile('.env');

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workDir = path.join(projectDir, '.work', 'story-covers');
const manifestPath = path.join(workDir, 'manifest.json');
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('缺少 SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const [categoryResult, storyResult, sceneResult, coverResult] = await Promise.all([
  supabase.from('categories').select('id,title,sort_order').order('sort_order'),
  supabase.from('stories').select('id,category_id,title,description,sort_order').eq('is_ready', true).order('category_id').order('sort_order'),
  supabase.from('scenes').select('story_id,scene_index,title,narrative').order('story_id').order('scene_index'),
  supabase.from('scene_images').select('story_id,image_url').eq('scene_index', 0),
]);

const failure = categoryResult.error || storyResult.error || sceneResult.error || coverResult.error;
if (failure) throw failure;

fs.mkdirSync(workDir, { recursive: true });
const previousManifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : { stories: [] };
const previousById = new Map(previousManifest.stories.map(story => [story.storyId, story]));
const categoryById = new Map(categoryResult.data.map(category => [category.id, category.title]));
const coverByStory = new Map(coverResult.data.filter(row => row.image_url).map(row => [row.story_id, row.image_url]));
const scenesByStory = new Map();

sceneResult.data.forEach(scene => {
  const scenes = scenesByStory.get(scene.story_id) || [];
  scenes.push(scene);
  scenesByStory.set(scene.story_id, scenes);
});

const stories = storyResult.data.map(story => {
  const scenes = scenesByStory.get(story.id) || [];
  const representativeIndexes = [...new Set([0, Math.floor((scenes.length - 1) / 2), scenes.length - 1])]
    .filter(index => index >= 0 && index < scenes.length);
  const representativeBeats = representativeIndexes.map(index => {
    const scene = scenes[index];
    const narrative = String(scene.narrative || '').replace(/\s+/g, ' ').trim().slice(0, 120);
    return `${scene.title}：${narrative}`;
  });
  const categoryTitle = categoryById.get(story.category_id) || story.category_id;
  const localRelativePath = `.work/story-covers/${story.id}/cover-v1.png`;
  const localPath = path.join(projectDir, localRelativePath);
  const remotePath = `${story.category_id}/${story.id}/cover-v1.png`;
  const existing = previousById.get(story.id);
  const coverUrl = coverByStory.get(story.id);

  return {
    storyId: story.id,
    categoryId: story.category_id,
    categoryTitle,
    storyTitle: story.title,
    description: story.description,
    sceneCount: scenes.length,
    representativeBeats,
    prompt: buildStoryCoverPrompt({
      categoryTitle,
      storyTitle: story.title,
      description: story.description,
      representativeBeats,
    }),
    localPath: localRelativePath,
    remotePath,
    coverUrl: coverUrl || null,
    status: coverUrl ? 'uploaded' : fs.existsSync(localPath) ? 'generated' : existing?.status || 'pending',
  };
});

const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'live-supabase',
  total: stories.length,
  uploaded: stories.filter(story => story.status === 'uploaded').length,
  generated: stories.filter(story => story.status === 'generated').length,
  pending: stories.filter(story => story.status === 'pending').length,
  stories,
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({
  manifestPath,
  total: manifest.total,
  uploaded: manifest.uploaded,
  generated: manifest.generated,
  pending: manifest.pending,
  withoutScenes: stories.filter(story => story.sceneCount === 0).map(story => story.storyId),
}, null, 2));
