export type ShareTransport = 'android-images' | 'capacitor' | 'web-zip';
export type SharePlatform = 'android' | 'ios' | 'web';

export type StoryShareMetadata = {
  title: string;
  text: string;
  clipboardText: string;
  dialogTitle: string;
};

export const buildStoryShareMetadata = (
  storyTitle: string,
  openingBackground: string,
): StoryShareMetadata => {
  const title = `中国故事：${storyTitle.trim()}`;
  const text = openingBackground.trim();

  return {
    title,
    text,
    clipboardText: `${title}\n\n${text}`,
    dialogTitle: '分享整套故事图片',
  };
};

export const chooseShareTransport = (platform: SharePlatform, fileCount: number): ShareTransport => {
  if (platform === 'web') return 'web-zip';
  if (platform === 'android' && fileCount > 1) return 'android-images';
  return 'capacitor';
};

export const shouldCopyStoryShareMetadata = (platform: SharePlatform): boolean => platform !== 'web';
