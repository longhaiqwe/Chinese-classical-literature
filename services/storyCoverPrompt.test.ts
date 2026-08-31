import assert from 'node:assert/strict';
import test from 'node:test';

test('故事封面提示词保持幕次插画风格并生成单一无字主视觉', async () => {
  const storyCoverPrompt = await import('./storyCoverPrompt.ts').catch(() => ({}));
  assert.equal(typeof storyCoverPrompt.buildStoryCoverPrompt, 'function');
  if (typeof storyCoverPrompt.buildStoryCoverPrompt !== 'function') return;

  const prompt = storyCoverPrompt.buildStoryCoverPrompt({
    categoryTitle: '三国演义',
    storyTitle: '千里走单骑',
    description: '关羽挂印封金，护送二嫂千里寻兄。',
    representativeBeats: ['东岭挡道', '过五关斩六将', '黄河渡口'],
  });

  assert.ok(prompt.startsWith(storyCoverPrompt.STORY_IMAGE_STYLE_PREFIX));
  assert.match(prompt, /三国演义/);
  assert.match(prompt, /千里走单骑/);
  assert.match(prompt, /关羽挂印封金/);
  assert.doesNotMatch(prompt, /东岭挡道/);
  assert.match(prompt, /exactly one moment/i);
  assert.match(prompt, /do not depict earlier or later events/i);
  assert.match(prompt, /same visual style/i);
  assert.match(prompt, /no collage/i);
  assert.match(prompt, /no blood/i);
  assert.ok(prompt.endsWith('no text --ar 16:9'));
});
