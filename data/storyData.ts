
import { CATEGORIES } from './stories';
import { TAOYUAN_SCENES } from './stories/sanguo/taoyuan';

export { CATEGORIES };

// For backward compatibility with geminiService.ts or other parts relying on this default export
export const STORY_SCENES = TAOYUAN_SCENES;
