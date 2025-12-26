
import { IGameCategory } from '../../../types';
import { DANAOTIANGONG_SCENES } from './danaotiangong';

export const XiyouCategory: IGameCategory = {
    id: 'xiyou',
    title: '西游记',
    coverImage: '/assets/covers/cover_xiyou.jpg',
    stories: [
        {
            id: 'danaotiangong',
            title: '大闹天宫',
            description: '孙悟空不满弼马温之职，大闹天宫，自封齐天大圣。',
            scenes: DANAOTIANGONG_SCENES
        }
    ]
};
