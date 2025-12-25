
import { IGameScene } from '../types';

export const STORY_SCENES: IGameScene[] = [
  {
    id: 1,
    title: "榜文叹息",
    narrative: "东汉末年，黄巾造反，天下大乱。幽州太守刘焉出榜招募义兵。榜文行至涿县，引得百姓围观。人群中有一人，生得身长七尺五寸，两耳垂肩，双手过膝，目能自顾其耳，面如冠玉，唇若涂脂。他看罢榜文，不仅长叹一声。忽闻背后一人厉声喝道：“大丈夫不与国家出力，何故长叹？”",
    environmentDescription: "A crowded market place in ancient China, viewing a government notice on a wall.",
    characterState: "Liu Bei sighing, Zhang Fei shouting from behind.",
    imagePrompt: "Masterpiece Chinese ink wash painting (Shui-mo), Han Dynasty style. Wide shot of a weathered city gate in Zhuo County. A crowd reads a yellow notice on the wall. In foreground, Liu Bei (scholar robes, gentle face) sighs. Behind him, Zhang Fei (tall, wild beard, black robe) looks angry. Sepia and black ink tones, heavy brush texture on rice paper.",
    options: [
      {
        text: "置之不理，自行离去 (Ignore him and leave)",
        isCorrect: false,
        feedback: "玄德以此为傲？非也。刘备虽乃汉室宗亲，然此时落魄，且素以此待人接物。若傲慢离去，便无后来之桃园佳话。"
      },
      {
        text: "回首询问，结识壮士 (Turn around and ask who he is)",
        isCorrect: true,
        feedback: "玄德回视其人，见身长八尺，豹头环眼，燕颔虎须，声若巨雷，势如奔马。此乃张飞张翼德也。二人志趣相投，遂同入村店饮酒。"
      },
      {
        text: "撕下皇榜，以此明志 (Tear down the notice)",
        isCorrect: false,
        feedback: "此非玄德所为。刘备性格宽仁沉稳，非鲁莽之辈。撕榜乃狂徒行径，不合其皇叔身份与性格。"
      }
    ]
  },
  {
    id: 2,
    title: "酒肆英雄",
    narrative: "玄德与那壮士入酒肆对饮，那人道姓张名飞，颇有家资，愿结交天下豪杰。正饮间，见一大汉推车入店，入座便唤酒保：“快斟酒来吃，我待赶入城去投军！”玄德看其人：身长九尺，髯长二尺；面如重枣，唇若涂脂；丹凤眼，卧蚕眉；相貌堂堂，威风凛凛。",
    environmentDescription: "Inside a rustic ancient tavern, wooden tables and jars of wine.",
    characterState: "Guan Yu entering majestically.",
    imagePrompt: "Masterpiece Chinese ink wash painting. Interior of a rustic Han tavern. Sunlight beams through wooden lattice windows illuminating dust motes. Guan Yu (giant, long beard, green robe, red face) enters the door, majestic presence. Liu Bei and Zhang Fei sit at a table in shadow. Dramatic lighting, wet ink wash technique.",
    options: [
      {
        text: "邀其同坐，共谋大事 (Invite him to sit and drink)",
        isCorrect: true,
        feedback: "玄德见其威仪，心知非凡人，遂邀其同坐。关公此时正欲投军，三人一见如故，共叙抱负。"
      },
      {
        text: "暗中观察，不做声张 (Watch silently)",
        isCorrect: false,
        feedback: "玄德求贤若渴，见此英雄岂有交臂失之理？若不主动相邀，关公饮罢便去，何来桃园三结义？"
      },
      {
        text: "张飞邀战，比试武艺 (Zhang Fei challenges him)",
        isCorrect: false,
        feedback: "演义之中，三人相遇乃是惺惺相惜，并未动武。酒肆比武多为民间评书野史演绎，非正统情节。"
      }
    ]
  },
  {
    id: 3,
    title: "志同道合",
    narrative: "三人互通姓名，关羽道出因杀势豪而亡命江湖。谈及天下大势，三人皆欲破贼安民，恨无门路。张飞大喜，提议道：“吾庄后有一桃园，花开正盛；明日当于园中祭告天地，我三人结为兄弟，协力同心，然后可图大事。”",
    environmentDescription: "Close up conversation at the table, animated gestures.",
    characterState: "Three heroes discussing passionately.",
    imagePrompt: "Masterpiece Chinese ink wash painting. Intimate conversation at a tavern table. Three heroes (Liu Bei, Guan Yu, Zhang Fei) leaning in, discussing with intense expressions. Cups of wine on table. Black ink outlines, expressive faces, sense of destiny and brotherhood. Minimalist background.",
    options: [
      {
        text: "推辞不受，恐有不妥 (Decline politely)",
        isCorrect: false,
        feedback: "玄德虽谦，然胸怀大志。今得两员虎将相助，正如鱼得水，岂有推辞之理？"
      },
      {
        text: "即刻结拜，不需祭礼 (Swear immediately without ceremony)",
        isCorrect: false,
        feedback: "古人重礼。结义乃大事，需祭告天地表心迹。张飞虽粗中有细，亦知需择吉地（桃园）备祭礼，方显庄重。"
      },
      {
        text: "欣然应允，约定明日 (Agree happily)",
        isCorrect: true,
        feedback: "玄德、云长齐声应曰：“如此甚好。” 所谓千金易得，知己难求。三人意气相投，以此定下盟约。"
      }
    ]
  },
  {
    id: 4,
    title: "桃园备祭",
    narrative: "次日，于张飞庄后桃园中，备下乌牛白马，祭礼等项。时值桃花盛开，景色绚烂。三人焚香再拜。誓曰：“念刘备、关羽、张飞，虽然异姓，既结为兄弟，则同心协力，救困扶危；上报国家，下安黎庶。”",
    environmentDescription: "A beautiful peach garden in full bloom, altar prepared.",
    characterState: "Three men standing before an altar.",
    imagePrompt: "Masterpiece Chinese ink wash painting. The Peach Garden in full bloom. Pink peach blossoms fill the air, contrasting with black branches. An altar with incense smoke rising. Three men kneeling in sworn brotherhood. Ethereal, poetic, splashes of pink watercolor, highly detailed characters.",
    options: [
      {
        text: "按武艺高低排座次 (Rank by martial arts)",
        isCorrect: false,
        feedback: "桃园结义论的是年岁长幼，而非武力高低。若论武力，恐难分伯仲，且伤兄弟和气。"
      },
      {
        text: "立誓毕，按年岁结拜 (Swear oath and bow by age)",
        isCorrect: true,
        feedback: "誓毕，拜玄德为兄，关羽次之，张飞为弟。长幼有序，礼之大本。此顺序定下三人终身之名分。"
      },
      {
        text: "推举家资厚者为兄 (Rank by wealth)",
        isCorrect: false,
        feedback: "张飞虽颇有家资，然结义看重的是志向与德行，且玄德乃汉室宗亲，年岁亦长，故尊为兄。"
      }
    ]
  },
  {
    id: 5,
    title: "义薄云天",
    narrative: "誓毕，宰牛设酒，聚乡中勇士，得三百余人，于桃园中痛饮一醉。以此为始，以此为基。收拾兵器，招兵买马。更有中山大商张世平、苏双等，资助良马五十匹，金银五百两，镔铁一千斤。玄德以此打造双股剑，关羽造青龙偃月刀，张飞造丈八蛇矛。",
    environmentDescription: "Feasting in the garden, weapons being forged in background.",
    characterState: "Celebration and preparation for war.",
    imagePrompt: "Masterpiece Chinese ink wash painting. A lively military camp feast in the garden. Soldiers drinking. Foreground details of legendary weapons: Double Swords, Green Dragon Crescent Blade, Serpent Spear resting on a rack. Atmosphere of heroism and preparation for war. Dynamic composition.",
    options: [
      {
        text: "留守桃园，独霸一方 (Stay in the garden)",
        isCorrect: false,
        feedback: "结义初衷乃是“上报国家，下安黎庶”。若只知割据一方，便成草寇，非英雄所为。"
      },
      {
        text: "散尽钱财，归隐田园 (Give away money and retire)",
        isCorrect: false,
        feedback: "乱世已至，大丈夫当提三尺剑立不世之功。三人皆世之豪杰，岂肯老死于林泉之下？"
      },
      {
        text: "整顿军马，投邹靖平乱 (Prepare army to join battle)",
        isCorrect: true,
        feedback: "大功告成。三人收拾军马，投幽州太守刘焉处（校尉邹靖引之），正式踏上平定黄巾、争霸天下的征途。"
      }
    ]
  }
];
