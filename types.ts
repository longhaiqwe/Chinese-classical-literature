
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

export enum AppState {
  INITIAL = 'INITIAL',
  GENERATING_STORY = 'GENERATING_STORY',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
  ERROR = 'ERROR'
}

export interface GenerationProgress {
  total: number;
  current: number;
  message: string;
}
