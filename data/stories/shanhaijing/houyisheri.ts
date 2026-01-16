import { IGameScene } from '../../../types';

export const HOUYISHERI_SCENES: IGameScene[] = [
    {
        id: 1,
        title: '十日并出',
        narrative: '东方海外，汤谷之中，原有十个太阳，每日轮流值守，照耀大地。然一日，十日竟一同升起，化作十只金乌在天空嬉戏。瞬间大地干裂，河流枯竭，草木焦黄，百姓苦不堪言。',
        environmentDescription: 'Ten suns scorching the earth, rivers drying up, people suffering.',
        characterState: 'People looking at the sky in despair.',
        imageUrl: '/assets/shanhaijing/houyisheri/bg_01_ten_suns.jpg',
        options: [
            {
                text: '躲入地穴，苟且偷生',
                isCorrect: false,
                feedback: '虽可暂避一时，然大地若毁，地穴岂能独存？且坐视苍生受难，非勇者所为。'
            },
            {
                text: '祈求上苍，降雨灭火',
                isCorrect: false,
                feedback: '天帝帝俊乃十日之父，此时正纵容诸子。祈求无用，唯有抗争。'
            },
            {
                text: '挺身而出，寻找救法',
                isCorrect: true,
                feedback: '在这绝望之际，神射手后羿看着受难的百姓，紧握手中彤弓素箭，眼中燃起怒火。'
            }
        ]
    },
    {
        id: 2,
        title: '帝尧之请',
        narrative: '人间帝王尧见百姓死伤惨重，痛心疾首，遂请天神后羿下界除害。后羿领命，来到昆仑之巅，张弓搭箭，直指苍穹。',
        environmentDescription: 'Emperor Yao pleading with Hou Yi, Hou Yi holding a bow.',
        characterState: 'Hou Yi preparing to shoot.',
        imageUrl: '/assets/shanhaijing/houyisheri/bg_02_emperor_plea.jpg',
        options: [
            {
                text: '直接射杀，不留情面',
                isCorrect: false,
                feedback: '先礼后兵乃君子之风。金乌虽顽劣，毕竟是神灵之子，应先予警告。'
            },
            {
                text: '鸣镝示警，劝其归去',
                isCorrect: true,
                feedback: '后羿射出一支鸣镝，划破长空，意在警告金乌速速归去，勿再为祸人间。'
            },
            {
                text: '畏惧天帝，不敢开弓',
                isCorrect: false,
                feedback: '后羿也就是因为这份刚正不阿，才会被贬下凡。既已领命，何惧之有？'
            }
        ]
    },
    {
        id: 3,
        title: '金乌顽劣',
        narrative: '那十只金乌见鸣镝飞来，不仅不惧，反而更加肆无忌惮，甚至向后羿喷吐真火，嘲笑其不自量力。',
        environmentDescription: 'Golden crows mocking Hou Yi, spitting fire.',
        characterState: 'Hou Yi angered by the crows\' arrogance.',
        imageUrl: '/assets/shanhaijing/houyisheri/bg_03_mockery.jpg',
        options: [
            {
                text: '再次警告，苦口婆心',
                isCorrect: false,
                feedback: '此时再言，已被其视为软弱。对付这等顽劣之徒，言语已是无用。'
            },
            {
                text: '愤而开弓，射落一日',
                isCorrect: true,
                feedback: '忍无可忍，无需再忍！后羿脚踏大地，手挽雕弓，满月崩弦，一箭射出！'
            },
            {
                text: '求助天帝，管教诸子',
                isCorrect: false,
                feedback: '远水难救近火。况且天帝帝俊若肯管教，何至于此？'
            }
        ]
    },
    {
        id: 4,
        title: '九日坠落',
        narrative: '只听一声惨叫，一只金乌中箭坠落，化为三足乌鸦，身上的火焰瞬间熄灭。余下九日大惊，四散奔逃。后羿神威大发，连珠箭发，一口气又射落八只。',
        environmentDescription: 'Suns falling from the sky one by one.',
        characterState: 'Hou Yi shooting arrows in rapid succession.',
        imageUrl: '/assets/shanhaijing/houyisheri/bg_04_falling_suns.jpg',
        options: [
            {
                text: '乘胜追击，射杀殆尽',
                isCorrect: false,
                feedback: '万物生长靠太阳。若十日皆亡，大地将陷入永恒的黑暗与严寒，亦是一场浩劫。'
            },
            {
                text: '因生怜悯，停手不射',
                isCorrect: false,
                feedback: '剩下那只若不给足教训，难保日后不故态复萌。此时停手，尚嫌太早。'
            },
            {
                text: '欲射最后一日',
                isCorrect: true,
                feedback: '后羿搭上最后一支箭，瞄准了最后那只瑟瑟发抖的金乌。'
            }
        ]
    },
    {
        id: 5,
        title: '万物复苏',
        narrative: '正当此时，尧帝急忙拦住后羿：“壮士留步！若无太阳，万物亦无法生存。”后羿闻言收弓。最后一只金乌死里逃生，发誓从此每日按时升起，造福万物。从此，风调雨顺，万物复甦。',
        environmentDescription: 'A single sun in the sky, rain falling, plants growing.',
        characterState: 'People celebrating, Hou Yi putting away his bow.',
        imageUrl: '/assets/shanhaijing/houyisheri/bg_05_salvation.jpg',
        options: [
            {
                text: '居功自傲，索要赏赐',
                isCorrect: false,
                feedback: '后羿射日乃为苍生，非为私利。英雄之所以为英雄，在于其无私。'
            },
            {
                text: '归隐山林，不问世事',
                isCorrect: false,
                feedback: '后羿虽立大功，但人世间尚有凿齿、九婴等妖兽为祸，英雄的使命尚未结束。'
            },
            {
                text: '继续除害，造福苍生',
                isCorrect: true,
                feedback: '后羿收拾弓箭，又踏上了铲除妖兽、守护大地的征途。他的名字，被后世永远铭记。'
            }
        ]
    },

];
