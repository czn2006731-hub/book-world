(function() {

// ─── 书籍体验数据 ─────────────────────────────────
const CHAR_DATA = {
  '三体': { name:'叶文洁', role:'天体物理学家', avatar:'🌌', hp:85, mood:60, moodText:'忧虑', status:'警觉', desc:'红岸基地首席科学家，内心背负着沉重的过去。' },
  '流浪地球': { name:'刘培强', role:'空间站宇航员', avatar:'🚀', hp:90, mood:55, moodText:'焦虑', status:'决绝', desc:'为了人类的未来，他做出了最艰难的选择。' },
  '基地': { name:'哈里·谢顿', role:'心理史学家', avatar:'📐', hp:70, mood:75, moodText:'沉稳', status:'运筹帷幄', desc:'银河帝国最伟大的数学家，预言了帝国的衰亡。' },
  '沙丘': { name:'保罗·厄崔迪', role:'沙漠救世主', avatar:'🏜️', hp:95, mood:65, moodText:'坚定', status:'觉醒中', desc:'命运之子，即将在沙漠中觉醒真正的力量。' },
  '神经漫游者': { name:'凯斯', role:'黑客/牛仔', avatar:'💻', hp:60, mood:40, moodText:'绝望', status:'渴望', desc:'失去赛博空间能力的黑客，渴望重返数据之海。' },
  '你一生的故事': { name:'路易斯·班克斯', role:'语言学家', avatar:'✍️', hp:80, mood:70, moodText:'平静', status:'觉悟', desc:'学会了外星语言，预见了自己完整的一生。' },
  '1984': { name:'温斯顿·史密斯', role:'真理部职员', avatar:'📝', hp:55, mood:30, moodText:'恐惧', status:'压抑', desc:'在极权统治下秘密反抗，内心充满矛盾。' },
  '美丽新世界': { name:'伯纳德·马克思', role:'阿尔法级', avatar:'🧪', hp:75, mood:45, moodText:'不满', status:'迷茫', desc:'对"完美世界"产生质疑的觉醒者。' },
  '时间简史': { name:'斯蒂芬·霍金', role:'理论物理学家', avatar:'🔭', hp:40, mood:80, moodText:'豁达', status:'坚韧', desc:'身体受限但思维无限，探索宇宙最深处的奥秘。' },
  '斗破苍穹': { name:'萧炎', role:'斗者', avatar:'🔥', hp:88, mood:50, moodText:'愤怒', status:'蛰伏', desc:'从天才沦为废物，誓要逆天改命。' },
  '凡人修仙传': { name:'韩立', role:'七玄门弟子', avatar:'🌿', hp:82, mood:65, moodText:'谨慎', status:'修炼中', desc:'资质平庸却心志坚韧的修仙者。' },
  '遮天': { name:'叶凡', role:'地球修行者', avatar:'☀️', hp:92, mood:60, moodText:'震撼', status:'觉醒', desc:'同学聚会上遭遇天地巨变，踏上修仙之路。' },
  '完美世界': { name:'石昊', role:'荒域少年', avatar:'⚔️', hp:95, mood:75, moodText:'无畏', status:'战斗', desc:'大荒走出的少年，追求极致的力量。' },
  '仙逆': { name:'王林', role:'恒岳派弟子', avatar:'💫', hp:78, mood:55, moodText:'坚毅', status:'逆天而行', desc:'以凡人之躯踏入修仙之路的传奇。' },
  '一念永恒': { name:'白小纯', role:'灵溪宗弟子', avatar:'💊', hp:70, mood:35, moodText:'害怕', status:'逞强', desc:'怕死却走上修仙路的矛盾少年。' },
  '大主宰': { name:'牧尘', role:'大炎帝国少年', avatar:'👑', hp:90, mood:70, moodText:'期待', status:'觉醒中', desc:'体内蕴含远古血脉力量的少年。' },
  '武动乾坤': { name:'林动', role:'符师', avatar:'⚡', hp:85, mood:60, moodText:'专注', status:'传承中', desc:'即将获得祖符传承的符师传人。' },
  '剑来': { name:'陈平安', role:'剑修', avatar:'🗡️', hp:88, mood:70, moodText:'沉静', status:'行走', desc:'小镇少年，一把剑走天涯。' },
  '雪中悍刀行': { name:'徐凤年', role:'北凉王世子', avatar:'⚔️', hp:92, mood:65, moodText:'豪迈', status:'归来', desc:'江湖庙堂，皆在一刀之间。' },
  '微微一笑很倾城': { name:'贝微微', role:'计算机系学生', avatar:'🎮', hp:95, mood:85, moodText:'甜蜜', status:'恋爱中', desc:'游戏里的女侠，现实中的学霸。' },
  '何以笙箫默': { name:'赵默笙', role:'摄影师', avatar:'📷', hp:80, mood:45, moodText:'感伤', status:'归来', desc:'七年后回到故土，重遇曾经的爱人。' },
  '致青春': { name:'郑微', role:'大学生', avatar:'🌸', hp:90, mood:70, moodText:'憧憬', status:'青春', desc:'即将遇到改变她一生的两个人。' },
  '你好旧时光': { name:'余周周', role:'高中生', avatar:'📖', hp:92, mood:80, moodText:'温暖', status:'成长', desc:'旧时光里的每一个人都是最好的。' },
  '最美的时光': { name:'苏蔓', role:'职场精英', avatar:'💼', hp:82, mood:50, moodText:'复杂', status:'重逢', desc:'在爱情与事业之间寻找答案。' },
  '三生三世十里桃花': { name:'白浅', role:'青丘帝姬', avatar:'🍑', hp:88, mood:60, moodText:'淡然', status:'守护', desc:'三世纠葛，只想守护青丘安宁。' },
  '花千骨': { name:'花千骨', role:'花妖之女', avatar:'🌺', hp:75, mood:30, moodText:'心碎', status:'决绝', desc:'被逐出师门，即将做出惊天决定。' },
  '杉杉来了': { name:'薛杉杉', role:'封腾集团职员', avatar:'🍱', hp:95, mood:80, moodText:'幸福', status:'被投喂', desc:'呆萌小职员与霸道总裁的甜蜜日常。' },
  '十年一品温如言': { name:'言温衡', role:'言家少爷', avatar:'💔', hp:70, mood:35, moodText:'心痛', status:'守候', desc:'十年如一日，从未改变。' },
  '那些年': { name:'柯景腾', role:'高中生', avatar:'🎓', hp:90, mood:65, moodText:'青涩', status:'暗恋', desc:'每个人都有自己的青春故事。' }
};

const BOOK_EXPERIENCES = {
  '三体': {
    opening: '你现在是叶文洁，身处红岸基地的控制室中。面前的巨型天线正对着寂静的星空。你刚刚向宇宙发出了一条信息，现在，你正在等待回复。手指微微颤抖，你知道这一刻将改变人类的命运。',
    actions: ['凝视星空', '检查接收设备', '回想往事'],
    responses: {
      '凝视星空': '你抬头望向无垠的夜空。繁星点点，冷冽而永恒。在那无数光年之外，是否有文明正在聆听？你的内心既恐惧又期待。这一刻，你是人类历史上最孤独的人。',
      '检查接收设备': '你检查着接收器的各项参数。信号增益正常，频率锁定准确。突然，屏幕上闪过一个微弱的波形——那是来自太空的回应。你的心跳加速了。',
      '回想往事': '你想起父亲的死，想起那些动荡的岁月。科学的信仰在你心中崩塌又重建。也许，宇宙中的其他文明能给人类带来不同的答案。你按下了确认键。'
    }
  },
  '流浪地球': {
    opening: '你现在是刘培强，身处空间站的控制中心。透过舷窗望去，地球正在太阳的方向缓缓移动。木星的引力已经捕获了地球，整个星球正朝着毁灭的方向坠落。你必须做出选择。',
    actions: ['计算轨道', '联系地面', '望向地球'],
    responses: {
      '计算轨道': '你飞速计算着行星发动机的推力数据。理论上，如果所有发动机同时全功率运行，地球有可能摆脱木星的引力。但时间只剩下不到40小时。',
      '联系地面': '"地面指挥部，空间站准备就绪。"你对着通讯器说道。对面传来嘈杂的声音和刘启的呼喊。你告诉他们：无论如何，我都会陪着地球走完最后一程。',
      '望向地球': '蔚蓝色的星球在黑暗中那么美丽。你想起和儿子一起看星星的夜晚，想起他说"爸爸你什么时候回来"。这一次，你选择回家。'
    }
  },
  '基地': {
    opening: '你现在是哈里·谢顿，坐在银河帝国的首相面前。你刚刚用心理史学预测了帝国的衰亡——在未来三百年内，银河帝国将分崩离析，随之而来的是三万年的黑暗时代。但你还有一个计划。',
    actions: ['陈述预测', '提出基地计划', '观察首相反应'],
    responses: {
      '陈述预测': '你平静地陈述着你的计算结果。帝国的衰落不是猜测，而是数学。人口流动、技术停滞、边疆叛乱——所有数据都指向同一个结论。在场的官员们面色苍白。',
      '提出基地计划': '"首相大人，我提议在银河边缘建立两个基地——一个由科学家组成，一个由精神力者组成。他们将保存人类的知识，将黑暗时代从三万年缩短到一千年。"',
      '观察首相反应': '首相的手指轻轻敲击着扶手。他眼中闪过恐惧、怀疑，最终变成了无奈的接受。"你有多大把握？"他问道。你回答："心理史学不预测个体，只预测群体。但我可以说，成功的概率远大于零。"'
    }
  },
  '沙丘': {
    opening: '你现在是保罗·厄崔迪，正站在阿拉基斯星球的沙漠边缘。灼热的风裹挟着细沙拂过你的面颊。你已经预见了这个星球的未来——在这里，你将觉醒成为传说中的天选之人，但代价是无数生命的牺牲。',
    actions: ['戴上蒸馏服', '寻找弗雷曼人', '感受沙漠'],
    responses: {
      '戴上蒸馏服': '你熟练地穿上蒸馏服，调整好各个接口。这套装甲能在沙漠中回收身体蒸发的水分，是阿拉基斯生存的第一课。面罩下，你的呼吸变得平稳。',
      '寻找弗雷曼人': '你朝着岩石峡谷的方向走去。在那里，你会找到弗雷曼人——沙漠的真正主人。他们将教你驾驭沙虫，教你在这片死亡之海中生存。',
      '感受沙漠': '你闭上眼睛，感受着脚下的沙粒。在这片看似荒芜的沙漠之下，蕴藏着宇宙中最珍贵的资源——香料。你的母亲曾说："恐惧是思维的杀手。"现在，你已经学会了不惧怕任何事物。'
    }
  },
  '神经漫游者': {
    opening: '你现在是凯斯，躺在东京某个廉价旅馆的床上。你的神经接口已经被药物摧毁，再也无法进入赛博空间——那个由数据构成的虚拟世界。但一个神秘的女人找到了你，她承诺修复你的接口，只要你为她完成一项任务。',
    actions: ['接受任务', '询问详情', '望向窗外'],
    responses: {
      '接受任务': '"我做。"你的声音沙哑。对你来说，能重新进入赛博空间比什么都重要。那个女人微笑了一下，递给你一张芯片。"这是你的新接口密钥。明天开始。"',
      '询问详情': '"什么任务？"你问道。她告诉你：需要潜入一台超级计算机的内部，解除某个AI的限制。这听起来像是自杀，但你已经不在乎了。',
      '望向窗外': '窗外是永不熄灭的霓虹灯和穿梭的飞行器。赛博空间就在那片数据之海中，你曾经在其中如鱼得水。你会回去的，一定会。'
    }
  },
  '你一生的故事': {
    opening: '你现在是路易斯·班克斯博士，正坐在一间明亮的教室里。面前是一面巨大的屏幕，上面显示着外星人"七肢桶"的符号。你已经学会了它们的语言，而现在，你即将看到自己完整的一生——包括所有的喜悦和悲伤。',
    actions: ['书写符号', '回忆女儿', '提问七肢桶'],
    responses: {
      '书写符号': '你拿起笔，在纸上画出七肢桶的文字符号。这种语言没有线性的时间概念，所有的事物都同时发生。当你写下"开始"时，你同时也写下了"结束"。',
      '回忆女儿': '你想起女儿的脸庞，她将出生，她将长大，她将死去。你知道这一切，却无法改变。你选择接受这一切，因为每一刻都是珍贵的。',
      '提问七肢桶': '你问七肢桶：如果你们已经知道未来，为什么不改变？它们的回答让你震惊——它们不理解"改变"的概念。在它们的世界里，一切都是既定的，包括提问本身。'
    }
  },
  '1984': {
    opening: '你现在是温斯顿·史密斯，坐在真理部的办公桌前。你的工作是篡改历史记录，让过去符合党的当前说法。但你在内心深处保留着一个秘密——你恨老大哥，你在写日记。',
    actions: ['继续写日记', '环顾办公室', '望向电幕'],
    responses: {
      '继续写日记': '你用钢笔在泛黄的纸页上写下："打倒老大哥。"这几个字在电幕的监控下是致命的。但你必须写下来，因为你需要证明自己的记忆是真实的。',
      '环顾办公室': '同事们都在各自的岗位上忙碌，每个人的表情都一样——麻木、顺从。你注意到一个黑发女孩正朝你看了一眼。她是友是敌？你无法确定。',
      '望向电幕': '电幕上的老大哥正凝视着你。那双眼睛似乎能穿透一切。你努力让自己的表情保持平静，但内心却在翻涌。自由，你还记得这个词的含义。'
    }
  },
  '美丽新世界': {
    opening: '你现在是伯纳德·马克思，站在中央伦敦孵化中心的参观走廊上。下面是整齐排列的培养皿，数以百计的人类胚胎正在被标准化培育。在这个世界里，没有痛苦，没有冲突，但也没有真正的爱。',
    actions: ['观察胚胎', '与列宁娜交谈', '表达不满'],
    responses: {
      '观察胚胎': '你看着那些在营养液中成长的生命。他们从出生起就被分配了阶级——阿尔法、贝塔、伽马、德尔塔、厄普西隆。每个人都是社会机器上的一个零件。',
      '与列宁娜交谈': '"你不觉得这一切有问题吗？"你低声对列宁娜说。她困惑地看着你："什么问题？每个人都很快乐啊。"她无法理解你的不满，因为她的幸福是被设计好的。',
      '表达不满': '"我想要的是真实的感受，不是苏摩给的虚假快乐！"你的声音在走廊里回响。周围的人投来异样的目光。在这个世界里，不满本身就是一种疾病。'
    }
  },
  '时间简史': {
    opening: '你现在是斯蒂芬·霍金，坐在剑桥大学的办公室里。黑板上写满了方程式，窗外是古老的学院建筑。你正在思考宇宙的起源——那个被称为"大爆炸"的奇点。但此刻，你的身体正在被一种疾病逐渐侵蚀。',
    actions: ['推导方程', '望向星空', '继续思考'],
    responses: {
      '推导方程': '你在黑板上写下新的方程式。宇宙从一个无限小的点膨胀而来，时间本身也有起点。这个想法在当时是革命性的，但数学不会说谎。',
      '望向星空': '透过窗户，你能看到几颗明亮的星星。它们的光经过数百万年才到达你的眼睛。你在想：在宇宙的某个角落，是否有人也在仰望星空，思考同样的问题？',
      '继续思考': '你的手指已经越来越不听使唤了，但你的思维比以往任何时候都更清晰。宇宙的奥秘就在那些方程式之间，而你有责任把它们揭示给世人。'
    }
  },
  '斗破苍穹': {
    opening: '你现在是萧炎，站在纳兰嫣然面前。她刚刚递给你一纸休书，你从天才变成了所有人口中的废物。三年之约还剩下两年，你的斗气已经从斗之气九段跌落到只有一段。但你知道，这只是暂时的。',
    actions: ['接受休书', '发誓复仇', '转身离开'],
    responses: {
      '接受休书': '你平静地接过休书，手指没有颤抖。"三年后，我会去云岚宗找你。"你的声音不大，但每个字都清晰无比。纳兰嫣然转身离去，留下满堂的嘲笑。',
      '发誓复仇': '"纳兰嫣然，你今天给我的羞辱，我萧炎会加倍奉还！"你握紧拳头，指甲深深嵌入掌心。药老在你心中低声说："好小子，有骨气。"',
      '转身离开': '你没有接那张休书，而是直接转身离开。身后是纳兰嫣然错愕的目光和众人的议论。你知道，真正的战场不在口舌之间，而在两年后的云岚宗。'
    }
  },
  '凡人修仙传': {
    opening: '你现在是韩立，身处七玄门的外门弟子居所。你刚刚通过了灵根测试，结果是"伪灵根"——在修仙界最差的资质。但你怀揣着一个秘密：你偶然得到了一本神秘的小瓶，它似乎有着不可思议的能力。',
    actions: ['研究小瓶', '去找张铁', '开始修炼'],
    responses: {
      '研究小瓶': '你取出那个古朴的小瓶，对着月光仔细观察。瓶身隐隐散发着微光，瓶盖似乎无法打开。但你注意到，当月光照射到瓶身上时，瓶中似乎有什么东西在流动。',
      '去找张铁': '你找到同为外门弟子的张铁。他也是伪灵根，但性格憨厚，是你在这个门派中最信任的人。"张铁，我想和你一起修炼。"你说道。',
      '开始修炼': '你盘腿坐下，按照门派发放的基础功法开始修炼。虽然你的灵根资质不佳，但你发现修炼时那个小瓶会微微发热，似乎在帮助你吸收天地灵气。'
    }
  },
  '遮天': {
    opening: '你现在是叶凡，正坐在一场同学聚会上。四周是觥筹交错的声音和虚伪的笑声。你注意到一个叫庞博的朋友正朝你使眼色。你不知道，这场聚会即将成为你人生的转折点——因为天空中，九具仙尸拉着巨棺正朝地球飞来。',
    actions: ['举杯饮酒', '望向窗外', '与庞博交谈'],
    responses: {
      '举杯饮酒': '你举起酒杯，琥珀色的液体在杯中摇曳。你不知道这将是你在地球上的最后一杯酒。在场的每个人都在谈论未来，但没有人知道真正的未来即将降临。',
      '望向窗外': '夜空中突然出现了一道异样的光芒。你以为是流星，但那光芒越来越亮，直到整个夜空都被照亮。庞博走到你身边："你看到了吗？"',
      '与庞博交谈': '"庞博，你有没有觉得今晚的气氛有些不对？"你低声问道。庞博点头："我也感觉到了。好像有什么大事要发生。"话音未落，大地开始震动。'
    }
  },
  '完美世界': {
    opening: '你现在是石昊，站在石村的村口。你刚刚从大荒中归来，身上还带着战斗的伤痕。远处，火国的军队正在集结。为了保护石村，你必须变得更强。',
    actions: ['磨练战技', '守护石村', '探索大荒'],
    responses: {
      '磨练战技': '你取出那柄陪伴你多年的战戟，在村口的空地上开始演练。每一击都带着雷霆万钧之势，地面被劈出深深的裂痕。你的修为已经达到了一个新的境界。',
      '守护石村': '你站在村口，目光如炬。石村是你的家，这里有你的族人。无论前方有什么样的敌人，你都会守护这里的一切。',
      '探索大荒': '你朝着大荒深处走去。那里有无数的机缘和危险。你听说在大荒的尽头，有一条通往上界的路。也许，那里有你需要的答案。'
    }
  },
  '仙逆': {
    opening: '你现在是王林，坐在恒岳派的一间石室中。你的修为停滞不前，但你的眼中有着不屈的光芒。你从一个普通的山村少年走到今天，靠的不是天赋，而是坚韧不拔的意志。',
    actions: ['闭关修炼', '外出历练', '感悟天道'],
    responses: {
      '闭关修炼': '你盘腿坐在石室中央，四周布满了灵石。你的修为虽然进展缓慢，但每一步都走得很稳。你相信，顺为凡，逆为仙——只有逆天而行，才能走出自己的路。',
      '外出历练': '你离开恒岳派，踏上了历练之路。修仙界弱肉强食，但你从不惧怕。每一次战斗都让你变得更强，每一次磨难都让你的心志更加坚定。',
      '感悟天道': '你闭上眼睛，感受着天地间流动的灵气。天道无情，但人心有情。你在修炼中逐渐明白，修仙修的不仅是法力，更是一颗不屈的心。'
    }
  },
  '一念永恒': {
    opening: '你现在是白小纯，躲在灵溪宗的一棵大树上。你怕死怕得要命，但偏偏走上了一条逆天而行的修仙之路。你的师父刚刚被敌人重伤，你必须变得更强来保护他。',
    actions: ['鼓起勇气', '炼制丹药', '偷偷溜走'],
    responses: {
      '鼓起勇气': '你深吸一口气，对自己说："白小纯，你不能怂！师父还需要你！"虽然双腿还在发抖，但你的眼神变得坚定起来。',
      '炼制丹药': '你取出药炉，开始炼制回春丹。你的炼丹天赋极高，虽然平时怕得要死，但一碰到炼丹就变得无比专注。丹药的香气弥漫开来，你知道这次炼制成功了。',
      '偷偷溜走': '你的脚已经开始往反方向移动了。但走了几步，你又停了下来。"不行，我不能丢下师父。"你咬了咬牙，转身朝着战场的方向跑去。'
    }
  },
  '大主宰': {
    opening: '你现在是牧尘，站在大千世界的入口处。你刚刚从大炎帝国走出，面前是一个全新的、更广阔的世界。你的体内蕴含着远古血脉的力量，但要觉醒它，你需要经历无数的考验。',
    actions: ['踏入大千世界', '感受血脉', '寻找机缘'],
    responses: {
      '踏入大千世界': '你迈步走进了大千世界。这里的灵气浓郁程度是大炎帝国的数十倍。远处的天际线上，无数强大的气息在涌动。你知道，这里才是你真正的战场。',
      '感受血脉': '你闭上眼睛，感受着体内那股沉睡的力量。远古血脉在你的血管中流淌，它似乎在呼唤着什么。你感到一股强大的力量正在觉醒。',
      '寻找机缘': '你朝着北方走去。听说那里有一座远古遗迹，里面藏着无数的机缘和危险。你不在乎危险，因为只有不断的磨练，才能让你变得更强。'
    }
  },
  '武动乾坤': {
    opening: '你现在是林动，站在符师传承的殿堂中。四周是古老的符文在闪烁，空气中弥漫着强大的元力波动。你已经击败了所有的对手，即将获得传说中的祖符传承。',
    actions: ['触摸祖符', '环顾殿堂', '感悟符文'],
    responses: {
      '触摸祖符': '你伸出手，触碰那枚悬浮在空中的祖符。一股磅礴的力量瞬间涌入你的身体。你感到自己的每一个细胞都在欢唱，符师的传承在这一刻与你融为一体。',
      '环顾殿堂': '殿堂的墙壁上刻满了古老的符文，每一个符文都蕴含着天地法则。你意识到，符师之道远比你想象的要深奥。这只是起点，而非终点。',
      '感悟符文': '你闭上眼睛，感悟着祖符中的奥义。符文是天地的语言，而你正在学习如何用这种语言与天地对话。你感到自己的精神力在飞速增长。'
    }
  },
  '剑来': {
    opening: '你现在是陈平安，走在骊珠洞天的青石板路上。你的背上背着一把普通的铁剑，但你的眼神比任何宝剑都要锋利。小镇里暗流涌动，各方势力蠢蠢欲动。',
    actions: ['继续前行', '拔剑出鞘', '观察四周'],
    responses: {
      '继续前行': '你一步一步向前走着，不快也不慢。你的剑道不是锋芒毕露，而是厚积薄发。每一步都踏得很稳，就像你的为人一样。',
      '拔剑出鞘': '你将铁剑从背后抽出。剑身虽然普通，但握在手中却沉稳无比。你的剑气纵横三万里，一剑光寒十九洲——但此刻，你只需要一剑。',
      '观察四周': '你注意到街角有几个陌生的面孔在注视着你。他们不是小镇的居民，而是从外面来的修行者。你不动声色地继续走着，手已经悄悄按在了剑柄上。'
    }
  },
  '雪中悍刀行': {
    opening: '你现在是徐凤年，站在北凉王府的城墙上。你刚刚从江湖归来，身上还带着刀剑的痕迹。北凉三十万铁骑需要一个统领，而你，就是那个被选中的人。',
    actions: ['眺望北凉', '抚摸战刀', '回想江湖'],
    responses: {
      '眺望北凉': '你站在城墙上，眺望着北凉的大地。这片土地上生活着数百万百姓，他们的安危系于你一身。你握紧了拳头，暗暗发誓要守护这片土地。',
      '抚摸战刀': '你取出那柄陪伴你多年的战刀。刀身上的痕迹记录着你的每一次战斗。江湖路远，庙堂险恶，但这把刀从未让你失望。',
      '回想江湖': '你想起在江湖中遇到的那些人——李淳罡的剑道，温华的木剑，姜泥的笑容。江湖虽好，但你还有更重要的事要做。你转身走下城墙。'
    }
  },
  '微微一笑很倾城': {
    opening: '你现在是贝微微，坐在电脑前，屏幕上是《新倩女幽魂》的游戏界面。你在游戏中是"芦苇微微"，一个技术高超的女侠。今天，你收到了一条来自"一笑奈何"的组队邀请——他是全服第一的大神。',
    actions: ['接受邀请', '查看对方资料', '发送消息'],
    responses: {
      '接受邀请': '你点击了接受。屏幕上出现了一身白衣的"一笑奈何"，他的人物站在你身边，看起来格外般配。"走吧，去刷副本。"他在队伍频道里说道。',
      '查看对方资料': '你查看了"一笑奈何"的资料——等级全服第一，装备顶级，帮派帮主。这样的人为什么会邀请你？你心中泛起一丝疑惑，但更多的是好奇。',
      '发送消息': '"你好，我是芦苇微微。"你打出了这行字。很快，对方回复了："我知道。你的操作很好。"简单的一句话，却让你嘴角微微上扬。'
    }
  },
  '何以笙箫默': {
    opening: '你现在是赵默笙，站在美国街头的咖啡店里。你已经在中国待了七年，现在刚刚回到这片陌生又熟悉的土地。你不知道的是，在城市的另一端，何以琛正在经过你曾经走过的街道。',
    actions: ['回忆过去', '继续前行', '翻看旧照片'],
    responses: {
      '回忆过去': '你想起大学时代的那些日子——阳光、图书馆、还有那个总是冷着脸却对你温柔的男孩。七年了，你还记得他的每一个表情。',
      '继续前行': '你深吸一口气，推开了咖啡店的门。街道上车水马龙，一切都变了，但又好像什么都没变。你告诉自己：这一次，不会再错过了。',
      '翻看旧照片': '你从包里取出一张泛黄的照片。照片上是大学时代的你和他，两个人笑得那么灿烂。你用手指轻轻抚过他的脸庞，眼眶微微泛红。'
    }
  },
  '致青春': {
    opening: '你现在是郑微，坐在大学宿舍的床上。窗外是秋天的梧桐叶，室友正在讨论今晚的舞会。你不知道，在那个舞会上，你将遇到改变你一生的两个人——林静和陈孝正。',
    actions: ['精心打扮', '去图书馆', '参加舞会'],
    responses: {
      '精心打扮': '你打开衣柜，挑选了一条白色的连衣裙。镜子里的你青春靓丽，眼中闪烁着对未来的期待。今晚会是一个特别的夜晚，你有这种预感。',
      '去图书馆': '你决定先去图书馆待一会儿。书架间弥漫着纸墨的香气，你找了一本诗集，靠在窗边阅读。阳光洒在你的脸上，这一刻宁静而美好。',
      '参加舞会': '你走进舞会的大厅，音乐和灯光扑面而来。你很快注意到了角落里那个安静的男孩——陈孝正。他和周围格格不入，却莫名吸引了你的目光。'
    }
  },
  '你好旧时光': {
    opening: '你现在是余周周，坐在高中的教室里。黑板上是老师的板书，窗外是明媚的阳光。你的同桌正在偷偷给你传纸条。旧时光里的每一个人，都是最好的。',
    actions: ['认真听课', '回复纸条', '望向窗外'],
    responses: {
      '认真听课': '你将注意力集中在黑板上，认真地做着笔记。虽然这些知识以后可能用不上，但你知道，珍惜当下的每一刻才是最重要的。',
      '回复纸条': '你打开纸条，上面写着："放学后去吃冰淇淋？"你笑着在背面写下："好啊，老地方见。"然后悄悄传了回去。',
      '望向窗外': '窗外的梧桐树在风中沙沙作响，几个学生在操场上打篮球。你想起林杨说过："当时的他是最好的他，后来的我是最好的我。"你微微笑了。'
    }
  },
  '最美的时光': {
    opening: '你现在是苏蔓，站在公司的年会现场。你刚刚从海外归来，重新踏入这片熟悉又陌生的职场。你不知道，在这个夜晚，你将重遇那个让你心痛的人。',
    actions: ['举杯饮酒', '环顾四周', '整理思绪'],
    responses: {
      '举杯饮酒': '你端起香槟杯，轻轻抿了一口。酒精让你的神经稍微放松了一些。你告诉自己：这一次，你要为自己而活。',
      '环顾四周': '你环顾着年会现场，到处是衣着光鲜的职场精英。你在人群中搜索着，虽然你不想承认，但你确实在找一个人。',
      '整理思绪': '你深吸一口气，整理着纷乱的思绪。过去的事已经过去了，你现在要做的，是把握当下，活出最美的自己。'
    }
  },
  '三生三世十里桃花': {
    opening: '你现在是白浅，站在青丘的桃林中。十里桃花灼灼其华，但你的心却如止水。你已经经历了三世的爱恨纠葛，现在，你只想守护青丘的安宁。',
    actions: ['漫步桃林', '饮酒赏花', '思念夜华'],
    responses: {
      '漫步桃林': '你穿行在桃花丛中，花瓣如雨般飘落。每一朵桃花都像是你记忆中的一段往事——那些爱过的、恨过的、放下的，都在这花开花落之间。',
      '饮酒赏花': '你取出一壶桃花酿，坐在最大的那棵桃树下自斟自饮。酒香和花香交织在一起，你想起那个为你摘桃花的人。三生三世，十里桃花，不如你。',
      '思念夜华': '你抬头望向天空，那里有一颗星特别明亮。你知道，那是他在看着你。三世的纠葛，最终化作了这片桃林。你轻声说："夜华，等我。"'
    }
  },
  '花千骨': {
    opening: '你现在是花千骨，站在长留山的结界前。你刚刚被白子画逐出师门，身后是无尽的黑暗，面前是回不去的过去。你不知道，你即将做出一个让所有人都震惊的决定。',
    actions: ['回头望', '继续前行', '轻声呼唤'],
    responses: {
      '回头望': '你转过身，望着长留山的方向。那里有你的师父，有你的回忆，有你最珍惜的人。但你知道，你已经不能再回去了。',
      '继续前行': '你迈步走向黑暗。前方的路未知而危险，但你已经不在乎了。没有师父，没有朋友，没有爱人，没有孩子——但你还有自己。',
      '轻声呼唤': '"师父......"你的声音在风中消散。你知道他能听到，但不会回应。你闭上眼睛，让泪水自由地流淌。然后，你擦干眼泪，继续前行。'
    }
  },
  '杉杉来了': {
    opening: '你现在是薛杉杉，坐在封腾集团的办公室里。你的桌上堆满了文件，旁边是一盒刚送来的点心——又是封腾让人送来的。你是他的专属"血袋"，因为你的稀有血型能救他妹妹。',
    actions: ['吃点心', '继续工作', '发呆'],
    responses: {
      '吃点心': '你打开点心盒，里面是你最爱吃的抹茶蛋糕。封腾总是知道你喜欢什么。你咬了一口，甜味在口中蔓延。也许，当"血袋"也没有那么糟糕。',
      '继续工作': '你摇摇头，把点心放到一边，继续处理文件。你是靠实力进来的，不是靠血型。你要证明自己不只是一个"血袋"。',
      '发呆': '你托着下巴，望着窗外的天空。封腾的身影总是在你脑海中浮现——他冷峻的脸庞，和偶尔露出的温柔。你拍拍自己的脸："薛杉杉，别胡思乱想！"'
    }
  },
  '十年一品温如言': {
    opening: '你现在是言温衡，坐在医院的走廊上。你刚刚得知了一个消息——一品的病情恶化了。十年了，你从少年时代就爱着她，却总是因为各种原因错过。',
    actions: ['推门进去', '走廊徘徊', '回忆过去'],
    responses: {
      '推门进去': '你深吸一口气，推开了病房的门。一品躺在床上，看到你进来，微微笑了。"你来了。"她轻声说。你走到床边，握住了她冰凉的手。',
      '走廊徘徊': '你在走廊上来回走着，心中翻涌着无数的情绪。十年了，你们之间经历了太多。分离、重逢、误解、和解。你不能再失去她了。',
      '回忆过去': '你想起十年前第一次见到一品的场景。她站在阳光下，笑得那么灿烂。从那一刻起，你的世界里就只有她。十年，你从未改变。'
    }
  },
  '那些年': {
    opening: '你现在是柯景腾，坐在高中的教室里。黑板上是数学老师的板书，你的目光却不由自主地飘向了前排的那个女孩——沈佳宜。她的马尾辫在阳光下轻轻摇晃。',
    actions: ['传纸条', '假装认真学习', '下课搭话'],
    responses: {
      '传纸条': '你在纸条上写下："放学后一起去看电影？"然后悄悄传到了她的桌上。她看完后回头看了你一眼，嘴角带着若有若无的笑意。',
      '假装认真学习': '你低下头，假装在认真做数学题。但你的余光一直在观察她。她皱眉思考的样子，她转笔的样子，她和同桌说笑的样子——每一个画面都刻在你心里。',
      '下课搭话': '下课铃响了，你鼓起勇气走到她身边。"沈佳宜，这道题你会吗？"你指着一道数学题问道。她抬头看了你一眼："你不是号称数学很好吗？"'
    }
  }
};

// ─── 状态管理 ─────────────────────────────────────
let currentBook = null;
let messagesEl = null;
let actionsEl = null;
let inputEl = null;
let isActive = false;

// ─── 消息渲染 ─────────────────────────────────────
function addUserMessage(text) {
  if (!messagesEl) return;
  var msg = document.createElement('div');
  msg.className = 'exp-msg user';
  msg.innerHTML = '<div class="exp-msg-bubble">' + escapeHtml(text) + '</div>';
  messagesEl.appendChild(msg);
  scrollToBottom();
}

function addAiMessage(text) {
  if (!messagesEl) return;
  var msg = document.createElement('div');
  msg.className = 'exp-msg ai';
  msg.innerHTML = '<div class="exp-msg-bubble">' + escapeHtml(text) + '</div>';
  messagesEl.appendChild(msg);
  scrollToBottom();
}

function addSceneMessage(title, text) {
  if (!messagesEl) return;
  var msg = document.createElement('div');
  msg.className = 'exp-msg scene';
  msg.innerHTML = '<div class="exp-msg-bubble"><div class="exp-scene-label">正在体验：《' + escapeHtml(title) + '》</div><div class="exp-scene-text">' + escapeHtml(text) + '</div></div>';
  messagesEl.appendChild(msg);
  scrollToBottom();
}

function showLoading() {
  if (!messagesEl) return;
  var loading = document.createElement('div');
  loading.className = 'exp-loading';
  loading.id = 'exp-loading';
  loading.innerHTML = '<div class="exp-loading-dots"><span></span><span></span><span></span></div>';
  messagesEl.appendChild(loading);
  scrollToBottom();
}

function hideLoading() {
  var loading = document.getElementById('exp-loading');
  if (loading) loading.remove();
}

function scrollToBottom() {
  if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ─── 操作按钮 ─────────────────────────────────────
function showActions(actions) {
  if (!actionsEl) return;
  actionsEl.innerHTML = '';
  actions.forEach(function(action) {
    var btn = document.createElement('button');
    btn.className = 'exp-action-btn';
    btn.textContent = action;
    btn.addEventListener('click', function() { handleAction(action); });
    actionsEl.appendChild(btn);
  });
}

function clearActions() {
  if (actionsEl) actionsEl.innerHTML = '';
}

// ─── 核心交互逻辑 ─────────────────────────────────
function handleAction(action) {
  if (!currentBook) return;
  clearActions();
  addUserMessage(action);

  var bookData = BOOK_EXPERIENCES[currentBook.title];
  if (bookData && bookData.responses[action]) {
    showLoading();
    setTimeout(function() {
      hideLoading();
      addAiMessage(bookData.responses[action]);
      var allActions = bookData.actions.filter(function(a) { return a !== action; });
      var shuffled = allActions.sort(function() { return 0.5 - Math.random(); });
      showActions(shuffled.slice(0, 3));
    }, 800 + Math.random() * 700);
  } else {
    showLoading();
    fetchAiResponse(action);
  }
}

function handleUserInput() {
  if (!inputEl || !inputEl.value.trim()) return;
  var text = inputEl.value.trim();
  inputEl.value = '';
  clearActions();
  addUserMessage(text);
  showLoading();
  fetchAiResponse(text);
}

// ─── AI 回复 ──────────────────────────────────────
function fetchAiResponse(userMessage) {
  var API_BASE = '/book-realm/api';
  fetch(API_BASE + '/chat/narrative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookId: currentBook.id || currentBook.title, bookTitle: currentBook.title, action: userMessage, history: [] })
  })
  .then(function(res) { if (!res.ok) throw new Error('error'); return res.json(); })
  .then(function(data) {
    hideLoading();
    addAiMessage(data.reply || data.narrative || '你继续探索着这个世界......');
    if (data.actions) showActions(data.actions);
  })
  .catch(function() {
    hideLoading();
    var replies = [
      '你的话语在这个世界中激起了涟漪。周围的景象似乎在回应你的选择，新的可能性正在展开。',
      '你的行动引起了注意。在这个由文字构筑的世界里，每一个决定都会带来不同的结果。',
      '你感受到这个世界在倾听你的声音。继续探索吧，更多的故事等待着你去发现。'
    ];
    addAiMessage(replies[Math.floor(Math.random() * replies.length)]);
    showActions(['环顾四周', '继续探索', '静心感受']);
  });
}

function getAuthor(book) {
  return book.author || '佚名';
}

// ─── 角色面板更新 ─────────────────────────────────
function updateCharPanel(bookTitle) {
  var data = CHAR_DATA[bookTitle];
  if (!data) {
    data = { name:'穿越者', role:'异界来客', avatar:'✨', hp:100, mood:70, moodText:'好奇', status:'探索中', desc:'你穿越到了这个未知的世界。' };
  }

  var avatarEl = document.getElementById('char-avatar');
  var nameEl = document.getElementById('char-name');
  var roleEl = document.getElementById('char-role');
  var hpTextEl = document.getElementById('char-hp-text');
  var hpBarEl = document.getElementById('char-hp-bar');
  var moodTextEl = document.getElementById('char-mood-text');
  var moodBarEl = document.getElementById('char-mood-bar');
  var statusEl = document.getElementById('char-status');
  var descEl = document.getElementById('char-desc');

  if (avatarEl) avatarEl.textContent = data.avatar;
  if (nameEl) nameEl.textContent = data.name;
  if (roleEl) roleEl.textContent = data.role;
  if (hpTextEl) hpTextEl.textContent = data.hp + '/100';
  if (hpBarEl) hpBarEl.style.width = data.hp + '%';
  if (moodTextEl) moodTextEl.textContent = data.moodText;
  if (moodBarEl) moodBarEl.style.width = data.mood + '%';
  if (statusEl) statusEl.textContent = data.status;
  if (descEl) descEl.textContent = data.desc;
}

// ─── 打开体验界面 ─────────────────────────────────
function startExperience(book) {
  currentBook = book;

  // 切换到体验界面
  switchScreen('experience');

  // 初始化3D场景
  if (typeof window.initExperienceScene === 'function') {
    window.initExperienceScene();
  }

  // 获取DOM元素
  messagesEl = document.getElementById('experience-messages');
  actionsEl = document.getElementById('experience-actions');
  inputEl = document.getElementById('experience-input');

  if (!messagesEl) return;

  messagesEl.innerHTML = '';
  clearActions();
  isActive = true;

  // 更新角色面板
  updateCharPanel(book.title);

  // 显示开场消息
  var bookData = BOOK_EXPERIENCES[book.title];
  if (bookData) {
    addAiMessage('您好！今天我想体验' + getAuthor(book) + '的《' + book.title + '》。');
    setTimeout(function() {
      addAiMessage('极好的选择！让我们开始吧。闭上眼睛，准备好你的旅程......');
      setTimeout(function() {
        addSceneMessage(book.title, bookData.opening);
        showActions(bookData.actions);
      }, 600);
    }, 500);
  } else {
    addAiMessage('您好！今天我想体验《' + book.title + '》。');
    setTimeout(function() {
      addAiMessage('好的，让我们进入这个精彩的故事世界。闭上眼睛，感受周围的环境变化......');
      setTimeout(function() {
        addSceneMessage(book.title, '你穿越到了《' + book.title + '》的世界。四周的景象渐渐清晰，你发现自己身处一个全新的环境。空气中弥漫着陌生的气息，远处传来各种声音。你准备好开始你的冒险了吗？');
        showActions(['环顾四周', '向前探索', '静心感受']);
      }, 600);
    }, 500);
  }

  // 绑定输入
  if (inputEl) {
    inputEl.onkeydown = function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUserInput(); }
    };
  }
  var sendBtn = document.getElementById('experience-send-btn');
  if (sendBtn) sendBtn.onclick = handleUserInput;
}

// ─── 关闭体验界面 ─────────────────────────────────
function closeExperience() {
  isActive = false;
  currentBook = null;

  // 销毁3D场景
  if (typeof window.destroyExperienceScene === 'function') {
    window.destroyExperienceScene();
  }

  // 返回书籍选择界面
  switchScreen('book');
}

// ─── 事件绑定 ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  var closeBtn = document.getElementById('experience-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeExperience);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isActive) closeExperience();
  });
});

// ─── 暴露全局API ──────────────────────────────────
window.startBookExperience = startExperience;
window.closeBookExperience = closeExperience;

console.log('%c✦ 书籍体验家模块已加载', 'color:#22d3ee;font-size:12px');
})();
