
import { IGameScene } from '../../../types';

export const CAOCHUANJIEJIAN_SCENES: IGameScene[] = [
    {
        id: 1,
        title: "公瑾设计",
        narrative: "周瑜忌孔明之能，恐为东吴后患，意欲除之。一日，瑜请孔明议事，曰：“水上交兵，当以何兵器为先？”孔明曰：“大江之上，弓箭为先。”瑜大喜，曰：“军中正缺箭，敢烦先生监造十万枝。此系公事，先生幸勿推却。”",
        environmentDescription: "Inside the military tent, Zhou Yu sits on the main seat with a hidden agenda, while Zhuge Liang stands calmly.",
        characterState: "Zhou Yu looks commanding; Zhuge Liang holds a feather fan, composed.",
        imageUrl: "/assets/sanguoyanyi/caochuanjiejian/bg_01_request.jpg",
        options: [
            {
                text: "言辞推托，不承军令",
                isCorrect: false,
                feedback: "若此推托，周瑜必以贻误军机之罪相加，正中其下怀。"
            },
            {
                text: "立军令状，三日便交",
                isCorrect: true,
                feedback: "孔明笑曰：“曹军即日将至，若候十日，必误大事。亮只须三天，便献十万枝箭。”遂立军令状。"
            },
            {
                text: "如期应允，十日完工",
                isCorrect: false,
                feedback: "十日造十万箭，纵有工匠也不易办到。且周瑜必从中作梗，使之不成，此乃绝路。"
            }
        ]
    },
    {
        id: 2,
        title: "私借草船",
        narrative: "孔明立状毕，鲁肃忧而问曰：“先生何故自取其祸？三日如何造得如许之箭？”孔明曰：“子敬救我！望借我二十只船，每船军士三十人，船上皆用青布为幔，各束草千余个，分布两边。切不可令公瑾知之。”",
        environmentDescription: "Zhuge Liang and Lu Su talking privately, intense atmosphere.",
        characterState: "Zhuge Liang whispering requests to Lu Su.",
        imageUrl: "/assets/sanguoyanyi/caochuanjiejian/bg_02_plan.jpg",
        options: [
            {
                text: "密嘱子敬，隐瞒公瑾",
                isCorrect: true,
                feedback: "子敬依言而行，回报周瑜时，只说孔明不用竹、漆、翎、毛等物，瑜大惑不解。"
            },
            {
                text: "告知实情，求助于瑜",
                isCorrect: false,
                feedback: "若让周瑜知晓此计，必先毁船断路，孔明性命休矣。"
            },
            {
                text: "自购材料，连夜赶制",
                isCorrect: false,
                feedback: "军中材料皆被周瑜扣留，且三天时间绝难造出十万箭。"
            }
        ]
    },
    {
        id: 3,
        title: "雾锁长江",
        narrative: "至第三日五更，孔明密请鲁肃入舟。肃惊问：“何往？”孔明笑曰：“特请子敬同往取箭。”是时大雾漫天，长江之中，面对不相见。孔明令将二十只船，用长索连住，径望北岸进发。",
        environmentDescription: "Heavy fog on the river, boats connected by chains invisible in the distance.",
        characterState: "Zhuge Liang and Lu Su on a boat, surrounded by thick fog.",
        imageUrl: "/assets/sanguoyanyi/caochuanjiejian/bg_03_fog.jpg",
        options: [
            {
                text: "擂鼓呐喊，虚张声势",
                isCorrect: true,
                feedback: "孔明令船只头西尾东，一字摆开，军士擂鼓呐喊。鲁肃大惊曰：“曹兵齐出若何？”"
            },
            {
                text: "悄然潜行，勿露行藏",
                isCorrect: false,
                feedback: "若不惊动曹军，曹操怎会轻易放箭？此计关键在于“诱”字。"
            },
            {
                text: "正面强攻，登陆冲杀",
                isCorrect: false,
                feedback: "我们就这二十只船，几百军士，若去强攻，无异于以卵击石。"
            }
        ]
    },
    {
        id: 4,
        title: "曹营惊弓",
        narrative: "曹操于寨中闻鼓声擂人心魄，慌问虚实。左右报曰：“江上迷雾重重，不知吴军多少。”操疑有伏兵，不敢轻出，急令旱寨、水寨弓弩手乱箭射之。",
        environmentDescription: "Cao Cao's camp in panic, archers shooting blindly into the fog.",
        characterState: "Cao Cao commanding archers with a suspicious look.",
        imageUrl: "/assets/sanguoyanyi/caochuanjiejian/bg_04_arrows.jpg",
        options: [
            {
                text: "掉转船头，两面受箭",
                isCorrect: true,
                feedback: "一侧草把箭满，孔明令把船掉转，头东尾西，逼近水寨受箭，一面既满，再取一面。"
            },
            {
                text: "急令回撤，见好就收",
                isCorrect: false,
                feedback: "此时箭数尚不足十万，若此时回撤，军令状难销，性命难保。"
            },
            {
                text: "冲入水寨，火攻曹营",
                isCorrect: false,
                feedback: "船上尽是干草，若冲入寨中，反易被火箭所引，自取灭亡。"
            }
        ]
    },
    {
        id: 5,
        title: "谢箭而还",
        narrative: "日高雾散，孔明视草上之箭，密密麻麻，约得十万余枝。遂令军士齐声高叫：“谢丞相箭！”曹操知中计，急令赶时，轻舟已过万重山。",
        environmentDescription: "Boats full of arrows returning, sun starting to clear the fog.",
        characterState: "Zhuge Liang laughing, soldiers shouting in joy.",
        imageUrl: "/assets/sanguoyanyi/caochuanjiejian/bg_05_return.jpg",
        options: [
            {
                text: "满载而归，复命周瑜",
                isCorrect: true,
                feedback: "船轻水急，曹军追之不及。孔明回至江东，周瑜差人来搬箭，只见十万余枝，无一根缺损。"
            },
            {
                text: "乘胜追击，痛打落水狗",
                isCorrect: false,
                feedback: "此行只为借箭，兵力单薄，不可恋战。"
            },
            {
                text: "半途而废，私吞羽箭",
                isCorrect: false,
                feedback: "若私吞羽箭，何以复命？"
            }
        ]
    },
    {
        id: 6,
        title: "平行时空：军法从事",
        narrative: "三天期限已到，十万枝箭未能凑齐。周瑜依军令状，令刀斧手将诸葛亮推出辕门斩首。一代卧龙就此陨落，孙刘联盟破裂，曹操挥师南下，天下一统归魏。",
        environmentDescription: "Execution ground inside the camp. Zhou Yu sits sternly on the podium, throwing the command arrow. Zhuge Liang is bound, looking up at the sky with a sigh.",
        characterState: "Zhou Yu stern and cold; Zhuge Liang resigned.",
        imageUrl: "/assets/sanguoyanyi/caochuanjiejian/bg_06_execution.jpg",
        options: [
            {
                text: "重新来过，再施妙计",
                isCorrect: true,
                feedback: "胜败乃兵家常事，少侠请重新来过。"
            }
        ]
    }
];
