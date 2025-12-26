
import { IGameScene } from '../../../types';

export const YANHUITOUZHOU_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "陈蔡绝粮",
        narrative: "孔子困于陈蔡之间，绝粮七日，弟子无论老少皆有饥色。唯颜回依然神态自若，每日依旧读书习礼，并设法讨得少许米粮煮粥。",
        environmentDescription: "A dilapidated temple, Confucius and disciples looking hungry and weak.",
        characterState: "Yan Hui cooking porridge quietly.",
        imageUrl: "/assets/lunyu/yanhuitouzhou/bg_01_hungry.jpg",
        options: [
            {
                text: "抱怨命运不公",
                isCorrect: false,
                feedback: "君子固穷，小人穷斯滥矣。孔门弟子当安贫乐道，岂可效小人之态？"
            },
            {
                text: "坚持修身讲学",
                isCorrect: true,
                feedback: "孔子弦歌不辍，以此以此教导弟子，越是困境，越显君子风骨。"
            },
            {
                text: "散伙各奔前程",
                isCorrect: false,
                feedback: "弟子追随夫子，乃为求大道。若因一时困顿便散去，何谈大义？"
            }
        ]
    },
    {
        id: 2,
        title: "视线一瞥",
        narrative: "粥将熟时，孔子正于堂上安坐，偶然眼光扫向庖厨，忽见颜回用勺子舀起锅中之粥喝了一口。",
        environmentDescription: "View from the hall looking into the kitchen.",
        characterState: "Confucius looking surprised/disappointed.",
        imageUrl: "/assets/lunyu/yanhuitouzhou/bg_02_glimpse.jpg",
        options: [
            {
                text: "大声呵斥颜回",
                isCorrect: false,
                feedback: "为师者，当先查明真相。若不问青红皂白便责骂，恐伤弟子之心，亦非圣贤所为。"
            },
            {
                text: "装作未见，暗自怀疑",
                isCorrect: false,
                feedback: "心中存疑而不问，非直道也。且若此误解加深，师徒之道恐有裂痕。"
            },
            {
                text: "佯作不知，借机试探",
                isCorrect: true,
                feedback: "孔子不动声色。待颜回献粥时，孔子曰：“吾梦见先君，洁食以祭。”以此试探颜回反应。"
            }
        ]
    },
    {
        id: 3,
        title: "真相大白",
        narrative: "颜回答道：“不可！方才烟尘落入釜中，弃之可惜，回已食之。不可祭也。”孔子闻言，长叹一声，方知错怪了颜回。",
        environmentDescription: "Confucius and Yan Hui talking sincerely.",
        characterState: "Confucius looking relieved and moved.",
        imageUrl: "/assets/lunyu/yanhuitouzhou/bg_03_truth.jpg",
        options: [
            {
                text: "向众弟子说明缘由",
                isCorrect: true,
                feedback: "孔子召集弟子曰：“所信者目也，而目犹不可信；所恃者心也，而心犹不足恃。弟子记之，知人固不易矣。”"
            },
            {
                text: "默不作声，心中愧疚",
                isCorrect: false,
                feedback: "既知真相，当为弟子正名，并以此教化众人。这也是极好的教育机会。"
            }
        ]
    },
    {
        id: 4,
        title: "平行时空：信任崩塌",
        narrative: "若孔子当时未能查明真相，认定颜回偷食，一代贤人恐蒙不白之冤，师徒情谊亦将不再。",
        environmentDescription: "A rift appearing between master and disciple.",
        characterState: "Yan Hui looking misunderstood.",
        imageUrl: "/assets/lunyu/yanhuitouzhou/bg_04_bad_mistrust.jpg",
        options: [
            {
                text: "重拾信任，再续师徒情",
                isCorrect: true,
                feedback: "信任如镜，碎之难圆。然若有心修补，未必不能重归于好。"
            }
        ]
    }
];
