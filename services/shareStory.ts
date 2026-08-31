import { Capacitor, registerPlugin } from '@capacitor/core';
import { Clipboard } from '@capacitor/clipboard';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import JSZip from 'jszip';
import type { IGameScene, IGameStory } from '../types';
import {
  buildShareCardPlan,
  collectShareCardFontText,
  fitShareCoverTitle,
  getShareCoverTemplateLayout,
  makeShareFileName,
  wrapTextToLines,
  type ShareCard,
} from './shareCardPlan';
import {
  buildStoryShareMetadata,
  chooseShareTransport,
  shouldCopyStoryShareMetadata,
  type SharePlatform,
} from './shareTransport';

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;
const BRAND_NAME = '中国故事';
const BRAND_TAGLINE = '在选择中，重走经典';
const SHARE_SERIF_FONT = '"ChineseStorySerif", serif';
const SHARE_CALLIGRAPHY_FONT = '"ChineseStoryCalligraphy", "ChineseStorySerif", serif';

export type ShareExportProgress = {
  current: number;
  total: number;
  message: string;
};

type ExportStoryInput = {
  story: IGameStory;
  categoryTitle: string;
  scenes: IGameScene[];
  onProgress?: (progress: ShareExportProgress) => void;
};

type ExportedCard = {
  blob: Blob;
  fileName: string;
};

type ImageSharePlugin = {
  shareImages(options: {
    title: string;
    text: string;
    files: string[];
    dialogTitle: string;
  }): Promise<void>;
};

const ImageShare = registerPlugin<ImageSharePlugin>('ImageShare');

const createCanvas = () => {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('当前设备无法创建分享图');
  return { canvas, context };
};

const roundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
};

const drawPaper = (context: CanvasRenderingContext2D) => {
  context.fillStyle = '#f4efe3';
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  context.save();
  context.globalAlpha = 0.035;
  context.fillStyle = '#2d241c';
  for (let y = 14; y < CARD_HEIGHT; y += 29) {
    for (let x = (y % 58) + 8; x < CARD_WIDTH; x += 47) {
      context.fillRect(x, y, 2, 2);
    }
  }
  context.restore();

  context.strokeStyle = '#2d2d2d';
  context.lineWidth = 3;
  context.strokeRect(38, 38, CARD_WIDTH - 76, CARD_HEIGHT - 76);
  context.strokeStyle = '#8b2626';
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(76, 72);
  context.lineTo(244, 72);
  context.stroke();
};

const drawBrand = (context: CanvasRenderingContext2D, pageNumber: number, pageCount: number) => {
  context.fillStyle = '#8b2626';
  roundedRect(context, 76, 1306, 64, 64, 8);
  context.fill();
  context.fillStyle = '#fffaf0';
  context.font = `700 34px ${SHARE_SERIF_FONT}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('中', 108, 1338);

  context.fillStyle = '#241f1b';
  context.font = `700 29px ${SHARE_SERIF_FONT}`;
  context.textAlign = 'left';
  context.fillText(BRAND_NAME, 160, 1328);
  context.fillStyle = '#7d7164';
  context.font = `400 21px ${SHARE_SERIF_FONT}`;
  context.fillText(BRAND_TAGLINE, 160, 1360);

  context.textAlign = 'right';
  context.fillStyle = '#7d7164';
  context.font = '500 23px ui-sans-serif, system-ui, sans-serif';
  context.fillText(`${String(pageNumber).padStart(2, '0')} / ${String(pageCount).padStart(2, '0')}`, 1004, 1344);
};

const wrapLines = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] => wrapTextToLines(text, maxWidth, value => context.measureText(value).width);

const drawWrappedText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) => {
  const lines = wrapLines(context, text, maxWidth);
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
  return lines.length;
};

const fitSceneContent = (
  context: CanvasRenderingContext2D,
  narrative: string,
  options: string[],
  maxHeight: number,
) => {
  let fallbackLayout;

  for (let narrativeFontSize = 34; narrativeFontSize >= 10; narrativeFontSize -= 1) {
    const narrativeLineHeight = Math.round(narrativeFontSize * 1.48);
    context.font = `500 ${narrativeFontSize}px ${SHARE_SERIF_FONT}`;
    const narrativeLines = wrapLines(context, narrative, 892);

    const optionFontSize = Math.max(12, Math.round(narrativeFontSize * 0.72));
    const optionLineHeight = Math.round(optionFontSize * 1.38);
    context.font = `600 ${optionFontSize}px ${SHARE_SERIF_FONT}`;
    const optionLines = options.map(option => wrapLines(context, option, 774));
    const optionHeights = optionLines.map(lines => Math.max(58, lines.length * optionLineHeight + 24));

    const narrativeHeight = narrativeLines.length * narrativeLineHeight;
    const optionGap = options.length ? 60 : 0;
    const optionsHeight = optionHeights.reduce((sum, height) => sum + height, 0)
      + Math.max(0, optionHeights.length - 1) * 12;

    const layout = {
      narrativeFontSize,
      narrativeLineHeight,
      narrativeLines,
      optionFontSize,
      optionLineHeight,
      optionLines,
      optionHeights,
    };
    fallbackLayout = layout;

    if (narrativeHeight + optionGap + optionsHeight <= maxHeight) return layout;
  }

  return fallbackLayout!;
};

const loadImage = async (url?: string): Promise<ImageBitmap | null> => {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`图片请求失败：${response.status}`);
    const blob = await response.blob();
    return await createImageBitmap(blob);
  } catch (error) {
    console.warn('分享图场景图片加载失败，将使用留白占位。', error);
    return null;
  }
};

const drawCoverImage = (
  context: CanvasRenderingContext2D,
  image: ImageBitmap | null,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  context.save();
  roundedRect(context, x, y, width, height, 8);
  context.clip();

  if (image) {
    const sourceWidth = image.width;
    const sourceHeight = image.height;
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  } else {
    const placeholder = context.createLinearGradient(x, y, x + width, y + height);
    placeholder.addColorStop(0, '#d9ccb2');
    placeholder.addColorStop(1, '#96836e');
    context.fillStyle = placeholder;
    context.fillRect(x, y, width, height);
  }
  context.restore();
};

const drawCover = (context: CanvasRenderingContext2D, card: ShareCard, image: ImageBitmap | null) => {
  context.fillStyle = 'rgba(139, 38, 38, 0.055)';
  roundedRect(context, 76, 118, 928, 1110, 12);
  context.fill();

  context.strokeStyle = 'rgba(139, 38, 38, 0.28)';
  context.lineWidth = 2;
  roundedRect(context, 96, 138, 888, 1070, 8);
  context.stroke();

  context.fillStyle = '#28231e';
  context.font = `400 64px ${SHARE_CALLIGRAPHY_FONT}`;
  context.textAlign = 'center';
  context.textBaseline = 'alphabetic';
  context.fillText('中国古典文学', CARD_WIDTH / 2, 224);

  context.strokeStyle = 'rgba(45, 45, 45, 0.55)';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(164, 248);
  context.lineTo(916, 248);
  context.stroke();

  context.fillStyle = '#f4efe3';
  context.strokeStyle = '#8b2626';
  context.lineWidth = 2;
  roundedRect(context, 342, 268, 396, 72, 8);
  context.fill();
  context.stroke();
  context.fillStyle = '#8b2626';
  context.font = `700 36px ${SHARE_SERIF_FONT}`;
  context.textBaseline = 'middle';
  context.fillText(card.categoryTitle, CARD_WIDTH / 2, 304);

  context.strokeStyle = '#2d2d2d';
  context.lineWidth = 3;
  roundedRect(context, 94, 372, 892, 558, 10);
  context.stroke();
  context.strokeStyle = 'rgba(139, 38, 38, 0.45)';
  context.lineWidth = 2;
  roundedRect(context, 108, 386, 864, 530, 8);
  context.stroke();
  drawCoverImage(context, image, 118, 396, 844, 510);

  const titleLayout = fitShareCoverTitle(card.title, 844, (value, fontSize) => {
    context.font = `400 ${fontSize}px ${SHARE_CALLIGRAPHY_FONT}`;
    return context.measureText(value).width;
  });
  const { fontSize: titleFontSize, lines: titleLines } = titleLayout;
  context.font = `400 ${titleFontSize}px ${SHARE_CALLIGRAPHY_FONT}`;

  const titleLineHeight = Math.round(titleFontSize * 1.12);
  const coverLayout = getShareCoverTemplateLayout();
  context.fillStyle = '#241f1b';
  context.textAlign = 'center';
  context.textBaseline = 'alphabetic';
  titleLines.forEach((line, index) => {
    const baseline = coverLayout.titleLastBaseline - (titleLines.length - 1 - index) * titleLineHeight;
    context.fillText(line, CARD_WIDTH / 2, baseline);
  });

  context.fillStyle = '#8b2626';
  context.font = `700 27px ${SHARE_SERIF_FONT}`;
  context.fillText(`${card.sceneCount} 幕互动选择 · 从下一页进入故事`, CARD_WIDTH / 2, coverLayout.sceneCountY);
};

const drawScene = (context: CanvasRenderingContext2D, card: ShareCard, image: ImageBitmap | null) => {
  context.fillStyle = '#8b2626';
  context.font = `700 27px ${SHARE_SERIF_FONT}`;
  context.textAlign = 'left';
  context.fillText(`《${card.storyTitle}》`, 76, 132);

  context.fillStyle = '#28231e';
  context.font = `400 58px ${SHARE_CALLIGRAPHY_FONT}`;
  context.fillText(card.title, 76, 218);

  context.textAlign = 'right';
  context.fillStyle = '#776b5e';
  context.font = `500 24px ${SHARE_SERIF_FONT}`;
  context.fillText(`第 ${card.sceneNumber} / ${card.sceneCount} 幕`, 1004, 210);

  drawCoverImage(context, image, 76, 262, 928, 420);

  context.textAlign = 'left';
  context.fillStyle = '#2b2722';
  context.textBaseline = 'alphabetic';
  const contentTop = 726;
  const contentLayout = fitSceneContent(context, card.body, card.options, 506);
  context.font = `500 ${contentLayout.narrativeFontSize}px ${SHARE_SERIF_FONT}`;
  contentLayout.narrativeLines.forEach((line, index) => {
    context.fillText(line, 94, contentTop + contentLayout.narrativeFontSize + index * contentLayout.narrativeLineHeight);
  });

  let optionY = contentTop + contentLayout.narrativeLines.length * contentLayout.narrativeLineHeight;

  if (card.options.length) {
    context.fillStyle = '#8b2626';
    context.font = `700 21px ${SHARE_SERIF_FONT}`;
    context.fillText('如果是你，会怎么选？', 94, optionY + 30);
    optionY += 60;
  }

  contentLayout.optionLines.forEach((lines, optionIndex) => {
    const optionHeight = contentLayout.optionHeights[optionIndex];
    context.fillStyle = 'rgba(255, 250, 240, 0.62)';
    context.strokeStyle = 'rgba(139, 38, 38, 0.46)';
    context.lineWidth = 2;
    roundedRect(context, 94, optionY, 892, optionHeight, 10);
    context.fill();
    context.stroke();

    context.fillStyle = '#8b2626';
    roundedRect(context, 112, optionY + (optionHeight - 42) / 2, 42, 42, 8);
    context.fill();
    context.fillStyle = '#fffaf0';
    context.font = '700 22px ui-sans-serif, system-ui, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(String.fromCharCode(65 + optionIndex), 133, optionY + optionHeight / 2);

    context.fillStyle = '#312b25';
    context.font = `600 ${contentLayout.optionFontSize}px ${SHARE_SERIF_FONT}`;
    context.textAlign = 'left';
    const textBlockHeight = lines.length * contentLayout.optionLineHeight;
    lines.forEach((line, lineIndex) => {
      context.fillText(
        line,
        176,
        optionY + (optionHeight - textBlockHeight) / 2 + contentLayout.optionLineHeight * (lineIndex + 0.5),
      );
    });

    optionY += optionHeight + 12;
  });

  context.textBaseline = 'alphabetic';
};

const drawEnding = (context: CanvasRenderingContext2D, card: ShareCard, image: ImageBitmap | null) => {
  drawCoverImage(context, image, 76, 126, 928, 560);
  context.fillStyle = 'rgba(32, 26, 20, 0.48)';
  context.fillRect(76, 126, 928, 560);

  context.fillStyle = '#f7f1e6';
  context.font = `400 78px ${SHARE_CALLIGRAPHY_FONT}`;
  context.textAlign = 'center';
  drawWrappedText(context, card.title, CARD_WIDTH / 2, 430, 790, 92);

  context.fillStyle = '#2b2722';
  context.font = `500 40px ${SHARE_SERIF_FONT}`;
  context.textAlign = 'left';
  drawWrappedText(context, card.body, 112, 800, 856, 66);

  context.fillStyle = '#8b2626';
  roundedRect(context, 112, 1110, 856, 104, 12);
  context.fill();
  context.fillStyle = '#fffaf0';
  context.font = `700 34px ${SHARE_SERIF_FONT}`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(`打开「${BRAND_NAME}」，亲手走一遍经典`, CARD_WIDTH / 2, 1162);
};

const renderShareCard = async (card: ShareCard): Promise<Blob> => {
  if (document.fonts) {
    const fontText = collectShareCardFontText(card);
    await Promise.all([
      document.fonts.load(`400 110px ${SHARE_CALLIGRAPHY_FONT}`, fontText),
      document.fonts.load(`400 40px ${SHARE_SERIF_FONT}`, fontText),
      document.fonts.load(`500 40px ${SHARE_SERIF_FONT}`, fontText),
      document.fonts.load(`600 40px ${SHARE_SERIF_FONT}`, fontText),
      document.fonts.load(`700 40px ${SHARE_SERIF_FONT}`, fontText),
    ]);
    await document.fonts.ready;
  }
  const { canvas, context } = createCanvas();
  drawPaper(context);
  const image = await loadImage(card.imageUrl);

  if (card.kind === 'cover') drawCover(context, card, image);
  else if (card.kind === 'scene') drawScene(context, card, image);
  else drawEnding(context, card, image);

  drawBrand(context, card.pageNumber, card.pageCount);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('分享图生成失败')), 'image/png');
  });
};

const blobToBase64 = async (blob: Blob): Promise<string> => {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('图片读取失败'));
    reader.readAsDataURL(blob);
  });
  return dataUrl.slice(dataUrl.indexOf(',') + 1);
};

const shareNativeFiles = async (story: IGameStory, cards: ExportedCard[]) => {
  const directory = `share/${story.id}-${Date.now()}`;
  const uris: string[] = [];

  for (const card of cards) {
    const path = `${directory}/${card.fileName}`;
    await Filesystem.writeFile({
      path,
      data: await blobToBase64(card.blob),
      directory: Directory.Cache,
      recursive: true,
    });
    const { uri } = await Filesystem.getUri({ path, directory: Directory.Cache });
    uris.push(uri);
  }

  const metadata = buildStoryShareMetadata(story.title, story.description);
  const platform = Capacitor.getPlatform() as SharePlatform;
  if (shouldCopyStoryShareMetadata(platform)) {
    await Clipboard.write({ string: metadata.clipboardText });
  }

  const shareOptions = {
    ...metadata,
    files: uris,
  };

  const transport = chooseShareTransport(platform, cards.length);
  if (transport === 'android-images') await ImageShare.shareImages(shareOptions);
  else await Share.share(shareOptions);
};

const downloadWebZip = async (story: IGameStory, cards: ExportedCard[]) => {
  const zip = new JSZip();
  cards.forEach(card => zip.file(card.fileName, card.blob));
  const archive = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const url = URL.createObjectURL(archive);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${story.title}-小红书分享图.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const exportAndShareStory = async ({
  story,
  categoryTitle,
  scenes,
  onProgress,
}: ExportStoryInput): Promise<number> => {
  const plan = buildShareCardPlan({ story, categoryTitle, scenes });
  const cards: ExportedCard[] = [];

  for (const card of plan) {
    onProgress?.({ current: card.pageNumber, total: plan.length, message: `正在生成第 ${card.pageNumber} 张` });
    cards.push({
      blob: await renderShareCard(card),
      fileName: makeShareFileName(card.pageNumber, plan.length, card.title),
    });
  }

  onProgress?.({ current: plan.length, total: plan.length, message: '正在准备分享' });
  if (Capacitor.isNativePlatform()) await shareNativeFiles(story, cards);
  else await downloadWebZip(story, cards);

  return cards.length;
};
