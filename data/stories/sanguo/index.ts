
import { IGameCategory } from '../../../types';
import { TAOYUAN_SCENES } from './taoyuan';

export const SanguoCategory: IGameCategory = {
    id: 'sanguo',
    title: '三国演义',
    coverImage: '/assets/covers/cover_sanguo.jpg',
    stories: [
        {
            id: 'taoyuan',
            title: '桃园结义',
            description: '东汉末年，天下大乱。刘关张三人于桃园结义，共图大事。',
            scenes: TAOYUAN_SCENES
        },
        {
            id: 'sanguo_placeholder_1',
            title: '三顾茅庐 (开发中)',
            description: '刘备三次拜访诸葛亮，求贤若渴，终得隆中对。',
            scenes: []
        },
        {
            id: 'sanguo_placeholder_2',
            title: '草船借箭 (开发中)',
            description: '周瑜设计害孔明，孔明谈笑间草船借箭十万枝。',
            scenes: []
        }
    ]
};
