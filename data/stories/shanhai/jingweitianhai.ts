
import { IGameScene } from '../../../types';

export const JINGWEITIANHAI_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "少女游海",
        narrative: "炎帝之小女，名曰女娃。女娃游于东海，泛舟戏水，天真烂漫，不知大海之险恶。",
        environmentDescription: "A beautiful young girl sailing a small boat on a calm sea.",
        characterState: "Nuwa enjoying the sea breeze.",
        imageUrl: "/assets/shanhai/jingweitianhai/bg_01_sailing.jpg",
        options: [
            {
                text: "深入大海，探寻奇景",
                isCorrect: true,
                feedback: "大海深处藏有无尽的秘密，女娃心生向往，驾舟向海中驶去。岂料风云突变，惊涛骇浪骤起。"
            },
            {
                text: "就在岸边，浅尝辄止",
                isCorrect: false,
                feedback: "若只在岸边嬉戏，虽安全无虞，却也不见大海之壮阔，更无后来之传奇。"
            },
            {
                text: "听从父命，早归山林",
                isCorrect: false,
                feedback: "女娃生性活泼好动，向往自由，岂肯轻易回转？"
            }
        ]
    },
    {
        id: 2,
        title: "溺水化鸟",
        narrative: "巨浪袭来，打翻小舟。女娃力竭，溺于东海。其精魂不灭，化为一鸟，白喙赤足，其型如乌，名曰精卫。",
        environmentDescription: "Stormy sea, a bird rising from the waves.",
        characterState: "Jingwei bird flying defiantly.",
        imageUrl: "/assets/shanhai/jingweitianhai/bg_02_transformation.jpg",
        options: [
            {
                text: "哀鸣离去，躲避大海",
                isCorrect: false,
                feedback: "精卫此时已非昔日柔弱少女，心中充满对大海的愤恨与不屈。"
            },
            {
                text: "衔石填海，矢志不渝",
                isCorrect: true,
                feedback: "精卫常衔西山之木石，以堙于东海。任凭大海嘲笑其渺小，亦不改其志。"
            },
            {
                text: "寻找炎帝，哭诉冤情",
                isCorrect: false,
                feedback: "化鸟之后，已通灵性，知天命不可违，唯有依靠自己之力，对抗这无情大海。"
            }
        ]
    },
    {
        id: 3,
        title: "千古誓言",
        narrative: "海神嘲笑曰：“尔一小鸟，纵千百万年，也难填平我这汪洋大海。”精卫答曰：“纵使千万年，甚至亿万年，我也誓将你填平，以免你再害他人！”",
        environmentDescription: "Jingwei dropping stones into the vast ocean.",
        characterState: "Determined bird carrying a stone.",
        imageUrl: "/assets/shanhai/jingweitianhai/bg_03_determination.jpg",
        options: [
            {
                text: "感悟天道，放弃执念",
                isCorrect: false,
                feedback: "此非执念，乃是坚韧不拔之精神。若放弃，便不再是那只让人敬佩的精卫鸟。"
            },
            {
                text: "子孙相继，永不放弃",
                isCorrect: true,
                feedback: "精卫之志，惊天地泣鬼神。后人感其精神，皆称赞这只小小冤禽，实乃天地间第一等倔强生灵。"
            }
        ]
    },
    {
        id: 4,
        title: "平行时空：安度一生",
        narrative: "若当日不起游海之念，或许女娃能承欢膝下，安度一生。但世间便少了一段凄美壮烈的神话。",
        environmentDescription: "Nuwa playing happily in the fields.",
        characterState: "Nuwa living a peaceful life.",
        imageUrl: "/assets/shanhai/jingweitianhai/bg_04_bad_safe.jpg",
        options: [
            {
                text: "重新来过，再化精卫",
                isCorrect: true,
                feedback: "有些命运，或许注定要燃烧自己，照亮后人。"
            }
        ]
    }
];
