import { IGameCategory } from '../../../types';
import { DANAOTIANGONG_SCENES } from './danaotiangong';
import { ZHENJIAMEIHOUWANG_SCENES } from './zhenjiameihouwang';

export const XiyouCategory: IGameCategory = {
    id: 'xiyouji',
    title: '西游记',
    coverImage: '/assets/covers/cover_xiyou.jpg',
    stories: [
        {
            id: 'danaotiangong',
            title: '大闹天宫',
            description: '孙悟空大闹天宫，挑战十万天兵天将。',
            endingTitle: '齐天大圣',
            endingDescription: '十万天兵难抵挡，定海神针显神威。这一战，打出了齐天大圣的赫赫威名，也种下了五百年被压五行山的因果。',
            scenes: DANAOTIANGONG_SCENES,
            isReady: true
        },
        {
            id: 'sandabaigujing',
            title: '三打白骨精 (敬请期待)',
            description: '白骨精三次变化戏弄唐僧，悟空火眼金睛识破妖魔。',
            endingTitle: '除魔卫道',
            endingDescription: '纵被师父误解逐出师门，亦不改除魔卫道之心。金猴奋起千钧棒，玉宇澄清万里埃。',
            scenes: [],
            isReady: false
        },
        {
            id: 'zhenjiameihouwang',
            title: '真假美猴王 (敬请期待)',
            description: '六耳猕猴假冒悟空，上天入地难辨真伪，终至如来佛祖处方显原形。',
            endingTitle: "师徒重归",
            endingDescription: "悟空一棒打死六耳猕猴，绝了二心。观音菩萨领着悟空去见唐僧，说明原委。唐僧方知错怪了徒弟，师徒重归于好，再上西行大道。",
            scenes: ZHENJIAMEIHOUWANG_SCENES,
            isReady: true
        },
        {
            id: 'nuerguo',
            title: '女儿国奇遇 (敬请期待)',
            description: '师徒误入西梁女国，唐僧在女王柔情与取经大业之间经受考验。',
            scenes: [],
            isReady: false
        },
        {
            id: 'dazhanhonghaier',
            title: '大战红孩儿 (敬请期待)',
            description: '红孩儿练成三昧真火，悟空难敌，请来观音菩萨方才收服。',
            scenes: [],
            isReady: false
        },
        {
            id: 'touchirenshenguo',
            title: '偷吃人参果 (敬请期待)',
            description: '万寿山五庄观，悟空偷吃人参果，推倒果树，惹怒镇元大仙。',
            scenes: [],
            isReady: false
        }
    ]
};
