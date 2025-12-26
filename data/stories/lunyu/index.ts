import { IGameCategory } from '../../../types';
import { YANHUITOUZHOU_SCENES } from './yanhuitouzhou';

export const LunyuCategory: IGameCategory = {
    id: 'lunyu',
    title: '论语',
    coverImage: '/assets/covers/cover_lunyu.jpg',
    stories: [
        {
            id: 'yanhuitouzhou',
            title: '颜回偷粥',
            description: '孔子误会颜回偷食，终知真相。通过此事感叹“知人不易”。',
            endingTitle: '知人不易',
            endingDescription: '所信者目也，而目犹不可信；所恃者心也，而心犹不足恃。弟子记之，知人固不易矣。',
            scenes: YANHUITOUZHOU_SCENES
        },
        {
            id: 'weibiansanjue',
            title: '韦编三绝 (敬请期待)',
            description: '孔子晚年喜读《易》，韦编三绝。曰：“假我数年，五十以学《易》，可以无大过矣。”',
            scenes: []
        },
        {
            id: 'zilushoujiao',
            title: '子路受教 (敬请期待)',
            description: '子路问政，孔子教之以先之劳之。子路性直，孔子常循循善诱。',
            scenes: []
        },
        {
            id: 'shizherusi',
            title: '逝者如斯 (敬请期待)',
            description: '子在川上曰：“逝者如斯夫！不舍昼夜。” 感叹时光流逝，勉励弟子珍惜光阴。',
            scenes: []
        },
        {
            id: 'junzibuqi',
            title: '君子不器 (敬请期待)',
            description: '孔子曰：“君子不器。” 意为君子博学多才，不应像器物一样只有单一用途。',
            scenes: []
        }
    ]
};
