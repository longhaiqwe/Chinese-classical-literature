import json

# ==========================================
# 1. 三国演义 (Sanguoyanyi)
# ==========================================

sangumaolu_scenes = [
    {
        "id": 1,
        "title": "初访隆中",
        "narrative": "汉末乱世，刘备求贤若渴，闻听司马徽推荐诸葛亮之名，遂携关羽、张飞前往隆中拜访。只见山不高而秀雅，水不深而澄清，地不广而平坦，林不大而茂盛。三人来到草庐门前，叩门问童子，童子应声而出。刘备恭敬询问先生所在。",
        "environmentDescription": "A serene thatched cottage in the mountains, surrounded by pine and bamboo.",
        "characterState": "Liu Bei asking a young servant boy.",
        "imageUrl": "/assets/sanguoyanyi/sangumaolu/bg_01_visit1.png",
        "options": [
            {
                "text": "硬闯草庐，搜寻孔明",
                "isCorrect": False,
                "feedback": "此非求贤之道！若这般无礼，只会惹怒高人，断送这段机缘。"
            },
            {
                "text": "怏怏而回，改日再来",
                "isCorrect": True,
                "feedback": "童子言：“先生晨起自出……踪迹不定，不知何日归。”刘备听罢，怅然若失，只得嘱咐童子：“先生归时，可言刘备拜访。”遂上马而回。"
            },
            {
                "text": "留关张守候，独自寻找",
                "isCorrect": False,
                "feedback": "山林广大，云深不知处，去何处寻找？且关张二人性急，若无人约束，只怕生事。"
            }
        ]
    },
    {
        "id": 2,
        "title": "风雪再访",
        "narrative": "时值隆冬，天降大雪。刘备探得孔明归家，不顾天寒地冻，冒雪再去。张飞曰：“天寒地冻，且非用兵之时，何必受此劳苦？”刘备呵斥之。至门前，闻草堂书声琅琅，刘备心中暗喜，以为即是孔明。",
        "environmentDescription": "Snowy landscape, Liu Bei waiting respectfully outside.",
        "characterState": "Liu Bei standing in the snow.",
        "imageUrl": "/assets/sanguoyanyi/sangumaolu/bg_02_visit2.png",
        "options": [
            {
                "text": "上前打断，表明来意",
                "isCorrect": False,
                "feedback": "此人乃是孔明之弟诸葛均。若贸然打断，显失礼数。"
            },
            {
                "text": "大怒而去，不再复来",
                "isCorrect": False,
                "feedback": "若因一时挫折便轻言放弃，何以此诚心感动卧龙？天下三分之策恐成泡影。"
            },
            {
                "text": "静候其毕，方才询问",
                "isCorrect": True,
                "feedback": "原来是诸葛均。孔明昨又应友人之约出门闲游去了。刘备虽失望，仍留书一封，以此明志：“备久慕高名，两次晋谒，不遇空回，惆怅何似……”"
            }
        ]
    },
    {
        "id": 3,
        "title": "三顾草庐",
        "narrative": "开春之际，刘备选定吉期，斋戒沐浴，三往隆中。凡门，童子曰：“先生昼寝未醒。”刘备当即大喜，令关张在门外等候，自己轻步入内。见先生仰卧于草堂几席之上，那般神态安详。",
        "environmentDescription": "Springtime at the cottage, peace and quiet.",
        "characterState": "Liu Bei waiting while Zhuge Liang sleeps.",
        "imageUrl": "/assets/sanguoyanyi/sangumaolu/bg_03_visit3.png",
        "options": [
            {
                "text": "拱立阶下，静候惊觉",
                "isCorrect": True,
                "feedback": "刘备此时已年近五旬，却恭敬侍立半晌。直待孔明醒来，口占一绝：“大梦谁先觉？平生我自知。草堂春睡足，窗外日迟迟。”"
            },
            {
                "text": "令童子唤醒先生",
                "isCorrect": False,
                "feedback": "张飞曾欲放火烧屋逼其起床，被刘备喝止。求贤当诚心诚意，岂可稍有怠慢？"
            },
            {
                "text": "咳嗽示警，促其早醒",
                "isCorrect": False,
                "feedback": "虽未直接唤醒，但故意弄出声响亦是不敬。孔明虽醒，然见客心浮气躁，恐难真心相辅。"
            }
        ]
    },
    {
        "id": 4,
        "title": "隆中对·相见",
        "narrative": "孔明更衣出迎，见刘备气宇轩昂，诚意拳拳。分宾主坐定，童子献茶。刘备言：“汉室倾颓，奸臣窃命，主上蒙尘。备不量力，欲伸大义于天下，而智术浅短，迄无所就。惟先生开其愚而拯其厄。”",
        "environmentDescription": "Interior of the cottage, simple but elegant. Liu Bei and Zhuge Liang sitting face to face.",
        "characterState": "Liu Bei bowing respectfully to Zhuge Liang.",
        "imageUrl": "/assets/sanguoyanyi/sangumaolu/bg_04_meeting.png",
        "options": [
            {
                "text": "夸耀兵力，许以重金",
                "isCorrect": False,
                "feedback": "先生志在天下，非为金银所动。若以此相诱，反显得刘备目光短浅，俗不可耐。"
            },
            {
                "text": "屏退左右，坦陈心迹",
                "isCorrect": True,
                "feedback": "刘备真情流露，泪沾袍袖。孔明感其诚意，乃曰：“将军既有如此大志，亮愿效犬马之劳。”"
            },
            {
                "text": "询问卜筮，测算吉凶",
                "isCorrect": False,
                "feedback": "孔明乃经天纬地之才，非江湖术士。问吉凶而非问大计，是看轻了先生。"
            }
        ]
    },
    {
        "id": 5,
        "title": "隆中对·天下",
        "narrative": "孔明命童子取出地图，指点江山，为刘备分析天下大势：“曹操已拥百万之众，挟天子以令诸侯，此诚不可与争锋。孙权据有江东，已历三世，此可以为援而不可图也。荆州北据汉、沔，利尽南海……”",
        "environmentDescription": "Zhuge Liang pointing at a map of China, explaining the strategy.",
        "characterState": "Zhuge Liang pointing at the map.",
        "imageUrl": "/assets/sanguoyanyi/sangumaolu/bg_05_map.png",
        "options": [
            {
                "text": "欲取中原，直捣许都",
                "isCorrect": False,
                "feedback": "此时曹操势大，若贸然北伐，无异于以卵击石。孔明之策，在先取基业，待天下有变。"
            },
            {
                "text": "偏安一隅，以此终老",
                "isCorrect": False,
                "feedback": "刘备志在匡扶汉室，若只求偏安，何须三顾茅庐？亦非孔明出山之本意。"
            },
            {
                "text": "拜谢先生，恳请出山",
                "isCorrect": True,
                "feedback": "先生未出草庐，已知三分天下。刘备顿首拜谢：“先生之言，顿开茅塞，如拨云雾而见青天！”"
            }
        ]
    },
    {
        "id": 6,
        "title": "平行时空：错失良机",
        "narrative": "若非刘备这般三顾之诚，诸葛亮恐终老林泉，或许汉室难兴，三国历史也将改写。",
        "environmentDescription": "An old man fishing by the river, forgotten by history.",
        "characterState": "Zhuge Liang fishing alone.",
        "imageUrl": "/assets/sanguoyanyi/sangumaolu/bg_06_bad_missed.png",
        "options": [
            {
                "text": "重新来过，诚心求贤",
                "isCorrect": True,
                "feedback": "精诚所至，金石为开。"
            }
        ]
    }
]


caochuanjiejian_scenes = [
    {
        "id": 1,
        "title": "公瑾设计",
        "narrative": "周瑜忌孔明之能，恐为东吴后患，意欲除之。一日，瑜请孔明议事，曰：“水上交兵，当以何兵器为先？”孔明曰：“大江之上，弓箭为先。”瑜大喜，曰：“军中正缺箭，敢烦先生监造十万枝。此系公事，先生幸勿推却。”",
        "environmentDescription": "Inside the military tent, Zhou Yu sits on the main seat with a hidden agenda, while Zhuge Liang stands calmly.",
        "characterState": "Zhou Yu looks commanding; Zhuge Liang holds a feather fan, composed.",
        "imageUrl": "/assets/sanguoyanyi/caochuanjiejian/bg_01_request.jpg",
        "audioUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/narrations/caochuanjiejian_1.mp3",
        "options": [
            {
                "text": "言辞推托，不承军令",
                "isCorrect": False,
                "feedback": "若此推托，周瑜必以贻误军机之罪相加，正中其下怀。"
            },
            {
                "text": "立军令状，三日便交",
                "isCorrect": True,
                "feedback": "孔明笑曰：“曹军即日将至，若候十日，必误大事。亮只须三天，便献十万枝箭。”遂立军令状。"
            },
            {
                "text": "如期应允，十日完工",
                "isCorrect": False,
                "feedback": "十日造十万箭，纵有工匠也不易办到。且周瑜必从中作梗，使之不成，此乃绝路。"
            }
        ]
    },
    {
        "id": 2,
        "title": "私借草船",
        "narrative": "孔明立状毕，鲁肃忧而问曰：“先生何故自取其祸？三日如何造得如许之箭？”孔明曰：“子敬救我！望借我二十只船，每船军士三十人，船上皆用青布为幔，各束草千余个，分布两边。切不可令公瑾知之。”",
        "environmentDescription": "Zhuge Liang and Lu Su talking privately, intense atmosphere.",
        "characterState": "Zhuge Liang whispering requests to Lu Su.",
        "imageUrl": "/assets/sanguoyanyi/caochuanjiejian/bg_02_plan.jpg",
        "audioUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/narrations/caochuanjiejian_2.mp3",
        "options": [
            {
                "text": "密嘱子敬，隐瞒公瑾",
                "isCorrect": True,
                "feedback": "子敬依言而行，回报周瑜时，只说孔明不用竹、漆、翎、毛等物，瑜大惑不解。"
            },
            {
                "text": "告知实情，求助于瑜",
                "isCorrect": False,
                "feedback": "若让周瑜知晓此计，必先毁船断路，孔明性命休矣。"
            },
            {
                "text": "自购材料，连夜赶制",
                "isCorrect": False,
                "feedback": "军中材料皆被周瑜扣留，且三天时间绝难造出十万箭。"
            }
        ]
    },
    {
        "id": 3,
        "title": "雾锁长江",
        "narrative": "至第三日五更，孔明密请鲁肃入舟。肃惊问：“何往？”孔明笑曰：“特请子敬同往取箭。”是时大雾漫天，长江之中，面对不相见。孔明令将二十只船，用长索连住，径望北岸进发。",
        "environmentDescription": "Heavy fog on the river, boats connected by chains invisible in the distance.",
        "characterState": "Zhuge Liang and Lu Su on a boat, surrounded by thick fog.",
        "imageUrl": "/assets/sanguoyanyi/caochuanjiejian/bg_03_fog.jpg",
        "audioUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/narrations/caochuanjiejian_3.mp3",
        "options": [
            {
                "text": "擂鼓呐喊，虚张声势",
                "isCorrect": True,
                "feedback": "孔明令船只头西尾东，一字摆开，军士擂鼓呐喊。鲁肃大惊曰：“曹兵齐出若何？”"
            },
            {
                "text": "悄然潜行，勿露行藏",
                "isCorrect": False,
                "feedback": "若不惊动曹军，曹操怎会轻易放箭？此计关键在于“诱”字。"
            },
            {
                "text": "正面强攻，登陆冲杀",
                "isCorrect": False,
                "feedback": "我们就这二十只船，几百军士，若去强攻，无异于以卵击石。"
            }
        ]
    },
    {
        "id": 4,
        "title": "曹营惊弓",
        "narrative": "曹操于寨中闻鼓声擂人心魄，慌问虚实。左右报曰：“江上迷雾重重，不知吴军多少。”操疑有伏兵，不敢轻出，急令旱寨、水寨弓弩手乱箭射之。",
        "environmentDescription": "Cao Cao's camp in panic, archers shooting blindly into the fog.",
        "characterState": "Cao Cao commanding archers with a suspicious look.",
        "imageUrl": "/assets/sanguoyanyi/caochuanjiejian/bg_04_arrows.jpg",
        "audioUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/narrations/caochuanjiejian_4.mp3",
        "options": [
            {
                "text": "掉转船头，两面受箭",
                "isCorrect": True,
                "feedback": "一侧草把箭满，孔明令把船掉转，头东尾西，逼近水寨受箭，一面既满，再取一面。"
            },
            {
                "text": "急令回撤，见好就收",
                "isCorrect": False,
                "feedback": "此时箭数尚不足十万，若此时回撤，军令状难销，性命难保。"
            },
            {
                "text": "冲入水寨，火攻曹营",
                "isCorrect": False,
                "feedback": "船上尽是干草，若冲入寨中，反易被火箭所引，自取灭亡。"
            }
        ]
    },
    {
        "id": 5,
        "title": "谢箭而还",
        "narrative": "日高雾散，孔明视草上之箭，密密麻麻，约得十万余枝。遂令军士齐声高叫：“谢丞相箭！”曹操知中计，急令赶时，轻舟已过万重山。",
        "environmentDescription": "Boats full of arrows returning, sun starting to clear the fog.",
        "characterState": "Zhuge Liang laughing, soldiers shouting in joy.",
        "imageUrl": "/assets/sanguoyanyi/caochuanjiejian/bg_05_return.jpg",
        "audioUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/narrations/caochuanjiejian_5.mp3",
        "options": [
            {
                "text": "满载而归，复命周瑜",
                "isCorrect": True,
                "feedback": "船轻水急，曹军追之不及。孔明回至江东，周瑜差人来搬箭，只见十万余枝，无一根缺损。"
            },
            {
                "text": "乘胜追击，痛打落水狗",
                "isCorrect": False,
                "feedback": "此行只为借箭，兵力单薄，不可恋战。"
            },
             {
                "text": "半途而废，私吞羽箭",
                "isCorrect": False,
                "feedback": "若私吞羽箭，何以复命？"
            }

        ]
    },
    {
        "id": 6,
        "title": "平行时空：军法从事",
        "narrative": "三天期限已到，十万枝箭未能凑齐。周瑜依军令状，令刀斧手将诸葛亮推出辕门斩首。一代卧龙就此陨落，孙刘联盟破裂，曹操挥师南下，天下一统归魏。",
        "environmentDescription": "Execution ground inside the camp. Zhou Yu sits sternly on the podium, throwing the command arrow. Zhuge Liang is bound, looking up at the sky with a sigh.",
        "characterState": "Zhou Yu stern and cold; Zhuge Liang resigned.",
        "imageUrl": "/assets/sanguoyanyi/caochuanjiejian/bg_06_execution.jpg",
        "options": [
            {
                "text": "重新来过，再施妙计",
                "isCorrect": True,
                "feedback": "胜败乃兵家常事，少侠请重新来过。"
            }
        ]
    }
]

taoyuan_scenes = [
    {
        "id": 1,
        "title": "榜文叹息",
        "narrative": "东汉末年，黄巾造反，天下大乱。幽州太守刘焉出榜招募义兵。榜文行至涿县，引得百姓围观。人群中有一人，生得身长七尺五寸，两耳垂肩，双手过膝，目能自顾其耳，面如冠玉，唇若涂脂。他看罢榜文，不仅长叹一声。",
        "environmentDescription": "A crowded market place in ancient China, viewing a government notice on a wall.",
        "characterState": "Liu Bei sighing at the notice.",
        "imageUrl": "/assets/sanguoyanyi/taoyuan/bg_01_notice.jpg",
        "options": [
            {
                "text": "置之不理，自行离去",
                "isCorrect": False,
                "feedback": "玄德以此为傲？非也。刘备虽乃汉室宗亲，然此时落魄，且素以此待人接物。若傲慢离去，便无后来之桃园佳话。"
            },
            {
                "text": "忧国忧民，感时伤怀",
                "isCorrect": True,
                "feedback": "玄德这一长叹，满腹心事尽在其中。这一叹，却引得身后一人厉声高喝。"
            },
            {
                "text": "撕下皇榜，以此明志",
                "isCorrect": False,
                "feedback": "此非玄德所为。刘备性格宽仁沉稳，非鲁莽之辈。撕榜乃狂徒行径，不合其皇叔身份与性格。"
            }
        ]
    },
     {
        "id": 2,
        "title": "壮士呵斥",
        "narrative": "忽闻背后一人厉声喝道：“大丈夫不与国家出力，何故长叹？”",
        "environmentDescription": "Market place, Liu Bei turning around to face a tall warrior.",
        "characterState": "Zhang Fei shouting at Liu Bei from behind.",
        "imageUrl": "/assets/sanguoyanyi/taoyuan/bg_02_encounter.jpg",
        "options": [
            {
                "text": "置之不理，自行离去",
                "isCorrect": False,
                "feedback": "豪杰相逢，岂可交臂失之？若此时离去，便错失了这位万人敌的猛将。"
            },
            {
                "text": "回首询问，结识壮士",
                "isCorrect": True,
                "feedback": "玄德回视其人，见身长八尺，豹头环眼，燕颔虎须，声若巨雷，势如奔马。此乃张飞张翼德也。二人志趣相投，遂同入村店饮酒。"
            },
            {
                "text": "反唇相讥，责其无礼",
                "isCorrect": False,
                "feedback": "玄德宽厚，不喜与人争执。且见此人相貌堂堂，必非凡俗，岂会因言语粗鲁而见怪？"
            }
        ]
    },
    {
        "id": 3,
        "title": "酒肆英雄",
        "narrative": "玄德与那壮士入酒肆对饮，那人道姓张名飞，颇有家资，愿结交天下豪杰。正饮间，见一大汉推车入店，入座便唤酒保：“快斟酒来吃，我待赶入城去投军！”玄德看其人：身长九尺，髯长二尺；面如重枣，唇若涂脂；丹凤眼，卧蚕眉；相貌堂堂，威风凛凛。",
        "environmentDescription": "Inside a rustic ancient tavern, wooden tables and jars of wine.",
        "characterState": "Guan Yu entering majestically.",
        "imageUrl": "/assets/sanguoyanyi/taoyuan/bg_03_guanyu.jpg",
        "options": [
            {
                "text": "邀其同坐，共谋大事",
                "isCorrect": True,
                "feedback": "玄德见其威仪，心知非凡人，遂邀其同坐。关公此时正欲投军，三人一见如故，共叙抱负。"
            },
            {
                "text": "暗中观察，不做声张",
                "isCorrect": False,
                "feedback": "玄德求贤若渴，见此英雄岂有交臂失之理？若不主动相邀，关公饮罢便去，何来桃园三结义？"
            },
            {
                "text": "张飞邀战，比试武艺",
                "isCorrect": False,
                "feedback": "演义之中，三人相遇乃是惺惺相惜，并未动武。酒肆比武多为民间评书野史演绎，非正统情节。"
            }
        ]
    },
    {
        "id": 4,
        "title": "志同道合",
        "narrative": "三人互通姓名，关羽道出因杀势豪而亡命江湖。谈及天下大势，三人皆欲破贼安民，恨无门路。张飞大喜，提议道：“吾庄后有一桃园，花开正盛；明日当于园中祭告天地，我三人结为兄弟，协力同心，然后可图大事。”",
        "environmentDescription": "Close up conversation at the table, animated gestures.",
        "characterState": "Three heroes discussing passionately.",
        "imageUrl": "/assets/sanguoyanyi/taoyuan/bg_04_tavern_talk.jpg",
        "options": [
            {
                "text": "推辞不受，恐有不妥",
                "isCorrect": False,
                "feedback": "玄德虽谦，然胸怀大志。今得两员虎将相助，正如鱼得水，岂有推辞之理？"
            },
            {
                "text": "即刻结拜，不需祭礼",
                "isCorrect": False,
                "feedback": "古人重礼。结义乃大事，需祭告天地表心迹。张飞虽粗中有细，亦知需择吉地（桃园）备祭礼，方显庄重。"
            },
            {
                "text": "欣然应允，约定明日",
                "isCorrect": True,
                "feedback": "玄德、云长齐声应曰：“如此甚好。” 所谓千金易得，知己难求。三人意气相投，以此定下盟约。"
            }
        ]
    },
    {
        "id": 5,
        "title": "桃园备祭",
        "narrative": "次日，于张飞庄后桃园中，备下乌牛白马，祭礼等项。时值桃花盛开，景色绚烂。三人焚香再拜。誓曰：“念刘备、关羽、张飞，虽然异姓，既结为兄弟，则同心协力，救困扶危；上报国家，下安黎庶。”",
        "environmentDescription": "A beautiful peach garden in full bloom, altar prepared.",
        "characterState": "Three men standing before an altar.",
        "imageUrl": "/assets/sanguoyanyi/taoyuan/bg_05_oath_moment.jpg",
        "options": [
            {
                "text": "按武艺高低排座次",
                "isCorrect": False,
                "feedback": "桃园结义论的是年岁长幼，而非武力高低。若论武力，恐难分伯仲，且伤兄弟和气。"
            },
            {
                "text": "立誓毕，按年岁结拜",
                "isCorrect": True,
                "feedback": "誓毕，拜玄德为兄，关羽次之，张飞为弟。长幼有序，礼之大本。此顺序定下三人终身之名分。"
            },
            {
                "text": "推举家资厚者为兄",
                "isCorrect": False,
                "feedback": "张飞虽颇有家资，然结义看重的是志向与德行，且玄德乃汉室宗亲，年岁亦长，故尊为兄。"
            }
        ]
    },
    {
        "id": 6,
        "title": "义薄云天",
        "narrative": "誓毕，宰牛设酒，聚乡中勇士，得三百余人，于桃园中痛饮一醉。以此为始，以此为基。收拾兵器，招兵买马。更有中山大商张世平、苏双等，资助良马五十匹，金银五百两，镔铁一千斤。玄德以此打造双股剑，关羽造青龙偃月刀，张飞造丈八蛇矛。",
        "environmentDescription": "Feasting in the garden, weapons being forged in background.",
        "characterState": "Celebration and preparation for war.",
        "imageUrl": "/assets/sanguoyanyi/taoyuan/bg_06_feasting.jpg",
        "options": [
            {
                "text": "留守桃园，独霸一方",
                "isCorrect": False,
                "feedback": "结义初衷乃是“上报国家，下安黎庶”。若只知割据一方，便成草寇，非英雄所为。"
            },
            {
                "text": "散尽钱财，归隐田园",
                "isCorrect": False,
                "feedback": "乱世已至，大丈夫当提三尺剑立不世之功。三人皆世之豪杰，岂肯老死于林泉之下？"
            },
            {
                "text": "整顿军马，投邹靖平乱",
                "isCorrect": True,
                "feedback": "大功告成。三人收拾军马，投幽州太守刘焉处（校尉邹靖引之），正式踏上平定黄巾、争霸天下的征途。"
            }
        ]
    },
    {
        "id": 7,
        "title": "平行时空：孤身落魄",
        "narrative": "虽有心报国，然行差踏错，终是孤身一人。桃园之义未成，天下大势亦随之而变...",
        "environmentDescription": "Lonely figure walking away in the snow.",
        "characterState": "Liu Bei walking away alone.",
        "imageUrl": "/assets/sanguoyanyi/taoyuan/bg_07_bad_lonely.jpg",
        "options": [
            {
                "text": "重新来过",
                "isCorrect": True,
                "feedback": "往事已矣，来者可追。"
            }
        ]
    }
]

# ==========================================
# 2. 西游记 (Xiyouji) - 大闹天宫
# ==========================================

danaotiangong_scenes = [
    {
        "id": 1,
        "title": "龙宫借宝",
        "narrative": "孙悟空学艺归来，占山为王，虽有神通，却手无寸铁。闻听东海龙宫宝物众多，遂入海求兵。老龙王先后奉上大捍刀、九股叉、画杆方天戟，悟空皆大摇其头，嫌兵器太轻，不称手。",
        "environmentDescription": "Splendid underwater Dragon Palace with various weapons displayed.",
        "characterState": "Sun Wukong rejecting conventional weapons.",
        "imageUrl": "/assets/xiyouji/danaotiangong/bg_01_dragon_palace.jpg",
        "options": [
            {
                "text": "强行索要，大闹龙宫",
                "isCorrect": False,
                "feedback": "虽显威风，然龙王也是一方神祗。若无理取闹，只怕引来看守海藏的神将围攻，反倒不美。"
            },
            {
                "text": "既然无宝，转身离去",
                "isCorrect": False,
                "feedback": "好不容易来此一遭，若空手而归，确是可惜。且龙宫必有异宝，只恨未曾得见。"
            },
            {
                "text": "询问更有何宝物",
                "isCorrect": True,
                "feedback": "龙女献策，道海藏中有一块天河定底神珍铁。龙王虽不舍，却也无奈，只得带悟空去见识。"
            }
        ]
    },
    {
        "id": 2,
        "title": "定海神针",
        "narrative": "龙王领悟空至海藏中间，忽见金光万道。那是一根铁柱，约有斗来粗庆。悟空尽力一拔，那柱子便动了一动。悟空喜道：“再细些更妙！”那宝贝果然细了一圈。连叫几声，直到碗口粗细。细看有一行字：“如意金箍棒，重一万三千五百斤”。",
        "environmentDescription": "The massive Golden Cudgel glowing in the depths of the sea.",
        "characterState": "Sun Wukong marveling at the magical weapon.",
        "imageUrl": "/assets/xiyouji/danaotiangong/bg_02_golden_cudgel.jpg",
        "options": [
            {
                "text": "嫌太重，放回原处",
                "isCorrect": False,
                "feedback": "此宝虽然沉重，却正是为你量身打造。若弃之不用，只怕再难寻得这般趁手兵器。"
            },
            {
                "text": "变作绣花针，藏于耳内",
                "isCorrect": True,
                "feedback": "妙哉！此宝能大能小，随心变化。悟空将其变作绣花针塞入耳中，谢过龙王，大笑而去。"
            },
            {
                "text": "扛起铁柱，径直打出",
                "isCorrect": False,
                "feedback": "虽有神力，然扛着如此巨物行走，终究不便。且宝物灵性，不知变化运用，仅做凡铁使唤，岂不暴殄天物？"
            }
        ]
    },
    {
        "id": 3,
        "title": "地府销名",
        "narrative": "悟空得了金箍棒，日日在花果山操练，好不快活。一日醉卧松阴，魂魄被黑白无常勾至幽冥界。悟空醒来大怒，掏出金箍棒，一路打入森罗殿，逼十代冥王取出此时生死簿。",
        "environmentDescription": "Gloomy Underworld court with terrified judges.",
        "characterState": "Sun Wukong checking the Book of Life and Death.",
        "imageUrl": "/assets/xiyouji/danaotiangong/bg_03_underworld.jpg",
        "options": [
            {
                "text": "只勾去自己名字",
                "isCorrect": False,
                "feedback": "虽得长生，然猴属同类仍受轮回之苦。既来之，何不惠及子孙？"
            },
            {
                "text": "尽销猴属之名",
                "isCorrect": True,
                "feedback": "悟空提起笔，把猴属之类有名者，一概勾之。大笑扔笔：“了帐！了帐！今番不伏你管了！”一路棒打出幽冥界。"
            },
            {
                "text": "大闹地府，推翻冥王",
                "isCorrect": False,
                "feedback": "地府乃三界轮回之所，若将其毁坏，致使阴阳失序，罪孽深重，必遭天谴。"
            }
        ]
    },
    {
        "id": 4,
        "title": "官封弼马",
        "narrative": "龙王、冥王上天告状。玉帝欲遣兵捉拿，太白金星主张招安。悟空受诏上天，被封为“弼马温”。初时不知官小，日夜在御马监殷勤看守。半月后，宴请同僚，忽问此官品级。",
        "environmentDescription": "Heavenly stables with divine horses.",
        "characterState": "Sun Wukong interacting with celestial horses.",
        "imageUrl": "/assets/xiyouji/danaotiangong/bg_04_stables.jpg",
        "options": [
            {
                "text": "嫌官小，打出南天门",
                "isCorrect": True,
                "feedback": "悟空闻言大怒：“这般渺视老孙！老孙在花果山，称王称祖，怎么哄我来替他养马？” 推倒公案，耳中取出宝贝，一路打出天门去了。"
            },
            {
                "text": "忍气吞声，继续养马",
                "isCorrect": False,
                "feedback": "齐天大圣其实池中之物？若甘心养马，便失了那一身傲骨与灵性。"
            },
            {
                "text": "上书玉帝，请求升迁",
                "isCorrect": False,
                "feedback": "天庭等级森严，岂容你轻易讨价还价？且悟空生性急躁，哪耐得住这般繁文缛节。"
            }
        ]
    },
    {
        "id": 5,
        "title": "蟠桃盛会",
        "narrative": "悟空回山自封“齐天大圣”。玉帝无奈，只得承认其号，令看管蟠桃园。一日，七仙女来摘桃，言王母设宴请众仙，并未请大圣。悟空大怒，定住七仙女，奔瑶池痛饮仙酒，又偷吃了太上老君的仙丹。",
        "environmentDescription": "Celestial banquet hall in disarray.",
        "characterState": "Sun Wukong drunk and causing chaos.",
        "imageUrl": "/assets/xiyouji/danaotiangong/bg_05_banquet.jpg",
        "options": [
            {
                "text": "酒醒惧罪，逃回下界",
                "isCorrect": True,
                "feedback": "悟空酒醒，自知闯下大祸：“不好！不好！这场祸比天大，若惊动玉帝，性命难存。走！走！走！” 遂逃回花果山。"
            },
            {
                "text": "在此等候，向玉帝请罪",
                "isCorrect": False,
                "feedback": "偷桃盗丹，搅乱蟠桃会，罪在不赦。若在此等候，正是自投罗网。"
            },
            {
                "text": "大闹瑶池，挑战群仙",
                "isCorrect": False,
                "feedback": "此时孤身一人，若在此大闹，引来漫天神佛围攻，只怕插翅难逃。不如先避其锋芒。"
            }
        ]
    },
    {
        "id": 6,
        "title": "大战天兵",
        "narrative": "玉帝大恼，命四大天王、李靖、哪吒，点十万天兵天将，布下十八架天罗地网，下界捉拿悟空。双方在花果山一场恶战。悟空使出法天象地神通，杀得天兵丢盔弃甲。",
        "environmentDescription": "Epic battlefield between Monkey King and Heavenly Army.",
        "characterState": "Sun Wukong fighting heroically.",
        "imageUrl": "/assets/xiyouji/danaotiangong/bg_06_battle.jpg",
        "options": [
            {
                "text": "乘胜追击，杀上天庭",
                "isCorrect": False,
                "feedback": "虽一时得胜，然天庭底蕴深厚，高手如云。若孤军深入，必陷绝境。"
            },
            {
                "text": "苦战不退，力竭被擒",
                "isCorrect": False,
                "feedback": "二郎神杨奇赶来助战，又有太上老君暗中偷袭。悟空虽勇，终究双拳难敌四手。然此非结局，乃是另一段传奇的开始。"
            },
            {
                "text": "且战且退，静观其变",
                "isCorrect": True,
                "feedback": "这一战，打出了齐天大圣的威名！虽最终被擒，然大闹天宫之举，已震动三界，成就千古美名。"
            }
        ]
    },
    {
        "id": 7,
        "title": "平行时空：皈依",
        "narrative": "若当初不至龙宫寻宝、地府销名、不闹天宫，安分守己做个弼马温，或许便是另一番光景。但这，还是那个敢爱敢恨、无法无天的齐天大圣吗？",
        "environmentDescription": "Sun Wukong looking bored in heaven.",
        "characterState": "Sun Wukong as a celestial bureaucrat.",
        "imageUrl": "/assets/xiyouji/danaotiangong/bg_07_bad_boring.jpg",
        "options": [
            {
                "text": "重新来过，再闹天宫！",
                "isCorrect": True,
                "feedback": "哪怕被压五百年，哪怕历经九九八十一难，俺老孙也绝不后悔！"
            }
        ]
    }
]


zhenjiameihouwang_scenes = [
    {
        "id": 1,
        "title": "被逐蒙冤",
        "narrative": "孙悟空因打死强盗，被唐僧逐回花果山。不料，悟空走后，又有一'悟空'现身，打晕唐僧，抢走行李。沙僧奔至花果山索讨，见'悟空'高坐石台，这也是'美猴王'，那也是'齐天大圣'，更有一般无二的猴子猴孙。",
        "environmentDescription": "Tang Seng collapsed on the roadside, luggage gone. A fake Wukong looking arrogant at Huaguoshan.",
        "characterState": "Tang Seng injured and confused, Sha Seng angry and suspicious.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/zhenjiameihouwang/bg_01_exile.jpg",
        "options": [
            {
                "text": "沙僧怒斥，挥杖便打",
                "isCorrect": True,
                "feedback": "沙僧见那'悟空'不仅不认账，反要自立门户去取经，大怒之下，举降妖杖便打。那'悟空'也不示弱，举棒相迎。沙僧虽勇，却难敌这'大圣'神威，只得败走南海求观音。"
            },
            {
                "text": "好言相劝，请回师兄",
                "isCorrect": False,
                "feedback": "沙僧不知眼前乃是假货，只道大师兄还在气头上。低声下气，反惹那妖怪耻笑，变本加厉，更无回转之机。"
            },
            {
                "text": "回禀师父，从长计议",
                "isCorrect": False,
                "feedback": "行李已失，师父受伤，若空手而回，岂不让师父更添忧虑？且那怪既然假扮悟空，必有图谋，迟则生变。"
            }
        ]
    },
    {
        "id": 2,
        "title": "真假莫辨",
        "narrative": "真悟空得知有人假冒自己，大怒，随沙僧同回花果山。两个悟空一照面，一般的黄衣虎皮裙，一般的金箍棒，一般的相貌声音。二猴打在一处，从花果山打到半空，如两道金光纠缠，难解难分。",
        "environmentDescription": "Two identical Monkey Kings fighting mid-air above Huaguoshan. Golden sparks flying.",
        "characterState": "Both Wukongs furious and evenly matched.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/zhenjiameihouwang/bg_02_battle.jpg",
        "options": [
            {
                "text": "请师父念咒辨真假",
                "isCorrect": False,
                "feedback": "二猴打到唐僧面前，唐僧念起紧箍咒。两个悟空一齐喊疼，抱着头打滚，一般无二。师父肉眼凡胎，哪里分辨得出？反倒疼坏了真悟空。"
            },
            {
                "text": "上天入地，且战且行",
                "isCorrect": True,
                "feedback": "既然武艺神通一般无二，便只有去寻个眼力高明的。二猴且战且走，惊动天庭，吓坏龙王，却谁也奈何不得谁，只得去往南天门求玉帝分辨。"
            },
            {
                "text": "各自罢手，平分行李",
                "isCorrect": False,
                "feedback": "美猴王乃是天地间独一无二的灵明石猴，岂容他人冒名顶替？便是粉身碎骨，也要争个明白，绝无妥协之理。"
            }
        ]
    },
    {
        "id": 3,
        "title": "南海难分",
        "narrative": "打到落伽山，观音菩萨唤来木叉与白鹦哥，欲擒那假悟空。谁知两个悟空同时护住唐僧，一般地降妖除魔，一般地虔诚礼拜。菩萨看来看去，也看不出半点破绽。",
        "environmentDescription": "Mount Luojia, Guanyin Bodhisattva observing two identical Wukongs.",
        "characterState": "Guanyin puzzled, Wukongs anxious.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/zhenjiameihouwang/bg_03_guanyin.jpg",
        "options": [
            {
                "text": "去天庭照妖镜一照",
                "isCorrect": False,
                "feedback": "托塔天王李靖借来照妖镜，照住两个悟空。镜中只见两个影子，一般无二，金箍服色皆同，毫无妖气。众神也是束手无策。"
            },
            {
                "text": "往地府寻谛听辨认",
                "isCorrect": True,
                "feedback": "观音道：'我亦难辨。却往地府去走一遭。' 二猴又打到幽冥地界，惊动十殿阎王。地藏王菩萨唤神兽谛听来听。"
            },
            {
                "text": "请如来佛祖定夺",
                "isCorrect": False,
                "feedback": "虽是终极之法，但按顺序，悟空性急，必是先近后远。地府既有能听遍三界之事的神兽，自当先去一试。"
            }
        ]
    },
    {
        "id": 4,
        "title": "地府谛听",
        "narrative": "谛听伏在地下，听了片刻，抬起头来。它虽已知晓真假，却不敢当面说破。因那假悟空神通广大，若当面揭穿，恐大闹地府，无人能制。",
        "environmentDescription": "Hell (Diyu), Di Ting (mythical beast) listening on the ground. Ten Kings of Hell watching fearfully.",
        "characterState": "Di Ting knowing but silent, Wukongs anxious.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/zhenjiameihouwang/bg_04_diting.jpg",
        "options": [
            {
                "text": "谛听直言真相",
                "isCorrect": False,
                "feedback": "谛听若说，那妖精必怒，地府阴司又无如来佛祖那般大法力，只怕要被拆了奈何桥，毁了森罗殿。神兽有灵，断不冒此险。"
            },
            {
                "text": "指引去雷音寺",
                "isCorrect": True,
                "feedback": "谛听对地藏王道：'怪名虽有，但不可当面说破，免致地府不安。佛法无边，还得去西天雷音寺。' 二猴听罢，又翻跟斗云往西天而去。"
            },
            {
                "text": "阎王查阅生死簿",
                "isCorrect": False,
                "feedback": "悟空早年闹地府，已将猴属之名尽数勾去。生死簿上既然无名，又从何查起？阎王们也是无可奈何。"
            }
        ]
    },
    {
        "id": 5,
        "title": "雷音辨妖",
        "narrative": "二猴打至西天大雷音寺，如来佛祖正对众罗汉讲经。见二猴赶来，佛祖笑道：'汝等俱是一心，且看二心竞斗而来也。' 即指出假悟空本相。",
        "environmentDescription": "Great Thunder Monastery, Buddha sitting on lotus throne. Two Wukongs arriving.",
        "characterState": "Buddha calm and omniscient, Fake Wukong panicked.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/zhenjiameihouwang/bg_05_buddha.jpg",
        "options": [
            {
                "text": "道破六耳猕猴身世",
                "isCorrect": True,
                "feedback": "如来道：'此猴非天非地，非神非鬼，乃六耳猕猴也。善聆音，能察理，知前后，万物皆明。' 那妖精见被说破，现了本相想要逃走，被金钵盂罩住。"
            },
            {
                "text": "施法力强行镇压",
                "isCorrect": False,
                "feedback": "我佛慈悲，以理服人。若不说明原委，只强行镇压，不仅众神不明，悟空心中也还在疑惑。道破根源，方显佛法无边。"
            },
            {
                "text": "让真悟空自己认",
                "isCorrect": False,
                "feedback": "真悟空若认得出，何必打到西天？此妖与真悟空同象同音，非大法力大智慧者不能辨。"
            }
        ]
    },
    {
        "id": 6,
        "title": "师徒重归",
        "narrative": "悟空一棒打死六耳猕猴，绝了二心。观音菩萨领着悟空去见唐僧，说明原委。唐僧方知错怪了徒弟，师徒重归于好，再上西行大道。",
        "environmentDescription": "Tang Seng reconciling with Wukong. The road ahead looks bright.",
        "characterState": "Wukong relieved, Tang Seng apologetic.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/zhenjiameihouwang/bg_06_reunion.jpg",
        "options": [
            {
                "text": "悟空记仇，不肯前行",
                "isCorrect": False,
                "feedback": "二心既除，悟空一心向佛，岂会再存芥蒂？况且此番真假之辩，也让他更明了取经之义。"
            },
            {
                "text": "一心同体，共证菩提",
                "isCorrect": True,
                "feedback": "经此大难，师徒心意更通。外魔易除，心魔难断。除了六耳，便是去了二心，从此一心一意，西天路虽遥，脚下却更坚实。"
            },
            {
                "text": "各奔东西，分道扬镳",
                "isCorrect": False,
                "feedback": "历经九九八十一难，方能修成正果。若在此散伙，前功尽弃，岂是修行人所为？"
            }
        ]
    }
]

sandabaigujing_scenes = [
    {
        "id": 1,
        "title": "荒山遇美",
        "narrative": "师徒四人行至白虎岭，只见峰岩重叠，涧壑湾环。忽见一女子，翠袖轻摇，湘裙斜拽，手提青砂罐，面如满月，目似秋波。八戒见了大喜，却不知此乃千年尸魔白骨精所化，意在取唐僧元阳。",
        "environmentDescription": "A desolate mountain ridge with jagged peaks (Baihu Ling). A beautiful young woman in green sleeves and skirt holding a clay pot approaches.",
        "characterState": "Sun Wukong vigilant, Pigsy infatuated, Tang Seng oblivious.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/sandabaigujing/bg_01_girl.jpg",
        "options": [
            {
                "text": "运起火眼金睛，当头便打",
                "isCorrect": True,
                "feedback": "悟空定睛一看，认出妖精本相，掣铁棒，大喝一声'好孽畜！'，劈头便打。那怪化一阵清风逃走，只留下一具假尸。唐僧肉眼凡胎，大惊失色，责怪悟空无故伤生。"
            },
            {
                "text": "上前搭讪，探问虚实",
                "isCorrect": False,
                "feedback": "既是荒山野岭，孤身女子行走必有蹊跷。若贸然上前，恐堕入妖计，反误了师父性命。这妖精手段高明，言多必失。"
            },
            {
                "text": "请师父定夺",
                "isCorrect": False,
                "feedback": "师父慈悲为怀，必不许伤生。若以此请示，妖精定然趁机下手，那时悔之晚矣。斩妖除魔，需得雷厉风行。"
            }
        ]
    },
    {
        "id": 2,
        "title": "老妇寻女",
        "narrative": "悟空才打跑妖精，山坡上又闪出一个老妇人，年满八旬，手拄藜杖，一步一哭，要寻女儿。唐僧见状，更是责备悟空滥杀无辜。悟空火眼金睛再看，认得还是那妖精变的，心中大怒。",
        "environmentDescription": "An old woman 80 years of age, leaning on a cane, crying on the mountain slope.",
        "characterState": "Tang Seng angry and guilty, Wukong furious.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/sandabaigujing/bg_02_old_woman.jpg",
        "options": [
            {
                "text": "不容分说，举棒再打",
                "isCorrect": True,
                "feedback": "悟空道：'这孽畜又来骗人！' 轮起金箍棒，照头一下。那怪元神出窍，化风而逃，却留下一具老妇尸首。唐僧气得念起紧箍咒，痛得悟空在地上打滚。"
            },
            {
                "text": "向师父解释原委",
                "isCorrect": False,
                "feedback": "此时唐僧已被八戒挑唆，正在气头上，哪里听得进解释？多说无益，反遭紧箍咒之苦。妖精在前，唯有除恶务尽。"
            },
            {
                "text": "变作个土地神哄她",
                "isCorrect": False,
                "feedback": "大圣乃正大光明之辈，岂可甚至妖精行骗？况且妖精认得大圣，此计难行。当务之急是保护师父，非是斗智。"
            }
        ]
    },
    {
        "id": 3,
        "title": "老丈寻亲",
        "narrative": "师徒正行间，又见一个老公公，白发如彭祖，苍髯赛寿星，念着佛号走来。那白骨精三次变化，意在乱唐僧心智。悟空见他又来，心中暗恨，道：'这妖精三番两次来戏弄我！' 须得断其根株。",
        "environmentDescription": "An elderly man matching the description of a longevity god (Shou Xing) approaching.",
        "characterState": "Wukong determined but wary of punishment.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/sandabaigujing/bg_03_old_man.jpg",
        "options": [
            {
                "text": "唤土地为证，一棒断根",
                "isCorrect": True,
                "feedback": "悟空恐师父念咒，先唤出本方土地、山神作证，然后抡起金箍棒，劈脸一下。那妖精再无处逃生，化作一堆白骨，脊梁上刻有'白骨夫人'四字。"
            },
            {
                "text": "听凭师父发落",
                "isCorrect": False,
                "feedback": "若不出手，妖怪必将师父摄去吃掉。为了取经大业，哪怕受屈含冤，也不能坐视不理。我不入地狱，谁入地狱？"
            },
            {
                "text": "佯装不见，护送师父快走",
                "isCorrect": False,
                "feedback": "树欲静而风不止，妖怪既然盯上，岂有轻易放过之理？避无可避，唯有迎头痛击，方能绝后患。"
            }
        ]
    },
    {
        "id": 4,
        "title": "师徒决裂",
        "narrative": "唐僧见连伤三命，虽有白骨为证，却信了八戒谗言，道是悟空以此变术以此遮掩。长老决意要赶悟空走，写下一纸贬书，递与悟空。悟空求饶无果，只得含泪从命。",
        "environmentDescription": "Tang Seng handing a written letter (贬书) to Wukong, looking stern. Wukong kneeling.",
        "characterState": "Wukong heartbroken, Tang Seng resolute.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/sandabaigujing/bg_04_parting.jpg",
        "options": [
            {
                "text": "拜别恩师，嘱托沙僧",
                "isCorrect": True,
                "feedback": "悟空见挽回无望，含泪朝东拜了四拜，嘱咐沙僧道：'贤弟，你是个好人，千万仔细看守师父！' 随后纵云回花果山水帘洞去了。此去经年，也是命中魔障。"
            },
            {
                "text": "强留不走，苦苦哀求",
                "isCorrect": False,
                "feedback": "师父心意已决，强留只会徒增厌恶。缘分暂尽，强求无益，不如暂避，待日后师父有难，自会明白俺老孙的苦心。"
            },
            {
                "text": "毁去贬书，软硬兼施",
                "isCorrect": False,
                "feedback": "如此岂是为人弟子之道？悟空虽顽劣，却极重尊师重道之礼，断不肯行此悖逆之事。一日为师，终身为父。"
            }
        ]
    },
    {
        "id": 5,
        "title": "黑松林遇险",
        "narrative": "悟空走后，唐僧师徒行至碗子山波月洞，被黄袍怪摄去。那怪将唐僧变成一只斑斓猛虎，关在笼中。八戒沙僧双战黄袍怪不过，八戒侥幸逃脱，沙僧被擒。",
        "environmentDescription": "A dark, eerie cave. A tiger in a cage. Yellow Robed Monster laughing.",
        "characterState": "Tang Seng transformed into a tiger, terrified.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/sandabaigujing/bg_05_tiger.jpg",
        "options": [
            {
                "text": "硬着头皮再战",
                "isCorrect": False,
                "feedback": "那黄袍怪武艺高强，连沙僧都被捉了，八戒独木难支，再去也是送死。"
            },
            {
                "text": "回高老庄散伙",
                "isCorrect": False,
                "feedback": "虽然八戒常嚷嚷着散伙，但真到了师父生死存亡之际，他倒也不忍心就这样一走了之。"
            },
            {
                "text": "去花果山请大师兄",
                "isCorrect": True,
                "feedback": "八戒心想：'解铃还须系铃人，这妖怪只有大师兄降得住！' 于是硬着头皮，驾云往东海花果山而去。"
            }
        ]
    },
    {
        "id": 6,
        "title": "义激美猴王",
        "narrative": "八戒来到花果山，见悟空在当猴王快活，便用激将法，说那妖怪骂齐天大圣是脓包。悟空虽知是计，但心中其实挂念师父，又听不得别人辱没名头，便随八戒下山。",
        "environmentDescription": "Water Curtain Cave (Shuilian Dong) with monkeys. Pigsy pleading/goading Wukong.",
        "characterState": "Wukong proud but concerned, Pigsy desperate.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/sandabaigujing/bg_06_pleading.jpg",
        "options": [
            {
                "text": "推脱不去，记恨前嫌",
                "isCorrect": False,
                "feedback": "悟空乃真豪杰，岂会真的记恨师父？他只是一时气愤，只需给个台阶便会下来。"
            },
            {
                "text": "即刻下山，降妖救师",
                "isCorrect": True,
                "feedback": "悟空道：'贤弟，莫要在那里胡扯！我岂不知你在激我？但我还须救师父去！' 兄弟二人驾云同去。"
            },
            {
                "text": "派孩儿们去打探",
                "isCorrect": False,
                "feedback": "救人如救火，迟则生变。况且那黄袍怪神通广大，小猴子们去也是白搭。"
            }
        ]
    },
    {
        "id": 7,
        "title": "破镜重圆",
        "narrative": "悟空施法收了黄袍怪，救出公主，又将唐僧变回原身。师徒相见，悲喜交集。唐僧悔不该听信谗言，逐走良徒；悟空亦泣拜师父，誓死护送西行。正是：剪断尘缘离色相，荡除心垢见灵山。",
        "environmentDescription": "Wukong defeating the monster, Tang Seng turning back to human, team reunited.",
        "characterState": "Tang Seng remorseful and grateful, Wukong triumphant.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/sandabaigujing/bg_07_reunion.jpg",
        "options": [
            {
                "text": "释嫌修好，重踏征程",
                "isCorrect": True,
                "feedback": "师父道：'贤徒，亏了你也！' 悟空道：'师父，你今日方知老孙的手段！' 经此一事，师徒情分更深一层，同心协力，共赴西天。"
            },
            {
                "text": "恃功傲物，逼师赔礼",
                "isCorrect": False,
                "feedback": "一日为师，终身为父。悟空虽受委屈，然笃守尊师重道之礼，岂敢恃功而傲慢？"
            },
            {
                "text": "夸耀神通，奚落八戒",
                "isCorrect": False,
                "feedback": "大圣心胸开阔，既已降妖救师，便不再计较前嫌。兄弟阋墙，非智者所为。"
            }
        ]
    },
    {
        "id": 8,
        "title": "平行时空：师徒情缘",
        "narrative": "若当时唐僧能识破妖计，或悟空能有更好法子证明清白，师徒也不必经受这一番分离之苦。然天道循环，自有定数。九九八十一难，少一难皆不成正果。",
        "environmentDescription": "A conceptual scene of the team reunited, walking towards the west.",
        "characterState": "Reflective and hopeful.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/sandabaigujing/bg_08_happy_team.jpg",
        "options": [
            {
                "text": "勘破迷障，再续前缘",
                "isCorrect": True,
                "feedback": "经此一难，师徒情分虽受挫折，却也为日后破镜重圆埋下伏笔。真金不怕火炼，患难才见真情。终以此心，修成正果。"
            },
            {
                "text": "畏难而退，散伙各去",
                "isCorrect": False,
                "feedback": "取经大业，关乎苍生福祉，岂可因一时误会而轻言放弃？半途而废，非英雄所为。"
            },
            {
                "text": "独善其身，逍遥自在",
                "isCorrect": False,
                "feedback": "悟空本已长生不老，然成佛作祖并非只为长生，更为修得正果，普度众生。独善其身，终非大道。"
            }
        ]
    }
]

# ==========================================
# 3. 山海经 (Shanhaijing) - 精卫填海
# ==========================================

jingweitianhai_scenes = [
    {
        "id": 1,
        "title": "离家远游",
        "narrative": "上古之时，炎帝神农氏有一爱女，名曰女娃。女娃生性活泼，向往自由。一日，她遥望日出之东方，只见云蒸霞蔚，心中顿生向往，意欲前往东海一游。",
        "environmentDescription": "Morning mist in the mountains, a young girl looking towards the east.",
        "characterState": "Nuwa standing on a hill, looking hopeful.",
        "imageUrl": "/assets/shanhaijing/jingweitianhai/bg_01_departure.jpg",
        "options": [
            {
                "text": "留恋家园，放弃远行",
                "isCorrect": False,
                "feedback": "若不出行，虽得安稳，却永远无法见识那广阔的天地。但这不符合女娃的性格。"
            },
            {
                "text": "辞别父亲，奔赴东海",
                "isCorrect": True,
                "feedback": "女娃拜别父亲，踏上了前往东海的旅途。一路山高水长，她却不知疲倦。"
            },
            {
                "text": "邀请伙伴，从长计议",
                "isCorrect": False,
                "feedback": "时光不等人，若事事都要万全准备，恐怕这辈子都走不出这大山。"
            }
        ]
    },
    {
        "id": 2,
        "title": "泛舟戏水",
        "narrative": "历经跋涉，女娃终于抵达东海之滨。只见碧波万顷，海天一色。她寻得一叶扁舟，独自划入海中。海风轻拂，波光粼粼，女娃只觉心旷神怡，从未有过的畅快。",
        "environmentDescription": "A beautiful young girl sailing a small boat on a calm sea.",
        "characterState": "Nuwa enjoying the sea breeze.",
        "imageUrl": "/assets/shanhaijing/jingweitianhai/bg_02_sailing.jpg",
        "options": [
            {
                "text": "无论是岸边，还是浅滩",
                "isCorrect": False,
                "feedback": "既已入海，岂能只在浅滩徘徊？"
            },
            {
                "text": "收帆垂钓，静享安宁",
                "isCorrect": False,
                "feedback": "大海变幻莫测，此刻虽宁静，却非久居之地。"
            },
            {
                "text": "深入大海，探寻奇景",
                "isCorrect": True,
                "feedback": "大海深处仿佛有神秘的呼唤，女娃不知不觉间已离岸甚远。"
            }
        ]
    },
    {
        "id": 3,
        "title": "风暴突袭",
        "narrative": "原本平静的海面骤然变色，乌云压顶，狂风大作。平静的东海瞬间化为吞噬万物的巨兽。巨浪滔天，狠狠地拍打着那如树叶般脆弱的小舟。",
        "environmentDescription": "Dark storm clouds, massive waves, a small boat in danger.",
        "characterState": "Nuwa struggling to control the boat.",
        "imageUrl": "/assets/shanhaijing/jingweitianhai/bg_03_storm.jpg",
        "options": [
            {
                "text": "奋力划桨，与浪搏斗",
                "isCorrect": True,
                "feedback": "女娃虽然年幼，却有着炎帝血脉中的倔强，她试图稳住小舟，但人力终究难抗天威。"
            },
            {
                "text": "闭目祈祷，听天由命",
                "isCorrect": False,
                "feedback": "坐以待毙绝非她的性格，即便面对绝境，也要抗争到底。"
            },
            {
                "text": "弃船求生，跳入海中",
                "isCorrect": False,
                "feedback": "在这惊涛骇浪之中，离开船只无异于自寻死路。"
            }
        ]
    },
    {
        "id": 4,
        "title": "溺水化鸟",
        "narrative": "轰隆一声巨响，一个如山般的巨浪拍下，小舟瞬间支离破碎。女娃落入冰冷的海水中，渐渐沉没。然而，她的身躯虽殁，怨愤之气不散，精魂化为一只白喙赤足的小鸟，名曰“精卫”。",
        "environmentDescription": "Stormy sea, a bird rising from the waves.",
        "characterState": "Jingwei bird flying defiantly.",
        "imageUrl": "/assets/shanhaijing/jingweitianhai/bg_04_transformation.jpg",
        "options": [
            {
                "text": "哀鸣离去，躲避大海",
                "isCorrect": False,
                "feedback": "它既已重生，便不再畏惧。"
            },
            {
                "text": "衔石填海，矢志不渝",
                "isCorrect": True,
                "feedback": "精卫发出凄厉的鸣叫，发誓要填平这夺去她性命的大海！"
            },
            {
                "text": "潜入海底，寻找肉身",
                "isCorrect": False,
                "feedback": "肉身已逝，唯有精神长存。此时回头已无意义。"
            }
        ]
    },
    {
        "id": 5,
        "title": "衔石西山",
        "narrative": "发鸠之山，其上多柘木。精卫以此为家，日复一日，往返于西山与东海之间。它衔来西山的木石，投得东海之中。路途遥远，风雨无阻，羽毛凌乱，足底流血，亦不肯停歇片刻。",
        "environmentDescription": "Bird carrying a stone flying over mountains.",
        "characterState": "Exhausted but determined bird.",
        "imageUrl": "/assets/shanhaijing/jingweitianhai/bg_05_labor.jpg",
        "options": [
            {
                "text": "稍作休息，养精蓄锐",
                "isCorrect": False,
                "feedback": "每一刻的停歇，都让精卫觉得是对仇恨的遗忘，它不肯停。"
            },
            {
                "text": "寻求帮手，共填沧海",
                "isCorrect": False,
                "feedback": "这是属于她一个人的战斗，也是她一个人的执念，哪怕孤独，也要坚持。"
            },
            {
                "text": "坚持不懈，日夜往复",
                "isCorrect": True,
                "feedback": "沧海桑田，精卫的身影从未消失。"
            }
        ]
    },
    {
        "id": 6,
        "title": "千古誓言",
        "narrative": "惊涛骇浪嘲笑它：“尔一小鸟，纵千百万年，也难填平我这汪洋大海。” 精卫在高空厉声回视：“纵使千万年，甚至亿万年，我也誓将你填平，以免你再害他人少年！”",
        "environmentDescription": "Jingwei dropping stones into the vast ocean.",
        "characterState": "Determined bird carrying a stone.",
        "imageUrl": "/assets/shanhaijing/jingweitianhai/bg_06_oath.jpg",
        "options": [
            {
                "text": "与海谈判，祈求和平",
                "isCorrect": False,
                "feedback": "大海无情，岂会因为言语而改变？唯有行动能证明一切。"
            },
            {
                "text": "子孙相继，永不放弃",
                "isCorrect": True,
                "feedback": "这种撼动天地的意志，令大海也不禁为之颤抖。"
            },
            {
                "text": "沉默不语，专心投石",
                "isCorrect": False,
                "feedback": "虽无言亦有力，但此刻的誓言，是对天地的宣告。"
            }
        ]
    },
    {
        "id": 7,
        "title": "精神永存",
        "narrative": "后来，人们常用“精卫填海”来比喻意志坚决，不畏艰难。那只白喙赤足的小鸟，成为了中华民族不屈不挠精神的象征，千古流传。",
        "environmentDescription": "A symbolic image of the bird and the filled sea (abstract).",
        "characterState": "Legendary status.",
        "imageUrl": "/assets/shanhaijing/jingweitianhai/bg_07_legacy.jpg",
        "options": [
            {
                "text": "重读经典，再悟精神",
                "isCorrect": True,
                "feedback": "故事虽短，精神长存。"
            },
            {
                "text": "讲述故事，传承后人",
                "isCorrect": False,
                "feedback": "将这精神代代相传，或许比填平大海更有意义。(游戏结束)"
            },
            {
                "text": "仰望星空，追忆往昔",
                "isCorrect": False,
                "feedback": "星空之下，是否还有那只倔强的小鸟在飞翔？(游戏结束)"
            }
        ]
    },
    {
        "id": 8,
        "title": "平行时空：安度一生",
        "narrative": "若当日女娃听从父命，未去东海，或许她能承欢膝下，无忧无虑度过一生。世间少了一段凄美的神话，却多了一个幸福的少女。但那样的女娃，还是那个向往自由的灵魂吗？",
        "environmentDescription": "Nuwa playing happily in the fields.",
        "characterState": "Nuwa living a peaceful life.",
        "imageUrl": "/assets/shanhaijing/jingweitianhai/bg_08_bad_safe.jpg",
        "options": [
            {
                "text": "享受平凡，相夫教子",
                "isCorrect": False,
                "feedback": "这也是一种幸福，只是少了那份惊心动魄。"
            },
            {
                "text": "梦回东海，心存遗憾",
                "isCorrect": False,
                "feedback": "既然选择了安逸，便只能在梦中寻找那片海。"
            },
            {
                "text": "重新来过，再化精卫",
                "isCorrect": True,
                "feedback": "有些命运，或许注定要燃烧自己，照亮后人。"
            }
        ]
    }
]


# ==========================================
# 3b. 山海经 (Shanhaijing) - 后羿射日
# ==========================================

houyisheri_scenes = [
    {
        "id": 1,
        "title": "十日并出",
        "narrative": "东方海外，汤谷之中，原有十个太阳，每日轮流值守，照耀大地。然一日，十日竟一同升起，化作十只金乌在天空嬉戏。瞬间大地干裂，河流枯竭，草木焦黄，百姓苦不堪言。",
        "environmentDescription": "Ten suns scorching the earth, rivers drying up, people suffering.",
        "characterState": "People looking at the sky in despair.",
        "imageUrl": "/assets/shanhaijing/houyisheri/bg_01_ten_suns.jpg",
        "options": [
            {
                "text": "躲入地穴，苟且偷生",
                "isCorrect": False,
                "feedback": "虽可暂避一时，然大地若毁，地穴岂能独存？且坐视苍生受难，非勇者所为。"
            },
            {
                "text": "祈求上苍，降雨灭火",
                "isCorrect": False,
                "feedback": "天帝帝俊乃十日之父，此时正纵容诸子。祈求无用，唯有抗争。"
            },
            {
                "text": "挺身而出，寻找救法",
                "isCorrect": True,
                "feedback": "在这绝望之际，神射手后羿看着受难的百姓，紧握手中彤弓素箭，眼中燃起怒火。"
            }
        ]
    },
    {
        "id": 2,
        "title": "帝尧之请",
        "narrative": "人间帝王尧见百姓死伤惨重，痛心疾首，遂请天神后羿下界除害。后羿领命，来到昆仑之巅，张弓搭箭，直指苍穹。",
        "environmentDescription": "Emperor Yao pleading with Hou Yi, Hou Yi holding a bow.",
        "characterState": "Hou Yi preparing to shoot.",
        "imageUrl": "/assets/shanhaijing/houyisheri/bg_02_emperor_plea.jpg",
        "options": [
            {
                "text": "直接射杀，不留情面",
                "isCorrect": False,
                "feedback": "先礼后兵乃君子之风。金乌虽顽劣，毕竟是神灵之子，应先予警告。"
            },
            {
                "text": "鸣镝示警，劝其归去",
                "isCorrect": True,
                "feedback": "后羿射出一支鸣镝，划破长空，意在警告金乌速速归去，勿再为祸人间。"
            },
            {
                "text": "畏惧天帝，不敢开弓",
                "isCorrect": False,
                "feedback": "后羿也就是因为这份刚正不阿，才会被贬下凡。既已领命，何惧之有？"
            }
        ]
    },
    {
        "id": 3,
        "title": "金乌顽劣",
        "narrative": "那十只金乌见鸣镝飞来，不仅不惧，反而更加肆无忌惮，甚至向后羿喷吐真火，嘲笑其不自量力。",
        "environmentDescription": "Golden crows mocking Hou Yi, spitting fire.",
        "characterState": "Hou Yi angered by the crows' arrogance.",
        "imageUrl": "/assets/shanhaijing/houyisheri/bg_03_mockery.jpg",
        "options": [
            {
                "text": "再次警告，苦口婆心",
                "isCorrect": False,
                "feedback": "此时再言，已被其视为软弱。对付这等顽劣之徒，言语已是无用。"
            },
            {
                "text": "愤而开弓，射落一日",
                "isCorrect": True,
                "feedback": "忍无可忍，无需再忍！后羿脚踏大地，手挽雕弓，满月崩弦，一箭射出！"
            },
            {
                "text": "求助天帝，管教诸子",
                "isCorrect": False,
                "feedback": "远水难救近火。况且天帝若肯管教，何至于此？"
            }
        ]
    },
    {
        "id": 4,
        "title": "九日坠落",
        "narrative": "只听一声惨叫，一只金乌中箭坠落，化为三足乌鸦，身上的火焰瞬间熄灭。余下九日大惊，四散奔逃。后羿神威大发，连珠箭发，一口气又射落八只。",
        "environmentDescription": "Suns falling from the sky one by one.",
        "characterState": "Hou Yi shooting arrows in rapid succession.",
        "imageUrl": "/assets/shanhaijing/houyisheri/bg_04_falling_suns.jpg",
        "options": [
            {
                "text": "乘胜追击，射杀殆尽",
                "isCorrect": False,
                "feedback": "万物生长靠太阳。若十日皆亡，大地将陷入永恒的黑暗与严寒，亦是一场浩劫。"
            },
            {
                "text": "因生怜悯，停手不射",
                "isCorrect": False,
                "feedback": "剩下那只若不给足教训，难保日后不故态复萌。此时停手，尚嫌太早。"
            },
            {
                "text": "欲射最后一日",
                "isCorrect": True,
                "feedback": "后羿搭上最后一支箭，瞄准了最后那只瑟瑟发抖的金乌。"
            }
        ]
    },
    {
        "id": 5,
        "title": "万物复苏",
        "narrative": "正当此时，尧帝急忙拦住后羿：“壮士留步！若无太阳，万物亦无法生存。”后羿闻言收弓。最后一只金乌死里逃生，发誓从此每日按时升起，造福万物。从此，风调雨顺，万物复甦。",
        "environmentDescription": "A single sun in the sky, rain falling, plants growing.",
        "characterState": "People celebrating, Hou Yi putting away his bow.",
        "imageUrl": "/assets/shanhaijing/houyisheri/bg_05_salvation.jpg",
        "options": [
            {
                "text": "居功自傲，索要赏赐",
                "isCorrect": False,
                "feedback": "后羿射日乃为苍生，非为私利。英雄之所以为英雄，在于其无私。"
            },
            {
                "text": "归隐山林，不问世事",
                "isCorrect": False,
                "feedback": "后羿虽立大功，但人世间尚有凿齿、九婴等妖兽为祸，英雄的使命尚未结束。"
            },
            {
                "text": "继续除害，造福苍生",
                "isCorrect": True,
                "feedback": "后羿收拾弓箭，又踏上了铲除妖兽、守护大地的征途。他的名字，被后世永远铭记。"
            }
        ]
    },
    {
        "id": 6,
        "title": "平行时空：黑暗永夜",
        "narrative": "若后羿一时兴起，将十日尽数射杀，世界从此陷入无尽黑暗，那个英雄，恐将成为千古罪人。",
        "environmentDescription": "Eternal night, frozen world.",
        "characterState": "Hou Yi standing alone in the dark.",
        "imageUrl": "/assets/shanhaijing/houyisheri/bg_06_bad_darkness.jpg",
        "options": [
            {
                "text": "重新来过，手下留情",
                "isCorrect": True,
                "feedback": "过犹不及，万事当有度。"
            }
        ]
    }
]

# ==========================================
# 4. 论语 (Lunyu) - 颜回偷粥
# ==========================================

yanhuitouzhou_scenes = [
    {
        "id": 1,
        "title": "绝粮陈蔡",
        "narrative": "孔子困于陈蔡之间，绝粮七日，弟子无论老少皆有饥色。唯颜回依然神态自若，每日依旧读书习礼，并设法讨得少许米粮煮粥。",
        "environmentDescription": "A dilapidated temple, Confucius and disciples looking hungry and weak.",
        "characterState": "Yan Hui cooking porridge quietly.",
        "imageUrl": "/assets/lunyu/yanhuitouzhou/bg_01_hungry.jpg",
        "options": [
            {
                "text": "安贫乐道",
                "isCorrect": True,
                "feedback": "君子固穷，小人穷斯滥矣。越是困境，越能磨炼心性，颜回深得夫子之道。"
            },
            {
                "text": "质疑师道",
                "isCorrect": False,
                "feedback": "子路曾问：“君子亦有穷乎？”若因一时困顿而动摇信念，便非真君子。"
            },
            {
                "text": "甚至想要离开",
                "isCorrect": False,
                "feedback": "患难见真情，此时离去，不仅背弃师门，更背弃了自己的道义。"
            }
        ]
    },
    {
        "id": 2,
        "title": "颜回讨米",
        "narrative": "颜回几经周折，终于讨回一些米来煮粥。大家早已饥肠辘辘，都在焦急地等待。",
        "environmentDescription": "Yan Hui cooking near a simple stove.",
        "characterState": "Yan Hui focused on cooking.",
        "imageUrl": "/assets/lunyu/yanhuitouzhou/bg_02_cooking.jpg",
        "options": [
            {
                "text": "小心看火",
                "isCorrect": True,
                "feedback": "米粮来之不易，需得全神贯注，确保粥熟且不浪费，这也是一种修行。"
            },
            {
                "text": "因为饥饿难耐",
                "isCorrect": False,
                "feedback": "虽饥肠辘辘，但颜回克己复礼，绝不会在师长未食之前因私欲而失态。"
            },
            {
                "text": "心生怨怼",
                "isCorrect": False,
                "feedback": "颜回为人谦冲，即使身处逆境，也绝无怨言，只会默默承担。"
            }
        ]
    },
    {
        "id": 3,
        "title": "意外发生",
        "narrative": "粥快熟时，忽有一阵风吹来，屋顶上的灰尘掉进了锅里。颜回连忙用勺子将脏了的粥舀出来。",
        "environmentDescription": "Dust falling into the pot.",
        "characterState": "Yan Hui looking concerned.",
        "imageUrl": "/assets/lunyu/yanhuitouzhou/bg_03_accident.jpg",
        "options": [
            {
                "text": "惜食吞粥",
                "isCorrect": True,
                "feedback": "“一箪食，一瓢饮，在陋巷，人不堪其忧，回也不改其乐。”颜回深知物力维艰，故不忍丢弃，虽然不洁，宁可自己吃下。"
            },
            {
                "text": "倒掉脏粥",
                "isCorrect": False,
                "feedback": "此时绝粮七日，每一粒米都关乎性命，岂能轻易倒掉？此举虽合卫生，却不合时宜。"
            },
            {
                "text": "搅拌掩饰",
                "isCorrect": False,
                "feedback": "若将灰尘拌入粥中呈给夫子，便是欺师；若自己食用却不言明，亦非诚实之道。"
            }
        ]
    },
    {
        "id": 4,
        "title": "孔子试探",
        "narrative": "孔子远远看见颜回似乎在偷吃，心中不悦，但没有当面发作。待颜回端粥送上时，孔子故意说道：“刚才我梦见了先君，这粥若是洁净的，就先拿去祭祀吧。”",
        "environmentDescription": "Confucius testing Yan Hui.",
        "characterState": "Confucius looking stern but calm.",
        "imageUrl": "/assets/lunyu/yanhuitouzhou/bg_04_test.jpg",
        "options": [
            {
                "text": "据实以告",
                "isCorrect": True,
                "feedback": "颜回坦荡答道：“不可！刚才有灰尘掉进锅里，我怕浪费便吃了，这粥已不洁，不能祭祀了。”诚实乃君子之本。"
            },
            {
                "text": "顺从师命",
                "isCorrect": False,
                "feedback": "祭祀讲究“诚”与“洁”。若明知粥不洁而献祭，是大不敬；若隐瞒实情，是欺师。"
            },
            {
                "text": "惶恐认错",
                "isCorrect": False,
                "feedback": "颜回所为并非错事，而是惜物之举，何须惶恐？只需如实说明即可。"
            }
        ]
    },
    {
        "id": 5,
        "title": "误会冰释",
        "narrative": "孔子听后感叹道：“原本我只相信眼睛看到的，可亲眼所见也未必是真相；原本我只依靠内心的推测，可内心有时也会不可靠。大家要记住，了解一个人真的不容易啊！”",
        "environmentDescription": "Confucius teaching his disciples.",
        "characterState": "All disciples listening with respect.",
        "imageUrl": "/assets/lunyu/yanhuitouzhou/bg_05_resolution.jpg",
        "options": [
            {
                "text": "深信不疑",
                "isCorrect": True,
                "feedback": "信任非一日之功，需经得起误解与考验。师徒之间，贵在相知相信。"
            },
            {
                "text": "眼见为实",
                "isCorrect": False,
                "feedback": "孔子今日之教，正是要破除“眼见为实”的执念。心之所感，往往比眼之所见更为真实。"
            },
            {
                "text": "心存芥蒂",
                "isCorrect": False,
                "feedback": "误会既已冰释，道理也已讲明，若仍存芥蒂，便枉费了夫子的一番教诲。"
            }
        ]
    },
    {
        "id": 6,
        "title": "信任崩塌",
        "narrative": "若孔子当时未能查明真相，或者颜回未能即使解释，一代贤人恐蒙不白之冤。师徒之间若无信任，道义何存？信任一旦破裂，便如覆水难收，令人扼腕叹息。",
        "environmentDescription": "Yan Hui walking away, Confucius looking regretful.",
        "characterState": "Sadness and separation.",
        "imageUrl": "/assets/lunyu/yanhuitouzhou/bg_06_bad.jpg",
        "options": []
    }
]

weibiansanjue_scenes = [
    {
        "id": 1,
        "title": "晚年好易",
        "narrative": "孔子晚年由卫返鲁，结束了长达十四年的周游列国生涯。此时他已年近古稀，却依然壮心不已，将全部精力投入到对古代典籍的整理之中。而在六经之中，他尤爱《周易》，常常不知疲倦地研读，甚至到了废寝忘食的地步。",
        "environmentDescription": "Confucius in his study room, surrounded by bamboo slips, peaceful atmosphere.",
        "characterState": "Confucius reading with great interest.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/weibiansanjue/bg_01_reading.jpg",
        "options": [
            {
                "text": "探究天道",
                "isCorrect": True,
                "feedback": "《周易》虽以此卜筮，但孔子看到的却是其中蕴含的天地万物变化之道。他不仅是读，更是要探寻宇宙人生的终极真理。"
            },
            {
                "text": "消磨时光",
                "isCorrect": False,
                "feedback": "孔子晚年惜时如金，感叹“逝者如斯夫”，绝不会为了单纯消磨时光而读书。他是在与时间赛跑，传承文化。"
            },
            {
                "text": "寻求吉凶",
                "isCorrect": False,
                "feedback": "孔子言“不占而已矣”，他读易并非为了算命卜卦求吉凶，而是为了通晓事理，修身养性。"
            }
        ]
    },
    {
        "id": 2,
        "title": "日夜精研",
        "narrative": "夜深了，颜回、子路等弟子都已歇息，孔子的书房里那盏油灯却依然亮着。他时而凝眉沉思，时而提笔批注，对于《周易》中的每一句卦辞、每一段爻辞，都反复推敲，务求甚解。简册上的字迹，在他昏花的眼中却似星辰般闪耀。",
        "environmentDescription": "Confucius studying late at night by candlelight.",
        "characterState": "Confucius looking thoughtful and focused.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/weibiansanjue/bg_02_studying.jpg",
        "options": [
            {
                "text": "学思并重",
                "isCorrect": True,
                "feedback": "“学而不思则罔，思而不学则殆。” 孔子正是通过不断地研读与思考，将古老的卜筮之书升华为哲学经典。"
            },
            {
                "text": "囫囵吞枣",
                "isCorrect": False,
                "feedback": "孔子治学最忌只读表面而不求甚解。对于艰深的《周易》，他更是逐字逐句地推敲，绝不含糊。"
            },
            {
                "text": "墨守成规",
                "isCorrect": False,
                "feedback": "孔子读易，并非死守古义，而是“述而不作，信而好古”中又有所创新，赋予了《周易》全新的德义内涵。"
            }
        ]
    },
    {
        "id": 3,
        "title": "韦编初断",
        "narrative": "春秋时期的书，是将许多根竹简用熟牛皮绳（韦）编联起来的。虽然牛皮绳坚韧异常，但架不住孔子日复一日、年复一年的频繁翻阅。这一日，正当孔子读到兴头上时，手中的书简突然散了架——那条坚韧的牛皮绳竟然磨断了！",
        "environmentDescription": "Bamboo slips scattered on the floor, broken leather strap.",
        "characterState": "Confucius looking surprised but calm.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/weibiansanjue/bg_03_broken.jpg",
        "options": [
            {
                "text": "欣然重编",
                "isCorrect": True,
                "feedback": "孔子并没有因此懊恼，反而因为自己读书之勤而感到一丝欣慰。他唤来弟子，耐心地将竹简按顺序重新编好，继续攻读。"
            },
            {
                "text": "怅然若失",
                "isCorrect": False,
                "feedback": "书简虽断，学问未断。孔子心胸豁达，这点小事不会让他感到怅然，反而会更激发他读书的热情。"
            },
            {
                "text": "置之不理",
                "isCorrect": False,
                "feedback": "书是孔子的良师益友，怎么会置之不理呢？"
            }
        ]
    },
    {
        "id": 4,
        "title": "韦编三绝",
        "narrative": "这并非偶然。随着岁月的流逝，孔子读《易》的热情有增无减。据说，那编联竹简的熟牛皮绳，竟然先后断了三次之多！这也不仅成为了“韦编三绝”这一成语的典故由来，更成为了后世千古流传的勤学佳话。",
        "environmentDescription": "Time passing montage, worn out bamboo slips.",
        "characterState": "Confucius looking determined and diligent.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/weibiansanjue/bg_04_three_times.jpg",
        "options": [
            {
                "text": "笃志虚心",
                "isCorrect": True,
                "feedback": "正是这种笃志好学、虚心求教的精神，成就了孔子的圣人地位。正如他自己所言：“我非生而知之者，好古，敏以求之者也。”"
            },
            {
                "text": "爱书如命",
                "isCorrect": False,
                "feedback": "虽然孔子确实爱书，但“韦编三绝”的核心精神在于“勤奋”与“刻苦”，而非单纯对书籍实体的爱惜。"
            },
            {
                "text": "力大无穷",
                "isCorrect": False,
                "feedback": "牛皮绳并非被拉断，而是被磨断的。这体现的是“水滴石穿”的功夫，而非力气的大小。"
            }
        ]
    },
    {
        "id": 5,
        "title": "假我数年",
        "narrative": "面对博大精深的《周易》，孔子依然保持着极度的谦逊。他曾深有感触地对子路说：“假我数年，五十以学《易》，可以无大过矣。” 即使到了古稀之年，他依然觉得时间不够用，依然觉得自己还有提升的空间。",
        "environmentDescription": "Confucius looking at the sky/horizon, contemplating.",
        "characterState": "Confucius looking wise and humble.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/weibiansanjue/bg_05_humble.jpg",
        "options": [
            {
                "text": "不仅孜孜",
                "isCorrect": True,
                "feedback": "圣人之所以为圣人，在于从不满足于已有的成就。孔子的这种“不知老之将至”的求学态度，才是最值得我们后人学习的。"
            },
            {
                "text": "临渊羡鱼",
                "isCorrect": False,
                "feedback": "孔子是在身体力行地“退而结网”，通过踏实地学习来避免过失，而非空想羡慕。"
            },
            {
                "text": "悔不当初",
                "isCorrect": False,
                "feedback": "孔子一生光明磊落，此言并非后悔，而是对知识的无限向往和对完美人格的不懈追求。"
            }
        ]
    },
    {
        "id": 6,
        "title": "十翼传世",
        "narrative": "功夫不负有心人。孔子晚年对《周易》的整理和注释，汇集成了被后世称为《十翼》（《易传》）的不朽经典。他为这本古老的卜筮之书插上了哲学的翅膀，使其飞越了千年的时空，至今仍照耀着中华文明的天空。",
        "environmentDescription": "Confucius teaching, phantom of Yi Jing text in background.",
        "characterState": "Confucius interacting with disciples.",
        "imageUrl": "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/weibiansanjue/bg_06_legacy.jpg",
        "options": []
    }
]

def generate_sql():
    sql = []
    
    # -------------------------------------------------------------
    # 1. Clean existing data (MODIFIED: WE NO LONGER DELETE EVERYTHING)
    #    Instead, we will use UPSERT (ON CONFLICT DO UPDATE) to support incremental updates.
    # -------------------------------------------------------------
    
    # STORAGE CONFIG
    STORAGE_BASE_URL = "https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/images"

    sql.append("-- NOTE: This script now uses UPSERT logic. It will NOT delete all data.")
    sql.append("-- It will update existing stories/scenes and insert new ones.")
    
    # -------------------------------------------------------------
    # 2. Insert Categories (Upsert)
    # -------------------------------------------------------------
    sql.append(f"  INSERT INTO categories (id, title, cover_image, sort_order) VALUES ('sanguoyanyi', '三国演义', '{STORAGE_BASE_URL}/covers/cover_sanguo.jpg', 1) ON CONFLICT (id) DO UPDATE SET sort_order=EXCLUDED.sort_order, cover_image=EXCLUDED.cover_image, title=EXCLUDED.title;")
    sql.append(f"  INSERT INTO categories (id, title, cover_image, sort_order) VALUES ('xiyouji', '西游记', '{STORAGE_BASE_URL}/covers/cover_xiyou.jpg', 2) ON CONFLICT (id) DO UPDATE SET sort_order=EXCLUDED.sort_order, cover_image=EXCLUDED.cover_image, title=EXCLUDED.title;")
    sql.append(f"  INSERT INTO categories (id, title, cover_image, sort_order) VALUES ('shanhaijing', '山海经', '{STORAGE_BASE_URL}/covers/cover_shanhai.jpg', 3) ON CONFLICT (id) DO UPDATE SET sort_order=EXCLUDED.sort_order, cover_image=EXCLUDED.cover_image, title=EXCLUDED.title;")
    sql.append(f"  INSERT INTO categories (id, title, cover_image, sort_order) VALUES ('lunyu', '论语', '{STORAGE_BASE_URL}/covers/cover_lunyu.jpg', 4) ON CONFLICT (id) DO UPDATE SET sort_order=EXCLUDED.sort_order, cover_image=EXCLUDED.cover_image, title=EXCLUDED.title;")
    
    # -------------------------------------------------------------
    # 3. Insert Stories (Upsert)
    # -------------------------------------------------------------
    
    # Helper for story upsert
    # Helper for story upsert
    def get_story_upsert(id, category_id, title, description, ending_title, ending_description, sort_order):
        # Escape single quotes
        title = title.replace("'", "''")
        description = description.replace("'", "''")

        # Check for "(敬请期待)" in title
        is_ready = str(True).lower()
        if "(敬请期待)" in title:
            is_ready = str(False).lower()
            title = title.replace(" (敬请期待)", "").replace("(敬请期待)", "")

        if ending_title: ending_title = "'" + ending_title.replace("'", "''") + "'"
        else: ending_title = "NULL"
        
        if ending_description: ending_description = "'" + ending_description.replace("'", "''") + "'"
        else: ending_description = "NULL"
        
        return f"INSERT INTO stories (id, category_id, title, description, ending_title, ending_description, sort_order, is_ready) VALUES ('{id}', '{category_id}', '{title}', '{description}', {ending_title}, {ending_description}, {sort_order}, {is_ready}) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, ending_title=EXCLUDED.ending_title, ending_description=EXCLUDED.ending_description, sort_order=EXCLUDED.sort_order, is_ready=EXCLUDED.is_ready;"

    # Sanguo
    sql.append(get_story_upsert('sangumaolu', 'sanguoyanyi', '三顾茅庐', '刘备三次拜访诸葛亮，求贤若渴，终得隆中对。', '如鱼得水', '刘备三顾茅庐，终得卧龙出山。此后君臣相知，如鱼得水，共创蜀汉基业。', 1))
    sql.append(get_story_upsert('taoyuan', 'sanguoyanyi', '桃园结义', '东汉末年，天下大乱。刘关张三人于桃园结义，共图大事。', '义薄云天', '三位英雄于桃园焚香结拜，誓同生死。一段波澜壮阔的三国史诗就此拉开序幕。恭喜你完成了这段历史的演绎。', 2))
    sql.append(get_story_upsert('caochuanjiejian', 'sanguoyanyi', '草船借箭', '周瑜设计害孔明，孔明谈笑间草船借箭十万枝。', '神机妙算', '孔明神机妙算，草船借箭十万枝，周瑜自叹不如。', 3))
    sql.append(get_story_upsert('huoshaochibi', 'sanguoyanyi', '火烧赤壁', '孙刘联军火烧赤壁，大破曹操八十万大军，奠定三国鼎立之势。', None, None, 4))
    sql.append(get_story_upsert('kongchengji', 'sanguoyanyi', '空城计 (敬请期待)', '马谡失街亭，司马懿大军压境。诸葛亮大开城门，抚琴退敌。', None, None, 5))

    # Xiyou
    sql.append(get_story_upsert('danaotiangong', 'xiyouji', '大闹天宫', '孙悟空大闹天宫，挑战十万天兵天将。', '齐天大圣', '十万天兵难抵挡，定海神针显神威。这一战，打出了齐天大圣的赫赫威名，也种下了五百年被压五行山的因果。', 1))
    sql.append(get_story_upsert('sandabaigujing', 'xiyouji', '三打白骨精', '白骨精三次变化戏弄唐僧，悟空火眼金睛识破妖魔。', '破镜重圆', '师徒四人经历了误会与分离，最终消除隔阂，重归于好。这份失而复得的情谊，更加坚不可摧。', 2))
    sql.append(get_story_upsert('zhenjiameihouwang', 'xiyouji', '真假美猴王 (敬请期待)', '六耳猕猴假冒悟空，上天入地难辨真伪，终至如来佛祖处方显原形。', None, None, 3))
    sql.append(get_story_upsert('nuerguo', 'xiyouji', '女儿国奇遇 (敬请期待)', '师徒误入西梁女国，唐僧在女王柔情与取经大业之间经受考验。', None, None, 4))
    sql.append(get_story_upsert('dazhanhonghaier', 'xiyouji', '大战红孩儿 (敬请期待)', '红孩儿练成三昧真火，悟空难敌，请来观音菩萨方才收服。', None, None, 5))
    sql.append(get_story_upsert('touchirenshenguo', 'xiyouji', '偷吃人参果 (敬请期待)', '万寿山五庄观，悟空偷吃人参果，推倒果树，惹怒镇元大仙。', None, None, 6))

    # Shanhai
    sql.append(get_story_upsert('jingweitianhai', 'shanhaijing', '精卫填海', '炎帝之女溺亡东海，化为精卫鸟，衔石填海，矢志不渝。', '坚韧不拔', '精卫衔微木，将以填沧海。刑天舞干戚，猛志固常在。你的坚持与毅力，正如这精卫鸟一般，令人动容。', 1))
    sql.append(get_story_upsert('houyisheri', 'shanhaijing', '后羿射日', '十日并出，焦禾稼，杀草木。后羿张弓搭箭，射落九日，解救苍生。', '光耀千秋', '后羿射落九日，留一日以照万物。自此风调雨顺，万物复苏。英雄之名，与日月同辉。', 2))
    sql.append(get_story_upsert('kuafuzhuri', 'shanhaijing', '夸父逐日 (敬请期待)', '夸父与日逐走，渴欲得饮，饮于河、渭；河、渭不足，北饮大泽，未至，道渴而死。', None, None, 3))
    sql.append(get_story_upsert('dayuzhishui', 'shanhaijing', '大禹治水 (敬请期待)', '大禹率民治水，三过家门而不入，疏通九河，平定水患。', None, None, 4))
    sql.append(get_story_upsert('huangdizhan', 'shanhaijing', '黄帝战蚩尤 (敬请期待)', '轩辕黄帝与蚩尤大战于逐鹿之野，风后设指南车破迷雾，最终统一华夏。', None, None, 5))

    # Lunyu
    sql.append(get_story_upsert('yanhuitouzhou', 'lunyu', '颜回偷粥', '孔子误会颜回偷食，终知真相。通过此事感叹“知人不易”。', '知人不易', '所信者目也，而目犹不可信；所恃者心也，而心犹不足恃。弟子记之，知人固不易矣。', 1))
    sql.append(get_story_upsert('weibiansanjue', 'lunyu', '韦编三绝', '孔子晚年喜读《易》，韦编三绝。曰：“假我数年，五十以学《易》，可以无大过矣。”', '勤学不倦', '韦编三绝今犹在，从此勤学不仅是少年的事，更是毕生的修行。', 2))
    sql.append(get_story_upsert('zilushoujiao', 'lunyu', '子路受教 (敬请期待)', '子路问政，孔子教之以先之劳之。子路性直，孔子常循循善诱。', None, None, 3))
    sql.append(get_story_upsert('shizherusi', 'lunyu', '逝者如斯 (敬请期待)', '子在川上曰：“逝者如斯夫！不舍昼夜。” 感叹时光流逝，勉励弟子珍惜光阴。', None, None, 4))
    sql.append(get_story_upsert('junzibuqi', 'lunyu', '君子不器 (敬请期待)', '孔子曰：“君子不器。” 意为君子博学多才，不应像器物一样只有单一用途。', None, None, 5))
    
    # -------------------------------------------------------------
    # 4. Helper function to insert scenes (Upsert)
    # -------------------------------------------------------------
    def get_scene_sql(story_id, scenes):
        lines = []
        lines.append(f"DO $$ DECLARE v_scene_id uuid; BEGIN")
        lines.append(f"  -- Story: {story_id}")
        for scene in scenes:
            scene_index = scene['id']
            title = scene['title'].replace("'", "''")
            narrative = scene['narrative'].replace("'", "''")
            env_desc = scene['environmentDescription'].replace("'", "''")
            char_state = scene['characterState'].replace("'", "''")
            img_url = scene['imageUrl'].replace("'", "''")
            if img_url.startswith('/assets/'):
                img_url = STORAGE_BASE_URL + img_url.replace('/assets/', '/')
            
            audio_url = scene.get('audioUrl', '').replace("'", "''")
            if not audio_url:
                audio_url = 'NULL'
            else:
                audio_url = f"'{audio_url}'"
            
            # UPSERT SCENE
            # This requires a UNIQUE constraint on scenes(story_id, scene_index)
            lines.append(f"  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url, audio_url) VALUES ('{story_id}', {scene_index}, '{title}', '{narrative}', '{env_desc}', '{char_state}', '{img_url}', {audio_url}) ON CONFLICT (story_id, scene_index) DO UPDATE SET title=EXCLUDED.title, narrative=EXCLUDED.narrative, environment_description=EXCLUDED.environment_description, character_state=EXCLUDED.character_state, image_url=EXCLUDED.image_url, audio_url=EXCLUDED.audio_url RETURNING id INTO v_scene_id;")
            
            # REFRESH OPTIONS
            # Delete options for this scene first, then re-insert. 
            # This is safer than upserting options since options are list-based.
            lines.append(f"  DELETE FROM scene_options WHERE scene_id = v_scene_id;")
            
            for index, option in enumerate(scene['options']):
                opt_text = option['text'].replace("'", "''")
                is_correct = str(option['isCorrect']).lower()
                feedback = option['feedback'].replace("'", "''")
                sort_order = index + 1
                lines.append(f"  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '{opt_text}', {is_correct}, '{feedback}', {sort_order});")
            lines.append("")
        lines.append("END $$;")
        return lines

    # -------------------------------------------------------------
    # 5. Insert Scenes
    # -------------------------------------------------------------
    sql.extend(get_scene_sql('sangumaolu', sangumaolu_scenes))
    sql.extend(get_scene_sql('caochuanjiejian', caochuanjiejian_scenes))
    sql.extend(get_scene_sql('taoyuan', taoyuan_scenes))
    sql.extend(get_scene_sql('danaotiangong', danaotiangong_scenes))
    sql.extend(get_scene_sql('sandabaigujing', sandabaigujing_scenes))
    sql.extend(get_scene_sql('zhenjiameihouwang', zhenjiameihouwang_scenes))
    sql.extend(get_scene_sql('jingweitianhai', jingweitianhai_scenes))
    sql.extend(get_scene_sql('houyisheri', houyisheri_scenes))
    sql.extend(get_scene_sql('yanhuitouzhou', yanhuitouzhou_scenes))
    sql.extend(get_scene_sql('weibiansanjue', weibiansanjue_scenes))
    
    return "\n".join(sql)

if __name__ == "__main__":
    sql_script = generate_sql()
    # Write to a file
    output_file = 'supabase/seed.sql'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(sql_script)
    print(f"Successfully generated {output_file}")
