
import { IGameScene } from '../../../types';

export const SANDABAIGUJING_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "荒山遇美",
        narrative: "师徒四人行至白虎岭，只见峰岩重叠，涧壑湾环。忽见一女子，翠袖轻摇，湘裙斜拽，手提青砂罐，面如满月，目似秋波。八戒见了大喜，却不知此乃千年尸魔白骨精所化，意在取唐僧元阳。",
        environmentDescription: "A desolate mountain path, a young woman approaching with a basket.",
        characterState: "Sun Wukong suspicious, Pigsy eager.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/sandabaigujing/bg_01_girl.jpg",
        options: [
            {
                text: "运起火眼金睛，当头便打",
                isCorrect: true,
                feedback: "悟空定睛一看，认出妖精本相，掣铁棒，大喝一声'好孽畜！'，劈头便打。那怪化一阵清风逃走，只留下一具假尸。唐僧肉眼凡胎，大惊失色，责怪悟空无故伤生。"
            },
            {
                text: "上前搭讪，探问虚实",
                isCorrect: false,
                feedback: "既是荒山野岭，孤身女子行走必有蹊跷。若贸然上前，恐堕入妖计，反误了师父性命。这妖精手段高明，言多必失。"
            },
            {
                text: "请师父定夺",
                isCorrect: false,
                feedback: "师父慈悲为怀，必不许伤生。若以此请示，妖精定然趁机下手，那时悔之晚矣。斩妖除魔，需得雷厉风行。"
            }
        ]
    },
    {
        id: 2,
        title: "老妇寻女",
        narrative: "悟空才打跑妖精，山坡上又闪出一个老妇人，年满八旬，手拄藜杖，一步一哭，要寻女儿。唐僧见状，更是责备悟空滥杀无辜。悟空火眼金睛再看，认得还是那妖精变的，心中大怒。",
        environmentDescription: "An old woman 80 years of age, leaning on a cane, crying on the mountain slope.",
        characterState: "Tang Seng angry and guilty, Wukong furious.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/sandabaigujing/bg_02_old_woman.jpg",
        options: [
            {
                text: "不容分说，举棒再打",
                isCorrect: true,
                feedback: "悟空道：'这孽畜又来骗人！' 轮起金箍棒，照头一下。那怪元神出窍，化风而逃，却留下一具老妇尸首。唐僧气得念起紧箍咒，痛得悟空在地上打滚。"
            },
            {
                text: "向师父解释原委",
                isCorrect: false,
                feedback: "此时唐僧已被八戒挑唆，正在气头上，哪里听得进解释？多说无益，反遭紧箍咒之苦。妖精在前，唯有除恶务尽。"
            },
            {
                text: "变作个土地神哄她",
                isCorrect: false,
                feedback: "大圣乃正大光明之辈，岂可甚至妖精行骗？况且妖精认得大圣，此计难行。当务之急是保护师父，非是斗智。"
            }
        ]
    },
    {
        id: 3,
        title: "老丈寻亲",
        narrative: "师徒正行间，又见一个老公公，白发如彭祖，苍髯赛寿星，念着佛号走来。那白骨精三次变化，意在乱唐僧心智。悟空见他又来，心中暗恨，道：'这妖精三番两次来戏弄我！' 须得断其根株。",
        environmentDescription: "An elderly man matching the description of a longevity god (Shou Xing) approaching.",
        characterState: "Wukong determined but wary of punishment.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/sandabaigujing/bg_03_old_man.jpg",
        options: [
            {
                text: "唤土地为证，一棒断根",
                isCorrect: true,
                feedback: "悟空恐师父念咒，先唤出本方土地、山神作证，然后抡起金箍棒，劈脸一下。那妖精再无处逃生，化作一堆白骨，脊梁上刻有'白骨夫人'四字。"
            },
            {
                text: "听凭师父发落",
                isCorrect: false,
                feedback: "若不出手，妖怪必将师父摄去吃掉。为了取经大业，哪怕受屈含冤，也不能坐视不理。我不入地狱，谁入地狱？"
            },
            {
                text: "佯装不见，护送师父快走",
                isCorrect: false,
                feedback: "树欲静而风不止，妖怪既然盯上，岂有轻易放过之理？避无可避，唯有迎头痛击，方能绝后患。"
            }
        ]
    },
    {
        id: 4,
        title: "师徒决裂",
        narrative: "唐僧见连伤三命，虽有白骨为证，却信了八戒谗言，道是悟空以此变术以此遮掩。长老决意要赶悟空走，写下一纸贬书，递与悟空。悟空求饶无果，只得含泪从命。",
        environmentDescription: "Tang Seng handing a written letter (贬书) to Wukong, looking stern. Wukong kneeling.",
        characterState: "Wukong heartbroken, Tang Seng resolute.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/sandabaigujing/bg_04_parting.jpg",
        options: [
            {
                text: "拜别恩师，嘱托沙僧",
                isCorrect: true,
                feedback: "悟空见挽回无望，含泪朝东拜了四拜，嘱咐沙僧道：'贤弟，你是个好人，千万仔细看守师父！' 随后纵云回花果山水帘洞去了。此去经年，也是命中魔障。"
            },
            {
                text: "强留不走，苦苦哀求",
                isCorrect: false,
                feedback: "师父心意已决，强留只会徒增厌恶。缘分暂尽，强求无益，不如暂避，待日后师父有难，自会明白俺老孙的苦心。"
            },
            {
                text: "毁去贬书，软硬兼施",
                isCorrect: false,
                feedback: "如此岂是为人弟子之道？悟空虽顽劣，却极重尊师重道之礼，断不肯行此悖逆之事。一日为师，终身为父。"
            }
        ]
    },
    {
        id: 5,
        title: "黑松林遇险",
        narrative: "悟空走后，唐僧师徒行至碗子山波月洞，被黄袍怪摄去。那怪将唐僧变成一只斑斓猛虎，关在笼中。八戒沙僧双战黄袍怪不过，八戒侥幸逃脱，沙僧被擒。",
        environmentDescription: "A dark, eerie cave. A tiger in a cage. Yellow Robed Monster laughing.",
        characterState: "Tang Seng transformed into a tiger, terrified.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/sandabaigujing/bg_05_tiger.jpg",
        options: [
            {
                text: "硬着头皮再战",
                isCorrect: false,
                feedback: "那黄袍怪武艺高强，连沙僧都被捉了，八戒独木难支，再去也是送死。"
            },
            {
                text: "回高老庄散伙",
                isCorrect: false,
                feedback: "虽然八戒常嚷嚷着散伙，但真到了师父生死存亡之际，他倒也不忍心就这样一走了之。"
            },
            {
                text: "去花果山请大师兄",
                isCorrect: true,
                feedback: "八戒心想：'解铃还须系铃人，这妖怪只有大师兄降得住！' 于是硬着头皮，驾云往东海花果山而去。"
            }
        ]
    },
    {
        id: 6,
        title: "义激美猴王",
        narrative: "八戒来到花果山，见悟空在当猴王快活，便用激将法，说那妖怪骂齐天大圣是脓包。悟空虽知是计，但心中其实挂念师父，又听不得别人辱没名头，便随八戒下山。",
        environmentDescription: "Water Curtain Cave (Shuilian Dong) with monkeys. Pigsy pleading/goading Wukong.",
        characterState: "Wukong proud but concerned, Pigsy desperate.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/sandabaigujing/bg_06_pleading.jpg",
        options: [
            {
                text: "推脱不去，记恨前嫌",
                isCorrect: false,
                feedback: "悟空乃真豪杰，岂会真的记恨师父？他只是一时气愤，只需给个台阶便会下来。"
            },
            {
                text: "即刻下山，降妖救师",
                isCorrect: true,
                feedback: "悟空道：'贤弟，莫要在那里胡扯！我岂不知你在激我？但我还须救师父去！' 兄弟二人驾云同去。"
            },
            {
                text: "派孩儿们去打探",
                isCorrect: false,
                feedback: "救人如救火，迟则生变。况且那黄袍怪神通广大，小猴子们去也是白搭。"
            }
        ]
    },
    {
        id: 7,
        title: "破镜重圆",
        narrative: "悟空施法收了黄袍怪，救出公主，又将唐僧变回原身。师徒相见，悲喜交集。唐僧悔不该听信谗言，逐走良徒；悟空亦泣拜师父，誓死护送西行。正是：剪断尘缘离色相，荡除心垢见灵山。",
        environmentDescription: "Wukong defeating the monster, Tang Seng turning back to human, team reunited.",
        characterState: "Tang Seng remorseful and grateful, Wukong triumphant.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/sandabaigujing/bg_07_reunion.jpg",
        options: [
            {
                text: "释嫌修好，重踏征程",
                isCorrect: true,
                feedback: "师父道：'贤徒，亏了你也！' 悟空道：'师父，你今日方知老孙的手段！' 经此一事，师徒情分更深一层，同心协力，共赴西天。"
            },
            {
                text: "恃功傲物，逼师赔礼",
                isCorrect: false,
                feedback: "一日为师，终身为父。悟空虽受委屈，然笃守尊师重道之礼，岂敢恃功而傲慢？"
            },
            {
                text: "夸耀神通，奚落八戒",
                isCorrect: false,
                feedback: "大圣心胸开阔，既已降妖救师，便不再计较前嫌。兄弟阋墙，非智者所为。"
            }
        ]
    },
    {
        id: 8,
        title: "平行时空：师徒情缘",
        narrative: "若当时唐僧能识破妖计，或悟空能有更好法子证明清白，师徒也不必经受这一番分离之苦。然天道循环，自有定数。九九八十一难，少一难皆不成正果。",
        environmentDescription: "A conceptual scene of the team reunited, walking towards the west.",
        characterState: "Reflective and hopeful.",
        imageUrl: "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images/xiyouji/sandabaigujing/bg_08_happy_team.jpg",
        options: [
            {
                text: "勘破迷障，再续前缘",
                isCorrect: true,
                feedback: "经此一难，师徒情分虽受挫折，却也为日后破镜重圆埋下伏笔。真金不怕火炼，患难才见真情。终以此心，修成正果。"
            },
            {
                text: "畏难而退，散伙各去",
                isCorrect: false,
                feedback: "取经大业，关乎苍生福祉，岂可因一时误会而轻言放弃？半途而废，非英雄所为。"
            },
            {
                text: "独善其身，逍遥自在",
                isCorrect: false,
                feedback: "悟空本已长生不老，然成佛作祖并非只为长生，更为修得正果，普度众生。独善其身，终非大道。"
            }
        ]
    }
];
