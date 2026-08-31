import assert from 'node:assert/strict';
import test from 'node:test';
import * as shareCardPlan from './shareCardPlan.ts';

const {
  buildShareCardPlan,
  fitShareCoverTitle,
  makeShareFileName,
  splitTextByLength,
  wrapTextToLines,
} = shareCardPlan;

const story = {
  id: 'sandabaigujing',
  title: '三打白骨精',
  description: '孙悟空保护师父，一次次识破白骨精的变化。',
  endingTitle: '火眼金睛',
  endingDescription: '真正的智慧，是不被表象迷惑。',
  scenes: [],
  isReady: true,
};

test('按自然标点把长叙事拆成不丢字的连续分享页', () => {
  const text = '第一段讲清来龙去脉。第二段继续推进故事！第三段留下一个问题？最后收束。';

  const pages = splitTextByLength(text, 18);

  assert.deepEqual(pages, [
    '第一段讲清来龙去脉。',
    '第二段继续推进故事！',
    '第三段留下一个问题？最后收束。',
  ]);
  assert.equal(pages.join(''), text);
});

test('每一幕固定生成一张分享图，即使正文很长也不拆页', () => {
  const plan = buildShareCardPlan({
    story,
    categoryTitle: '西游记',
    scenes: [
      {
        id: 1,
        title: '妖精初现',
        narrative: '甲'.repeat(520),
        environmentDescription: '',
        characterState: '',
        imageUrl: 'https://example.com/scene-1.jpg',
        options: [
          { text: '先观察草木的形态', isCorrect: true, feedback: '观察得很仔细。' },
          { text: '随便挑一种尝尝', isCorrect: false, feedback: '这样太危险。' },
        ],
      },
      {
        id: 2,
        title: '悟空识破',
        narrative: '乙'.repeat(40),
        environmentDescription: '',
        characterState: '',
        imageUrl: 'https://example.com/scene-2.jpg',
        options: [],
      },
    ],
  });

  assert.deepEqual(plan.map(card => card.kind), ['cover', 'scene', 'scene', 'ending']);
  assert.deepEqual(
    plan.filter(card => card.kind === 'scene').map(card => [card.sceneNumber, card.part, card.partCount]),
    [[1, 1, 1], [2, 1, 1]],
  );
  assert.deepEqual(plan.map(card => card.pageNumber), [1, 2, 3, 4]);
  assert.ok(plan.every(card => card.pageCount === 4));
  assert.deepEqual(plan[1].options, ['先观察草木的形态', '随便挑一种尝尝']);
  assert.deepEqual(plan[0].options, []);
});

test('介绍页使用开篇背景但不重复第一幕图片', () => {
  const plan = buildShareCardPlan({
    story,
    categoryTitle: '西游记',
    scenes: [
      {
        id: 1,
        title: '妖精初现',
        narrative: '山路上出现一位送饭女子。',
        environmentDescription: '',
        characterState: '',
        imageUrl: 'https://example.com/scene-1.jpg',
        options: [],
      },
    ],
  });

  assert.equal(plan[0].kind, 'cover');
  assert.equal(plan[0].body, story.description);
  assert.equal(plan[0].imageUrl, undefined);
  assert.equal(plan[1].imageUrl, 'https://example.com/scene-1.jpg');
});

test('分享首图使用故事专用封面图', () => {
  const coverImage = 'https://example.com/story-cover.jpg';
  const plan = buildShareCardPlan({
    story: { ...story, coverImage },
    categoryTitle: '西游记',
    scenes: [],
  });

  assert.equal(plan[0].kind, 'cover');
  assert.equal(plan[0].imageUrl, coverImage);
});

test('封面标题和幕数提示不会压到模板底部边框', () => {
  assert.equal(typeof shareCardPlan.getShareCoverTemplateLayout, 'function');
  const layout = shareCardPlan.getShareCoverTemplateLayout();

  assert.ok(layout.titleLastBaseline <= layout.sceneCountY - 60);
  assert.ok(layout.sceneCountY <= layout.panelBottom - 20);
});

test('封面长标题优先缩小字号保持一行，不产生末行孤字', () => {
  assert.equal(typeof fitShareCoverTitle, 'function');

  const layout = fitShareCoverTitle(
    '悟空学艺告别师门',
    844,
    (value, fontSize) => value.length * fontSize,
  );

  assert.deepEqual(layout.lines, ['悟空学艺告别师门']);
  assert.equal(layout.fontSize, 104);
});

test('必须使用两行的超长封面标题采用均衡分行和安全字号', () => {
  assert.equal(typeof fitShareCoverTitle, 'function');

  const layout = fitShareCoverTitle(
    '孙悟空大闹天宫之后护送唐僧西天取经',
    844,
    (value, fontSize) => value.length * fontSize,
  );

  assert.equal(layout.lines.length, 2);
  assert.ok(Math.abs(layout.lines[0].length - layout.lines[1].length) <= 1);
  assert.ok(layout.lines.every(line => line.length > 1));
  assert.ok(layout.fontSize <= 78);
});

test('导出文件名稳定排序并移除文件系统非法字符', () => {
  assert.equal(makeShareFileName(3, 12, '夜探：盘丝洞/惊变'), '03-12-夜探-盘丝洞-惊变.png');
});

test('排版换行时不让中文标点孤零零出现在行首', () => {
  assert.deepEqual(wrapTextToLines('天地玄黄，宇宙洪荒。', 4, value => value.length), [
    '天地玄黄，',
    '宇宙洪荒。',
  ]);
});

test('字体预加载文本覆盖封面、幕标题、正文和选项里的全部汉字', () => {
  assert.equal(typeof shareCardPlan.collectShareCardFontText, 'function');

  const text = shareCardPlan.collectShareCardFontText({
    kind: 'scene',
    title: '东岭挡道',
    body: '关羽千里寻兄。',
    categoryTitle: '三国演义',
    storyTitle: '千里走单骑',
    sceneNumber: 1,
    sceneCount: 5,
    options: ['好言解释缘由', '立刻强行冲关'],
    part: 1,
    partCount: 1,
    pageNumber: 2,
    pageCount: 7,
  });

  assert.match(text, /千里走单骑/);
  assert.match(text, /东岭挡道/);
  assert.match(text, /关羽千里寻兄/);
  assert.match(text, /好言解释缘由/);
  assert.match(text, /中国故事/);
});
