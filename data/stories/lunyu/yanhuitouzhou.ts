
import { IGameScene } from '../../../types';

export const YANHUITOUZHOU_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "绝粮陈蔡",
        narrative: "孔子困于陈蔡之间，绝粮七日，弟子无论老少皆有饥色。唯颜回依然神态自若，每日依旧读书习礼，并设法讨得少许米粮煮粥。",
        environmentDescription: "A dilapidated temple, Confucius and disciples looking hungry and weak.",
        characterState: "Yan Hui cooking porridge quietly.",
        imageUrl: "/assets/lunyu/yanhuitouzhou/bg_01_hungry.jpg",
        options: [
            {
                text: "安贫乐道",
                isCorrect: true,
                feedback: "君子固穷，小人穷斯滥矣。越是困境，越能磨炼心性，颜回深得夫子之道。"
            },
            {
                text: "质疑师道",
                isCorrect: false,
                feedback: "子路曾问：“君子亦有穷乎？”若因一时困顿而动摇信念，便非真君子。"
            },
            {
                text: "甚至想要离开",
                isCorrect: false,
                feedback: "患难见真情，此时离去，不仅背弃师门，更背弃了自己的道义。"
            }
        ]
    },
    {
        id: 2,
        title: "颜回讨米",
        narrative: "颜回几经周折，终于讨回一些米来煮粥。大家早已饥肠辘辘，都在焦急地等待。",
        environmentDescription: "Yan Hui cooking near a simple stove.",
        characterState: "Yan Hui focused on cooking.",
        imageUrl: "/assets/lunyu/yanhuitouzhou/bg_02_cooking.jpg",
        options: [
            {
                text: "小心看火",
                isCorrect: true,
                feedback: "米粮来之不易，需得全神贯注，确保粥熟且不浪费，这也是一种修行。"
            },
            {
                text: "因为饥饿难耐",
                isCorrect: false,
                feedback: "虽饥肠辘辘，但颜回克己复礼，绝不会在师长未食之前因私欲而失态。"
            },
            {
                text: "心生怨怼",
                isCorrect: false,
                feedback: "颜回为人谦冲，即使身处逆境，也绝无怨言，只会默默承担。"
            }
        ]
    },
    {
        id: 3,
        title: "意外发生",
        narrative: "粥快熟时，忽有一阵风吹来，屋顶上的灰尘掉进了锅里。颜回连忙用勺子将脏了的粥舀出来。",
        environmentDescription: "Dust falling into the pot.",
        characterState: "Yan Hui looking concerned.",
        imageUrl: "/assets/lunyu/yanhuitouzhou/bg_03_accident.jpg",
        options: [
            {
                text: "惜食吞粥",
                isCorrect: true,
                feedback: "“一箪食，一瓢饮，在陋巷，人不堪其忧，回也不改其乐。”颜回深知物力维艰，故不忍丢弃，虽然不洁，宁可自己吃下。"
            },
            {
                text: "倒掉脏粥",
                isCorrect: false,
                feedback: "此时绝粮七日，每一粒米都关乎性命，岂能轻易倒掉？此举虽合卫生，却不合时宜。"
            },
            {
                text: "搅拌掩饰",
                isCorrect: false,
                feedback: "若将灰尘拌入粥中呈给夫子，便是欺师；若自己食用却不言明，亦非诚实之道。"
            }
        ]
    },
    {
        id: 4,
        title: "孔子试探",
        narrative: "孔子远远看见颜回似乎在偷吃，心中不悦，但没有当面发作。待颜回端粥送上时，孔子故意说道：“刚才我梦见了先君，这粥若是洁净的，就先拿去祭祀吧。”",
        environmentDescription: "Confucius testing Yan Hui.",
        characterState: "Confucius looking stern but calm.",
        imageUrl: "/assets/lunyu/yanhuitouzhou/bg_04_test.jpg",
        options: [
            {
                text: "据实以告",
                isCorrect: true,
                feedback: "颜回坦荡答道：“不可！刚才有灰尘掉进锅里，我怕浪费便吃了，这粥已不洁，不能祭祀了。”诚实乃君子之本。"
            },
            {
                text: "顺从师命",
                isCorrect: false,
                feedback: "祭祀讲究“诚”与“洁”。若明知粥不洁而献祭，是大不敬；若隐瞒实情，是欺师。"
            },
            {
                text: "惶恐认错",
                isCorrect: false,
                feedback: "颜回所为并非错事，而是惜物之举，何须惶恐？只需如实说明即可。"
            }
        ]
    },
    {
        id: 5,
        title: "误会冰释",
        narrative: "孔子听后感叹道：“原本我只相信眼睛看到的，可亲眼所见也未必是真相；原本我只依靠内心的推测，可内心有时也会不可靠。大家要记住，了解一个人真的不容易啊！”",
        environmentDescription: "Confucius teaching his disciples.",
        characterState: "All disciples listening with respect.",
        imageUrl: "/assets/lunyu/yanhuitouzhou/bg_05_resolution.jpg",
        options: [
            {
                text: "深信不疑",
                isCorrect: true,
                feedback: "信任非一日之功，需经得起误解与考验。师徒之间，贵在相知相信。"
            },
            {
                text: "眼见为实",
                isCorrect: false,
                feedback: "孔子今日之教，正是要破除“眼见为实”的执念。心之所感，往往比眼之所见更为真实。"
            },
            {
                text: "心存芥蒂",
                isCorrect: false,
                feedback: "误会既已冰释，道理也已讲明，若仍存芥蒂，便枉费了夫子的一番教诲。"
            }
        ]
    },

];
