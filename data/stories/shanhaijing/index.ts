import { IGameCategory } from '../../../types';
import { JINGWEITIANHAI_SCENES } from './jingweitianhai';
import { HOUYISHERI_SCENES } from './houyisheri';

export const ShanhaiCategory: IGameCategory = {
    id: 'shanhaijing',
    title: '山海经',
    coverImage: '/assets/covers/cover_shanhai.jpg',
    stories: [
        {
            id: 'jingweitianhai',
            title: '精卫填海',
            description: '炎帝之女溺亡东海，化为精卫鸟，衔石填海，矢志不渝。',
            endingTitle: '坚韧不拔',
            endingDescription: '精卫衔微木，将以填沧海。刑天舞干戚，猛志固常在。你的坚持与毅力，正如这精卫鸟一般，令人动容。',
            scenes: JINGWEITIANHAI_SCENES
        },
        {
            id: 'houyisheri',
            title: '后羿射日',
            description: '十日并出，焦禾稼，杀草木。后羿张弓搭箭，射落九日，解救苍生。',
            scenes: HOUYISHERI_SCENES
        },
        {
            id: 'kuafuzhuri',
            title: '夸父逐日 (敬请期待)',
            description: '夸父与日逐走，渴欲得饮，饮于河、渭；河、渭不足，北饮大泽，未至，道渴而死。',
            scenes: []
        },
        {
            id: 'dayuzhishui',
            title: '大禹治水 (敬请期待)',
            description: '大禹率民治水，三过家门而不入，疏通九河，平定水患。',
            scenes: []
        },
        {
            id: 'huangdizhan',
            title: '黄帝战蚩尤 (敬请期待)',
            description: '轩辕黄帝与蚩尤大战于逐鹿之野，风后设指南车破迷雾，最终统一华夏。',
            scenes: []
        }
    ]
};
