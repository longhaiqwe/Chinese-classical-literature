
import { IGameScene } from '../../../types';

export const JINGWEITIANHAI_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "离家远游",
        narrative: "上古之时，炎帝神农氏有一爱女，名曰女娃。女娃生性活泼，向往自由。一日，她遥望日出之东方，只见云蒸霞蔚，心中顿生向往，意欲前往东海一游。",
        environmentDescription: "Morning mist in the mountains, a young girl looking towards the east.",
        characterState: "Nuwa standing on a hill, looking hopeful.",
        imageUrl: "/assets/shanhaijing/jingweitianhai/bg_01_departure.jpg",
        options: [
            {
                text: "留恋家园，放弃远行",
                isCorrect: false,
                feedback: "若不出行，虽得安稳，却永远无法见识那广阔的天地。但这不符合女娃的性格。"
            },
            {
                text: "辞别父亲，奔赴东海",
                isCorrect: true,
                feedback: "女娃拜别父亲，踏上了前往东海的旅途。一路山高水长，她却不知疲倦。"
            },
            {
                text: "邀请伙伴，从长计议",
                isCorrect: false,
                feedback: "时光不等人，若事事都要万全准备，恐怕这辈子都走不出这大山。"
            }
        ]
    },
    {
        id: 2,
        title: "泛舟戏水",
        narrative: "历经跋涉，女娃终于抵达东海之滨。只见碧波万顷，海天一色。她寻得一叶扁舟，独自划入海中。海风轻拂，波光粼粼，女娃只觉心旷神怡，从未有过的畅快。",
        environmentDescription: "A beautiful young girl sailing a small boat on a calm sea.",
        characterState: "Nuwa enjoying the sea breeze.",
        imageUrl: "/assets/shanhaijing/jingweitianhai/bg_02_sailing.jpg",
        options: [
            {
                text: "无论是岸边，还是浅滩",
                isCorrect: false,
                feedback: "既已入海，岂能只在浅滩徘徊？"
            },
            {
                text: "收帆垂钓，静享安宁",
                isCorrect: false,
                feedback: "大海变幻莫测，此刻虽宁静，却非久居之地。"
            },
            {
                text: "深入大海，探寻奇景",
                isCorrect: true,
                feedback: "大海深处仿佛有神秘的呼唤，女娃不知不觉间已离岸甚远。"
            }
        ]
    },
    {
        id: 3,
        title: "风暴突袭",
        narrative: "原本平静的海面骤然变色，乌云压顶，狂风大作。平静的东海瞬间化为吞噬万物的巨兽。巨浪滔天，狠狠地拍打着那如树叶般脆弱的小舟。",
        environmentDescription: "Dark storm clouds, massive waves, a small boat in danger.",
        characterState: "Nuwa struggling to control the boat.",
        imageUrl: "/assets/shanhaijing/jingweitianhai/bg_03_storm.jpg",
        options: [
            {
                text: "奋力划桨，与浪搏斗",
                isCorrect: true,
                feedback: "女娃虽然年幼，却有着炎帝血脉中的倔强，她试图稳住小舟，但人力终究难抗天威。"
            },
            {
                text: "闭目祈祷，听天由命",
                isCorrect: false,
                feedback: "坐以待毙绝非她的性格，即便面对绝境，也要抗争到底。"
            },
            {
                text: "弃船求生，跳入海中",
                isCorrect: false,
                feedback: "在这惊涛骇浪之中，离开船只无异于自寻死路。"
            }
        ]
    },
    {
        id: 4,
        title: "溺水化鸟",
        narrative: "轰隆一声巨响，一个如山般的巨浪拍下，小舟瞬间支离破碎。女娃落入冰冷的海水中，渐渐沉没。然而，她的身躯虽殁，怨愤之气不散，精魂化为一只白喙赤足的小鸟，名曰“精卫”。",
        environmentDescription: "Stormy sea, a bird rising from the waves.",
        characterState: "Jingwei bird flying defiantly.",
        imageUrl: "/assets/shanhaijing/jingweitianhai/bg_04_transformation.jpg",
        options: [
            {
                text: "哀鸣离去，躲避大海",
                isCorrect: false,
                feedback: "它既已重生，便不再畏惧。"
            },
            {
                text: "衔石填海，矢志不渝",
                isCorrect: true,
                feedback: "精卫发出凄厉的鸣叫，发誓要填平这夺去她性命的大海！"
            },
            {
                text: "潜入海底，寻找肉身",
                isCorrect: false,
                feedback: "肉身已逝，唯有精神长存。此时回头已无意义。"
            }
        ]
    },
    {
        id: 5,
        title: "衔石西山",
        narrative: "发鸠之山，其上多柘木。精卫以此为家，日复一日，往返于西山与东海之间。它衔来西山的木石，投得东海之中。路途遥远，风雨无阻，羽毛凌乱，足底流血，亦不肯停歇片刻。",
        environmentDescription: "Bird carrying a stone flying over mountains.",
        characterState: "Exhausted but determined bird.",
        imageUrl: "/assets/shanhaijing/jingweitianhai/bg_05_labor.jpg",
        options: [
            {
                text: "稍作休息，养精蓄锐",
                isCorrect: false,
                feedback: "每一刻的停歇，都让精卫觉得是对仇恨的遗忘，它不肯停。"
            },
            {
                text: "寻求帮手，共填沧海",
                isCorrect: false,
                feedback: "这是属于她一个人的战斗，也是她一个人的执念，哪怕孤独，也要坚持。"
            },
            {
                text: "坚持不懈，日夜往复",
                isCorrect: true,
                feedback: "沧海桑田，精卫的身影从未消失。"
            }
        ]
    },
    {
        id: 6,
        title: "千古誓言",
        narrative: "惊涛骇浪嘲笑它：“尔一小鸟，纵千百万年，也难填平我这汪洋大海。” 精卫在高空厉声回视：“纵使千万年，甚至亿万年，我也誓将你填平，以免你再害他人少年！”",
        environmentDescription: "Jingwei dropping stones into the vast ocean.",
        characterState: "Determined bird carrying a stone.",
        imageUrl: "/assets/shanhaijing/jingweitianhai/bg_06_oath.jpg",
        options: [
            {
                text: "与海谈判，祈求和平",
                isCorrect: false,
                feedback: "大海无情，岂会因为言语而改变？唯有行动能证明一切。"
            },
            {
                text: "子孙相继，永不放弃",
                isCorrect: true,
                feedback: "这种撼动天地的意志，令大海也不禁为之颤抖。"
            },
            {
                text: "沉默不语，专心投石",
                isCorrect: false,
                feedback: "虽无言亦有力，但此刻的誓言，是对天地的宣告。"
            }
        ]
    },
    {
        id: 7,
        title: "精神永存",
        narrative: "后来，人们常用“精卫填海”来比喻意志坚决，不畏艰难。那只白喙赤足的小鸟，成为了中华民族不屈不挠精神的象征，千古流传。",
        environmentDescription: "A symbolic image of the bird and the filled sea (abstract).",
        characterState: "Legendary status.",
        imageUrl: "/assets/shanhaijing/jingweitianhai/bg_07_legacy.jpg",
        options: [
            {
                text: "重读经典，再悟精神",
                isCorrect: true,
                feedback: "故事虽短，精神长存。"
            },
            {
                text: "讲述故事，传承后人",
                isCorrect: false,
                feedback: "将这精神代代相传，或许比填平大海更有意义。(游戏结束)"
            },
            {
                text: "仰望星空，追忆往昔",
                isCorrect: false,
                feedback: "星空之下，是否还有那只倔强的小鸟在飞翔？(游戏结束)"
            }
        ]
    },
    {
        id: 8,
        title: "平行时空：安度一生",
        narrative: "若当日女娃听从父命，未去东海，或许她能承欢膝下，无忧无虑度过一生。世间少了一段凄美的神话，却多了一个幸福的少女。但那样的女娃，还是那个向往自由的灵魂吗？",
        environmentDescription: "Nuwa playing happily in the fields.",
        characterState: "Nuwa living a peaceful life.",
        imageUrl: "/assets/shanhaijing/jingweitianhai/bg_08_bad_safe.jpg",
        options: [
            {
                text: "享受平凡，相夫教子",
                isCorrect: false,
                feedback: "这也是一种幸福，只是少了那份惊心动魄。"
            },
            {
                text: "梦回东海，心存遗憾",
                isCorrect: false,
                feedback: "既然选择了安逸，便只能在梦中寻找那片海。"
            },
            {
                text: "重新来过，再化精卫",
                isCorrect: true,
                feedback: "有些命运，或许注定要燃烧自己，照亮后人。"
            }
        ]
    }
];
