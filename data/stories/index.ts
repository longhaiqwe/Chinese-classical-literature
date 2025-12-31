
import { IGameCategory } from '../../types';
import { SanguoCategory } from './sanguoyanyi';
import { XiyouCategory } from './xiyouji';
import { ShanhaiCategory } from './shanhaijing';
import { LunyuCategory } from './lunyu';

export const CATEGORIES: IGameCategory[] = [
    SanguoCategory,
    XiyouCategory,
    ShanhaiCategory,
    LunyuCategory
];
