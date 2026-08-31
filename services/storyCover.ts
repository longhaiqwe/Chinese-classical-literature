export const STORY_COVER_SCENE_INDEX = 0;
export const STORY_COVER_FALLBACK_SCENE_INDEX = 1;

export const resolveStoryCoverImage = (
  dedicatedCover?: string | null,
  firstSceneImage?: string | null,
): string | undefined => dedicatedCover || firstSceneImage || undefined;

export const getStoryCoverStoragePath = (categoryId: string, storyId: string): string =>
  `${categoryId}/${storyId}/cover-v1.png`;

export const getStoryCoverPublicUrl = (
  supabaseUrl: string,
  categoryId: string,
  storyId: string,
): string => `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/images/${getStoryCoverStoragePath(categoryId, storyId)}`;
