export const STORY_IMAGE_STYLE_PREFIX = 'Gritty Chinese Manhua style, closer to classic Water Margin illustration and serious historical Chinese comic art, cinematic composition, expressive ink lines, restrained realism, historical costume details, safe for children, no text.';
export const STORY_IMAGE_STYLE_SUFFIX = 'no text --ar 16:9';

type StoryCoverPromptInput = {
  categoryTitle: string;
  storyTitle: string;
  description: string;
  representativeBeats: string[];
};

export const buildStoryCoverPrompt = ({
  categoryTitle,
  storyTitle,
  description,
  representativeBeats: _representativeBeats,
}: StoryCoverPromptInput): string => {
  return `${STORY_IMAGE_STYLE_PREFIX} Create a dedicated cover illustration for the Chinese classic 《${categoryTitle}》 story “${storyTitle}”. Story summary: ${description} Choose the single most iconic, child-safe moment suggested by this summary and depict exactly one moment, in one physical location, with one clear focal action. Do not depict earlier or later events, memories, visions, floating secondary scenes, or alternate versions of the same character. Match the same visual style, restrained earthy palette, character treatment, ink texture, and historical atmosphere as the in-app scene illustrations. Landscape composition with strong foreground, middle ground, and background depth, suitable for a large image area inside a warm rice-paper and cinnabar-red app template. No collage, no montage, no split panels, no decorative frame, no poster typography, no letters, no symbols, no watermark, no blood, no gore, no visible wounds. ${STORY_IMAGE_STYLE_SUFFIX}`;
};
