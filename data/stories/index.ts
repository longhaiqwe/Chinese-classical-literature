
import { IGameCategory } from '../../types';
import { SanguoCategory } from './sanguo';
import { XiyouCategory } from './xiyou';
import { ShanhaiCategory } from './shanhai';
import { LunyuCategory } from './lunyu';

export const CATEGORIES: IGameCategory[] = [
    SanguoCategory,
    XiyouCategory,
    ShanhaiCategory,
    LunyuCategory
];
