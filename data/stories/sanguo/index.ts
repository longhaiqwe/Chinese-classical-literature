import { IGameCategory } from '../../../types';
import { TAOYUAN_SCENES } from './taoyuan';
import { SANGUMAOLU_SCENES } from './sangumaolu';

export const SanguoCategory: IGameCategory = {
    id: 'sanguo',
    title: '三国演义',
    coverImage: '/assets/covers/cover_sanguo.jpg',
    stories: [
        {
            id: 'taoyuan',
            title: '桃园结义',
            description: '东汉末年，天下大乱。刘关张三人于桃园结义，共图大事。',
            endingTitle: '义薄云天',
            endingDescription: '三位英雄于桃园焚香结拜，誓同生死。一段波澜壮阔的三国史诗就此拉开序幕。恭喜你完成了这段历史的演绎。',
            scenes: TAOYUAN_SCENES
        },
        {
            id: 'sangumaolu',
            title: '三顾茅庐',
            description: '刘备三次拜访诸葛亮，求贤若渴，终得隆中对。',
            endingTitle: '如鱼得水',
            endingDescription: '刘备三顾茅庐，终得卧龙出山。此后君臣相知，如鱼得水，共创蜀汉基业。',
            scenes: SANGUMAOLU_SCENES
        },
        {
            id: 'sanguo_placeholder_2',
            title: '草船借箭 (敬请期待)',
            description: '周瑜设计害孔明，孔明谈笑间草船借箭十万枝。',
            scenes: []
        },
        {
            id: 'chibizhizhan',
            title: '赤壁之战 (敬请期待)',
            description: '孙刘联军火烧赤壁，大破曹操八十万大军，奠定三国鼎立之势。',
            scenes: []
        },
        {
            id: 'kongchengji',
            title: '空城计 (敬请期待)',
            description: '司马懿大军压境，诸葛亮因险设局，抚琴退敌。',
            scenes: []
        },
        {
            id: 'zhujiulunyinxiong',
            title: '煮酒论英雄 (敬请期待)',
            description: '曹操青梅煮酒，与刘备共论天下英雄。',
            scenes: []
        },
        {
            id: 'qiqinmenghuo',
            title: '七擒孟获 (敬请期待)',
            description: '诸葛亮深入南中，七擒七纵孟获，攻心为上，平定南方。',
            scenes: []
        }
    ]
};
