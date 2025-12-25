
import { IGameScene } from "../types";
import { STORY_SCENES } from "../data/storyData";

/**
 * Returns the static, high-quality story structure.
 */
export const getStaticGameStory = (): IGameScene[] => {
  return JSON.parse(JSON.stringify(STORY_SCENES));
};

