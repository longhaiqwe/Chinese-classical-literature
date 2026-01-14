import { IGameScene } from '../../../types';

export const WEIBIANSANJUE_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "晚年好易",
        narrative: "孔子晚年由卫返鲁，结束了长达十四年的周游列国生涯。此时他已年近古稀，却依然壮心不已，将全部精力投入到对古代典籍的整理之中。而在六经之中，他尤爱《周易》，常常不知疲倦地研读，甚至到了废寝忘食的地步。",
        environmentDescription: "Confucius in his study room, surrounded by bamboo slips, peaceful atmosphere.",
        characterState: "Confucius reading with great interest.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/lunyu/weibiansanjue/bg_01_reading.jpg",
        options: [
            {
                text: "探究天道",
                isCorrect: true,
                feedback: "《周易》虽以此卜筮，但孔子看到的却是其中蕴含的天地万物变化之道。他不仅是读，更是要探寻宇宙人生的终极真理。"
            },
            {
                text: "消磨时光",
                isCorrect: false,
                feedback: "孔子晚年惜时如金，感叹“逝者如斯夫”，绝不会为了单纯消磨时光而读书。他是在与时间赛跑，传承文化。"
            },
            {
                text: "寻求吉凶",
                isCorrect: false,
                feedback: "孔子言“不占而已矣”，他读易并非为了算命卜卦求吉凶，而是为了通晓事理，修身养性。"
            }
        ]
    },
    {
        id: 2,
        title: "日夜精研",
        narrative: "夜深了，颜回、子路等弟子都已歇息，孔子的书房里那盏油灯却依然亮着。他时而凝眉沉思，时而提笔批注，对于《周易》中的每一句卦辞、每一段爻辞，都反复推敲，务求甚解。简册上的字迹，在他昏花的眼中却似星辰般闪耀。",
        environmentDescription: "Confucius studying late at night by candlelight.",
        characterState: "Confucius looking thoughtful and focused.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/lunyu/weibiansanjue/bg_02_studying.jpg",
        options: [
            {
                text: "学思并重",
                isCorrect: true,
                feedback: "“学而不思则罔，思而不学则殆。” 孔子正是通过不断地研读与思考，将古老的卜筮之书升华为哲学经典。"
            },
            {
                text: "囫囵吞枣",
                isCorrect: false,
                feedback: "孔子治学最忌只读表面而不求甚解。对于艰深的《周易》，他更是逐字逐句地推敲，绝不含糊。"
            },
            {
                text: "墨守成规",
                isCorrect: false,
                feedback: "孔子读易，并非死守古义，而是“述而不作，信而好古”中又有所创新，赋予了《周易》全新的德义内涵。"
            }
        ]
    },
    {
        id: 3,
        title: "韦编初断",
        narrative: "春秋时期的书，是将许多根竹简用熟牛皮绳（韦）编联起来的。虽然牛皮绳坚韧异常，但架不住孔子日复一日、年复一年的频繁翻阅。这一日，正当孔子读到兴头上时，手中的书简突然散了架——那条坚韧的牛皮绳竟然磨断了！",
        environmentDescription: "Bamboo slips scattered on the floor, broken leather strap.",
        characterState: "Confucius looking surprised but calm.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/lunyu/weibiansanjue/bg_03_broken.jpg",
        options: [
            {
                text: "欣然重编",
                isCorrect: true,
                feedback: "孔子并没有因此懊恼，反而因为自己读书之勤而感到一丝欣慰。他唤来弟子，耐心地将竹简按顺序重新编好，继续攻读。"
            },
            {
                text: "怅然若失",
                isCorrect: false,
                feedback: "书简虽断，学问未断。孔子心胸豁达，这点小事不会让他感到怅然，反而会更激发他读书的热情。"
            },
            {
                text: "置之不理",
                isCorrect: false,
                feedback: "书是孔子的良师益友，怎么会置之不理呢？"
            }
        ]
    },
    {
        id: 4,
        title: "韦编三绝",
        narrative: "这并非偶然。随着岁月的流逝，孔子读《易》的热情有增无减。据说，那编联竹简的熟牛皮绳，竟然先后断了三次之多！这也不仅成为了“韦编三绝”这一成语的典故由来，更成为了后世千古流传的勤学佳话。",
        environmentDescription: "Time passing montage, worn out bamboo slips.",
        characterState: "Confucius looking determined and diligent.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/lunyu/weibiansanjue/bg_04_three_times.jpg",
        options: [
            {
                text: "笃志虚心",
                isCorrect: true,
                feedback: "正是这种笃志好学、虚心求教的精神，成就了孔子的圣人地位。正如他自己所言：“我非生而知之者，好古，敏以求之者也。”"
            },
            {
                text: "爱书如命",
                isCorrect: false,
                feedback: "虽然孔子确实爱书，但“韦编三绝”的核心精神在于“勤奋”与“刻苦”，而非单纯对书籍实体的爱惜。"
            },
            {
                text: "力大无穷",
                isCorrect: false,
                feedback: "牛皮绳并非被拉断，而是被磨断的。这体现的是“水滴石穿”的功夫，而非力气的大小。"
            }
        ]
    },
    {
        id: 5,
        title: "假我数年",
        narrative: "面对博大精深的《周易》，孔子依然保持着极度的谦逊。他曾深有感触地对子路说：“假我数年，五十以学《易》，可以无大过矣。” 即使到了古稀之年，他依然觉得时间不够用，依然觉得自己还有提升的空间。",
        environmentDescription: "Confucius looking at the sky/horizon, contemplating.",
        characterState: "Confucius looking wise and humble.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/lunyu/weibiansanjue/bg_05_humble.jpg",
        options: [
            {
                text: "不仅孜孜",
                isCorrect: true,
                feedback: "圣人之所以为圣人，在于从不满足于已有的成就。孔子的这种“不知老之将至”的求学态度，才是最值得我们后人学习的。"
            },
            {
                text: "临渊羡鱼",
                isCorrect: false,
                feedback: "孔子是在身体力行地“退而结网”，通过踏实地学习来避免过失，而非空想羡慕。"
            },
            {
                text: "悔不当初",
                isCorrect: false,
                feedback: "孔子一生光明磊落，此言并非后悔，而是对知识的无限向往和对完美人格的不懈追求。"
            }
        ]
    },
    {
        id: 6,
        title: "十翼传世",
        narrative: "功夫不负有心人。孔子晚年对《周易》的整理和注释，汇集成了被后世称为《十翼》（《易传》）的不朽经典。他为这本古老的卜筮之书插上了哲学的翅膀，使其飞越了千年的时空，至今仍照耀着中华文明的天空。",
        environmentDescription: "Confucius teaching, phantom of Yi Jing text in background.",
        characterState: "Confucius interacting with disciples.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/lunyu/weibiansanjue/bg_06_legacy.jpg",
        options: []
    }
];
