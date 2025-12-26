
import { IGameScene } from '../../../types';

export const SANDABAIGUJING_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "荒山遇美",
        narrative: "唐僧师徒行至白虎岭，忽见一少妇，提篮送饭而来。八戒见了，口水直流，要去讨饭吃。悟空火眼金睛，一眼识破那是妖怪所变。",
        environmentDescription: "A desolate mountain path, a young woman approaching with a basket.",
        characterState: "Sun Wukong suspicious, Pigsy eager.",
        imageUrl: "/assets/xiyou/sandabaigujing/bg_01_girl.jpg",
        options: [
            {
                text: "当头一棒，打死妖精",
                isCorrect: true,
                feedback: "悟空举棒便打，那怪化作一阵清风去了，只留下假尸首。唐僧受了惊吓，责怪悟空乱杀无辜。"
            },
            {
                text: "劝说师父，绕道而行",
                isCorrect: false,
                feedback: "妖精一心要吃唐僧肉，岂会轻易放过？若不除去，必生后患。"
            },
            {
                text: "静观其变，看她戏法",
                isCorrect: false,
                feedback: "唐僧肉体凡胎，若被她近身捉去，悔之晚矣。"
            }
        ]
    },
    {
        id: 2,
        title: "老妇寻女",
        narrative: "少顷，山坡上闪出一个老妇人，哭哭啼啼，要寻女儿。唐僧见了，心中不忍，责怪悟空方才做得太绝。",
        environmentDescription: "An old woman crying on the mountain slope.",
        characterState: "Tang Seng feeling guilty.",
        imageUrl: "/assets/xiyou/sandabaigujing/bg_02_old_woman.jpg",
        options: [
            {
                text: "再起一棒，打杀老妇",
                isCorrect: true,
                feedback: "悟空认出又是那怪所变，不容分说，照头一下。那怪元神又出窍逃走，只留下一具假尸。"
            },
            {
                text: "上前赔礼，说明误会",
                isCorrect: false,
                feedback: "此乃妖怪诱敌之计。若上前搭话，正中下怀。"
            },
            {
                text: "请师父诵经超度",
                isCorrect: false,
                feedback: "妖精未除，诵经何用？且唐僧此时已被八戒挑唆，正在气头上，哪里听得进劝。"
            }
        ]
    },
    {
        id: 3,
        title: "老丈寻亲",
        narrative: "不多时，个老公公拄着拐杖走来。悟空睁圆火眼金睛，认得还是那个孽畜。",
        environmentDescription: "An elderly man approaching slowly.",
        characterState: "Sun Wukong furious but hesitant.",
        imageUrl: "/assets/xiyou/sandabaigujing/bg_03_old_man.jpg",
        options: [
            {
                text: "忍气吞声，任由师父责罚",
                isCorrect: false,
                feedback: "若不出手，师父必被妖怪捉去。大圣保唐僧西天取经，即使受屈，也不能眼看师父遭难。"
            },
            {
                text: "唤出土地，作证辨妖",
                isCorrect: true,
                feedback: "悟空念动咒语，唤出土地山神作证，方才举棒打死妖精。那怪终于现出原形，乃是一堆白骨。"
            },
            {
                text: "一棒打死，不管不顾",
                isCorrect: false,
                feedback: "虽除妖怪，却因未留证据，致使唐僧误会更深，终致被逐。"
            }
        ]
    },
    {
        id: 4,
        title: "师徒决裂",
        narrative: "唐僧见连伤三命，大怒之下，写下贬书，将悟空逐出师门。悟空无奈，只得嘱咐沙僧好好看顾师父，含泪拜别。",
        environmentDescription: "Tang Seng handing a letter to Wukong, looking away.",
        characterState: "Sun Wukong leaving in tears.",
        imageUrl: "/assets/xiyou/sandabaigujing/bg_04_parting.jpg",
        options: [
            {
                text: "回花果山，重做齐天大圣",
                isCorrect: true,
                feedback: "悟空回到花果山，重整旗鼓。虽身在水帘洞，心却系取经路。日后师父遭难，终还得他去解救。"
            }
        ]
    },
    {
        id: 5,
        title: "平行时空：师徒情缘",
        narrative: "若当时唐僧能识破妖计，或悟空能有更好法子证明清白，师徒也不必经受这一番分离之苦。",
        environmentDescription: "Original team walking happily towards the sunset.",
        characterState: "Team united.",
        imageUrl: "/assets/xiyou/sandabaigujing/bg_05_happy_team.jpg",
        options: [
            {
                text: "重新来过，护送师父",
                isCorrect: true,
                feedback: "取经之路漫漫，唯有师徒同心，方能修成正果。"
            }
        ]
    }
];
