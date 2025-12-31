-- Clean existing data
DELETE FROM scene_options WHERE scene_id IN (SELECT id FROM scenes WHERE story_id IN ('sangumaolu', 'taoyuan', 'danaotiangong', 'sandabaigujing', 'zhenjiameihouwang', 'nuerguo', 'dazhanhonghaier', 'touchirenshenguo', 'jingweitianhai', 'houyisheri', 'kuafuzhuri', 'dayuzhishui', 'huangdizhan', 'yanhuitouzhou', 'weibiansanjue', 'zilushoujiao', 'shizherusi', 'junzibuqi'));
DELETE FROM scenes WHERE story_id IN ('sangumaolu', 'taoyuan', 'danaotiangong', 'sandabaigujing', 'zhenjiameihouwang', 'nuerguo', 'dazhanhonghaier', 'touchirenshenguo', 'jingweitianhai', 'houyisheri', 'kuafuzhuri', 'dayuzhishui', 'huangdizhan', 'yanhuitouzhou', 'weibiansanjue', 'zilushoujiao', 'shizherusi', 'junzibuqi');
DELETE FROM stories WHERE id IN ('sangumaolu', 'taoyuan', 'danaotiangong', 'sandabaigujing', 'zhenjiameihouwang', 'nuerguo', 'dazhanhonghaier', 'touchirenshenguo', 'jingweitianhai', 'houyisheri', 'kuafuzhuri', 'dayuzhishui', 'huangdizhan', 'yanhuitouzhou', 'weibiansanjue', 'zilushoujiao', 'shizherusi', 'junzibuqi');
DELETE FROM categories WHERE id IN ('sanguo', 'xiyou', 'shanhai');
  INSERT INTO categories (id, title, cover_image, sort_order) VALUES ('sanguoyanyi', '三国演义', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/covers/cover_sanguo.jpg', 1) ON CONFLICT (id) DO UPDATE SET sort_order=1, cover_image=EXCLUDED.cover_image;
  INSERT INTO categories (id, title, cover_image, sort_order) VALUES ('xiyouji', '西游记', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/covers/cover_xiyou.jpg', 2) ON CONFLICT (id) DO UPDATE SET sort_order=2, cover_image=EXCLUDED.cover_image;
  INSERT INTO categories (id, title, cover_image, sort_order) VALUES ('shanhaijing', '山海经', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/covers/cover_shanhai.jpg', 3) ON CONFLICT (id) DO UPDATE SET sort_order=3, cover_image=EXCLUDED.cover_image;
  INSERT INTO categories (id, title, cover_image, sort_order) VALUES ('lunyu', '论语', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/covers/cover_lunyu.jpg', 4) ON CONFLICT (id) DO UPDATE SET sort_order=4, cover_image=EXCLUDED.cover_image;
  INSERT INTO stories (id, category_id, title, description, ending_title, ending_description, sort_order) VALUES ('sangumaolu', 'sanguoyanyi', '三顾茅庐', '刘备三次拜访诸葛亮，求贤若渴，终得隆中对。', '如鱼得水', '刘备三顾茅庐，终得卧龙出山。此后君臣相知，如鱼得水，共创蜀汉基业。', 1) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, ending_title, ending_description, sort_order) VALUES ('taoyuan', 'sanguoyanyi', '桃园结义', '东汉末年，天下大乱。刘关张三人于桃园结义，共图大事。', '义薄云天', '三位英雄于桃园焚香结拜，誓同生死。一段波澜壮阔的三国史诗就此拉开序幕。恭喜你完成了这段历史的演绎。', 2) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, ending_title, ending_description, sort_order) VALUES ('danaotiangong', 'xiyouji', '大闹天宫', '孙悟空大闹天宫，挑战十万天兵天将。', '齐天大圣', '十万天兵难抵挡，定海神针显神威。这一战，打出了齐天大圣的赫赫威名，也种下了五百年被压五行山的因果。', 1) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('sandabaigujing', 'xiyouji', '三打白骨精 (敬请期待)', '白骨精三次变化戏弄唐僧，悟空火眼金睛识破妖魔。', 2) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('zhenjiameihouwang', 'xiyouji', '真假美猴王 (敬请期待)', '六耳猕猴假冒悟空，上天入地难辨真伪，终至如来佛祖处方显原形。', 3) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('nuerguo', 'xiyouji', '女儿国奇遇 (敬请期待)', '师徒误入西梁女国，唐僧在女王柔情与取经大业之间经受考验。', 4) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('dazhanhonghaier', 'xiyouji', '大战红孩儿 (敬请期待)', '红孩儿练成三昧真火，悟空难敌，请来观音菩萨方才收服。', 5) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('touchirenshenguo', 'xiyouji', '偷吃人参果 (敬请期待)', '万寿山五庄观，悟空偷吃人参果，推倒果树，惹怒镇元大仙。', 6) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, ending_title, ending_description, sort_order) VALUES ('jingweitianhai', 'shanhaijing', '精卫填海', '炎帝之女溺亡东海，化为精卫鸟，衔石填海，矢志不渝。', '坚韧不拔', '精卫衔微木，将以填沧海。刑天舞干戚，猛志固常在。你的坚持与毅力，正如这精卫鸟一般，令人动容。', 1) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('houyisheri', 'shanhaijing', '后羿射日 (敬请期待)', '十日并出，焦禾稼，杀草木。后羿张弓搭箭，射落九日，解救苍生。', 2) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('kuafuzhuri', 'shanhaijing', '夸父逐日 (敬请期待)', '夸父与日逐走，渴欲得饮，饮于河、渭；河、渭不足，北饮大泽，未至，道渴而死。', 3) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('dayuzhishui', 'shanhaijing', '大禹治水 (敬请期待)', '大禹率民治水，三过家门而不入，疏通九河，平定水患。', 4) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('huangdizhan', 'shanhaijing', '黄帝战蚩尤 (敬请期待)', '轩辕黄帝与蚩尤大战于逐鹿之野，风后设指南车破迷雾，最终统一华夏。', 5) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, ending_title, ending_description, sort_order) VALUES ('yanhuitouzhou', 'lunyu', '颜回偷粥', '孔子误会颜回偷食，终知真相。通过此事感叹“知人不易”。', '知人不易', '所信者目也，而目犹不可信；所恃者心也，而心犹不足恃。弟子记之，知人固不易矣。', 1) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('weibiansanjue', 'lunyu', '韦编三绝 (敬请期待)', '孔子晚年喜读《易》，韦编三绝。曰：“假我数年，五十以学《易》，可以无大过矣。”', 2) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('zilushoujiao', 'lunyu', '子路受教 (敬请期待)', '子路问政，孔子教之以先之劳之。子路性直，孔子常循循善诱。', 3) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('shizherusi', 'lunyu', '逝者如斯 (敬请期待)', '子在川上曰：“逝者如斯夫！不舍昼夜。” 感叹时光流逝，勉励弟子珍惜光阴。', 4) ON CONFLICT (id) DO NOTHING;
  INSERT INTO stories (id, category_id, title, description, sort_order) VALUES ('junzibuqi', 'lunyu', '君子不器 (敬请期待)', '孔子曰：“君子不器。” 意为君子博学多才，不应像器物一样只有单一用途。', 5) ON CONFLICT (id) DO NOTHING;
DO $$ DECLARE v_scene_id uuid; BEGIN
  -- sangumaolu
  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('sangumaolu', 1, '初访隆中', '汉末乱世，刘备求贤若渴，闻听司马徽推荐诸葛亮之名，遂携关羽、张飞前往隆中拜访。只见山不高而秀雅，水不深而澄清，地不广而平坦，林不大而茂盛。三人来到草庐门前，叩门问童子，童子应声而出。刘备恭敬询问先生所在。', 'A serene thatched cottage in the mountains, surrounded by pine and bamboo.', 'Liu Bei asking a young servant boy.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/sangumaolu/bg_01_visit1.png') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '硬闯草庐，搜寻孔明', false, '此非求贤之道！若这般无礼，只会惹怒高人，断送这段机缘。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '怏怏而回，改日再来', true, '童子言：“先生晨起自出……踪迹不定，不知何日归。”刘备听罢，怅然若失，只得嘱咐童子：“先生归时，可言刘备拜访。”遂上马而回。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '留关张守候，独自寻找', false, '山林广大，云深不知处，去何处寻找？且关张二人性急，若无人约束，只怕生事。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('sangumaolu', 2, '风雪再访', '时值隆冬，天降大雪。刘备探得孔明归家，不顾天寒地冻，冒雪再去。张飞曰：“天寒地冻，且非用兵之时，何必受此劳苦？”刘备呵斥之。至门前，闻草堂书声琅琅，刘备心中暗喜，以为即是孔明。', 'Snowy landscape, Liu Bei waiting respectfully outside.', 'Liu Bei standing in the snow.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/sangumaolu/bg_02_visit2.png') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '上前打断，表明来意', false, '此人乃是孔明之弟诸葛均。若贸然打断，显失礼数。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '大怒而去，不再复来', false, '若因一时挫折便轻言放弃，何以此诚心感动卧龙？天下三分之策恐成泡影。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '静候其毕，方才询问', true, '原来是诸葛均。孔明昨又应友人之约出门闲游去了。刘备虽失望，仍留书一封，以此明志：“备久慕高名，两次晋谒，不遇空回，惆怅何似……”', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('sangumaolu', 3, '三顾草庐', '开春之际，刘备选定吉期，斋戒沐浴，三往隆中。凡门，童子曰：“先生昼寝未醒。”刘备当即大喜，令关张在门外等候，自己轻步入内。见先生仰卧于草堂几席之上，那般神态安详。', 'Springtime at the cottage, peace and quiet.', 'Liu Bei waiting while Zhuge Liang sleeps.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/sangumaolu/bg_03_visit3.png') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '拱立阶下，静候惊觉', true, '刘备此时已年近五旬，却恭敬侍立半晌。直待孔明醒来，口占一绝：“大梦谁先觉？平生我自知。草堂春睡足，窗外日迟迟。”', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '令童子唤醒先生', false, '张飞曾欲放火烧屋逼其起床，被刘备喝止。求贤当诚心诚意，岂可稍有怠慢？', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '咳嗽示警，促其早醒', false, '虽未直接唤醒，但故意弄出声响亦是不敬。孔明虽醒，然见客心浮气躁，恐难真心相辅。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('sangumaolu', 4, '隆中对·相见', '孔明更衣出迎，见刘备气宇轩昂，诚意拳拳。分宾主坐定，童子献茶。刘备言：“汉室倾颓，奸臣窃命，主上蒙尘。备不量力，欲伸大义于天下，而智术浅短，迄无所就。惟先生开其愚而拯其厄。”', 'Interior of the cottage, simple but elegant. Liu Bei and Zhuge Liang sitting face to face.', 'Liu Bei bowing respectfully to Zhuge Liang.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/sangumaolu/bg_04_meeting.png') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '夸耀兵力，许以重金', false, '先生志在天下，非为金银所动。若以此相诱，反显得刘备目光短浅，俗不可耐。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '屏退左右，坦陈心迹', true, '刘备真情流露，泪沾袍袖。孔明感其诚意，乃曰：“将军既有如此大志，亮愿效犬马之劳。”', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '询问卜筮，测算吉凶', false, '孔明乃经天纬地之才，非江湖术士。问吉凶而非问大计，是看轻了先生。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('sangumaolu', 5, '隆中对·天下', '孔明命童子取出地图，指点江山，为刘备分析天下大势：“曹操已拥百万之众，挟天子以令诸侯，此诚不可与争锋。孙权据有江东，已历三世，此可以为援而不可图也。荆州北据汉、沔，利尽南海……”', 'Zhuge Liang pointing at a map of China, explaining the strategy.', 'Zhuge Liang pointing at the map.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/sangumaolu/bg_05_map.png') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '欲取中原，直捣许都', false, '此时曹操势大，若贸然北伐，无异于以卵击石。孔明之策，在先取基业，待天下有变。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '偏安一隅，以此终老', false, '刘备志在匡扶汉室，若只求偏安，何须三顾茅庐？亦非孔明出山之本意。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '拜谢先生，恳请出山', true, '先生未出草庐，已知三分天下。刘备顿首拜谢：“先生之言，顿开茅塞，如拨云雾而见青天！”', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('sangumaolu', 6, '平行时空：错失良机', '若非刘备这般三顾之诚，诸葛亮恐终老林泉，或许汉室难兴，三国历史也将改写。', 'An old man fishing by the river, forgotten by history.', 'Zhuge Liang fishing alone.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/sangumaolu/bg_06_bad_missed.png') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '重新来过，诚心求贤', true, '精诚所至，金石为开。', 1);


END $$;
DO $$ DECLARE v_scene_id uuid; BEGIN
  -- taoyuan
  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('taoyuan', 1, '榜文叹息', '东汉末年，黄巾造反，天下大乱。幽州太守刘焉出榜招募义兵。榜文行至涿县，引得百姓围观。人群中有一人，生得身长七尺五寸，两耳垂肩，双手过膝，目能自顾其耳，面如冠玉，唇若涂脂。他看罢榜文，不仅长叹一声。', 'A crowded market place in ancient China, viewing a government notice on a wall.', 'Liu Bei sighing at the notice.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/taoyuan/bg_01_notice.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '置之不理，自行离去', false, '玄德以此为傲？非也。刘备虽乃汉室宗亲，然此时落魄，且素以此待人接物。若傲慢离去，便无后来之桃园佳话。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '忧国忧民，感时伤怀', true, '玄德这一长叹，满腹心事尽在其中。这一叹，却引得身后一人厉声高喝。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '撕下皇榜，以此明志', false, '此非玄德所为。刘备性格宽仁沉稳，非鲁莽之辈。撕榜乃狂徒行径，不合其皇叔身份与性格。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('taoyuan', 2, '壮士呵斥', '忽闻背后一人厉声喝道：“大丈夫不与国家出力，何故长叹？”', 'Market place, Liu Bei turning around to face a tall warrior.', 'Zhang Fei shouting at Liu Bei from behind.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/taoyuan/bg_02_encounter.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '置之不理，自行离去', false, '豪杰相逢，岂可交臂失之？若此时离去，便错失了这位万人敌的猛将。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '回首询问，结识壮士', true, '玄德回视其人，见身长八尺，豹头环眼，燕颔虎须，声若巨雷，势如奔马。此乃张飞张翼德也。二人志趣相投，遂同入村店饮酒。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '反唇相讥，责其无礼', false, '玄德宽厚，不喜与人争执。且见此人相貌堂堂，必非凡俗，岂会因言语粗鲁而见怪？', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('taoyuan', 3, '酒肆英雄', '玄德与那壮士入酒肆对饮，那人道姓张名飞，颇有家资，愿结交天下豪杰。正饮间，见一大汉推车入店，入座便唤酒保：“快斟酒来吃，我待赶入城去投军！”玄德看其人：身长九尺，髯长二尺；面如重枣，唇若涂脂；丹凤眼，卧蚕眉；相貌堂堂，威风凛凛。', 'Inside a rustic ancient tavern, wooden tables and jars of wine.', 'Guan Yu entering majestically.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/taoyuan/bg_03_guanyu.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '邀其同坐，共谋大事', true, '玄德见其威仪，心知非凡人，遂邀其同坐。关公此时正欲投军，三人一见如故，共叙抱负。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '暗中观察，不做声张', false, '玄德求贤若渴，见此英雄岂有交臂失之理？若不主动相邀，关公饮罢便去，何来桃园三结义？', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '张飞邀战，比试武艺', false, '演义之中，三人相遇乃是惺惺相惜，并未动武。酒肆比武多为民间评书野史演绎，非正统情节。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('taoyuan', 4, '志同道合', '三人互通姓名，关羽道出因杀势豪而亡命江湖。谈及天下大势，三人皆欲破贼安民，恨无门路。张飞大喜，提议道：“吾庄后有一桃园，花开正盛；明日当于园中祭告天地，我三人结为兄弟，协力同心，然后可图大事。”', 'Close up conversation at the table, animated gestures.', 'Three heroes discussing passionately.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/taoyuan/bg_04_tavern_talk.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '推辞不受，恐有不妥', false, '玄德虽谦，然胸怀大志。今得两员虎将相助，正如鱼得水，岂有推辞之理？', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '即刻结拜，不需祭礼', false, '古人重礼。结义乃大事，需祭告天地表心迹。张飞虽粗中有细，亦知需择吉地（桃园）备祭礼，方显庄重。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '欣然应允，约定明日', true, '玄德、云长齐声应曰：“如此甚好。” 所谓千金易得，知己难求。三人意气相投，以此定下盟约。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('taoyuan', 5, '桃园备祭', '次日，于张飞庄后桃园中，备下乌牛白马，祭礼等项。时值桃花盛开，景色绚烂。三人焚香再拜。誓曰：“念刘备、关羽、张飞，虽然异姓，既结为兄弟，则同心协力，救困扶危；上报国家，下安黎庶。”', 'A beautiful peach garden in full bloom, altar prepared.', 'Three men standing before an altar.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/taoyuan/bg_05_oath_moment.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '按武艺高低排座次', false, '桃园结义论的是年岁长幼，而非武力高低。若论武力，恐难分伯仲，且伤兄弟和气。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '立誓毕，按年岁结拜', true, '誓毕，拜玄德为兄，关羽次之，张飞为弟。长幼有序，礼之大本。此顺序定下三人终身之名分。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '推举家资厚者为兄', false, '张飞虽颇有家资，然结义看重的是志向与德行，且玄德乃汉室宗亲，年岁亦长，故尊为兄。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('taoyuan', 6, '义薄云天', '誓毕，宰牛设酒，聚乡中勇士，得三百余人，于桃园中痛饮一醉。以此为始，以此为基。收拾兵器，招兵买马。更有中山大商张世平、苏双等，资助良马五十匹，金银五百两，镔铁一千斤。玄德以此打造双股剑，关羽造青龙偃月刀，张飞造丈八蛇矛。', 'Feasting in the garden, weapons being forged in background.', 'Celebration and preparation for war.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/taoyuan/bg_06_feasting.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '留守桃园，独霸一方', false, '结义初衷乃是“上报国家，下安黎庶”。若只知割据一方，便成草寇，非英雄所为。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '散尽钱财，归隐田园', false, '乱世已至，大丈夫当提三尺剑立不世之功。三人皆世之豪杰，岂肯老死于林泉之下？', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '整顿军马，投邹靖平乱', true, '大功告成。三人收拾军马，投幽州太守刘焉处（校尉邹靖引之），正式踏上平定黄巾、争霸天下的征途。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('taoyuan', 7, '平行时空：孤身落魄', '虽有心报国，然行差踏错，终是孤身一人。桃园之义未成，天下大势亦随之而变...', 'Lonely figure walking away in the snow.', 'Liu Bei walking away alone.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/sanguoyanyi/taoyuan/bg_07_bad_lonely.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '重新来过', true, '往事已矣，来者可追。', 1);


END $$;
DO $$ DECLARE v_scene_id uuid; BEGIN
  -- danaotiangong
  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('danaotiangong', 1, '龙宫借宝', '孙悟空学艺归来，占山为王，虽有神通，却手无寸铁。闻听东海龙宫宝物众多，遂入海求兵。老龙王先后奉上大捍刀、九股叉、画杆方天戟，悟空皆大摇其头，嫌兵器太轻，不称手。', 'Splendid underwater Dragon Palace with various weapons displayed.', 'Sun Wukong rejecting conventional weapons.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/danaotiangong/bg_01_dragon_palace.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '强行索要，大闹龙宫', false, '虽显威风，然龙王也是一方神祗。若无理取闹，只怕引来看守海藏的神将围攻，反倒不美。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '既然无宝，转身离去', false, '好不容易来此一遭，若空手而归，确是可惜。且龙宫必有异宝，只恨未曾得见。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '询问更有何宝物', true, '龙女献策，道海藏中有一块天河定底神珍铁。龙王虽不舍，却也无奈，只得带悟空去见识。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('danaotiangong', 2, '定海神针', '龙王领悟空至海藏中间，忽见金光万道。那是一根铁柱，约有斗来粗庆。悟空尽力一拔，那柱子便动了一动。悟空喜道：“再细些更妙！”那宝贝果然细了一圈。连叫几声，直到碗口粗细。细看有一行字：“如意金箍棒，重一万三千五百斤”。', 'The massive Golden Cudgel glowing in the depths of the sea.', 'Sun Wukong marveling at the magical weapon.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/danaotiangong/bg_02_golden_cudgel.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '嫌太重，放回原处', false, '此宝虽然沉重，却正是为你量身打造。若弃之不用，只怕再难寻得这般趁手兵器。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '变作绣花针，藏于耳内', true, '妙哉！此宝能大能小，随心变化。悟空将其变作绣花针塞入耳中，谢过龙王，大笑而去。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '扛起铁柱，径直打出', false, '虽有神力，然扛着如此巨物行走，终究不便。且宝物灵性，不知变化运用，仅做凡铁使唤，岂不暴殄天物？', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('danaotiangong', 3, '地府销名', '悟空得了金箍棒，日日在花果山操练，好不快活。一日醉卧松阴，魂魄被黑白无常勾至幽冥界。悟空醒来大怒，掏出金箍棒，一路打入森罗殿，逼十代冥王取出此时生死簿。', 'Gloomy Underworld court with terrified judges.', 'Sun Wukong checking the Book of Life and Death.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/danaotiangong/bg_03_underworld.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '只勾去自己名字', false, '虽得长生，然猴属同类仍受轮回之苦。既来之，何不惠及子孙？', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '尽销猴属之名', true, '悟空提起笔，把猴属之类有名者，一概勾之。大笑扔笔：“了帐！了帐！今番不伏你管了！”一路棒打出幽冥界。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '大闹地府，推翻冥王', false, '地府乃三界轮回之所，若将其毁坏，致使阴阳失序，罪孽深重，必遭天谴。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('danaotiangong', 4, '官封弼马', '龙王、冥王上天告状。玉帝欲遣兵捉拿，太白金星主张招安。悟空受诏上天，被封为“弼马温”。初时不知官小，日夜在御马监殷勤看守。半月后，宴请同僚，忽问此官品级。', 'Heavenly stables with divine horses.', 'Sun Wukong interacting with celestial horses.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/danaotiangong/bg_04_stables.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '嫌官小，打出南天门', true, '悟空闻言大怒：“这般渺视老孙！老孙在花果山，称王称祖，怎么哄我来替他养马？” 推倒公案，耳中取出宝贝，一路打出天门去了。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '忍气吞声，继续养马', false, '齐天大圣其实池中之物？若甘心养马，便失了那一身傲骨与灵性。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '上书玉帝，请求升迁', false, '天庭等级森严，岂容你轻易讨价还价？且悟空生性急躁，哪耐得住这般繁文缛节。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('danaotiangong', 5, '蟠桃盛会', '悟空回山自封“齐天大圣”。玉帝无奈，只得承认其号，令看管蟠桃园。一日，七仙女来摘桃，言王母设宴请众仙，并未请大圣。悟空大怒，定住七仙女，奔瑶池痛饮仙酒，又偷吃了太上老君的仙丹。', 'Celestial banquet hall in disarray.', 'Sun Wukong drunk and causing chaos.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/danaotiangong/bg_05_banquet.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '酒醒惧罪，逃回下界', true, '悟空酒醒，自知闯下大祸：“不好！不好！这场祸比天大，若惊动玉帝，性命难存。走！走！走！” 遂逃回花果山。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '在此等候，向玉帝请罪', false, '偷桃盗丹，搅乱蟠桃会，罪在不赦。若在此等候，正是自投罗网。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '大闹瑶池，挑战群仙', false, '此时孤身一人，若在此大闹，引来漫天神佛围攻，只怕插翅难逃。不如先避其锋芒。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('danaotiangong', 6, '大战天兵', '玉帝大恼，命四大天王、李靖、哪吒，点十万天兵天将，布下十八架天罗地网，下界捉拿悟空。双方在花果山一场恶战。悟空使出法天象地神通，杀得天兵丢盔弃甲。', 'Epic battlefield between Monkey King and Heavenly Army.', 'Sun Wukong fighting heroically.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/danaotiangong/bg_06_battle.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '乘胜追击，杀上天庭', false, '虽一时得胜，然天庭底蕴深厚，高手如云。若孤军深入，必陷绝境。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '苦战不退，力竭被擒', false, '二郎神杨奇赶来助战，又有太上老君暗中偷袭。悟空虽勇，终究双拳难敌四手。然此非结局，乃是另一段传奇的开始。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '且战且退，静观其变', true, '这一战，打出了齐天大圣的威名！虽最终被擒，然大闹天宫之举，已震动三界，成就千古美名。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('danaotiangong', 7, '平行时空：皈依', '若当初不至龙宫寻宝、地府销名、不闹天宫，安分守己做个弼马温，或许便是另一番光景。但这，还是那个敢爱敢恨、无法无天的齐天大圣吗？', 'Sun Wukong looking bored in heaven.', 'Sun Wukong as a celestial bureaucrat.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/xiyouji/danaotiangong/bg_07_bad_boring.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '重新来过，再闹天宫！', true, '哪怕被压五百年，哪怕历经九九八十一难，俺老孙也绝不后悔！', 1);


END $$;
DO $$ DECLARE v_scene_id uuid; BEGIN
  -- jingweitianhai
  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('jingweitianhai', 1, '离家远游', '上古之时，炎帝神农氏有一爱女，名曰女娃。女娃生性活泼，向往自由。一日，她遥望日出之东方，只见云蒸霞蔚，心中顿生向往，意欲前往东海一游。', 'Morning mist in the mountains, a young girl looking towards the east.', 'Nuwa standing on a hill, looking hopeful.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/shanhaijing/jingweitianhai/bg_01_departure.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '留恋家园，放弃远行', false, '若不出行，虽得安稳，却永远无法见识那广阔的天地。但这不符合女娃的性格。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '辞别父亲，奔赴东海', true, '女娃拜别父亲，踏上了前往东海的旅途。一路山高水长，她却不知疲倦。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '邀请伙伴，从长计议', false, '时光不等人，若事事都要万全准备，恐怕这辈子都走不出这大山。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('jingweitianhai', 2, '泛舟戏水', '历经跋涉，女娃终于抵达东海之滨。只见碧波万顷，海天一色。她寻得一叶扁舟，独自划入海中。海风轻拂，波光粼粼，女娃只觉心旷神怡，从未有过的畅快。', 'A beautiful young girl sailing a small boat on a calm sea.', 'Nuwa enjoying the sea breeze.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/shanhaijing/jingweitianhai/bg_02_sailing.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '无论是岸边，还是浅滩', false, '既已入海，岂能只在浅滩徘徊？', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '收帆垂钓，静享安宁', false, '大海变幻莫测，此刻虽宁静，却非久居之地。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '深入大海，探寻奇景', true, '大海深处仿佛有神秘的呼唤，女娃不知不觉间已离岸甚远。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('jingweitianhai', 3, '风暴突袭', '原本平静的海面骤然变色，乌云压顶，狂风大作。平静的东海瞬间化为吞噬万物的巨兽。巨浪滔天，狠狠地拍打着那如树叶般脆弱的小舟。', 'Dark storm clouds, massive waves, a small boat in danger.', 'Nuwa struggling to control the boat.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/shanhaijing/jingweitianhai/bg_03_storm.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '奋力划桨，与浪搏斗', true, '女娃虽然年幼，却有着炎帝血脉中的倔强，她试图稳住小舟，但人力终究难抗天威。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '闭目祈祷，听天由命', false, '坐以待毙绝非她的性格，即便面对绝境，也要抗争到底。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '弃船求生，跳入海中', false, '在这惊涛骇浪之中，离开船只无异于自寻死路。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('jingweitianhai', 4, '溺水化鸟', '轰隆一声巨响，一个如山般的巨浪拍下，小舟瞬间支离破碎。女娃落入冰冷的海水中，渐渐沉没。然而，她的身躯虽殁，怨愤之气不散，精魂化为一只白喙赤足的小鸟，名曰“精卫”。', 'Stormy sea, a bird rising from the waves.', 'Jingwei bird flying defiantly.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/shanhaijing/jingweitianhai/bg_04_transformation.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '哀鸣离去，躲避大海', false, '它既已重生，便不再畏惧。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '衔石填海，矢志不渝', true, '精卫发出凄厉的鸣叫，发誓要填平这夺去她性命的大海！', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '潜入海底，寻找肉身', false, '肉身已逝，唯有精神长存。此时回头已无意义。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('jingweitianhai', 5, '衔石西山', '发鸠之山，其上多柘木。精卫以此为家，日复一日，往返于西山与东海之间。它衔来西山的木石，投得东海之中。路途遥远，风雨无阻，羽毛凌乱，足底流血，亦不肯停歇片刻。', 'Bird carrying a stone flying over mountains.', 'Exhausted but determined bird.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/shanhaijing/jingweitianhai/bg_05_labor.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '稍作休息，养精蓄锐', false, '每一刻的停歇，都让精卫觉得是对仇恨的遗忘，它不肯停。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '寻求帮手，共填沧海', false, '这是属于她一个人的战斗，也是她一个人的执念，哪怕孤独，也要坚持。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '坚持不懈，日夜往复', true, '沧海桑田，精卫的身影从未消失。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('jingweitianhai', 6, '千古誓言', '惊涛骇浪嘲笑它：“尔一小鸟，纵千百万年，也难填平我这汪洋大海。” 精卫在高空厉声回视：“纵使千万年，甚至亿万年，我也誓将你填平，以免你再害他人少年！”', 'Jingwei dropping stones into the vast ocean.', 'Determined bird carrying a stone.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/shanhaijing/jingweitianhai/bg_06_oath.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '与海谈判，祈求和平', false, '大海无情，岂会因为言语而改变？唯有行动能证明一切。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '子孙相继，永不放弃', true, '这种撼动天地的意志，令大海也不禁为之颤抖。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '沉默不语，专心投石', false, '虽无言亦有力，但此刻的誓言，是对天地的宣告。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('jingweitianhai', 7, '精神永存', '后来，人们常用“精卫填海”来比喻意志坚决，不畏艰难。那只白喙赤足的小鸟，成为了中华民族不屈不挠精神的象征，千古流传。', 'A symbolic image of the bird and the filled sea (abstract).', 'Legendary status.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/shanhaijing/jingweitianhai/bg_07_legacy.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '重读经典，再悟精神', true, '故事虽短，精神长存。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '讲述故事，传承后人', false, '将这精神代代相传，或许比填平大海更有意义。(游戏结束)', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '仰望星空，追忆往昔', false, '星空之下，是否还有那只倔强的小鸟在飞翔？(游戏结束)', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('jingweitianhai', 8, '平行时空：安度一生', '若当日女娃听从父命，未去东海，或许她能承欢膝下，无忧无虑度过一生。世间少了一段凄美的神话，却多了一个幸福的少女。但那样的女娃，还是那个向往自由的灵魂吗？', 'Nuwa playing happily in the fields.', 'Nuwa living a peaceful life.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/shanhaijing/jingweitianhai/bg_08_bad_safe.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '享受平凡，相夫教子', false, '这也是一种幸福，只是少了那份惊心动魄。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '梦回东海，心存遗憾', false, '既然选择了安逸，便只能在梦中寻找那片海。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '重新来过，再化精卫', true, '有些命运，或许注定要燃烧自己，照亮后人。', 3);


END $$;
DO $$ DECLARE v_scene_id uuid; BEGIN
  -- yanhuitouzhou
  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('yanhuitouzhou', 1, '绝粮陈蔡', '孔子困于陈蔡之间，绝粮七日，弟子无论老少皆有饥色。唯颜回依然神态自若，每日依旧读书习礼，并设法讨得少许米粮煮粥。', 'A dilapidated temple, Confucius and disciples looking hungry and weak.', 'Yan Hui cooking porridge quietly.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/yanhuitouzhou/bg_01_hungry.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '安贫乐道', true, '君子固穷，小人穷斯滥矣。越是困境，越能磨炼心性，颜回深得夫子之道。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '质疑师道', false, '子路曾问：“君子亦有穷乎？”若因一时困顿而动摇信念，便非真君子。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '甚至想要离开', false, '患难见真情，此时离去，不仅背弃师门，更背弃了自己的道义。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('yanhuitouzhou', 2, '颜回讨米', '颜回几经周折，终于讨回一些米来煮粥。大家早已饥肠辘辘，都在焦急地等待。', 'Yan Hui cooking near a simple stove.', 'Yan Hui focused on cooking.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/yanhuitouzhou/bg_02_cooking.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '小心看火', true, '米粮来之不易，需得全神贯注，确保粥熟且不浪费，这也是一种修行。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '因为饥饿难耐', false, '虽饥肠辘辘，但颜回克己复礼，绝不会在师长未食之前因私欲而失态。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '心生怨怼', false, '颜回为人谦冲，即使身处逆境，也绝无怨言，只会默默承担。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('yanhuitouzhou', 3, '意外发生', '粥快熟时，忽有一阵风吹来，屋顶上的灰尘掉进了锅里。颜回连忙用勺子将脏了的粥舀出来。', 'Dust falling into the pot.', 'Yan Hui looking concerned.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/yanhuitouzhou/bg_03_accident.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '惜食吞粥', true, '“一箪食，一瓢饮，在陋巷，人不堪其忧，回也不改其乐。”颜回深知物力维艰，故不忍丢弃，虽然不洁，宁可自己吃下。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '倒掉脏粥', false, '此时绝粮七日，每一粒米都关乎性命，岂能轻易倒掉？此举虽合卫生，却不合时宜。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '搅拌掩饰', false, '若将灰尘拌入粥中呈给夫子，便是欺师；若自己食用却不言明，亦非诚实之道。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('yanhuitouzhou', 4, '孔子试探', '孔子远远看见颜回似乎在偷吃，心中不悦，但没有当面发作。待颜回端粥送上时，孔子故意说道：“刚才我梦见了先君，这粥若是洁净的，就先拿去祭祀吧。”', 'Confucius testing Yan Hui.', 'Confucius looking stern but calm.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/yanhuitouzhou/bg_04_test.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '据实以告', true, '颜回坦荡答道：“不可！刚才有灰尘掉进锅里，我怕浪费便吃了，这粥已不洁，不能祭祀了。”诚实乃君子之本。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '顺从师命', false, '祭祀讲究“诚”与“洁”。若明知粥不洁而献祭，是大不敬；若隐瞒实情，是欺师。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '惶恐认错', false, '颜回所为并非错事，而是惜物之举，何须惶恐？只需如实说明即可。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('yanhuitouzhou', 5, '误会冰释', '孔子听后感叹道：“原本我只相信眼睛看到的，可亲眼所见也未必是真相；原本我只依靠内心的推测，可内心有时也会不可靠。大家要记住，了解一个人真的不容易啊！”', 'Confucius teaching his disciples.', 'All disciples listening with respect.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/yanhuitouzhou/bg_05_resolution.jpg') RETURNING id INTO v_scene_id;
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '深信不疑', true, '信任非一日之功，需经得起误解与考验。师徒之间，贵在相知相信。', 1);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '眼见为实', false, '孔子今日之教，正是要破除“眼见为实”的执念。心之所感，往往比眼之所见更为真实。', 2);
  INSERT INTO scene_options (scene_id, text, is_correct, feedback, sort_order) VALUES (v_scene_id, '心存芥蒂', false, '误会既已冰释，道理也已讲明，若仍存芥蒂，便枉费了夫子的一番教诲。', 3);


  INSERT INTO scenes (story_id, scene_index, title, narrative, environment_description, character_state, image_url) VALUES ('yanhuitouzhou', 6, '信任崩塌', '若孔子当时未能查明真相，或者颜回未能即使解释，一代贤人恐蒙不白之冤。师徒之间若无信任，道义何存？信任一旦破裂，便如覆水难收，令人扼腕叹息。', 'Yan Hui walking away, Confucius looking regretful.', 'Sadness and separation.', 'https://yvftzwxiiyhheaoykxgc.supabase.co/storage/v1/object/public/story-assets/lunyu/yanhuitouzhou/bg_06_bad.jpg') RETURNING id INTO v_scene_id;


END $$;