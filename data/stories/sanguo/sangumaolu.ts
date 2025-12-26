
import { IGameScene } from '../../../types';

export const SANGUMAOLU_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "初访隆中",
        narrative: "刘备求贤若渴，携关羽、张飞前往隆中拜访诸葛亮。至草卢前，问童子，言先生晨起出游，不知去向。",
        environmentDescription: "A serene thatched cottage in the mountains, surrounded by pine and bamboo.",
        characterState: "Liu Bei asking a young servant boy.",
        imageUrl: "/assets/sanguo/sangumaolu/bg_01_visit1.jpg",
        options: [
            {
                text: "怏怏而回，改日再来",
                isCorrect: true,
                feedback: "既然先生不在，只得且回。刘备这般诚心，也是求贤之道。"
            },
            {
                text: "硬闯草庐，搜寻孔明",
                isCorrect: false,
                feedback: "此非求贤之道！若这般无礼，只会惹怒高人，断送这段机缘。"
            },
            {
                text: "留关张守候，独自寻找",
                isCorrect: false,
                feedback: "山林广大，去何处寻找？且关张二人性急，若无人约束，只怕生事。"
            }
        ]
    },
    {
        id: 2,
        title: "风雪再访",
        narrative: "数日后，探得孔明归家。刘备不顾天寒地冻，冒雪再往。至门前，闻草堂书声琅琅，以为是孔明。",
        environmentDescription: "Snowy landscape, Liu Bei waiting respectfully outside.",
        characterState: "Liu Bei standing in the snow.",
        imageUrl: "/assets/sanguo/sangumaolu/bg_02_visit2.jpg",
        options: [
            {
                text: "上前打断，表明来意",
                isCorrect: false,
                feedback: "此人乃是孔明之弟诸葛均。若贸然打断，显失礼数。"
            },
            {
                text: "静候其毕，方才询问",
                isCorrect: true,
                feedback: "原来是诸葛均。孔明昨又应友人之约出门闲游去了。刘备虽失望，仍留书一封，以此明志。"
            },
            {
                text: "大怒而去，不再复来",
                isCorrect: false,
                feedback: "若因一时挫折便轻言放弃，何以此诚心感动卧龙？天下三分之策恐成泡影。"
            }
        ]
    },
    {
        id: 3,
        title: "三顾草庐",
        narrative: "开春之际，刘备选定吉期，斋戒沐浴，三往隆中。凡门，童子曰：“先生昼寝未醒。”",
        environmentDescription: "Springtime at the cottage, peace and quiet.",
        characterState: "Liu Bei waiting while Zhuge Liang sleeps.",
        imageUrl: "/assets/sanguo/sangumaolu/bg_03_visit3.jpg",
        options: [
            {
                text: "令童子唤醒先生",
                isCorrect: false,
                feedback: "张飞曾欲放火烧屋逼其起床，被刘备喝止。求贤当诚心诚意，岂可稍有怠慢？"
            },
            {
                text: "径直入内，且看且等",
                isCorrect: false,
                feedback: "虽是心急，然擅入卧房，非君子所为，亦是对先生不敬。"
            },
            {
                text: "拱立阶下，静候惊觉",
                isCorrect: true,
                feedback: "刘备此时已年近五旬，却恭敬侍立半晌。孔明醒来，见玄德如此诚意，终被感动，遂有隆中对，天下三分由是始。"
            }
        ]
    },
    {
        id: 4,
        title: "平行时空：错失良机",
        narrative: "若非刘备这般三顾之诚，诸葛亮恐终老林泉，或许汉室难兴，三国历史也将改写。",
        environmentDescription: "An old man fishing by the river, forgotten by history.",
        characterState: "Zhuge Liang fishing alone.",
        imageUrl: "/assets/sanguo/sangumaolu/bg_04_bad_missed.jpg",
        options: [
            {
                text: "重新来过，诚心求贤",
                isCorrect: true,
                feedback: "精诚所至，金石为开。"
            }
        ]
    }
];
