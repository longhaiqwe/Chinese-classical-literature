import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { STORY_SHARE_BUTTON_PRESENTATION } from '../components/storyShareButtonPresentation.ts';

const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
const categoryViewSource = readFileSync(new URL('../components/CategoryView.tsx', import.meta.url), 'utf8');
const storyCardSource = readFileSync(new URL('../components/StoryCard.tsx', import.meta.url), 'utf8');

test('分享入口只出现在通关页，并位于重新阅览和返回目录之后', () => {
  assert.doesNotMatch(storyCardSource, /StoryShareButton|onShare/);
  assert.doesNotMatch(categoryViewSource, /onShareStory|onShare=/);
  assert.equal((appSource.match(/<StoryShareButton/g) ?? []).length, 1);

  const victoryStart = appSource.indexOf('{/* VICTORY VIEW */}');
  const gameOverStart = appSource.indexOf('{/* GAME OVER VIEW */}');
  const victorySource = appSource.slice(victoryStart, gameOverStart);
  assert.ok(victorySource.indexOf('<StoryShareButton') > victorySource.indexOf('返回目录'));
});

test('通关页分享入口继续使用小号纯图标按钮', () => {
  assert.equal(STORY_SHARE_BUTTON_PRESENTATION.visibleLabel, null);
  assert.equal(STORY_SHARE_BUTTON_PRESENTATION.ariaLabel, '导出整套故事分享图');
  assert.match(STORY_SHARE_BUTTON_PRESENTATION.buttonClassName, /h-9/);
  assert.match(STORY_SHARE_BUTTON_PRESENTATION.buttonClassName, /w-9/);
  assert.match(STORY_SHARE_BUTTON_PRESENTATION.buttonClassName, /after:-inset-1/);
  assert.equal(STORY_SHARE_BUTTON_PRESENTATION.iconClassName, 'h-4 w-4');
});

test('故事列表卡片左侧展示故事封面，右侧保留标题和简介', () => {
  assert.match(storyCardSource, /story\.coverImage/);
  assert.match(storyCardSource, /<img/);
  assert.match(storyCardSource, /alt={`?\$\{story\.title\}封面`?}/);
  assert.match(storyCardSource, /grid-cols-/);
  assert.match(storyCardSource, /min-w-0/);
  assert.match(storyCardSource, /line-clamp-/);
});

test('故事列表卡片的封面、标题和操作区使用同一组上下基线', () => {
  assert.match(storyCardSource, /self-start/);
  assert.doesNotMatch(storyCardSource, /self-center/);
  assert.match(storyCardSource, /line-clamp-2/);
  assert.match(storyCardSource, /mt-auto/);
  assert.match(storyCardSource, /leading-tight/);
});

test('故事列表的长标题在手机端缩小一级并避免末行孤字', () => {
  assert.match(storyCardSource, /Array\.from\(story\.title\.trim\(\)\)\.length/);
  assert.match(storyCardSource, /text-lg sm:text-xl/);
  assert.match(storyCardSource, /text-balance/);
});
