
import { IGameScene } from '../../../types';

export const DANAOTIANGONG_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "龙宫借宝",
        narrative: "孙悟空学艺归来，占山为王，虽有神通，却手无寸铁。闻听东海龙宫宝物众多，遂入海求兵。老龙王先后奉上大捍刀、九股叉、画杆方天戟，悟空皆大摇其头，嫌兵器太轻，不称手。",
        environmentDescription: "Splendid underwater Dragon Palace with various weapons displayed.",
        characterState: "Sun Wukong rejecting conventional weapons.",
        imageUrl: "/assets/xiyouji/danaotiangong/bg_01_dragon_palace.jpg",
        options: [
            {
                text: "强行索要，大闹龙宫",
                isCorrect: false,
                feedback: "虽显威风，然龙王也是一方神祗。若无理取闹，只怕引来看守海藏的神将围攻，反倒不美。"
            },
            {
                text: "既然无宝，转身离去",
                isCorrect: false,
                feedback: "好不容易来此一遭，若空手而归，确是可惜。且龙宫必有异宝，只恨未曾得见。"
            },
            {
                text: "询问更有何宝物",
                isCorrect: true,
                feedback: "龙女献策，道海藏中有一块天河定底神珍铁。龙王虽不舍，却也无奈，只得带悟空去见识。"
            }
        ]
    },
    {
        id: 2,
        title: "定海神针",
        narrative: "龙王领悟空至海藏中间，忽见金光万道。那是一根铁柱，约有斗来粗庆。悟空尽力一拔，那柱子便动了一动。悟空喜道：“再细些更妙！”那宝贝果然细了一圈。连叫几声，直到碗口粗细。细看有一行字：“如意金箍棒，重一万三千五百斤”。",
        environmentDescription: "The massive Golden Cudgel glowing in the depths of the sea.",
        characterState: "Sun Wukong marveling at the magical weapon.",
        imageUrl: "/assets/xiyouji/danaotiangong/bg_02_golden_cudgel.jpg",
        options: [
            {
                text: "嫌太重，放回原处",
                isCorrect: false,
                feedback: "此宝虽然沉重，却正是为你量身打造。若弃之不用，只怕再难寻得这般趁手兵器。"
            },
            {
                text: "变作绣花针，藏于耳内",
                isCorrect: true,
                feedback: "妙哉！此宝能大能小，随心变化。悟空将其变作绣花针塞入耳中，谢过龙王，大笑而去。"
            },
            {
                text: "扛起铁柱，径直打出",
                isCorrect: false,
                feedback: "虽有神力，然扛着如此巨物行走，终究不便。且宝物灵性，不知变化运用，仅做凡铁使唤，岂不暴殄天物？"
            }
        ]
    },
    {
        id: 3,
        title: "地府销名",
        narrative: "悟空得了金箍棒，日日在花果山操练，好不快活。一日醉卧松阴，魂魄被黑白无常勾至幽冥界。悟空醒来大怒，掏出金箍棒，一路打入森罗殿，逼十代冥王取出此时生死簿。",
        environmentDescription: "Gloomy Underworld court with terrified judges.",
        characterState: "Sun Wukong checking the Book of Life and Death.",
        imageUrl: "/assets/xiyouji/danaotiangong/bg_03_underworld.jpg",
        options: [
            {
                text: "只勾去自己名字",
                isCorrect: false,
                feedback: "虽得长生，然猴属同类仍受轮回之苦。既来之，何不惠及子孙？"
            },
            {
                text: "尽销猴属之名",
                isCorrect: true,
                feedback: "悟空提起笔，把猴属之类有名者，一概勾之。大笑扔笔：“了帐！了帐！今番不伏你管了！”一路棒打出幽冥界。"
            },
            {
                text: "大闹地府，推翻冥王",
                isCorrect: false,
                feedback: "地府乃三界轮回之所，若将其毁坏，致使阴阳失序，罪孽深重，必遭天谴。"
            }
        ]
    },
    {
        id: 4,
        title: "官封弼马",
        narrative: "龙王、冥王上天告状。玉帝欲遣兵捉拿，太白金星主张招安。悟空受诏上天，被封为“弼马温”。初时不知官小，日夜在御马监殷勤看守。半月后，宴请同僚，忽问此官品级。",
        environmentDescription: "Heavenly stables with divine horses.",
        characterState: "Sun Wukong interacting with celestial horses.",
        imageUrl: "/assets/xiyouji/danaotiangong/bg_04_stables.jpg",
        options: [
            {
                text: "嫌官小，打出南天门",
                isCorrect: true,
                feedback: "悟空闻言大怒：“这般渺视老孙！老孙在花果山，称王称祖，怎么哄我来替他养马？” 推倒公案，耳中取出宝贝，一路打出天门去了。"
            },
            {
                text: "忍气吞声，继续养马",
                isCorrect: false,
                feedback: "齐天大圣其实池中之物？若甘心养马，便失了那一身傲骨与灵性。"
            },
            {
                text: "上书玉帝，请求升迁",
                isCorrect: false,
                feedback: "天庭等级森严，岂容你轻易讨价还价？且悟空生性急躁，哪耐得住这般繁文缛节。"
            }
        ]
    },
    {
        id: 5,
        title: "蟠桃盛会",
        narrative: "悟空回山自封“齐天大圣”。玉帝无奈，只得承认其号，令看管蟠桃园。一日，七仙女来摘桃，言王母设宴请众仙，并未请大圣。悟空大怒，定住七仙女，奔瑶池痛饮仙酒，又偷吃了太上老君的仙丹。",
        environmentDescription: "Celestial banquet hall in disarray.",
        characterState: "Sun Wukong drunk and causing chaos.",
        imageUrl: "/assets/xiyouji/danaotiangong/bg_05_banquet.jpg",
        options: [
            {
                text: "酒醒惧罪，逃回下界",
                isCorrect: true,
                feedback: "悟空酒醒，自知闯下大祸：“不好！不好！这场祸比天大，若惊动玉帝，性命难存。走！走！走！” 遂逃回花果山。"
            },
            {
                text: "在此等候，向玉帝请罪",
                isCorrect: false,
                feedback: "偷桃盗丹，搅乱蟠桃会，罪在不赦。若在此等候，正是自投罗网。"
            },
            {
                text: "大闹瑶池，挑战群仙",
                isCorrect: false,
                feedback: "此时孤身一人，若在此大闹，引来漫天神佛围攻，只怕插翅难逃。不如先避其锋芒。"
            }
        ]
    },
    {
        id: 6,
        title: "大战天兵",
        narrative: "玉帝大恼，命四大天王、李靖、哪吒，点十万天兵天将，布下十八架天罗地网，下界捉拿悟空。双方在花果山一场恶战。悟空使出法天象地神通，杀得天兵丢盔弃甲。",
        environmentDescription: "Epic battlefield between Monkey King and Heavenly Army.",
        characterState: "Sun Wukong fighting heroically.",
        imageUrl: "/assets/xiyouji/danaotiangong/bg_06_battle.jpg",
        options: [
            {
                text: "乘胜追击，杀上天庭",
                isCorrect: false,
                feedback: "虽一时得胜，然天庭底蕴深厚，高手如云。若孤军深入，必陷绝境。"
            },
            {
                text: "苦战不退，力竭被擒",
                isCorrect: false,
                feedback: "二郎神杨奇赶来助战，又有太上老君暗中偷袭。悟空虽勇，终究双拳难敌四手。然此非结局，乃是另一段传奇的开始。"
            },
            {
                text: "且战且退，静观其变",
                isCorrect: true,
                feedback: "这一战，打出了齐天大圣的威名！虽最终被擒，然大闹天宫之举，已震动三界，成就千古美名。"
            }
        ]
    },
    {
        id: 7,
        title: "平行时空：皈依",
        narrative: "若当初不至龙宫寻宝、地府销名、不闹天宫，安分守己做个弼马温，或许便是另一番光景。但这，还是那个敢爱敢恨、无法无天的齐天大圣吗？",
        environmentDescription: "Sun Wukong looking bored in heaven.",
        characterState: "Sun Wukong as a celestial bureaucrat.",
        imageUrl: "/assets/xiyouji/danaotiangong/bg_07_bad_boring.jpg",
        options: [
            {
                text: "重新来过，再闹天宫！",
                isCorrect: true,
                feedback: "哪怕被压五百年，哪怕历经九九八十一难，俺老孙也绝不后悔！"
            }
        ]
    }
];
