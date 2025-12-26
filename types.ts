
export interface GameOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface IGameScene {
  id: number;
  title: string;
  narrative: string;
  environmentDescription: string;
  characterState: string;

  imageUrl?: string; // Populated after image generation
  options: GameOption[];
}


export interface IGameStory {
  id: string;
  title: string;
  description: string;
  scenes: IGameScene[];
}

export interface IGameCategory {
  id: string;
  title: string;
  coverImage?: string;
  stories: IGameStory[];
}

export enum AppState {
  HOME = 'HOME',
  CATEGORY_VIEW = 'CATEGORY_VIEW',
  STORY_VIEW = 'STORY_VIEW',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
  ERROR = 'ERROR',
  // Deprecated but kept for compatibility during refactor
  INITIAL = 'INITIAL',
  GENERATING_STORY = 'GENERATING_STORY',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
}

export interface GenerationProgress {
  total: number;
  current: number;
  message: string;
}
