import assert from 'node:assert/strict';
import test from 'node:test';

test('故事专用封面优先，第一幕图片只作缺图兜底', async () => {
  const storyCover = await import('./storyCover.ts').catch(() => ({}));
  assert.equal(typeof storyCover.resolveStoryCoverImage, 'function');
  if (typeof storyCover.resolveStoryCoverImage !== 'function') return;

  assert.equal(storyCover.resolveStoryCoverImage('cover.jpg', 'scene-1.jpg'), 'cover.jpg');
  assert.equal(storyCover.resolveStoryCoverImage(null, 'scene-1.jpg'), 'scene-1.jpg');
  assert.equal(storyCover.resolveStoryCoverImage(undefined, undefined), undefined);
});

test('故事封面使用稳定的存储路径和公开 URL', async () => {
  const storyCover = await import('./storyCover.ts');
  assert.equal(typeof storyCover.getStoryCoverStoragePath, 'function');
  assert.equal(typeof storyCover.getStoryCoverPublicUrl, 'function');
  if (typeof storyCover.getStoryCoverStoragePath !== 'function' || typeof storyCover.getStoryCoverPublicUrl !== 'function') return;

  assert.equal(
    storyCover.getStoryCoverStoragePath('sanguoyanyi', 'qianlizoudanqi'),
    'sanguoyanyi/qianlizoudanqi/cover-v1.png',
  );
  assert.equal(
    storyCover.getStoryCoverPublicUrl('https://example.supabase.co/', 'sanguoyanyi', 'qianlizoudanqi'),
    'https://example.supabase.co/storage/v1/object/public/images/sanguoyanyi/qianlizoudanqi/cover-v1.png',
  );
});
