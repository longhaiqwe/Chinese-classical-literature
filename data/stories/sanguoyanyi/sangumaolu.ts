
import { IGameScene } from '../../../types';

export const SANGUMAOLU_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "初访隆中",
        narrative: "汉末乱世，刘备求贤若渴，闻听司马徽推荐诸葛亮之名，遂携关羽、张飞前往隆中拜访。只见山不高而秀雅，水不深而澄清，地不广而平坦，林不大而茂盛。三人来到草庐门前，叩门问童子，童子应声而出。刘备恭敬询问先生所在。",
        environmentDescription: "A serene thatched cottage in the mountains, surrounded by pine and bamboo.",
        characterState: "Liu Bei asking a young servant boy.",
        imageUrl: "/assets/sanguoyanyi/sangumaolu/bg_01_visit1.png",
        options: [
            {
                text: "硬闯草庐，搜寻孔明",
                isCorrect: false,
                feedback: "此非求贤之道！若这般无礼，只会惹怒高人，断送这段机缘。"
            },
            {
                text: "怏怏而回，改日再来",
                isCorrect: true,
                feedback: "童子言：“先生晨起自出……踪迹不定，不知何日归。”刘备听罢，怅然若失，只得嘱咐童子：“先生归时，可言刘备拜访。”遂上马而回。"
            },
            {
                text: "留关张守候，独自寻找",
                isCorrect: false,
                feedback: "山林广大，云深不知处，去何处寻找？且关张二人性急，若无人约束，只怕生事。"
            }
        ]
    },
    {
        id: 2,
        title: "风雪再访",
        narrative: "时值隆冬，天降大雪。刘备探得孔明归家，不顾天寒地冻，冒雪再去。张飞曰：“天寒地冻，且非用兵之时，何必受此劳苦？”刘备呵斥之。至门前，闻草堂书声琅琅，刘备心中暗喜，以为即是孔明。",
        environmentDescription: "Snowy landscape, Liu Bei waiting respectfully outside.",
        characterState: "Liu Bei standing in the snow.",
        imageUrl: "/assets/sanguoyanyi/sangumaolu/bg_02_visit2.png",
        options: [
            {
                text: "上前打断，表明来意",
                isCorrect: false,
                feedback: "此人乃是孔明之弟诸葛均。若贸然打断，显失礼数。"
            },
            {
                text: "大怒而去，不再复来",
                isCorrect: false,
                feedback: "若因一时挫折便轻言放弃，何以此诚心感动卧龙？天下三分之策恐成泡影。"
            },
            {
                text: "静候其毕，方才询问",
                isCorrect: true,
                feedback: "原来是诸葛均。孔明昨又应友人之约出门闲游去了。刘备虽失望，仍留书一封，以此明志：“备久慕高名，两次晋谒，不遇空回，惆怅何似……”"
            }
        ]
    },
    {
        id: 3,
        title: "三顾草庐",
        narrative: "开春之际，刘备选定吉期，斋戒沐浴，三往隆中。凡门，童子曰：“先生昼寝未醒。”刘备当即大喜，令关张在门外等候，自己轻步入内。见先生仰卧于草堂几席之上，那般神态安详。",
        environmentDescription: "Springtime at the cottage, peace and quiet.",
        characterState: "Liu Bei waiting while Zhuge Liang sleeps.",
        imageUrl: "/assets/sanguoyanyi/sangumaolu/bg_03_visit3.png",
        options: [
            {
                text: "拱立阶下，静候惊觉",
                isCorrect: true,
                feedback: "刘备此时已年近五旬，却恭敬侍立半晌。直待孔明醒来，口占一绝：“大梦谁先觉？平生我自知。草堂春睡足，窗外日迟迟。”"
            },
            {
                text: "令童子唤醒先生",
                isCorrect: false,
                feedback: "张飞曾欲放火烧屋逼其起床，被刘备喝止。求贤当诚心诚意，岂可稍有怠慢？"
            },
            {
                text: "咳嗽示警，促其早醒",
                isCorrect: false,
                feedback: "虽未直接唤醒，但故意弄出声响亦是不敬。孔明虽醒，然见客心浮气躁，恐难真心相辅。"
            }
        ]
    },
    {
        id: 4,
        title: "隆中对·相见",
        narrative: "孔明更衣出迎，见刘备气宇轩昂，诚意拳拳。分宾主坐定，童子献茶。刘备言：“汉室倾颓，奸臣窃命，主上蒙尘。备不量力，欲伸大义于天下，而智术浅短，迄无所就。惟先生开其愚而拯其厄。”",
        environmentDescription: "Interior of the cottage, simple but elegant. Liu Bei and Zhuge Liang sitting face to face.",
        characterState: "Liu Bei bowing respectfully to Zhuge Liang.",
        imageUrl: "/assets/sanguoyanyi/sangumaolu/bg_04_meeting.png",
        options: [
            {
                text: "夸耀兵力，许以重金",
                isCorrect: false,
                feedback: "先生志在天下，非为金银所动。若以此相诱，反显得刘备目光短浅，俗不可耐。"
            },
            {
                text: "屏退左右，坦陈心迹",
                isCorrect: true,
                feedback: "刘备真情流露，泪沾袍袖。孔明感其诚意，乃曰：“将军既有如此大志，亮愿效犬马之劳。”"
            },
            {
                text: "询问卜筮，测算吉凶",
                isCorrect: false,
                feedback: "孔明乃经天纬地之才，非江湖术士。问吉凶而非问大计，是看轻了先生。"
            }
        ]
    },
    {
        id: 5,
        title: "隆中对·天下",
        narrative: "孔明命童子取出地图，指点江山，为刘备分析天下大势：“曹操已拥百万之众，挟天子以令诸侯，此诚不可与争锋。孙权据有江东，已历三世，此可以为援而不可图也。荆州北据汉、沔，利尽南海……”",
        environmentDescription: "Zhuge Liang pointing at a map of China, explaining the strategy.",
        characterState: "Zhuge Liang pointing at the map.",
        imageUrl: "/assets/sanguoyanyi/sangumaolu/bg_05_map.png",
        options: [
            {
                text: "欲取中原，直捣许都",
                isCorrect: false,
                feedback: "此时曹操势大，若贸然北伐，无异于以卵击石。孔明之策，在先取基业，待天下有变。"
            },
            {
                text: "偏安一隅，以此终老",
                isCorrect: false,
                feedback: "刘备志在匡扶汉室，若只求偏安，何须三顾茅庐？亦非孔明出山之本意。"
            },
            {
                text: "拜谢先生，恳请出山",
                isCorrect: true,
                feedback: "先生未出草庐，已知三分天下。刘备顿首拜谢：“先生之言，顿开茅塞，如拨云雾而见青天！”"
            }
        ]
    },
    {
        id: 6,
        title: "平行时空：错失良机",
        narrative: "若非刘备这般三顾之诚，诸葛亮恐终老林泉，或许汉室难兴，三国历史也将改写。",
        environmentDescription: "An old man fishing by the river, forgotten by history.",
        characterState: "Zhuge Liang fishing alone.",
        imageUrl: "/assets/sanguoyanyi/sangumaolu/bg_06_bad_missed.png",
        options: [
            {
                text: "重新来过，诚心求贤",
                isCorrect: true,
                feedback: "精诚所至，金石为开。"
            }
        ]
    }
];
