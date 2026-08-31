import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');
const renderer = readFileSync(new URL('./shareStory.ts', import.meta.url), 'utf8');

test('分享图使用 App 内置的完整中文字体，并按本张图片的实际文字预加载', () => {
  assert.match(
    css,
    /@font-face\s*{[^}]*font-family:\s*["']ChineseStoryCalligraphy["'][^}]*\/fonts\/MaShanZheng-Regular\.ttf/s,
  );
  assert.match(
    css,
    /@font-face\s*{[^}]*font-family:\s*["']ChineseStorySerif["'][^}]*\/fonts\/NotoSerifSC-Regular\.ttf/s,
  );
  assert.match(renderer, /document\.fonts\.load\([^,]+,\s*fontText\)/);
  assert.match(renderer, /["']ChineseStoryCalligraphy["']/);
  assert.match(renderer, /["']ChineseStorySerif["']/);
});

test('分享首图是大图极简模板，不再绘制长篇开篇背景', () => {
  const coverStart = renderer.indexOf('const drawCover =');
  const sceneStart = renderer.indexOf('const drawScene =');
  const coverRenderer = renderer.slice(coverStart, sceneStart);

  assert.match(coverRenderer, /drawCoverImage/);
  assert.match(coverRenderer, /中国古典文学/);
  assert.doesNotMatch(coverRenderer, /card\.body|开篇背景|fitNarrativeText/);
});
