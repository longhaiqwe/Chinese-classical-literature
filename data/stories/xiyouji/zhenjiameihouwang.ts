
import { IGameScene } from '../../../types';

export const ZHENJIAMEIHOUWANG_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "被逐蒙冤",
        narrative: "孙悟空因打死强盗，被唐僧逐回花果山。不料，悟空走后，又有一'悟空'现身，打晕唐僧，抢走行李。沙僧奔至花果山索讨，见'悟空'高坐石台，这也是'美猴王'，那也是'齐天大圣'，更有一般无二的猴子猴孙。",
        environmentDescription: "Tang Seng collapsed on the roadside, luggage gone. A fake Wukong looking arrogant at Huaguoshan.",
        characterState: "Tang Seng injured and confused, Sha Seng angry and suspicious.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/zhenjiameihouwang/bg_01_exile.jpg",
        options: [
            {
                text: "沙僧怒斥，挥杖便打",
                isCorrect: true,
                feedback: "沙僧见那'悟空'不仅不认账，反要自立门户去取经，大怒之下，举降妖杖便打。那'悟空'也不示弱，举棒相迎。沙僧虽勇，却难敌这'大圣'神威，只得败走南海求观音。"
            },
            {
                text: "好言相劝，请回师兄",
                isCorrect: false,
                feedback: "沙僧不知眼前乃是假货，只道大师兄还在气头上。低声下气，反惹那妖怪耻笑，变本加厉，更无回转之机。"
            },
            {
                text: "回禀师父，从长计议",
                isCorrect: false,
                feedback: "行李已失，师父受伤，若空手而回，岂不让师父更添忧虑？且那怪既然假扮悟空，必有图谋，迟则生变。"
            }
        ]
    },
    {
        id: 2,
        title: "真假莫辨",
        narrative: "真悟空得知有人假冒自己，大怒，随沙僧同回花果山。两个悟空一照面，一般的黄衣虎皮裙，一般的金箍棒，一般的相貌声音。二猴打在一处，从花果山打到半空，如两道金光纠缠，难解难分。",
        environmentDescription: "Two identical Monkey Kings fighting mid-air above Huaguoshan. Golden sparks flying.",
        characterState: "Both Wukongs furious and evenly matched.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/zhenjiameihouwang/bg_02_battle.jpg",
        options: [
            {
                text: "请师父念咒辨真假",
                isCorrect: false,
                feedback: "二猴打到唐僧面前，唐僧念起紧箍咒。两个悟空一齐喊疼，抱着头打滚，一般无二。师父肉眼凡胎，哪里分辨得出？反倒疼坏了真悟空。"
            },
            {
                text: "上天入地，且战且行",
                isCorrect: true,
                feedback: "既然武艺神通一般无二，便只有去寻个眼力高明的。二猴且战且走，惊动天庭，吓坏龙王，却谁也奈何不得谁，只得去往南天门求玉帝分辨。"
            },
            {
                text: "各自罢手，平分行李",
                isCorrect: false,
                feedback: "美猴王乃是天地间独一无二的灵明石猴，岂容他人冒名顶替？便是粉身碎骨，也要争个明白，绝无妥协之理。"
            }
        ]
    },
    {
        id: 3,
        title: "南海难分",
        narrative: "打到落伽山，观音菩萨唤来木叉与白鹦哥，欲擒那假悟空。谁知两个悟空同时护住唐僧，一般地降妖除魔，一般地虔诚礼拜。菩萨看来看去，也看不出半点破绽。",
        environmentDescription: "Mount Luojia, Guanyin Bodhisattva observing two identical Wukongs.",
        characterState: "Guanyin puzzled, Wukongs anxious.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/zhenjiameihouwang/bg_03_guanyin.jpg",
        options: [
            {
                text: "去天庭照妖镜一照",
                isCorrect: false,
                feedback: "托塔天王李靖借来照妖镜，照住两个悟空。镜中只见两个影子，一般无二，金箍服色皆同，毫无妖气。众神也是束手无策。"
            },
            {
                text: "往地府寻谛听辨认",
                isCorrect: true,
                feedback: "观音道：'我亦难辨。却往地府去走一遭。' 二猴又打到幽冥地界，惊动十殿阎王。地藏王菩萨唤神兽谛听来听。"
            },
            {
                text: "请如来佛祖定夺",
                isCorrect: false,
                feedback: "虽是终极之法，但按顺序，悟空性急，必是先近后远。地府既有能听遍三界之事的神兽，自当先去一试。"
            }
        ]
    },
    {
        id: 4,
        title: "地府谛听",
        narrative: "谛听伏在地下，听了片刻，抬起头来。它虽已知晓真假，却不敢当面说破。因那假悟空神通广大，若当面揭穿，恐大闹地府，无人能制。",
        environmentDescription: "Hell (Diyu), Di Ting (mythical beast) listening on the ground. Ten Kings of Hell watching fearfully.",
        characterState: "Di Ting knowing but silent, Wukongs impatient.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/zhenjiameihouwang/bg_04_diting.jpg",
        options: [
            {
                text: "谛听直言真相",
                isCorrect: false,
                feedback: "谛听若说，那妖精必怒，地府阴司又无如来佛祖那般大法力，只怕要被拆了奈何桥，毁了森罗殿。神兽有灵，断不冒此险。"
            },
            {
                text: "指引去雷音寺",
                isCorrect: true,
                feedback: "谛听对地藏王道：'怪名虽有，但不可当面说破，免致地府不安。佛法无边，还得去西天雷音寺。' 二猴听罢，又翻跟斗云往西天而去。"
            },
            {
                text: "阎王查阅生死簿",
                isCorrect: false,
                feedback: "悟空早年闹地府，已将猴属之名尽数勾去。生死簿上既然无名，又从何查起？阎王们也是无可奈何。"
            }
        ]
    },
    {
        id: 5,
        title: "雷音辨妖",
        narrative: "二猴打至西天大雷音寺，如来佛祖正对众罗汉讲经。见二猴赶来，佛祖笑道：'汝等俱是一心，且看二心竞斗而来也。' 即指出假悟空本相。",
        environmentDescription: "Great Thunder Monastery, Buddha sitting on lotus throne. Two Wukongs arriving.",
        characterState: "Buddha calm and omniscient, Fake Wukong panicked.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/zhenjiameihouwang/bg_05_buddha.jpg",
        options: [
            {
                text: "道破六耳猕猴身世",
                isCorrect: true,
                feedback: "如来道：'此猴非天非地，非神非鬼，乃六耳猕猴也。善聆音，能察理，知前后，万物皆明。' 那妖精见被说破，现了本相想要逃走，被金钵盂罩住。"
            },
            {
                text: "施法力强行镇压",
                isCorrect: false,
                feedback: "我佛慈悲，以理服人。若不说明原委，只强行镇压，不仅众神不明，悟空心中也还在疑惑。道破根源，方显佛法无边。"
            },
            {
                text: "让真悟空自己认",
                isCorrect: false,
                feedback: "真悟空若认得出，何必打到西天？此妖与真悟空同象同音，非大法力大智慧者不能辨。"
            }
        ]
    },
    {
        id: 6,
        title: "六耳得逞",
        narrative: "一念之差，真假难辨。六耳猕猴通过了考验，从此顶替了美猴王的名号。取经路上，魔心深种，最终酿成大祸，三界大乱……\n\n（胜败乃兵家常事，少侠请重新来过）",
        environmentDescription: "Chaos in the three realms. Fake Wukong laughing menacingly.",
        characterState: "Fake Wukong triumphant, world in chaos.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/zhenjiameihouwang/bg_06_failure.jpg",
        options: [
            {
                text: "重新来过，再辨真伪",
                isCorrect: true,
                feedback: "",
            }
        ]
    }
];
