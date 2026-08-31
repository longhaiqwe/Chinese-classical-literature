import type { IGameScene, IGameStory } from '../types';

export type ShareCard = {
  kind: 'cover' | 'scene' | 'ending';
  title: string;
  body: string;
  imageUrl?: string;
  categoryTitle: string;
  storyTitle: string;
  sceneNumber?: number;
  sceneCount: number;
  options: string[];
  part: number;
  partCount: number;
  pageNumber: number;
  pageCount: number;
};

type BuildShareCardPlanInput = {
  story: IGameStory;
  categoryTitle: string;
  scenes: IGameScene[];
};

export const collectShareCardFontText = (card: ShareCard): string => [
  '中国古典文学',
  '中国故事',
  '在选择中，重走经典',
  '故事',
  '互动故事',
  '开篇背景',
  '如果是你，会怎么选？',
  '打开，亲手走一遍经典',
  card.categoryTitle,
  card.storyTitle,
  card.title,
  card.body,
  ...card.options,
].join('');

export const getShareCoverTemplateLayout = () => ({
  panelBottom: 1208,
  titleLastBaseline: 1098,
  sceneCountY: 1178,
});

export type ShareCoverTitleLayout = {
  fontSize: number;
  lines: string[];
};

type MeasureTitle = (value: string, fontSize: number) => number;

const findBalancedTitleSplit = (
  title: string,
  fontSize: number,
  maxWidth: number,
  measure: MeasureTitle,
): string[] | null => {
  const characters = Array.from(title);
  const candidates: Array<{ lines: string[]; score: number }> = [];

  for (let splitIndex = 1; splitIndex < characters.length; splitIndex += 1) {
    const firstLine = characters.slice(0, splitIndex).join('');
    const secondLine = characters.slice(splitIndex).join('');
    if (CLOSING_PUNCTUATION.test(secondLine[0])) continue;

    const firstWidth = measure(firstLine, fontSize);
    const secondWidth = measure(secondLine, fontSize);
    if (firstWidth > maxWidth || secondWidth > maxWidth) continue;

    const orphanPenalty = Math.min(splitIndex, characters.length - splitIndex) === 1 ? maxWidth * 10 : 0;
    candidates.push({
      lines: [firstLine, secondLine],
      score: orphanPenalty + Math.abs(firstWidth - secondWidth),
    });
  }

  candidates.sort((left, right) => left.score - right.score);
  return candidates[0]?.lines ?? null;
};

export const fitShareCoverTitle = (
  title: string,
  maxWidth: number,
  measure: MeasureTitle,
): ShareCoverTitleLayout => {
  const normalizedTitle = title.trim().replace(/\s+/g, ' ');
  if (!normalizedTitle) return { fontSize: 108, lines: [''] };

  for (let fontSize = 108; fontSize >= 62; fontSize -= 2) {
    if (measure(normalizedTitle, fontSize) <= maxWidth) {
      return { fontSize, lines: [normalizedTitle] };
    }
  }

  // 两行标题需要给封面图边框留出呼吸空间，因此使用更克制的字号上限。
  for (let fontSize = 70; fontSize >= 36; fontSize -= 2) {
    const lines = findBalancedTitleSplit(normalizedTitle, fontSize, maxWidth, measure);
    if (lines) return { fontSize, lines };
  }

  return { fontSize: 36, lines: [normalizedTitle] };
};

const SENTENCE_PATTERN = /[^。！？!?；;\n]+[。！？!?；;\n]?/g;
const CLOSING_PUNCTUATION = /[，。！？；：、）】》」』”’!?;,:]/;

export const wrapTextToLines = (
  text: string,
  maxWidth: number,
  measure: (value: string) => number,
): string[] => {
  const lines: string[] = [];
  let current = '';

  for (const character of text) {
    if (character === '\n') {
      if (current) lines.push(current);
      current = '';
      continue;
    }

    const candidate = current + character;
    if (current && measure(candidate) > maxWidth) {
      if (CLOSING_PUNCTUATION.test(character)) {
        lines.push(candidate);
        current = '';
      } else {
        lines.push(current);
        current = character;
      }
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines;
};

export const splitTextByLength = (text: string, maxLength: number): string[] => {
  const normalized = text.trim();
  if (!normalized) return [''];
  if (maxLength < 1) throw new Error('maxLength 必须大于 0');

  const sentences = normalized.match(SENTENCE_PATTERN) ?? [normalized];
  const pages: string[] = [];
  let current = '';

  const pushCurrent = () => {
    if (!current) return;
    pages.push(current);
    current = '';
  };

  for (const sentence of sentences) {
    if (sentence.length > maxLength) {
      pushCurrent();
      for (let index = 0; index < sentence.length; index += maxLength) {
        const chunk = sentence.slice(index, index + maxLength);
        if (chunk.length === maxLength || index + maxLength < sentence.length) pages.push(chunk);
        else current = chunk;
      }
      continue;
    }

    if (current && current.length + sentence.length > maxLength) pushCurrent();
    current += sentence;
  }

  pushCurrent();
  return pages;
};

export const buildShareCardPlan = ({
  story,
  categoryTitle,
  scenes,
}: BuildShareCardPlanInput): ShareCard[] => {
  const drafts: Omit<ShareCard, 'pageNumber' | 'pageCount'>[] = [
    {
      kind: 'cover',
      title: story.title,
      body: story.description,
      imageUrl: story.coverImage,
      categoryTitle,
      storyTitle: story.title,
      sceneCount: scenes.length,
      options: [],
      part: 1,
      partCount: 1,
    },
  ];

  scenes.forEach((scene, sceneIndex) => {
    drafts.push({
      kind: 'scene',
      title: scene.title,
      body: scene.narrative,
      imageUrl: scene.imageUrl,
      categoryTitle,
      storyTitle: story.title,
      sceneNumber: sceneIndex + 1,
      sceneCount: scenes.length,
      options: scene.options.map(option => option.text),
      part: 1,
      partCount: 1,
    });
  });

  drafts.push({
    kind: 'ending',
    title: story.endingTitle || '故事未完，经典常新',
    body: story.endingDescription || '在一次次选择里，重新认识我们熟悉的中国故事。',
    imageUrl: scenes.at(-1)?.imageUrl,
    categoryTitle,
    storyTitle: story.title,
    sceneCount: scenes.length,
    options: [],
    part: 1,
    partCount: 1,
  });

  return drafts.map((card, index) => ({
    ...card,
    pageNumber: index + 1,
    pageCount: drafts.length,
  }));
};

export const makeShareFileName = (pageNumber: number, pageCount: number, title: string): string => {
  const width = Math.max(2, String(pageCount).length);
  const safeTitle = title
    .trim()
    .replace(/[\\/:*?"<>|：]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || '中国故事';

  return `${String(pageNumber).padStart(width, '0')}-${String(pageCount).padStart(width, '0')}-${safeTitle}.png`;
};
