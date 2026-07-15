(function() {

// ─── 星云对应书籍数据 ───────────────────────────
const NEBULA_BOOKS = {
  scifi: [
    {id:'s1',title:'三体',author:'刘慈欣',color:'#5dade2',insight:'地球文明向宇宙发出的第一声啼鸣，引来三体文明的入侵。黑暗森林法则揭示了宇宙文明之间残酷的生存逻辑。',quote:'给岁月以文明，而不是给文明以岁月。',summary:'文化大革命如火如荼进行的同时，军方探寻外星文明的绝秘计划"红岸工程"取得了突破性进展。但在按下发射键的那一刻，历经劫难的叶文洁没有意识到，她彻底改变了人类的命运。',worldSetting:'距地球四光年的三体星系，三体文明在三个太阳的无规律运动中挣扎求存，最终将目标锁定为地球。',difficulty:4,immersion:5},
    {id:'s2',title:'流浪地球',author:'刘慈欣',color:'#3498db',insight:'太阳即将毁灭，人类带着地球逃亡，在宇宙中寻找新的家园。一场跨越2500年的星际流浪就此展开。',quote:'地球啊，我的流浪地球。',summary:'太阳即将毁灭，人类在地球表面建造出巨大的推进器，将地球推离太阳系，踏上长达2500年的星际流浪之旅。在漫长的旅途中，人类面临着资源枯竭、社会动荡和宇宙危险的多重考验。',worldSetting:'未来某天，科学家预测太阳将在几百年内膨胀为红巨星，吞没地球轨道，人类被迫启动"流浪地球"计划。',difficulty:3,immersion:5},
    {id:'s3',title:'银河帝国',author:'阿西莫夫',color:'#c9a825',insight:'心理史学预测未来的宏篇巨制。阿西莫夫用基地系列证明了科幻可以同时是史诗、政治寓言和哲学思考。',quote:'暴力是无能者的最后庇护所。',summary:'银河帝国已存在一万两千年，哈里·谢顿以其开创的心理史学预言帝国即将灭亡，银河将经历三万年的蛮荒时代。他建立了两个基地以缩短这段黑暗时期。',worldSetting:'银河帝国统治着数百万个有人居住的星球，科技高度发达，但帝国中心正在悄然腐朽。',difficulty:4,immersion:4},
    {id:'s4',title:'沙丘',author:'弗兰克·赫伯特',color:'#d4a050',insight:'在沙漠星球阿拉基斯上，控制着宇宙珍贵香料的家族展开了一场史诗般的权力斗争。',quote:'恐惧是思维的杀手。',summary:'厄崔迪家族被迫接手沙漠星球阿拉基斯的香料开采，却陷入哈克南家族的阴谋陷阱。少年保罗在沙漠中崛起，成为弗雷曼人的救世主，改变了整个宇宙的格局。',worldSetting:'沙漠星球阿拉基斯出产宇宙最珍贵的物质"美琅脂"——香料，它能延长寿命、预知未来，是权力争夺的核心。',difficulty:4,immersion:5},
    {id:'s5',title:'神经漫游者',author:'威廉·吉布森',color:'#1abc9c',insight:'赛博朋克的开山之作。在霓虹与暗巷交织的未来，吉布森预见了网络与AI将如何重塑人类定义。',quote:'天空是完美的电视，调到了死寂的频道。',summary:'天才黑客凯斯被剥夺了接入网络的能力，直到一位神秘女性提供了一次修复手术的机会，代价是执行一项不可能的任务——入侵一座看不见的堡垒。',worldSetting:'未来的地球，跨国公司取代了国家权力，人类通过神经接口将意识投射到赛博空间中。',difficulty:3,immersion:4},
    {id:'s6',title:'你一生的故事',author:'特德·姜',color:'#76d7ea',insight:'语言学家在学习外星语言的过程中获得了预知未来的能力。用语言学重新阐释了自由意志与时间的本质。',quote:'如果你已经知道自己的整个人生，你会改变什么吗？',summary:'外星生物"七肢桶"降临地球，语言学家路易斯被军方征召与之交流。在学习其非线性语言的过程中，她获得了预知未来的能力，同时也预知了自己短暂而完整的女儿的一生。',worldSetting:'七肢桶的语言遵循非线性时间观，掌握这种语言的人能同时感知过去、现在和未来。',difficulty:4,immersion:5}
  ],
  xianxia: [
    {id:'x1',title:'斗破苍穹',author:'天蚕土豆',color:'#c0392b',insight:'萧炎从天才沦为废物，又从废物逆袭成强者，在斗气大陆书写属于自己的传奇。三十年河东，三十年河西。',quote:'三十年河东，三十年河西，莫欺少年穷！',summary:'天才少年萧炎突然失去斗气，沦为废物，被未婚妻退婚。在药老的帮助下，他重新修炼，一路逆袭，最终站在斗气大陆的巅峰，揭开斗帝传承的终极秘密。',worldSetting:'斗气大陆以斗气修炼为核心，分为斗之气、斗者、斗师直到斗帝等阶，强者为尊。',difficulty:2,immersion:5},
    {id:'x2',title:'凡人修仙传',author:'忘语',color:'#27ae60',insight:'一个普通山村少年韩立，偶入修仙门派，凭借坚韧不拔的意志，一步步踏上修仙巅峰。',quote:'修仙之路，逆天而行。',summary:'山村少年韩立偶然进入七玄门，从最底层的外门弟子做起。他没有惊人天赋，只靠谨慎与坚韧，历经千难万险，最终修成正果，飞升仙界。',worldSetting:'凡人界修士通过修炼灵气提升境界，从炼气期到渡劫期，最终飞升仙界，追求长生不死。',difficulty:3,immersion:5},
    {id:'x3',title:'遮天',author:'辰东',color:'#8e44ad',insight:'冰冷与黑暗并存的宇宙深处，九具仙尸拉着巨棺划过星空，拉开了一场波澜壮阔的修仙大幕。',quote:'天地不仁，以万物为刍狗。',summary:'九龙拉棺从天外飞来，将少年叶凡带离地球，踏入一个光怪陆离的修仙世界。他从荒古禁地中走出，一步步揭开万古之谜，最终成就遮天之名。',worldSetting:'浩瀚宇宙中存在无数修炼体系，万族林立，强者可撕裂虚空，遨游星河。',difficulty:3,immersion:5},
    {id:'x4',title:'完美世界',author:'辰东',color:'#f39c12',insight:'一粒尘可填海，一根草斩尽日月星辰。少年石昊从大荒走出，踏上追求极致的道路。',quote:'我要这天，再遮不住我眼。',summary:'石昊从小村走出，天赋绝世却命途多舛。他在大荒中历练，与万族天骄争锋，从石村一路战到上界，最终成为荒天帝，守护整个完美世界。',worldSetting:'下界八域、上界三千州，修炼体系从搬血境到至尊境，天地间存在着上古遗迹与无尽造化。',difficulty:3,immersion:5},
    {id:'x5',title:'仙逆',author:'耳根',color:'#2980b9',insight:'王林逆天而行，以凡人之躯踏入修仙之路，成就一代传奇。修仙，修的是心。',quote:'顺为凡，逆为仙。',summary:'资质平庸的少年王林被家族遗弃，机缘巧合下踏入修仙之路。他逆天而行，以凡人之躯成就仙道，经历了无数生死离别，最终明白了修仙的真谛。',worldSetting:'修真界等级森严，从凝气到问鼎，每个境界都代表着对天地法则的不同领悟。',difficulty:3,immersion:5},
    {id:'x6',title:'剑来',author:'烽火戏诸侯',color:'#1abc9c',insight:'小镇少年陈平安，一把剑走天涯。剑气纵横三万里，一剑光寒十九洲。',quote:'天下熙熙，皆为利来。',summary:'小镇少年陈平安因一场变故失去双亲，偶然间踏上修行之路。他手持一把剑，从骊珠洞天走出，行走于浩然天下，以剑问道，最终成就剑道至尊。',worldSetting:'浩然天下分九洲，修行体系繁多，剑修、儒释道三教各有传承，妖族与人族共存。',difficulty:3,immersion:5}
  ],
  romance: [
    {id:'r1',title:'红楼梦',author:'曹雪芹',color:'#e74c3c',insight:'一部中国封建社会的百科全书。以贾宝玉与林黛玉、薛宝钗的爱情悲剧为主线，揭示了贾、史、王、薛四大家族的兴衰。',quote:'满纸荒唐言，一把辛酸泪。',summary:'贾宝玉与林黛玉青梅竹马，情投意合，却在家族利益与封建礼教的压迫下，黛玉泪尽而亡，宝玉出家为僧。贾府也在权力斗争中走向衰败。',worldSetting:'清代封建贵族家庭，四大家族盘根错节，以诗词歌赋、园林建筑和人情世故构成一个微缩社会。',difficulty:4,immersion:5},
    {id:'r2',title:'西游记',author:'吴承恩',color:'#f39c12',insight:'唐僧师徒四人西天取经，历经九九八十一难。一部充满想象力的神魔小说，也是人生修行的寓言。',quote:'敢问路在何方？路在脚下。',summary:'唐僧受唐王之命西行取经，途中收孙悟空、猪八戒、沙僧为徒。师徒四人一路降妖除魔，历经八十一难，最终取得真经，修成正果。',worldSetting:'天庭、人间、地府三界并存，妖魔鬼怪横行，佛教道教各有神通，修行者可飞天遁地。',difficulty:2,immersion:4},
    {id:'r3',title:'水浒传',author:'施耐庵',color:'#2ecc71',insight:'一百零八将梁山聚义，替天行道。一部充满血性与侠义的英雄史诗。',quote:'路见不平一声吼，该出手时就出手。',summary:'北宋末年，朝廷腐败，官逼民反。一百零八位好汉齐聚梁山泊，替天行道。最终接受招安，南征北战，却落得悲剧收场。',worldSetting:'北宋末年社会动荡，官府与江湖并存，绿林好汉以义气为先，梁山泊是他们的聚义之地。',difficulty:3,immersion:4},
    {id:'r4',title:'三国演义',author:'罗贯中',color:'#3498db',insight:'东汉末年的群雄逐鹿，魏蜀吴三足鼎立。权谋与武力的较量，英雄与奸雄的博弈。',quote:'滚滚长江东逝水，浪花淘尽英雄。',summary:'东汉末年天下大乱，刘备、曹操、孙权三方势力崛起，演绎了一段波澜壮阔的三国争霸史。从桃园结义到三分归晋，英雄辈出。',worldSetting:'东汉末年分崩离析，群雄割据，魏蜀吴三国鼎立，谋士武将各展其才。',difficulty:3,immersion:5},
    {id:'r5',title:'百年孤独',author:'加西亚·马尔克斯',color:'#9b59b6',insight:'布恩迪亚家族七代人的传奇故事，马孔多小镇的百年兴衰。魔幻现实主义的巅峰之作。',quote:'多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。',summary:'马孔多小镇上，布恩迪亚家族七代人的命运轮回。他们经历了爱情、战争、繁荣与衰败，最终在一场飓风中消失，象征着拉丁美洲百年孤独的缩影。',worldSetting:'虚构的马孔多小镇，现实与魔幻交织，时间循环往复，命运如同羊皮卷早已注定。',difficulty:4,immersion:5},
    {id:'r6',title:'活着',author:'余华',color:'#e67e22',insight:'福贵一生的苦难与坚韧。在时代的洪流中，一个人如何承受所有的失去，仍然活着。',quote:'人是为了活着本身而活着，而不是为了活着之外的任何事物而活着。',summary:'富家少爷福贵嗜赌成性，输光家产。此后他经历了内战、大跃进、文革等历史动荡，亲人一个个离他而去，只剩他和一头老牛相依为命，安静地活着。',worldSetting:'20世纪中国农村，经历了内战、土改、大跃进、文革等历史巨变，普通人在苦难中求生。',difficulty:2,immersion:5}
  ]
};

const NEBULA_NAMES = { scifi:'科幻星云', xianxia:'修仙星云', romance:'文学星云' };

const COVER_IMAGES = {
  'x1': 'assets/covers/douPoCangQiong.jpg',
  'x2': 'assets/covers/fanRenXiuXianZhuan.jpg'
};

// ─── 工具函数 ─────────────────────────────────────
function hexToRGB(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}
function rgbStr(r,g,b) { return `rgb(${Math.max(0,Math.min(255,r|0))},${Math.max(0,Math.min(255,g|0))},${Math.max(0,Math.min(255,b|0))})`; }
function clamp(v) { return Math.max(0,Math.min(255,v|0)); }

function seededRandom(seed) {
  let s = seed;
  return function() { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

// ─── 模块状态 ─────────────────────────────────────
let renderer, scene, camera, controls, composer, bloomPass;
let animationId = null;
let orbMeshes = [], orbLabels = [], connFlows = [];
let centralStar = null;
let stars, nodeDots, nodeDotsTex;
let rightPanel, panelTitle, panelAuthor, panelInsight, panelCover, ctaBtn, paperNote;
let selectedBook = null, selectedMesh = null, orbitRing = null, orbitRingGlow = null;
let flyTarget = null, flyProgress = 0, isFlying = false;
let dynamicNebula = null, nebulaRipple = 0;
let currentNebulaType = null;
let keys = { w:false, a:false, s:false, d:false };
let wasdSpeed = 5.5;
let speedOnWheel = false;
let lastRebuild = 0;
let keyDownHandler, keyUpHandler, wheelHandler, resizeHandler;
let canvas;
let hoveredMesh = null;
let searchHighlightIds = [];
let entranceAnim = 0;
let orbitDustSystems = [];

const ORB_RADIUS = 0.8;
const ORB_SEGMENTS = 64;
const CONN_PARTICLES = 200;

const CONN_TUBE_RADIUS = ORB_RADIUS * 0.05;

// 星云连线配色
const CONN_COLOR_MAP = {
  scifi:   {hue:0.56, sat:0.4, light:0.8},
  xianxia: {hue:0.105, sat:0.92, light:0.5},
  romance: {hue:0.93, sat:0.4, light:0.8}
};
// ─── 星球纹理生成（精美单色大理石纹 + 流体漩涡）───

// ─── 专属纹理：完美世界 → 橙红熔岩星球 ───
function generateLavaTexture(hexColor, seed) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  const [baseR,baseG,baseB] = hexToRGB(hexColor);
  const rand = seededRandom(seed || 42);
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  const N = 64;
  const grid = new Float32Array(N*N);
  for (let i=0; i<N*N; i++) grid[i] = rand();
  function noise(x, y, s) {
    const nx = (x/1024*s)%N, ny = (y/512*s)%N;
    const ix = nx|0, iy = ny|0, fx = nx-ix, fy = ny-iy;
    const ix1 = (ix+1)%N, iy1 = (iy+1)%N;
    const a = grid[iy*N+ix], bv = grid[iy*N+ix1];
    const cv = grid[iy1*N+ix], dv = grid[iy1*N+ix1];
    return a + (bv-a)*fx + (cv-a)*fy + (a-bv-cv+dv)*fx*fy;
  }
  function fbm(x, y, oct, s) {
    let v = 0, a2 = 0.5, f = 1;
    for (let o=0; o<oct; o++) { v += a2*noise(x, y, s*f); f *= 2; a2 *= 0.5; }
    return v;
  }

  for (let py=0; py<512; py++) {
    for (let px=0; px<1024; px++) {
      const i = (py*1024+px)*4;
      const warp = fbm(px, py, 3, 2);
      const lava = fbm(px + warp*200, py + warp*150, 5, 3);
      const crack = Math.abs(Math.sin(lava * 10 + warp * 6));
      const vein = Math.pow(crack, 0.4);
      const base = 0.4 + vein * 0.6;
      d[i]   = Math.min(255, baseR * (0.6 + base * 0.4));
      d[i+1] = Math.min(255, baseG * (0.5 + base * 0.5));
      d[i+2] = Math.min(255, baseB * (0.4 + base * 0.6));
      d[i+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return c;
}

// ─── 专属纹理：斗破苍穹 → 金棕荒漠古域 ───
function generateDesertTexture(hexColor, seed) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  const [baseR,baseG,baseB] = hexToRGB(hexColor);
  const rand = seededRandom(seed || 42);
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  const N = 64;
  const grid = new Float32Array(N*N);
  for (let i=0; i<N*N; i++) grid[i] = rand();
  function noise(x, y, s) {
    const nx = (x/1024*s)%N, ny = (y/512*s)%N;
    const ix = nx|0, iy = ny|0, fx = nx-ix, fy = ny-iy;
    const ix1 = (ix+1)%N, iy1 = (iy+1)%N;
    const a = grid[iy*N+ix], bv = grid[iy*N+ix1];
    const cv = grid[iy1*N+ix], dv = grid[iy1*N+ix1];
    return a + (bv-a)*fx + (cv-a)*fy + (a-bv-cv+dv)*fx*fy;
  }
  function fbm(x, y, oct, s) {
    let v = 0, a2 = 0.5, f = 1;
    for (let o=0; o<oct; o++) { v += a2*noise(x, y, s*f); f *= 2; a2 *= 0.5; }
    return v;
  }

  for (let py=0; py<512; py++) {
    for (let px=0; px<1024; px++) {
      const i = (py*1024+px)*4;
      const warp = fbm(px, py, 3, 2.5);
      const sand = fbm(px + warp*180, py + warp*120, 5, 3);
      const erode = fbm(px + 300, py + 200, 3, 6);
      const erodeMask = erode > 0.6 ? (erode - 0.6) * 2.5 : 0;
      const base = 0.4 + sand * 0.6;
      d[i]   = Math.min(255, baseR * (0.7 + base * 0.3) * (1 - erodeMask * 0.2));
      d[i+1] = Math.min(255, baseG * (0.6 + base * 0.4) * (1 - erodeMask * 0.2));
      d[i+2] = Math.min(255, baseB * (0.5 + base * 0.5) * (1 - erodeMask * 0.15));
      d[i+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return c;
}

// ─── 专属纹理：凡人修仙传 → 蓝白冰晶星球 ───
function generateIceTexture(hexColor, seed) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  const [baseR,baseG,baseB] = hexToRGB(hexColor);
  const rand = seededRandom(seed || 42);
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  const N = 64;
  const grid = new Float32Array(N*N);
  for (let i=0; i<N*N; i++) grid[i] = rand();
  function noise(x, y, s) {
    const nx = (x/1024*s)%N, ny = (y/512*s)%N;
    const ix = nx|0, iy = ny|0, fx = nx-ix, fy = ny-iy;
    const ix1 = (ix+1)%N, iy1 = (iy+1)%N;
    const a = grid[iy*N+ix], bv = grid[iy*N+ix1];
    const cv = grid[iy1*N+ix], dv = grid[iy1*N+ix1];
    return a + (bv-a)*fx + (cv-a)*fy + (a-bv-cv+dv)*fx*fy;
  }
  function fbm(x, y, oct, s) {
    let v = 0, a2 = 0.5, f = 1;
    for (let o=0; o<oct; o++) { v += a2*noise(x, y, s*f); f *= 2; a2 *= 0.5; }
    return v;
  }

  for (let py=0; py<512; py++) {
    for (let px=0; px<1024; px++) {
      const i = (py*1024+px)*4;
      const warp = fbm(px, py, 3, 2);
      const crystal = fbm(px + warp*200, py + warp*160, 5, 3.5);
      const base = 0.4 + crystal * 0.6;
      d[i]   = Math.min(255, baseR * (0.7 + base * 0.3));
      d[i+1] = Math.min(255, baseG * (0.7 + base * 0.3));
      d[i+2] = Math.min(255, baseB * (0.6 + base * 0.4));
      d[i+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // 冰晶反光
  const numSparkles = 12 + (rand()*8|0);
  for (let i=0; i<numSparkles; i++) {
    const sx = rand()*1024, sy = rand()*512;
    const sr = 1 + rand()*2;
    const sparkle = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
    sparkle.addColorStop(0, `rgba(255,255,255,${0.3+rand()*0.2})`);
    sparkle.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sparkle;
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2); ctx.fill();
  }

  return c;
}

// ─── 专属纹理：诛仙 → 青绿森林星球 ───
function generateForestTexture(hexColor, seed) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  const [baseR,baseG,baseB] = hexToRGB(hexColor);
  const rand = seededRandom(seed || 42);
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  const N = 64;
  const grid = new Float32Array(N*N);
  for (let i=0; i<N*N; i++) grid[i] = rand();
  function noise(x, y, s) {
    const nx = (x/1024*s)%N, ny = (y/512*s)%N;
    const ix = nx|0, iy = ny|0, fx = nx-ix, fy = ny-iy;
    const ix1 = (ix+1)%N, iy1 = (iy+1)%N;
    const a = grid[iy*N+ix], bv = grid[iy*N+ix1];
    const cv = grid[iy1*N+ix], dv = grid[iy1*N+ix1];
    return a + (bv-a)*fx + (cv-a)*fy + (a-bv-cv+dv)*fx*fy;
  }
  function fbm(x, y, oct, s) {
    let v = 0, a2 = 0.5, f = 1;
    for (let o=0; o<oct; o++) { v += a2*noise(x, y, s*f); f *= 2; a2 *= 0.5; }
    return v;
  }

  for (let py=0; py<512; py++) {
    for (let px=0; px<1024; px++) {
      const i = (py*1024+px)*4;
      const warp = fbm(px, py, 3, 2.5);
      const forest = fbm(px + warp*180, py + warp*140, 5, 3);
      const vine = Math.sin(forest * 12 + warp * 8) * 0.5 + 0.5;
      const base = 0.4 + forest * 0.6;
      d[i]   = Math.min(255, baseR * (0.5 + base * 0.5));
      d[i+1] = Math.min(255, baseG * (0.5 + base * 0.5));
      d[i+2] = Math.min(255, baseB * (0.5 + base * 0.5));
      d[i+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return c;
}

// ─── 专属纹理：剑来 → 青白剑气星球 ───
function generateSwordTexture(hexColor, seed) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  const [baseR,baseG,baseB] = hexToRGB(hexColor);
  const rand = seededRandom(seed || 42);
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  const N = 64;
  const grid = new Float32Array(N*N);
  for (let i=0; i<N*N; i++) grid[i] = rand();
  function noise(x, y, s) {
    const nx = (x/1024*s)%N, ny = (y/512*s)%N;
    const ix = nx|0, iy = ny|0, fx = nx-ix, fy = ny-iy;
    const ix1 = (ix+1)%N, iy1 = (iy+1)%N;
    const a = grid[iy*N+ix], bv = grid[iy*N+ix1];
    const cv = grid[iy1*N+ix], dv = grid[iy1*N+ix1];
    return a + (bv-a)*fx + (cv-a)*fy + (a-bv-cv+dv)*fx*fy;
  }
  function fbm(x, y, oct, s) {
    let v = 0, a2 = 0.5, f = 1;
    for (let o=0; o<oct; o++) { v += a2*noise(x, y, s*f); f *= 2; a2 *= 0.5; }
    return v;
  }

  for (let py=0; py<512; py++) {
    for (let px=0; px<1024; px++) {
      const i = (py*1024+px)*4;
      const warp = fbm(px, py, 3, 2);
      const blade = fbm(px + warp*160, py + warp*120, 5, 3);
      const sharp = Math.abs(Math.sin(blade * 15 + warp * 10));
      const edge = Math.pow(sharp, 0.3);
      const base = 0.5 + edge * 0.5;
      d[i]   = Math.min(255, baseR * (0.6 + base * 0.4));
      d[i+1] = Math.min(255, baseG * (0.6 + base * 0.4));
      d[i+2] = Math.min(255, baseB * (0.6 + base * 0.4));
      d[i+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return c;
}

// ─── 纹理分发器 ───
const CUSTOM_TEXTURE_MAP = {
  'x4': generateLavaTexture,    // 完美世界
  'x1': generateDesertTexture,  // 斗破苍穹
  'x2': generateIceTexture,     // 凡人修仙传
  'x7': generateForestTexture,  // 诛仙
  'x6': generateSwordTexture    // 剑来
};

function generatePlanetTexture(hexColor, seed, bookId) {
  // 检查是否有专属纹理
  if (bookId && CUSTOM_TEXTURE_MAP[bookId]) {
    return CUSTOM_TEXTURE_MAP[bookId](hexColor, seed);
  }

  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  const [r,g,b] = hexToRGB(hexColor);
  const rand = seededRandom(seed || 42);
  const imgData = ctx.createImageData(1024, 512);
  const d = imgData.data;

  // 噪声网格
  const N = 64;
  const grid = new Float32Array(N*N);
  for (let i=0; i<N*N; i++) grid[i] = rand();
  function noise(x, y, s) {
    const nx = (x/1024*s)%N, ny = (y/512*s)%N;
    const ix = nx|0, iy = ny|0, fx = nx-ix, fy = ny-iy;
    const ix1 = (ix+1)%N, iy1 = (iy+1)%N;
    const a = grid[iy*N+ix], bv = grid[iy*N+ix1];
    const cv = grid[iy1*N+ix], dv = grid[iy1*N+ix1];
    return a + (bv-a)*fx + (cv-a)*fy + (a-bv-cv+dv)*fx*fy;
  }
  function fbm(x, y, oct, s) {
    let v = 0, a = 0.5, f = 1;
    for (let o=0; o<oct; o++) { v += a*noise(x, y, s*f); f *= 2; a *= 0.5; }
    return v;
  }

  // 预计算 HSL 基色
  const maxC = Math.max(r,g,b)||1;
  const rr = r/maxC, gg = g/maxC, bb = b/maxC;
  const mx = Math.max(rr,gg,bb), mn = Math.min(rr,gg,bb);
  const l = (mx+mn)/2;
  let h = 0, s = 0;
  if (mx !== mn) {
    const d2 = mx - mn;
    s = l > 0.5 ? d2/(2-mx-mn) : d2/(mx+mn);
    if (mx === rr) h = ((gg-bb)/d2 + (gg<bb?6:0)) / 6;
    else if (mx === gg) h = ((bb-rr)/d2 + 2) / 6;
    else h = ((rr-gg)/d2 + 4) / 6;
  }

  function hsl2rgb(hh, ss, ll) {
    let r2, g2, b2;
    if (ss === 0) { r2 = g2 = b2 = ll; }
    else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q-p)*6*t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q-p)*(2/3-t)*6;
        return p;
      }
      const q = ll < 0.5 ? ll*(1+ss) : ll+ss-ll*ss;
      const p = 2*ll - q;
      r2 = hue2rgb(p, q, hh + 1/3);
      g2 = hue2rgb(p, q, hh);
      b2 = hue2rgb(p, q, hh - 1/3);
    }
    return [r2*255, g2*255, b2*255];
  }

  for (let py=0; py<512; py++) {
    for (let px=0; px<1024; px++) {
      const i = (py*1024+px)*4;

      // 域扭曲流体漩涡
      const warp1 = fbm(px, py, 4, 2.5);
      const warp2 = fbm(px+500, py+300, 4, 2.5);
      const pat = fbm(px + warp1*220, py + warp2*180, 6, 3.5);

      // 大理石纹脉络：sin 扭曲产生流动感
      const vein = Math.sin(pat * 14 + warp1 * 10) * 0.5 + 0.5;
      const vein2 = Math.sin(pat * 8 - warp2 * 6 + 1.5) * 0.5 + 0.5;
      const blended = vein * 0.65 + vein2 * 0.35;

      // 亮度变化：0.35 ~ 0.75（自然明暗，不发光）
      const brightness = 0.35 + blended * 0.40;
      // 饱和度微调
      const sat = 0.65 + blended * 0.35;

      const [cr, cg, cb] = hsl2rgb(h, sat, brightness);
      d[i]   = Math.min(255, Math.max(0, cr));
      d[i+1] = Math.min(255, Math.max(0, cg));
      d[i+2] = Math.min(255, Math.max(0, cb));
      d[i+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  return c;
}

function generateAtmosphereTexture(hexColor) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  const [r,g,b] = hexToRGB(hexColor);
  const grad = ctx.createRadialGradient(64,64,28,64,64,64);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.55, `rgba(${r},${g},${b},0.04)`);
  grad.addColorStop(0.82, `rgba(${r},${g},${b},0.12)`);
  grad.addColorStop(0.95, `rgba(${r},${g},${b},0.06)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,128,128);
  return c;
}

// ─── 球形保护壳（Fresnel 边缘发光 + 颗粒噪点 + 裂痕 + 气态流动）───
function createShellMesh(hexColor, parentMesh) {
  var color = new THREE.Color(hexColor);
  var shellGeo = new THREE.SphereGeometry(ORB_RADIUS * 1.55, 48, 48);
  var shellMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor:     { value: color },
      uIntensity: { value: 0.8 },
      uPower:     { value: 3.0 },
      uTime:      { value: 0.0 }
    },
    vertexShader: [
      'varying vec3 vNormal;',
      'varying vec3 vViewDir;',
      'varying vec3 vWorldPos;',
      'varying vec3 vLocalPos;',
      'void main() {',
      '  vNormal = normalize(normalMatrix * normal);',
      '  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);',
      '  vViewDir = -normalize(mvPos.xyz);',
      '  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;',
      '  vLocalPos = position;',
      '  gl_Position = projectionMatrix * mvPos;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 uColor;',
      'uniform float uIntensity;',
      'uniform float uPower;',
      'uniform float uTime;',
      'varying vec3 vNormal;',
      'varying vec3 vViewDir;',
      'varying vec3 vWorldPos;',
      'varying vec3 vLocalPos;',

      'float hash(vec3 p) {',
      '  p = fract(p * 0.3183099 + 0.1);',
      '  p *= 17.0;',
      '  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));',
      '}',
      'float noise3D(vec3 p) {',
      '  vec3 i = floor(p);',
      '  vec3 f = fract(p);',
      '  f = f*f*(3.0-2.0*f);',
      '  return mix(',
      '    mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),',
      '        mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),',
      '    mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),',
      '        mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);',
      '}',

      'void main() {',
      '  float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), uPower);',

      // 气态流动：低频噪声随时间漂移
      '  float flow = noise3D(vWorldPos * 3.5 + uTime * 0.12);',
      '  float flow2 = noise3D(vWorldPos * 6.0 - uTime * 0.08 + 50.0);',
      '  float gasMask = flow * 0.6 + flow2 * 0.4;',

      // 裂痕：高频噪声取窄带
      '  float crackLarge = smoothstep(0.46, 0.5, abs(noise3D(vLocalPos * 10.0)));',
      '  float crackSmall = smoothstep(0.48, 0.5, abs(noise3D(vLocalPos * 22.0 + 30.0)));',
      '  float crack = max(crackLarge * 0.5, crackSmall * 0.3);',

      // 颗粒噪点
      '  float grain = noise3D(vWorldPos * 20.0) * 0.25;',

      // 颜色：保持色相的提亮（不泛白）
      '  vec3 brightColor = uColor * 1.6 + vec3(0.15);',
      '  vec3 col = mix(uColor, brightColor, fresnel * 0.7);',

      // 裂痕发光（亮裂痕）
      '  col += brightColor * crack * 0.4;',

      // 最终 alpha：fresnel + 气态流动 + 颗粒，裂痕区域增强
      '  float alpha = fresnel * uIntensity;',
      '  alpha += gasMask * fresnel * 0.25;',
      '  alpha += grain * fresnel * 0.3;',
      '  alpha += crack * fresnel * 0.2;',
      '  alpha = clamp(alpha, 0.0, 1.0);',

      '  gl_FragColor = vec4(col, alpha);',
      '}'
    ].join('\n'),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.FrontSide
  });
  var shell = new THREE.Mesh(shellGeo, shellMat);
  shell.position.copy(parentMesh.position);
  shell.userData = { parentOrb: parentMesh, isShell: true };
  return shell;
}

// 圆形大号柔光粒子纹理（扩散光晕）
var _particleTexCache = {};
function getParticleTex(hexColor) {
  if(_particleTexCache[hexColor]) return _particleTexCache[hexColor];
  var c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  var ctx = c.getContext('2d');
  var [r,g,b] = hexToRGB(hexColor);
  // 径向渐变：中心亮 → 边缘柔和扩散
  var grad = ctx.createRadialGradient(64,64,0,64,64,64);
  grad.addColorStop(0, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.08, `rgba(${r},${g},${b},0.85)`);
  grad.addColorStop(0.25, `rgba(${r},${g},${b},0.45)`);
  grad.addColorStop(0.5, `rgba(${r},${g},${b},0.15)`);
  grad.addColorStop(0.75, `rgba(${r},${g},${b},0.04)`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,128,128);
  var tex = new THREE.CanvasTexture(c);
  _particleTexCache[hexColor] = tex;
  return tex;
}

// 连线发光线纹理
function getGlowLineTexture(hexColor) {
  var c = document.createElement('canvas');
  c.width = 4; c.height = 64;
  var ctx = c.getContext('2d');
  var [r,g,b] = hexToRGB(hexColor);
  var grad = ctx.createLinearGradient(0,0,4,0);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.08)`);
  grad.addColorStop(0.5, `rgba(${r},${g},${b},0.15)`);
  grad.addColorStop(0.7, `rgba(${r},${g},${b},0.08)`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,4,64);
  var tex = new THREE.CanvasTexture(c);
  return tex;
}

// 云层纹理（噪点云）
function generateCloudTexture(seed) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const ctx = c.getContext('2d');
  const rand = seededRandom(seed || 99);
  const imgData = ctx.createImageData(512, 256);
  const d = imgData.data;

  // 简易噪声
  const N = 32;
  const grid = new Float32Array(N*N);
  for (let i=0; i<N*N; i++) grid[i] = rand();
  function noise(x, y, s) {
    const nx = (x/512*s)%N, ny = (y/256*s)%N;
    const ix = nx|0, iy = ny|0;
    const fx = nx-ix, fy = ny-iy;
    const ix1 = (ix+1)%N, iy1 = (iy+1)%N;
    return grid[iy*N+ix]*(1-fx)*(1-fy) + grid[iy*N+ix1]*fx*(1-fy)
         + grid[iy1*N+ix]*(1-fx)*fy + grid[iy1*N+ix1]*fx*fy;
  }
  function fbm(x, y, oct, s) {
    let v = 0, a = 0.6, f = 1;
    for (let o=0; o<oct; o++) { v += a*noise(x, y, s*f); f *= 1.8; a *= 0.45; }
    return v;
  }

  for (let py=0; py<256; py++) {
    for (let px=0; px<512; px++) {
      const i = (py*512+px)*4;
      const v = fbm(px+py, py-px, 5, 2.5);
      const alpha = Math.max(0, Math.min(1, (v-0.35)*2.5));
      const bright = 200 + v*55;
      d[i] = bright; d[i+1] = bright; d[i+2] = bright+10;
      d[i+3] = alpha*200|0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return c;
}

// 螺旋星云纹理（暖金核心 + 蓝紫螺旋臂，参考图）
function generateSpiralGalaxyTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1024;
  const ctx = c.getContext('2d');
  const cx = 512, cy = 512;

  // 黑色背景
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,1024,1024);

  // 外层弥漫气体（蓝紫色调）
  var outerGlow = ctx.createRadialGradient(cx,cy,80,cx,cy,500);
  outerGlow.addColorStop(0, 'rgba(80,50,140,0)');
  outerGlow.addColorStop(0.3, 'rgba(60,40,120,0.06)');
  outerGlow.addColorStop(0.6, 'rgba(50,30,100,0.12)');
  outerGlow.addColorStop(0.8, 'rgba(40,25,80,0.08)');
  outerGlow.addColorStop(1, 'rgba(20,10,40,0)');
  ctx.fillStyle = outerGlow;
  ctx.fillRect(0,0,1024,1024);

  // 螺旋臂（3条，蓝紫色）
  var arms = [
    { color1:'rgba(80,60,180,0.18)', color2:'rgba(60,40,140,0.06)', width:35, turns:2.2, offset:0 },
    { color1:'rgba(100,60,200,0.14)', color2:'rgba(70,45,150,0.04)', width:28, turns:1.8, offset:Math.PI*0.67 },
    { color1:'rgba(70,50,160,0.12)', color2:'rgba(50,35,120,0.03)', width:22, turns:2.5, offset:Math.PI*1.33 }
  ];

  arms.forEach(function(arm) {
    ctx.save();
    // 绘制多层螺旋臂
    for (var layer=0; layer<3; layer++) {
      var w = arm.width * (1 + layer*0.4);
      ctx.beginPath();
      for (var t=0; t<arm.turns*Math.PI*2; t+=0.02) {
        var r = 40 + t/(arm.turns*Math.PI*2) * 420;
        var angle = t + arm.offset + layer*0.03;
        var x = cx + r*Math.cos(angle);
        var y = cy + r*Math.sin(angle);
        if (t===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle = layer===0 ? arm.color1 : arm.color2;
      ctx.lineWidth = w;
      ctx.shadowColor = arm.color1;
      ctx.shadowBlur = 20+layer*15;
      ctx.stroke();
    }
    ctx.restore();
  });

  // 核心：暖金色/粉橙色（参考图的明亮核心）
  var coreGlow = ctx.createRadialGradient(cx,cy,0,cx,cy,140);
  coreGlow.addColorStop(0, 'rgba(255,220,180,0.7)');
  coreGlow.addColorStop(0.15, 'rgba(255,180,120,0.5)');
  coreGlow.addColorStop(0.35, 'rgba(220,140,80,0.25)');
  coreGlow.addColorStop(0.55, 'rgba(180,100,60,0.1)');
  coreGlow.addColorStop(1, 'rgba(100,50,30,0)');
  ctx.fillStyle = coreGlow;
  ctx.fillRect(0,0,1024,1024);

  // 核心白亮中心
  var coreBright = ctx.createRadialGradient(cx,cy,0,cx,cy,35);
  coreBright.addColorStop(0, 'rgba(255,245,230,0.55)');
  coreBright.addColorStop(0.5, 'rgba(255,220,180,0.25)');
  coreBright.addColorStop(1, 'rgba(255,180,120,0)');
  ctx.fillStyle = coreBright;
  ctx.fillRect(0,0,1024,1024);

  // 星点（白色/彩色）
  for (var s=0; s<300; s++) {
    var sx = Math.random()*1024;
    var sy = Math.random()*1024;
    var dist = Math.sqrt((sx-cx)*(sx-cx)+(sy-cy)*(sy-cy));
    var brightness = Math.max(0, 1 - dist/500) * 0.9;
    var colors = ['#ffffff','#ffffff','#aaddff','#ffddaa','#aaffcc'];
    ctx.fillStyle = colors[Math.random()*colors.length|0];
    ctx.globalAlpha = brightness * (0.3+Math.random()*0.7);
    var starSize = 0.5+Math.random()*2;
    ctx.beginPath();
    ctx.arc(sx, sy, starSize, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 边缘柔化（径向渐变遮罩）
  var edgeFade = ctx.createRadialGradient(cx,cy,420,cx,cy,512);
  edgeFade.addColorStop(0, 'rgba(0,0,0,0)');
  edgeFade.addColorStop(0.7, 'rgba(0,0,0,0.3)');
  edgeFade.addColorStop(1, 'rgba(0,0,0,0.9)');
  ctx.fillStyle = edgeFade;
  ctx.fillRect(0,0,1024,1024);

  var tex = new THREE.CanvasTexture(c);
  return tex;
}

// ─── 动态星云背景（PlaneGeometry + ShaderMaterial 体积雾）──────────────
// GLSL 3D Simplex Noise（Ashima Arts）
var NOISE_GLSL = [
  'vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}',
  'vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}',
  'vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}',
  'vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}',
  'float snoise(vec3 v){',
  '  const vec2 C = vec2(1.0/6.0, 1.0/3.0);',
  '  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);',
  '  vec3 i=floor(v+dot(v,C.yyy));',
  '  vec3 x0=v-i+dot(i,C.xxx);',
  '  vec3 g=step(x0.yzx,x0.xyz);',
  '  vec3 l=1.0-g;',
  '  vec3 i1=min(g.xyz,l.zxy);',
  '  vec3 i2=max(g.xyz,l.zxy);',
  '  vec3 x1=x0-i1+C.xxx;',
  '  vec3 x2=x0-i2+C.yyy;',
  '  vec3 x3=x0-D.yyy;',
  '  i=mod289(i);',
  '  vec4 p=permute(permute(permute(',
  '    i.z+vec4(0.0,i1.z,i2.z,1.0))',
  '    +i.y+vec4(0.0,i1.y,i2.y,1.0))',
  '    +i.x+vec4(0.0,i1.x,i2.x,1.0));',
  '  float n_=0.142857142857;',
  '  vec3 ns=n_*D.wyz-D.xzx;',
  '  vec4 j=p-49.0*floor(p*ns.z*ns.z);',
  '  vec4 x_=floor(j*ns.z);',
  '  vec4 y_=floor(j-7.0*x_);',
  '  vec4 x=x_*ns.x+ns.yyyy;',
  '  vec4 y=y_*ns.x+ns.yyyy;',
  '  vec4 h=1.0-abs(x)-abs(y);',
  '  vec4 b0=vec4(x.xy,y.xy);',
  '  vec4 b1=vec4(x.zw,y.zw);',
  '  vec4 s0=floor(b0)*2.0+1.0;',
  '  vec4 s1=floor(b1)*2.0+1.0;',
  '  vec4 sh=-step(h,vec4(0.0));',
  '  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;',
  '  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;',
  '  vec3 p0=vec3(a0.xy,h.x);',
  '  vec3 p1=vec3(a0.zw,h.y);',
  '  vec3 p2=vec3(a1.xy,h.z);',
  '  vec3 p3=vec3(a1.zw,h.w);',
  '  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));',
  '  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;',
  '  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);',
  '  m=m*m;',
  '  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));',
  '}'
].join('\n');

function buildDynamicNebula() {
  var geo = new THREE.PlaneGeometry(80, 60);

  var vertSrc = [
    'varying vec2 vUv;',
    'void main(){',
    '  vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var fragSrc = NOISE_GLSL + [
    'uniform float uTime;',
    'uniform vec2 uResolution;',
    'varying vec2 vUv;',
    '',
    'float fbm(vec3 p){',
    '  float v=0.0, a=0.5;',
    '  vec3 shift=vec3(100.0);',
    '  for(int i=0;i<4;i++){',
    '    v+=a*snoise(p); p=p*2.0+shift; a*=0.5;',
    '  }',
    '  return v;',
    '}',
    '',
    '// 轻量域扭曲：2次fbm（非7次）',
    'float warpNoise(vec3 p){',
    '  float t=p.z;',
    '  vec2 q=vec2(',
    '    fbm(p+vec3(0.0,0.0,t)),',
    '    fbm(p+vec3(5.2,1.3,t*0.7))',
    '  );',
    '  return fbm(p+vec3(q*2.0, t*0.5));',
    '}',
    '',
    'void main(){',
    '  vec2 uv = vUv * 2.0 - 1.0;',
    '  float aspect = uResolution.x / uResolution.y;',
    '  uv.x *= aspect;',
    '  float r = length(uv);',
    '  float t = uTime * 0.08;',
    '',
    '  // 缓慢旋转',
    '  float rotAngle = t * 0.15;',
    '  float cs = cos(rotAngle), sn = sin(rotAngle);',
    '  vec2 ruv = vec2(uv.x*cs - uv.y*sn, uv.x*sn + uv.y*cs);',
    '',
    '  // === 漩涡扭曲（中心附近强） ===',
    '  float swirlStr = 2.5 * exp(-r * 1.8);',
    '  float baseAngle = atan(ruv.y, ruv.x);',
    '  float swirledAngle = baseAngle + swirlStr;',
    '  vec2 suv = vec2(cos(swirledAngle), sin(swirledAngle)) * r;',
    '',
    '  // === 气体（轻量域扭曲） ===',
    '  float gas = warpNoise(vec3(suv * 1.6, t * 0.12));',
    '  gas = 0.5 + 0.5 * gas;',
    '',
    '  // 第二层：简单fbm叠加（不走域扭曲，省性能）',
    '  float gas2 = fbm(vec3(suv * 3.0 + vec2(5.0), t * 0.1 + 20.0));',
    '  gas2 = 0.5 + 0.5 * gas2;',
    '',
    '  float gasMix = gas * 0.65 + gas2 * 0.35;',
    '',
    '  // === 径向衰减 ===',
    '  float fade = smoothstep(1.4, 0.1, r);',
    '  float density = gasMix * fade;',
    '',
    '  // === 中心漩涡凹陷 ===',
    '  float ring = smoothstep(0.01, 0.06, r) * smoothstep(0.18, 0.08, r);',
    '  float core = exp(-r * 4.5) * 1.2;',
    '',
    '  // === 粒子/星点（单层） ===',
    '  float stars = snoise(vec3(uv * 60.0, 0.0));',
    '  stars = smoothstep(0.80, 0.84, stars);',
    '  float starBright = exp(-r * 1.2) * 0.7 + 0.12;',
    '  stars *= starBright;',
    '',
    '  // 金色颗粒：集中在中心',
    '  float goldStars = snoise(vec3(uv * 80.0, 10.0));',
    '  goldStars = smoothstep(0.75, 0.80, goldStars);',
    '  float goldStarBright = exp(-r * 2.5) * 0.8;',
    '  goldStars *= goldStarBright;',
    '',
    '  // 金色气体：围绕中心的暖色雾气',
    '  float goldGas = fbm(vec3(suv * 4.0 + vec2(20.0), t * 0.15 + 5.0));',
    '  goldGas = 0.5 + 0.5 * goldGas;',
    '  float goldGasMask = exp(-r * 3.0) * goldGas;',
    '',
    '  // === 颜色（5色渐变：蓝→紫→粉→金→亮核） ===',
    '  vec3 cDeep  = vec3(0.04, 0.06, 0.18);',
    '  vec3 cBlue  = vec3(0.15, 0.22, 0.55);',
    '  vec3 cMid   = vec3(0.35, 0.12, 0.60);',
    '  vec3 cGold  = vec3(0.85, 0.55, 0.20);',
    '  vec3 cCore  = vec3(1.0, 0.72, 0.25);',
    '',
    '  float blueFactor = smoothstep(0.3, 1.0, r);',
    '  float goldFactor = 1.0 - smoothstep(0.0, 0.4, r);',
    '',
    '  vec3 col = mix(cMid, cBlue, blueFactor * fade);',
    '  col = mix(col, cDeep, (1.0 - fade) * 0.5);',
    '  col = mix(col, cGold, goldFactor * density * 0.7);',
    '  col += cGold * goldGasMask * 0.35;',
    '  col *= 1.0 - ring * 0.55;',
    '  col = mix(col, cCore, core);',
    '  vec3 starColor = mix(vec3(1.0, 0.85, 0.5), vec3(0.7, 0.8, 1.0), blueFactor);',
    '  col += starColor * stars;',
    '  col += vec3(1.0, 0.75, 0.3) * goldStars;',
    '',
    '  float alpha = density * 0.6 + core * 0.9 + stars * 0.4;',
    '  alpha = clamp(alpha, 0.0, 1.0);',
    '',
    '  gl_FragColor = vec4(col, alpha);',
    '}'
  ].join('\n');

  var mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: vertSrc,
    fragmentShader: fragSrc,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });

  dynamicNebula = new THREE.Mesh(geo, mat);
  dynamicNebula.position.set(0, 0, -30);
  dynamicNebula.renderOrder = -1;
  dynamicNebula.frustumCulled = false;
  scene.add(dynamicNebula);
}

// 更新动态星云（每帧调用）
function updateDynamicNebula(dt, time) {
  if (!dynamicNebula) return;
  var mat = dynamicNebula.material;
  mat.uniforms.uTime.value += 0.005;
  if (nebulaRipple > 0.001) {
    nebulaRipple *= 0.96;
  } else {
    nebulaRipple = 0;
  }
}

function generateLabelSprite(book, size) {
  size = size || 256;
  const c = document.createElement('canvas');
  c.width = size*1.4; c.height = size*0.7;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  const fs = book.title.length<=4 ? size*0.26 : size*(0.26-(book.title.length-4)*0.035);
  ctx.font = `900 ${fs}px "PingFang SC","Microsoft YaHei","SimHei","Noto Sans SC",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = book.color; ctx.shadowBlur = 10;
  ctx.fillText(book.title, c.width/2, c.height/2);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({map:tex, blending:THREE.NormalBlending, transparent:true, opacity:1.0, depthWrite:false, depthTest:true});
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.2,1.1,1);
  sprite.userData.bookColor = book.color;
  return sprite;
}

// 重新生成标签纹理（变色用）
function regenerateLabelTexture(book, size, newColor) {
  size = size || 256;
  const c = document.createElement('canvas');
  c.width = size*1.4; c.height = size*0.7;
  const ctx = c.getContext('2d');
  ctx.fillStyle = newColor;
  const fs = book.title.length<=4 ? size*0.26 : size*(0.26-(book.title.length-4)*0.035);
  ctx.font = `900 ${fs}px "PingFang SC","Microsoft YaHei","SimHei","Noto Sans SC",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = newColor; ctx.shadowBlur = 14;
  ctx.fillText(book.title, c.width/2, c.height/2);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
  return tex;
}

function generatePanelCover(book, size) {
  size = size || 350;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  const [r,g,b] = hexToRGB(book.color);
  const cx = size/2, cy = size/2;

  // 星云纹理背景
  const imgData = ctx.createImageData(size, size);
  const d = imgData.data;
  const rand = seededRandom(parseInt(book.id.slice(1)) * 137 + 42);
  const N = 32;
  const grid = new Float32Array(N*N);
  for (let i=0; i<N*N; i++) grid[i] = rand();
  function noise(x, y, s) {
    const nx = (x/size*s)%N, ny = (y/size*s)%N;
    const ix = nx|0, iy = ny|0, fx = nx-ix, fy = ny-iy;
    const ix1 = (ix+1)%N, iy1 = (iy+1)%N;
    return grid[iy*N+ix]*(1-fx)*(1-fy) + grid[iy*N+ix1]*fx*(1-fy)
         + grid[iy1*N+ix]*(1-fx)*fy + grid[iy1*N+ix1]*fx*fy;
  }
  function fbm(x, y, oct, s) {
    let v = 0, a = 0.5, f = 1;
    for (let o=0; o<oct; o++) { v += a*noise(x, y, s*f); f *= 2; a *= 0.5; }
    return v;
  }
  for (let py=0; py<size; py++) {
    for (let px=0; px<size; px++) {
      const i = (py*size+px)*4;
      const warp = fbm(px, py, 3, 2.5);
      const cloud = fbm(px + warp*150, py + warp*120, 5, 3);
      const dist = Math.sqrt((px-cx)*(px-cx)+(py-cy)*(py-cy)) / (size*0.5);
      const vignette = Math.max(0, 1 - dist*dist);
      const brightness = cloud * vignette;
      d[i]   = Math.min(255, r * brightness * 0.8);
      d[i+1] = Math.min(255, g * brightness * 0.8);
      d[i+2] = Math.min(255, b * brightness * 0.8);
      d[i+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // 中心柔光
  var coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size*0.35);
  coreGrad.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
  coreGrad.addColorStop(0.5, `rgba(${r},${g},${b},0.1)`);
  coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = coreGrad;
  ctx.fillRect(0,0,size,size);

  // 标题文字
  ctx.fillStyle = '#ffffff';
  const fs = book.title.length<=4 ? size*0.18 : size*(0.18-(book.title.length-4)*0.02);
  ctx.font = `900 ${fs}px "PingFang SC","Microsoft YaHei","SimHei","Noto Sans SC",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = book.color; ctx.shadowBlur = 20;
  ctx.fillText(book.title, cx, cy);
  ctx.shadowBlur = 0;

  // 作者
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `400 ${size*0.05}px "PingFang SC","Microsoft YaHei","SimHei","Noto Sans SC",sans-serif`;
  ctx.fillText(book.author, cx, cy + fs*0.8);

  return c;
}

// ─── 场景构建 ──────────────────────────────────────
function buildScene(nebulaType) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#030308');
  scene.fog = new THREE.FogExp2('#030308', 0.00012);

  camera = new THREE.PerspectiveCamera(58, window.innerWidth/window.innerHeight, 0.4, 200);
  camera.position.set(0,12,22);
  camera.lookAt(0,0,0);

  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMappingExposure = 0.65;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.07;
  controls.enableZoom = true; controls.zoomSpeed = 1.1;
  controls.minDistance = 5; controls.maxDistance = 50;
  controls.enablePan = false; controls.target.set(0,0,0); controls.update();

  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth,window.innerHeight), 0.15, 0.5, 0.65);
  composer.addPass(bloomPass);

  scene.add(new THREE.AmbientLight(0x1c1640, 0.2));
  scene.add(new THREE.HemisphereLight(0x5040a0, 0x08081a, 0.1));
  const keyLight = new THREE.DirectionalLight(0xf0e8ff, 0.4);
  keyLight.position.set(5,4,10); scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x403060, 0.12);
  fillLight.position.set(-4,0,2); scene.add(fillLight);

  const poiLights = [
    {c:0xa855f7, p:[0,3.5,5], in:1.0, dist:18},
    {c:0x22d3ee, p:[5,-1,4], in:0.9, dist:16},
    {c:0xe879f9, p:[-4,1,5], in:0.8, dist:16},
    {c:0x34d399, p:[3,-3,6], in:0.8, dist:14},
  ];
  poiLights.forEach(function(pl) {
    var l = new THREE.PointLight(pl.c, pl.in, pl.dist, 1.0);
    l.position.set(pl.p[0],pl.p[1],pl.p[2]); scene.add(l);
  });

  buildNebulae();
  buildDynamicNebula();
  buildStars();
  buildOrbs(nebulaType);
}

function createNebulaSprite(x,y,z,size,colorInputs,opacity) {
  var nc = document.createElement('canvas'); nc.width = 512; nc.height = 512;
  var nctx = nc.getContext('2d');
  var colors = Array.isArray(colorInputs) ? colorInputs : [colorInputs];
  colors.forEach(function(color) {
    var cx2 = 256+(Math.random()-0.5)*200, cy2 = 256+(Math.random()-0.5)*200;
    var r = 120+Math.random()*180;
    var g = nctx.createRadialGradient(cx2,cy2,0,cx2,cy2,r);
    g.addColorStop(0, color);
    g.addColorStop(0.25, color.replace(/[\d.]+\)$/,'0.55)'));
    g.addColorStop(0.55, color.replace(/[\d.]+\)$/,'0.12)'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    nctx.fillStyle = g; nctx.fillRect(0,0,512,512);
  });
  for (var i=0; i<60; i++) {
    var rx = 256+(Math.random()-0.5)*420, ry = 256+(Math.random()-0.5)*420;
    var rr = 0.8+Math.random()*3;
    nctx.fillStyle = 'rgba(255,255,255,'+(0.02+Math.random()*0.1)+')';
    nctx.beginPath(); nctx.arc(rx,ry,rr,0,Math.PI*2); nctx.fill();
  }
  var tex = new THREE.CanvasTexture(nc);
  var spr = new THREE.Sprite(new THREE.SpriteMaterial({map:tex,blending:THREE.AdditiveBlending,opacity:opacity,depthWrite:false}));
  spr.position.set(x,y,z); spr.scale.set(size,size,1);
  return spr;
}

function buildNebulae() {
  var nebulaDefs = [
    {colors:['rgba(34,211,238,1)','rgba(56,189,248,1)','rgba(167,139,250,1)'], size:22, opacity:0.10},
    {colors:['rgba(168,85,247,1)','rgba(232,121,249,1)','rgba(192,132,252,1)'], size:24, opacity:0.11},
    {colors:['rgba(52,211,153,1)','rgba(45,212,191,1)','rgba(34,211,238,1)'], size:20, opacity:0.09},
    {colors:['rgba(232,121,249,1)','rgba(244,114,182,1)','rgba(168,85,247,1)'], size:23, opacity:0.10},
    {colors:['rgba(56,189,248,1)','rgba(125,211,252,1)','rgba(34,211,238,1)'], size:25, opacity:0.08},
    {colors:['rgba(124,58,237,1)','rgba(168,85,247,1)','rgba(99,102,241,1)'], size:21, opacity:0.11},
    {colors:['rgba(250,204,21,1)','rgba(251,191,36,1)','rgba(252,165,34,1)'], size:20, opacity:0.08},
    {colors:['rgba(244,114,182,1)','rgba(232,121,249,1)','rgba(251,113,133,1)'], size:18, opacity:0.09},
  ];
  var nebRadius = 25;
  var goldRatio = (1+Math.sqrt(5))/2;
  nebulaDefs.forEach(function(def,i) {
    var idx = i+0.5;
    var phi = Math.acos(1-2*idx/nebulaDefs.length);
    var theta = 2*Math.PI*idx/goldRatio;
    var r = nebRadius+Math.random()*8;
    scene.add(createNebulaSprite(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi), def.size, def.colors, def.opacity));
  });
}

function buildStars() {
  var STARS = 4000;
  var geo = new THREE.BufferGeometry();
  var pos = new Float32Array(STARS*3);
  var col = new Float32Array(STARS*3);
  for (var i=0; i<STARS; i++) {
    var r = 14+Math.random()*40, th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
    pos[i*3] = r*Math.sin(ph)*Math.cos(th);
    pos[i*3+1] = r*Math.sin(ph)*Math.sin(th);
    pos[i*3+2] = r*Math.cos(ph);
    var cl = new THREE.Color().setHSL(0.55+Math.random()*0.3, 0.35+Math.random()*0.55, 0.6+Math.random()*0.4);
    col[i*3] = cl.r; col[i*3+1] = cl.g; col[i*3+2] = cl.b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  stars = new THREE.Points(geo, new THREE.PointsMaterial({
    size:0.09, vertexColors:true, blending:THREE.AdditiveBlending,
    depthWrite:false, transparent:true, opacity:1.0
  }));
  stars.userData.twinkle = [];
  scene.add(stars);

  // 闪烁亮星（独立Sprite）
  var starSprites = [];
  var spriteTex = getParticleTex('#ffffff');
  for (var i=0; i<120; i++) {
    var r = 12+Math.random()*35, th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
    var mat = new THREE.SpriteMaterial({map:spriteTex, blending:THREE.AdditiveBlending, transparent:true, depthWrite:false, opacity:0.3+Math.random()*0.7});
    var sp = new THREE.Sprite(mat);
    var s = 0.08+Math.random()*0.35;
    sp.scale.set(s, s, 1);
    sp.position.set(r*Math.sin(ph)*Math.cos(th), r*Math.sin(ph)*Math.sin(th), r*Math.cos(ph));
    sp.userData = {phase:Math.random()*Math.PI*2, speed:0.3+Math.random()*0.8, baseSize:s, baseOp:0.3+Math.random()*0.7};
    scene.add(sp);
    starSprites.push(sp);
  }
  stars.userData.twinkleSprites = starSprites;
}

function buildOrbs(nebulaType) {
  orbMeshes = [];
  orbLabels = [];
  var orbGroup = new THREE.Group(); scene.add(orbGroup);

  var books = NEBULA_BOOKS[nebulaType] || [];
  var nodePosArr = new Float32Array(books.length*3);

  // ── 中央恒星（ShaderMaterial）──
  var starColors = {scifi:'#5b8dee', xianxia:'#f59e0b', romance:'#ec4899'};
  var starDarkColors = {scifi:'#1a3a5c', xianxia:'#8b4513', romance:'#6b1d3a'};
  var starBrightColors = {scifi:'#c8e6ff', xianxia:'#fff3c4', romance:'#ffe0f0'};
  var starHex = starColors[nebulaType] || '#f59e0b';
  var starColor = new THREE.Color(starHex);
  var starDarkColor = new THREE.Color(starDarkColors[nebulaType] || '#8b4513');
  var starBrightColor = new THREE.Color(starBrightColors[nebulaType] || '#fff3c4');
  var starRadius = ORB_RADIUS * 2.2;

  var starMat = new THREE.ShaderMaterial({
    uniforms: {
      uColor:      { value: starColor },
      uDarkColor:  { value: starDarkColor },
      uBrightColor:{ value: starBrightColor },
      uTime:       { value: 0.0 }
    },
    vertexShader: [
      'varying vec3 vNormal;',
      'varying vec3 vLocalPos;',
      'varying vec3 vViewDir;',
      'void main() {',
      '  vNormal = normalize(normalMatrix * normal);',
      '  vLocalPos = position;',
      '  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);',
      '  vViewDir = -normalize(mvPos.xyz);',
      '  gl_Position = projectionMatrix * mvPos;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 uColor;',
      'uniform vec3 uDarkColor;',
      'uniform vec3 uBrightColor;',
      'uniform float uTime;',
      'varying vec3 vNormal;',
      'varying vec3 vLocalPos;',
      'varying vec3 vViewDir;',

      'float hash(vec3 p) {',
      '  p = fract(p * 0.3183099 + 0.1);',
      '  p *= 17.0;',
      '  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));',
      '}',
      'float noise3D(vec3 p) {',
      '  vec3 i = floor(p);',
      '  vec3 f = fract(p);',
      '  f = f*f*(3.0-2.0*f);',
      '  return mix(',
      '    mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),',
      '        mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),',
      '    mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),',
      '        mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);',
      '}',
      'float fbm(vec3 p) {',
      '  float v = 0.0, a = 0.5;',
      '  for (int i = 0; i < 4; i++) { v += a * noise3D(p); p *= 2.0; a *= 0.5; }',
      '  return v;',
      '}',

      'void main() {',
      '  vec3 p = vLocalPos * 2.0;',
      '  float t = uTime * 0.05;',

      '  float n1 = fbm(p + vec3(t, t * 0.6, t * 0.3));',
      '  float n2 = fbm(p * 3.0 + vec3(t * 0.8, t * 0.4, t * 0.5));',
      '  float n3 = fbm(p * 1.2 + vec3(10.0));',
      '  float darkMask = smoothstep(0.35, 0.52, n3);',
      '  float brightMask = smoothstep(0.62, 0.82, n2) * 0.5;',

      '  vec3 col = mix(uColor * (0.85 + n1 * 0.3), uDarkColor, darkMask * 0.55);',
      '  col = mix(col, uBrightColor, brightMask);',

      '  float NdotV = max(dot(vNormal, vViewDir), 0.0);',
      '  float limb = pow(NdotV, 0.55);',
      '  col *= 0.5 + limb * 0.5;',

      '  gl_FragColor = vec4(col, 1.0);',
      '}'
    ].join('\n'),
    depthWrite: true
  });
  var starGeo = new THREE.SphereGeometry(starRadius, ORB_SEGMENTS, ORB_SEGMENTS);
  centralStar = new THREE.Mesh(starGeo, starMat);
  centralStar.position.set(0, 0, 0);
  orbGroup.add(centralStar);

  // ── 恒星辉光 + 气体云 ──
  var [sr,sg,sb] = hexToRGB(starHex);
  function makeRadialCanvas(r, g, b, stops) {
    var gc = document.createElement('canvas');
    gc.width = 128; gc.height = 128;
    var gx = gc.getContext('2d');
    var gg = gx.createRadialGradient(64,64,0,64,64,64);
    for (var si = 0; si < stops.length; si++) {
      var s = stops[si];
      gg.addColorStop(s[0], s[1]);
    }
    gx.fillStyle = gg;
    gx.fillRect(0,0,128,128);
    return new THREE.CanvasTexture(gc);
  }

  // 三层静态辉光
  var starGlowTex1 = makeRadialCanvas(sr,sg,sb, [[0,`rgba(${sr},${sg},${sb},0.9)`],[0.25,`rgba(${sr},${sg},${sb},0.45)`],[0.6,`rgba(${sr},${sg},${sb},0.1)`],[1,'rgba(0,0,0,0)']]);
  var starGlow1 = new THREE.Sprite(new THREE.SpriteMaterial({map:starGlowTex1, blending:THREE.AdditiveBlending, transparent:true, opacity:0.85, depthWrite:false}));
  starGlow1.scale.set(starRadius*5, starRadius*5, 1);
  orbGroup.add(starGlow1);

  var starGlowTex2 = makeRadialCanvas(sr,sg,sb, [[0,`rgba(${sr},${sg},${sb},0.5)`],[0.25,`rgba(${sr},${sg},${sb},0.18)`],[0.6,`rgba(${sr},${sg},${sb},0.04)`],[1,'rgba(0,0,0,0)']]);
  var starGlow2 = new THREE.Sprite(new THREE.SpriteMaterial({map:starGlowTex2, blending:THREE.AdditiveBlending, transparent:true, opacity:0.55, depthWrite:false}));
  starGlow2.scale.set(starRadius*9, starRadius*9, 1);
  orbGroup.add(starGlow2);

  var starGlowTex3 = makeRadialCanvas(sr,sg,sb, [[0,`rgba(${sr},${sg},${sb},0.25)`],[0.25,`rgba(${sr},${sg},${sb},0.08)`],[1,'rgba(0,0,0,0)']]);
  var starGlow3 = new THREE.Sprite(new THREE.SpriteMaterial({map:starGlowTex3, blending:THREE.AdditiveBlending, transparent:true, opacity:0.35, depthWrite:false}));
  starGlow3.scale.set(starRadius*13, starRadius*13, 1);
  orbGroup.add(starGlow3);

  // 存储以便动画脉冲
  centralStar.userData.glowSprites = [starGlow1, starGlow2, starGlow3];
  centralStar.userData.starRadius = starRadius;

  // ── 行星公转参数 ──
  var orbitRadii = [];
  var baseRadius = 5.5;
  var radiusStep = 2.2;
  for (var k=0; k<books.length; k++) {
    orbitRadii.push(baseRadius + k * radiusStep);
  }

  books.forEach(function(book,i) {
    // 星球纹理
    var texCanvas = generatePlanetTexture(book.color, (i+1)*137, book.id);
    var tex = new THREE.CanvasTexture(texCanvas);
    tex.encoding = THREE.sRGBEncoding;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;

    var mat = new THREE.MeshStandardMaterial({map:tex, roughness:0.7, metalness:0.1, emissive:new THREE.Color(book.color), emissiveIntensity:0.02, depthWrite:true});
    var geo = new THREE.SphereGeometry(ORB_RADIUS, ORB_SEGMENTS, ORB_SEGMENTS);
    var mesh = new THREE.Mesh(geo, mat);

    // 大小差异化
    var sizeScale = 0.7 + Math.random() * 0.3;
    mesh.scale.setScalar(sizeScale);

    // 公转参数
    var orbitR = orbitRadii[i];
    var angle = Math.random() * Math.PI * 2;
    var speed = 0.04 + Math.random() * 0.18;
    var tiltY = (Math.random() - 0.5) * 0.3;
    var baseRotSpeed = (0.03+Math.random()*0.06)*(Math.random()>0.5?1:-1);
    // 大行星转慢、小行星转快
    var rotSpeed = baseRotSpeed / sizeScale;

    mesh.position.set(
      Math.cos(angle) * orbitR,
      tiltY,
      Math.sin(angle) * orbitR
    );
    mesh.userData = {
      book:book, id:book.id,
      basePos:mesh.position.clone(),
      orbitR:orbitR,
      orbitAngle:angle,
      orbitSpeed:speed,
      orbitTilt:tiltY,
      sizeScale:sizeScale,
      baseRotSpeed:rotSpeed,
      dimAmount:0,
      glowBoost:0
    };
    orbGroup.add(mesh); orbMeshes.push(mesh);

    // ── 轨道环（纯色环 + 粒子尘埃）──
    var ringColor = new THREE.Color(book.color);
    var [rr,rg,rb] = hexToRGB(book.color);

    // 主轨道环
    var ringGeo = new THREE.RingGeometry(orbitR - 0.04, orbitR + 0.04, 128);
    var ringMat = new THREE.MeshBasicMaterial({color:ringColor, transparent:true, opacity:0.35, blending:THREE.AdditiveBlending, side:THREE.DoubleSide, depthWrite:false});
    var ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, tiltY, 0);
    orbGroup.add(ring);

    // 粒子尘埃带
    var dustCount = 80;
    var dustPos = new Float32Array(dustCount * 3);
    var dustCol = new Float32Array(dustCount * 3);
    var dustSpeeds = new Float32Array(dustCount);
    var dustAngles = new Float32Array(dustCount);
    var dustDrifts = new Float32Array(dustCount);
    for (var di = 0; di < dustCount; di++) {
      var da = Math.random() * Math.PI * 2;
      var dr = orbitR + (Math.random() - 0.5) * 0.3;
      dustPos[di*3]   = Math.cos(da) * dr;
      dustPos[di*3+1] = tiltY + (Math.random() - 0.5) * 0.15;
      dustPos[di*3+2] = Math.sin(da) * dr;
      var mix = Math.random() * 0.3;
      dustCol[di*3]   = (rr/255) + (1 - rr/255) * mix;
      dustCol[di*3+1] = (rg/255) + (1 - rg/255) * mix;
      dustCol[di*3+2] = (rb/255) + (1 - rb/255) * mix;
      dustAngles[di] = da;
      dustSpeeds[di] = speed * (0.85 + Math.random() * 0.3);
      dustDrifts[di] = (Math.random() - 0.5) * 0.002;
    }
    var dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
    var dustMat = new THREE.PointsMaterial({
      size: 0.06, vertexColors: true, map: getParticleTex(book.color),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.5,
      sizeAttenuation: true
    });
    var dustSystem = new THREE.Points(dustGeo, dustMat);
    dustSystem.userData = {
      isOrbitDust: true, orbitR: orbitR, tiltY: tiltY,
      angles: dustAngles, speeds: dustSpeeds, drifts: dustDrifts
    };
    orbGroup.add(dustSystem);
    orbitDustSystems.push(dustSystem);

    // 外层柔和辉光环
    var ringGlowGeo = new THREE.RingGeometry(orbitR - 0.15, orbitR + 0.15, 128);
    var ringGlowMat = new THREE.MeshBasicMaterial({color:ringColor, transparent:true, opacity:0.1, blending:THREE.AdditiveBlending, side:THREE.DoubleSide, depthWrite:false});
    var ringGlow = new THREE.Mesh(ringGlowGeo, ringGlowMat);
    ringGlow.rotation.x = -Math.PI / 2;
    ringGlow.position.set(0, tiltY, 0);
    orbGroup.add(ringGlow);

    // 大气层光晕
    var atmoCanvas = generateAtmosphereTexture(book.color);
    var atmoTex = new THREE.CanvasTexture(atmoCanvas);
    var atmoMat = new THREE.SpriteMaterial({map:atmoTex, blending:THREE.AdditiveBlending, transparent:true, opacity:0.1, depthWrite:false});
    var atmo = new THREE.Sprite(atmoMat);
    atmo.scale.set(ORB_RADIUS*3.2, ORB_RADIUS*3.2, 1);
    atmo.userData = {parentOrb:mesh};
    orbGroup.add(atmo);

    // 外层辉光
    var glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128; glowCanvas.height = 128;
    var gctx = glowCanvas.getContext('2d');
    var [gr,gg,gb] = hexToRGB(book.color);
    var glowGrad = gctx.createRadialGradient(64,64,ORB_RADIUS*30,64,64,64);
    glowGrad.addColorStop(0, `rgba(${gr},${gg},${gb},0)`);
    glowGrad.addColorStop(0.5, `rgba(${gr},${gg},${gb},0.03)`);
    glowGrad.addColorStop(0.8, `rgba(${gr},${gg},${gb},0.08)`);
    glowGrad.addColorStop(1, `rgba(${gr},${gg},${gb},0)`);
    gctx.fillStyle = glowGrad; gctx.fillRect(0,0,128,128);
    var glowTex = new THREE.CanvasTexture(glowCanvas);
    var glowMat = new THREE.SpriteMaterial({map:glowTex, blending:THREE.AdditiveBlending, transparent:true, opacity:0.25, depthWrite:false});
    var glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(ORB_RADIUS*6, ORB_RADIUS*6, 1);
    glowSprite.userData = {parentOrb:mesh, baseOpacity:0.25};
    orbGroup.add(glowSprite);

    // ── 球形保护壳（Fresnel 边缘发光）──
    var shell = createShellMesh(book.color, mesh);
    shell.scale.setScalar(sizeScale);
    orbGroup.add(shell);

    // ── 壳体附着粒子（大气层小颗粒）──
    var shellParticleCount = 40;
    var spPos = new Float32Array(shellParticleCount * 3);
    var spCol = new Float32Array(shellParticleCount * 3);
    var spAngles = new Float32Array(shellParticleCount);
    var spElevations = new Float32Array(shellParticleCount);
    var spRadii = new Float32Array(shellParticleCount);
    var spSpeeds = new Float32Array(shellParticleCount);
    var [spr,spg,spb] = hexToRGB(book.color);
    for (var spi = 0; spi < shellParticleCount; spi++) {
      var spa = Math.random() * Math.PI * 2;
      var spe = (Math.random() - 0.5) * Math.PI;
      var spr2 = ORB_RADIUS * 1.55 * sizeScale * (0.95 + Math.random() * 0.3);
      spPos[spi*3]   = Math.cos(spa) * Math.cos(spe) * spr2;
      spPos[spi*3+1] = Math.sin(spe) * spr2;
      spPos[spi*3+2] = Math.sin(spa) * Math.cos(spe) * spr2;
      var mix = Math.random() * 0.25;
      spCol[spi*3]   = (spr/255) * (0.8 + mix * 0.4);
      spCol[spi*3+1] = (spg/255) * (0.8 + mix * 0.4);
      spCol[spi*3+2] = (spb/255) * (0.8 + mix * 0.4);
      spAngles[spi] = spa;
      spElevations[spi] = spe;
      spRadii[spi] = spr2;
      spSpeeds[spi] = (0.02 + Math.random() * 0.04) * (Math.random() > 0.5 ? 1 : -1);
    }
    var spGeo = new THREE.BufferGeometry();
    spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3));
    spGeo.setAttribute('color', new THREE.BufferAttribute(spCol, 3));
    var spMat = new THREE.PointsMaterial({
      size: 0.05, vertexColors: true, map: getParticleTex(book.color),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55,
      sizeAttenuation: true
    });
    var shellParticles = new THREE.Points(spGeo, spMat);
    shellParticles.userData = {
      isShellParticles: true, parentOrb: mesh, sizeScale: sizeScale,
      angles: spAngles, elevations: spElevations, radii: spRadii, speeds: spSpeeds
    };
    orbGroup.add(shellParticles);

    // 标签
    var label = generateLabelSprite(book);
    label.position.copy(mesh.position);
    label.position.y += ORB_RADIUS+0.5;
    label.renderOrder = 2;
    label.userData = {parentOrb:mesh};
    orbGroup.add(label); orbLabels.push(label);

    nodePosArr[i*3] = mesh.position.x;
    nodePosArr[i*3+1] = mesh.position.y;
    nodePosArr[i*3+2] = mesh.position.z;
  });
}

function buildConnections() {
  // 清理旧连线和发光管
  var oldItems = [];
  scene.traverse(function(child) {
    if (child.userData && child.userData.isConn) oldItems.push(child);
  });
  oldItems.forEach(function(c) { scene.remove(c); if(c.geometry)c.geometry.dispose(); if(c.material){if(c.material.map)c.material.map.dispose();c.material.dispose();} });
  connFlows = [];

  var ccfg = CONN_COLOR_MAP[currentNebulaType] || CONN_COLOR_MAP.scifi;
  var nebHexMap = {scifi:'#38bdf8', xianxia:'#f59e0b', romance:'#f472b6'};
  var nebHex = nebHexMap[currentNebulaType] || '#38bdf8';

  // 每个星球找最近邻居连线，去重
  var connectedPairs = {};
  for (var i=0; i<orbMeshes.length; i++) {
    var nearest = -1;
    var nearestDist = Infinity;
    for (var j=0; j<orbMeshes.length; j++) {
      if(i===j) continue;
      var dist = orbMeshes[i].position.distanceTo(orbMeshes[j].position);
      if(dist < nearestDist) { nearestDist = dist; nearest = j; }
    }
    if(nearest < 0) continue;
    var key = i < nearest ? i+':'+nearest : nearest+':'+i;
    if(connectedPairs[key]) continue;
    connectedPairs[key] = true;

      var pi = orbMeshes[i].position;
      var pj = orbMeshes[nearest].position;

      // 计算垂直方向
      var dir = new THREE.Vector3().subVectors(pj, pi).normalize();
      var up = new THREE.Vector3(0,1,0);
      var perp1 = new THREE.Vector3().crossVectors(dir, up).normalize();
      if(perp1.length()<0.01) perp1.set(1,0,0);
      var perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize();

      // ─── 粒子数据 ───
      var particleProgress = new Float32Array(CONN_PARTICLES);
      var particleSpeeds = new Float32Array(CONN_PARTICLES);
      var particleRadii = new Float32Array(CONN_PARTICLES);
      var particleAngles = new Float32Array(CONN_PARTICLES);
      for (var p=0; p<CONN_PARTICLES; p++) {
        particleProgress[p] = Math.random();
        particleSpeeds[p] = 0.01 + Math.random()*0.03;
        particleRadii[p] = Math.sqrt(Math.random()) * CONN_TUBE_RADIUS;
        particleAngles[p] = Math.random() * Math.PI * 2;
      }

      var hueJitter = (Math.random()-0.5)*0.06;
      var ptCol = new THREE.Color().setHSL(ccfg.hue+hueJitter, ccfg.sat, ccfg.light);

      var pGeo = new THREE.BufferGeometry();
      var pPositions = new Float32Array(CONN_PARTICLES*3);
      var pColors = new Float32Array(CONN_PARTICLES*3);

      for (var p=0; p<CONN_PARTICLES; p++) {
        var pp = particleProgress[p];
        var rr = particleRadii[p];
        var aa = particleAngles[p];
        var cx = Math.cos(aa)*rr, cy = Math.sin(aa)*rr;
        pPositions[p*3] = pi.x+(pj.x-pi.x)*pp + perp1.x*cx + perp2.x*cy;
        pPositions[p*3+1] = pi.y+(pj.y-pi.y)*pp + perp1.y*cx + perp2.y*cy;
        pPositions[p*3+2] = pi.z+(pj.z-pi.z)*pp + perp1.z*cx + perp2.z*cy;
        pColors[p*3] = ptCol.r; pColors[p*3+1] = ptCol.g; pColors[p*3+2] = ptCol.b;
      }

      pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions,3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(pColors,3));

      var pMat = new THREE.PointsMaterial({
        size:0.15, vertexColors:true, map:getParticleTex(nebHex),
        blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:0.5
      });
      var pts = new THREE.Points(pGeo, pMat);
      pts.userData = {
        isConn:true, from:i, to:nearest,
        perp1:perp1, perp2:perp2,
        particleProgress:particleProgress,
        particleSpeeds:particleSpeeds,
        particleRadii:particleRadii,
        particleAngles:particleAngles
      };
      scene.add(pts); connFlows.push(pts);

      // ─── 外层扩散光晕（大粒子、低透明度、更宽散布）───
      var haloCount = 80;
      var haloProgress = new Float32Array(haloCount);
      var haloSpeeds = new Float32Array(haloCount);
      var haloRadii = new Float32Array(haloCount);
      var haloAngles = new Float32Array(haloCount);
      for (var h=0; h<haloCount; h++) {
        haloProgress[h] = Math.random();
        haloSpeeds[h] = 0.005 + Math.random()*0.015;
        haloRadii[h] = CONN_TUBE_RADIUS * (0.8 + Math.random()*2.5);
        haloAngles[h] = Math.random() * Math.PI * 2;
      }
      var hGeo = new THREE.BufferGeometry();
      var hPos = new Float32Array(haloCount*3);
      var hCol = new Float32Array(haloCount*3);
      var ptColH = new THREE.Color().setHSL(ccfg.hue, ccfg.sat*0.5, ccfg.light*0.8);
      for (var h=0; h<haloCount; h++) {
        var pp = haloProgress[h], rr = haloRadii[h], aa = haloAngles[h];
        var cx = Math.cos(aa)*rr, cy = Math.sin(aa)*rr;
        hPos[h*3] = pi.x+(pj.x-pi.x)*pp + perp1.x*cx + perp2.x*cy;
        hPos[h*3+1] = pi.y+(pj.y-pi.y)*pp + perp1.y*cx + perp2.y*cy;
        hPos[h*3+2] = pi.z+(pj.z-pi.z)*pp + perp1.z*cx + perp2.z*cy;
        hCol[h*3] = ptColH.r; hCol[h*3+1] = ptColH.g; hCol[h*3+2] = ptColH.b;
      }
      hGeo.setAttribute('position', new THREE.BufferAttribute(hPos,3));
      hGeo.setAttribute('color', new THREE.BufferAttribute(hCol,3));
      var hMat = new THREE.PointsMaterial({
        size:0.35, vertexColors:true, map:getParticleTex(nebHex),
        blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:0.12
      });
      var hPts = new THREE.Points(hGeo, hMat);
      hPts.userData = {
        isConn:true, from:i, to:nearest, isHalo:true,
        perp1:perp1, perp2:perp2,
        particleProgress:haloProgress,
        particleSpeeds:haloSpeeds,
        particleRadii:haloRadii,
        particleAngles:haloAngles
      };
      scene.add(hPts); connFlows.push(hPts);
    }
  }

// ─── UI 交互 ──────────────────────────────────────
function getHits(e) {
  var mouse = new THREE.Vector2();
  mouse.x = (e.clientX/window.innerWidth)*2-1;
  mouse.y = -(e.clientY/window.innerHeight)*2+1;
  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  return raycaster.intersectObjects(orbMeshes);
}

// ─── 探索进度系统 ──────────────────────────────
function getExplorationData() {
  try { return JSON.parse(localStorage.getItem('bookEmu_exploration') || '{}'); } catch(e) { return {}; }
}
function saveExplorationData(data) {
  localStorage.setItem('bookEmu_exploration', JSON.stringify(data));
}
function getExplorationProgress(bookId) {
  var data = getExplorationData();
  return data[bookId] ? data[bookId].progress || 0 : 0;
}
function addExplorationProgress(bookId, amount) {
  var data = getExplorationData();
  if (!data[bookId]) data[bookId] = { progress: 0, clicks: 0, viewed: false, played: false };
  data[bookId].clicks = (data[bookId].clicks || 0) + 1;
  data[bookId].progress = Math.min(100, (data[bookId].progress || 0) + amount);
  saveExplorationData(data);
  return data[bookId].progress;
}
function markBookViewed(bookId) {
  var data = getExplorationData();
  if (!data[bookId]) data[bookId] = { progress: 0, clicks: 0, viewed: false, played: false };
  if (!data[bookId].viewed) {
    data[bookId].viewed = true;
    data[bookId].progress = Math.min(100, (data[bookId].progress || 0) + 15);
    saveExplorationData(data);
  }
  return data[bookId].progress;
}
function markBookPlayed(bookId) {
  var data = getExplorationData();
  if (!data[bookId]) data[bookId] = { progress: 0, clicks: 0, viewed: false, played: false };
  if (!data[bookId].played) {
    data[bookId].played = true;
    data[bookId].progress = Math.min(100, (data[bookId].progress || 0) + 30);
    saveExplorationData(data);
  }
  return data[bookId].progress;
}

// ─── 相关书籍渲染 ──────────────────────────────
function renderRelatedBooks(book) {
  var container = document.getElementById('panel-related');
  if (!container) return;
  container.innerHTML = '';
  var allBooks = NEBULA_BOOKS[currentNebulaType] || [];
  allBooks.forEach(function(b) {
    if (b.id === book.id) return;
    var item = document.createElement('div');
    item.className = 'panel-related-item';
    item.addEventListener('click', function() { selectBook(b); });
    var thumb = document.createElement('div');
    thumb.className = 'panel-related-thumb';
    var tc = document.createElement('canvas');
    tc.width = 72; tc.height = 72;
    var tctx = tc.getContext('2d');
    var rgb = hexToRGB(b.color);
    var tgrad = tctx.createRadialGradient(36,36,0,36,36,36);
    tgrad.addColorStop(0, 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0.35)');
    tgrad.addColorStop(1, 'rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',0.05)');
    tctx.fillStyle = '#0c0a24'; tctx.fillRect(0,0,72,72);
    tctx.fillStyle = tgrad; tctx.fillRect(0,0,72,72);
    tctx.fillStyle = '#fff';
    tctx.font = '700 14px "PingFang SC","Microsoft YaHei",sans-serif';
    tctx.textAlign = 'center'; tctx.textBaseline = 'middle';
    tctx.fillText(b.title.length<=4 ? b.title : b.title.slice(0,4), 36, 36);
    tc.style.width = '100%'; tc.style.height = '100%'; tc.style.objectFit = 'cover';
    thumb.appendChild(tc);
    var nameWrap = document.createElement('div');
    nameWrap.className = 'panel-related-name';
    nameWrap.innerHTML = b.title + '<span>' + b.author + '</span>';
    item.appendChild(thumb);
    item.appendChild(nameWrap);
    container.appendChild(item);
  });
}

function selectBook(book) {
  selectedBook = book;
  nebulaRipple = 1.0;
  // 找到选中的星球mesh
  selectedMesh = null;
  orbMeshes.forEach(function(m) {
    if(m.userData.book && m.userData.book.id === book.id) selectedMesh = m;
  });

  // 重置所有标签为白色
  orbLabels.forEach(function(l) {
    l.material.map.dispose();
    l.material.map = regenerateLabelTexture(l.userData.parentOrb.userData.book, 256, '#ffffff');
    l.material.needsUpdate = true;
  });

  // 选中的标签变为保护壳颜色
  if (selectedMesh) {
    orbLabels.forEach(function(l) {
      if (l.userData.parentOrb === selectedMesh) {
        l.material.map.dispose();
        l.material.map = regenerateLabelTexture(book, 256, book.color);
        l.material.needsUpdate = true;
      }
    });
  }

  // 镜头飞向目标星球
  if (selectedMesh) {
    flyTarget = selectedMesh.position.clone();
    flyProgress = 0;
    isFlying = true;
    // 创建轨道高亮环
    if (orbitRing) { scene.remove(orbitRing); if(orbitRing.geometry) orbitRing.geometry.dispose(); if(orbitRing.material) orbitRing.material.dispose(); orbitRing=null; }
    if (orbitRingGlow) { scene.remove(orbitRingGlow); if(orbitRingGlow.geometry) orbitRingGlow.geometry.dispose(); if(orbitRingGlow.material) orbitRingGlow.material.dispose(); orbitRingGlow=null; }
    var ringGeo = new THREE.TorusGeometry(ORB_RADIUS*1.8, 0.04, 16, 48);
    var ringMat = new THREE.MeshBasicMaterial({color:book.color, transparent:true, opacity:0.6, blending:THREE.AdditiveBlending});
    orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.position.copy(selectedMesh.position);
    scene.add(orbitRing);
    var ringGeo2 = new THREE.TorusGeometry(ORB_RADIUS*2.0, 0.1, 16, 48);
    var ringMat2 = new THREE.MeshBasicMaterial({color:book.color, transparent:true, opacity:0.15, blending:THREE.AdditiveBlending, side:THREE.DoubleSide});
    orbitRingGlow = new THREE.Mesh(ringGeo2, ringMat2);
    orbitRingGlow.position.copy(selectedMesh.position);
    scene.add(orbitRingGlow);
  }

  panelTitle.textContent = book.title;
  panelAuthor.textContent = book.author;
  panelInsight.textContent = book.insight;

  var summaryEl = document.getElementById('panel-summary');
  var worldEl = document.getElementById('panel-world');
  var progressText = document.getElementById('panel-progress-text');
  var progressFill = document.getElementById('panel-progress-fill');

  if(summaryEl) summaryEl.textContent = book.summary || '暂无简介。';
  if(worldEl) worldEl.textContent = book.worldSetting || '等待探索...';

  // 探索进度
  var prog = addExplorationProgress(book.id, 10);
  if(progressText) progressText.textContent = prog + '%';
  if(progressFill) progressFill.style.width = prog + '%';

  // 相关书籍
  renderRelatedBooks(book);

  rightPanel.classList.remove('hidden');

  paperNote.innerHTML = '<div class="tape"></div><div class="note-icon">📖</div>「'+book.quote+'」<br><span style="font-size:11px;opacity:0.6">—— 《'+book.title+'》</span>';

  panelCover.innerHTML = '';
  var coverPath = COVER_IMAGES[book.id];
  if(coverPath) {
    var img = document.createElement('img');
    img.src = coverPath;
    img.alt = book.title;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.onerror = function() {
      panelCover.innerHTML = '';
      var pc = generatePanelCover(book, 350);
      var pv = document.createElement('canvas');
      pv.width = pc.width; pv.height = pc.height;
      pv.getContext('2d').drawImage(pc,0,0);
      pv.style.width = '100%'; pv.style.height = '100%'; pv.style.objectFit = 'cover';
      panelCover.appendChild(pv);
    };
    panelCover.appendChild(img);
  } else {
    var pc = generatePanelCover(book, 350);
    var pv = document.createElement('canvas');
    pv.width = pc.width; pv.height = pc.height;
    pv.getContext('2d').drawImage(pc,0,0);
    pv.style.width = '100%'; pv.style.height = '100%'; pv.style.objectFit = 'cover';
    panelCover.appendChild(pv);
  }
}

function clearOrbitRing() {
  if (orbitRing) { scene.remove(orbitRing); orbitRing.geometry.dispose(); orbitRing.material.dispose(); orbitRing=null; }
  if (orbitRingGlow) { scene.remove(orbitRingGlow); orbitRingGlow.geometry.dispose(); orbitRingGlow.material.dispose(); orbitRingGlow=null; }
  selectedMesh = null;
  selectedBook = null;
  isFlying = false;
  // 重置所有行星明暗
  orbMeshes.forEach(function(m) {
    m.userData.dimAmount = 0;
    m.material.opacity = 1.0;
    m.material.transparent = false;
    m.material.emissiveIntensity = 0.02;
  });
  // 重置所有标签为白色
  orbLabels.forEach(function(l) {
    l.material.map.dispose();
    l.material.map = regenerateLabelTexture(l.userData.parentOrb.userData.book, 256, '#ffffff');
    l.material.needsUpdate = true;
  });
}

// ─── 动画循环 ──────────────────────────────────────
function animate() {
  if (!renderer) return;
  animationId = requestAnimationFrame(animate);
  var dt = Math.min(0.1, 0.016);
  var t = performance.now()*0.001;
  controls.update();
  updateDynamicNebula(dt, t);

  // ── 入场动画：摄像机飞入 ──
  if (entranceAnim < 1) {
    entranceAnim = Math.min(1, entranceAnim + dt * 0.6);
    var ease = 1 - Math.pow(1 - entranceAnim, 3);
    var targetPos = new THREE.Vector3(0, 12, 22);
    camera.position.lerp(targetPos, ease * 0.06);
    controls.target.set(0, 0, 0);
    // 淡入整个场景
    renderer.toneMappingExposure = 0.65 * ease;
  }

  // 镜头飞向动画
  if (isFlying && flyTarget) {
    flyProgress = Math.min(1, flyProgress + dt*1.2);
    var ease = 1 - Math.pow(1-flyProgress, 3);
    controls.target.lerp(flyTarget, ease*0.08);
    if (flyProgress >= 1) isFlying = false;
    // 禁用WASD飞行期间
    keys.w=false; keys.a=false; keys.s=false; keys.d=false;
  }

  // 轨道环跟随+旋转
  if (orbitRing && selectedMesh) {
    orbitRing.position.copy(selectedMesh.position);
    orbitRing.rotation.y += dt*0.6;
    orbitRing.rotation.x += dt*0.15;
    if (orbitRingGlow) {
      orbitRingGlow.position.copy(selectedMesh.position);
      orbitRingGlow.rotation.y += dt*0.5;
      orbitRingGlow.rotation.x += dt*0.1;
    }
  }

  // ── 轨道尘埃粒子动画 ──
  orbitDustSystems.forEach(function(ds) {
    var ud = ds.userData;
    var pos = ds.geometry.attributes.position;
    for (var di = 0; di < pos.count; di++) {
      ud.angles[di] += ud.speeds[di] * dt;
      var a = ud.angles[di];
      var r = ud.orbitR + Math.sin(t * 0.5 + di) * ud.drifts[di] * 10;
      pos.array[di*3]   = Math.cos(a) * r;
      pos.array[di*3+1] = ud.tiltY + Math.sin(t * 0.3 + di * 0.5) * 0.05;
      pos.array[di*3+2] = Math.sin(a) * r;
    }
    pos.needsUpdate = true;
    // 尘埃闪烁
    ds.material.opacity = 0.35 + Math.sin(t * 1.5) * 0.1;
  });

  var fwd = new THREE.Vector3(); camera.getWorldDirection(fwd); fwd.y=0; fwd.normalize();
  var rgt = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0,1,0)).normalize();
  var mv = new THREE.Vector3();
  if(keys.w) mv.add(fwd); if(keys.s) mv.sub(fwd); if(keys.d) mv.add(rgt); if(keys.a) mv.sub(rgt);
  if(mv.length()>0) { mv.normalize().multiplyScalar(wasdSpeed*dt); controls.target.add(mv); }

  stars.rotation.y += dt*0.012;
  stars.rotation.x += dt*0.005;
  // 亮星闪烁
  if (stars.userData && stars.userData.twinkleSprites) {
    stars.userData.twinkleSprites.forEach(function(sp) {
      var ud = sp.userData;
      var flicker = 0.5 + 0.5*Math.sin(t*ud.speed + ud.phase);
      sp.material.opacity = ud.baseOp * (0.4 + flicker*0.6);
      var scale = ud.baseSize * (0.7 + flicker*0.3);
      sp.scale.set(scale, scale, 1);
    });
  }

  orbMeshes.forEach(function(m) {
    var ud = m.userData;
    // 公转
    ud.orbitAngle += ud.orbitSpeed * dt;
    m.position.x = Math.cos(ud.orbitAngle) * ud.orbitR;
    m.position.y = ud.orbitTilt;
    m.position.z = Math.sin(ud.orbitAngle) * ud.orbitR;
    // 自转
    m.rotation.y += dt*ud.baseRotSpeed;
    m.rotation.x += dt*ud.baseRotSpeed*0.5;

    // 搜索状态下跳过悬停/选中效果
    var isSearchActive = searchHighlightIds.length > 0;
    var isSearchMatch = isSearchActive && searchHighlightIds.indexOf(ud.id) >= 0;

    // ── 悬停缩放效果 ──
    var isHovered = (m === hoveredMesh);
    var isSelected = (m === selectedMesh);
    var targetScale = ud.sizeScale;
    if (isHovered) targetScale *= 1.18;
    var curScale = m.scale.x;
    var newScale = curScale + (targetScale - curScale) * 0.12;
    m.scale.setScalar(newScale);

    // ── 悬停光晕增强 ──
    var targetGlow = isHovered ? 0.35 : 0;
    ud.glowBoost += (targetGlow - ud.glowBoost) * 0.1;

    // ── 明暗效果 ──
    var targetDim = 0;
    if (isSearchActive && !isSearchMatch) {
      targetDim = 0.6;
    } else if (selectedMesh && !isSelected && !isHovered) {
      targetDim = 0.45;
    }
    ud.dimAmount += (targetDim - ud.dimAmount) * 0.08;
    m.material.opacity = 1.0 - ud.dimAmount;
    m.material.transparent = ud.dimAmount > 0.01;

    // ── 发光强度 ──
    if (!isSearchActive) {
      var pulse = isSelected ? Math.sin(t * 3) * 0.08 : 0;
      m.material.emissiveIntensity = 0.02 + ud.glowBoost + pulse;
    }
  });

  orbLabels.forEach(function(l) {
    var parent = l.userData.parentOrb;
    l.position.copy(parent.position);
    l.position.y += ORB_RADIUS * parent.userData.sizeScale + 0.5;
    l.visible = parent.visible;

    // 距离缩放：根据相机距离动态调整标签大小
    var dist = camera.position.distanceTo(l.position);
    var distScale = THREE.MathUtils.clamp(18 / dist, 0.5, 1.8);
    var baseScale = 2.2 * distScale;
    l.scale.set(baseScale, baseScale * 0.5, 1);

    // 悬停高亮
    var isHoveredParent = (parent === hoveredMesh);
    var isSelectedParent = (parent === selectedMesh);
    var targetOpacity = 1.0;
    if (selectedMesh && !isSelectedParent && !isHoveredParent) targetOpacity = 0.35;
    l.material.opacity += (targetOpacity - l.material.opacity) * 0.1;
  });

  // 大气层/辉光跟随 + 明暗
  scene.traverse(function(child) {
    if (child.userData && child.userData.parentOrb && child.isSprite && child.material.blending === THREE.AdditiveBlending) {
      var p = child.userData.parentOrb;
      child.position.copy(p.position);
      child.visible = p.visible;
      // 跟随行星明暗（辉光层）
      if (child.userData.baseOpacity !== undefined && p.userData) {
        child.material.opacity = child.userData.baseOpacity * (1 - (p.userData.dimAmount || 0) * 0.5);
      }
    }
  });

  // 中央恒星自转 + uTime + 光晕脉冲
  if (centralStar) {
    centralStar.rotation.y += dt * 0.02;
    centralStar.material.uniforms.uTime.value = t;
    if (centralStar.userData.glowSprites) {
      var glows = centralStar.userData.glowSprites;
      glows[0].material.opacity = 0.85 + Math.sin(t * 1.2) * 0.15;
      glows[1].material.opacity = 0.55 + Math.sin(t * 0.8 + 1.0) * 0.12;
      glows[2].material.opacity = 0.35 + Math.sin(t * 0.5 + 2.0) * 0.10;
    }
  }

  // ── 球形保护壳跟随 + 明暗 + 时间更新 ──
  scene.traverse(function(child) {
    if (child.userData && child.userData.isShell && child.userData.parentOrb) {
      var p = child.userData.parentOrb;
      child.position.copy(p.position);
      child.visible = p.visible;
      // 跟随行星明暗
      if (child.material.uniforms && child.material.uniforms.uIntensity) {
        var baseIntensity = 0.82;
        child.material.uniforms.uIntensity.value = baseIntensity * (1 - p.userData.dimAmount * 0.6);
        child.material.uniforms.uTime.value = t;
      }
    }
  });

  // ── 壳体附着粒子动画 ──
  scene.traverse(function(child) {
    if (child.userData && child.userData.isShellParticles && child.userData.parentOrb) {
      var p = child.userData.parentOrb;
      child.position.copy(p.position);
      child.visible = p.visible;
      var pos = child.geometry.attributes.position;
      var ud = child.userData;
      for (var spi = 0; spi < pos.count; spi++) {
        ud.angles[spi] += ud.speeds[spi] * dt;
        var a = ud.angles[spi];
        var e = ud.elevations[spi] + Math.sin(t * 0.3 + spi * 0.7) * 0.08;
        var r = ud.radii[spi] + Math.sin(t * 0.5 + spi * 1.3) * 0.03;
        pos.array[spi*3]   = Math.cos(a) * Math.cos(e) * r;
        pos.array[spi*3+1] = Math.sin(e) * r;
        pos.array[spi*3+2] = Math.sin(a) * Math.cos(e) * r;
      }
      pos.needsUpdate = true;
      // 粒子闪烁
      child.material.opacity = 0.4 + Math.sin(t * 2.0) * 0.12;
    }
  });

  if(t-lastRebuild>8.0) { lastRebuild=t; }

  composer.render();
}

// ─── 事件处理 ──────────────────────────────────────
var pointerDownPos = null;

function onPointerDown(e) {
  if(e.button===0) pointerDownPos = {x:e.clientX, y:e.clientY};
}

function onPointerUp(e) {
  if(!pointerDownPos) return;
  var dx = e.clientX-pointerDownPos.x, dy = e.clientY-pointerDownPos.y;
  pointerDownPos = null;
  if(Math.sqrt(dx*dx+dy*dy)>5) return;
  var h = getHits(e);
  if(h.length>0) selectBook(h[0].object.userData.book);
}

function onMouseMove(e) {
  var h = getHits(e);
  canvas.style.cursor = h.length ? 'pointer' : 'default';
  // 更新悬停目标
  var newHover = h.length > 0 ? h[0].object : null;
  if (newHover !== hoveredMesh) {
    hoveredMesh = newHover;
  }
  // 悬停时星云轻微涟漪
  if (h.length > 0 && nebulaRipple < 0.3) {
    nebulaRipple = Math.max(nebulaRipple, 0.3);
  }
}

function onMouseLeave() {
  hoveredMesh = null;
}

function onKeyDown(e) {
  var k = e.key.toLowerCase();
  if(k in keys) { keys[k]=true; e.preventDefault(); }
  if(k==='h') {
    var overlay = document.getElementById('constellation-overlay');
    if(overlay) overlay.classList.toggle('hidden');
  }
}

function onKeyUp(e) {
  var k = e.key.toLowerCase();
  if(k in keys) { keys[k]=false; e.preventDefault(); }
}

function onShiftDown() { speedOnWheel=true; }
function onShiftUp() { speedOnWheel=false; }

function onWheel(e) {
  if(speedOnWheel) {
    wasdSpeed = Math.max(1, Math.min(20, wasdSpeed-e.deltaY*0.01));
    e.preventDefault();
  }
}

function onResize() {
  if(!camera||!renderer) return;
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

// ─── 公开 API ──────────────────────────────────────
window.initConstellation = function(nebulaType) {
  if(renderer) window.destroyConstellation();

  currentNebulaType = nebulaType;
  canvas = document.getElementById('constellation-canvas');
  if(!canvas) return;

  buildScene(nebulaType);

  // 入场动画：摄像机从远处飞入
  entranceAnim = 0;
  camera.position.set(0, 28, 45);

  rightPanel = document.getElementById('right-panel');
  panelTitle = document.getElementById('panel-title');
  panelAuthor = document.getElementById('panel-author');
  panelInsight = document.getElementById('panel-insight');
  panelCover = document.getElementById('panel-cover');
  ctaBtn = document.getElementById('cta-btn');
  paperNote = document.getElementById('paper-note');

  var titleEl = document.getElementById('constellation-title');
  if(titleEl) titleEl.textContent = NEBULA_NAMES[nebulaType] || '书籍宇宙';

  // 底部提示打字机效果
  var hintEl = document.querySelector('.controls-hint');
  if (hintEl) {
    var fullText = hintEl.textContent;
    hintEl.textContent = '';
    var ci = 0;
    function typeChar() {
      if (ci < fullText.length) {
        hintEl.textContent += fullText[ci];
        ci++;
        setTimeout(typeChar, 20 + Math.random()*15);
      }
    }
    typeChar();
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);
  keyDownHandler = onKeyDown; keyUpHandler = onKeyUp;
  window.addEventListener('keydown', keyDownHandler);
  window.addEventListener('keyup', keyUpHandler);
  window.addEventListener('keydown', onShiftDown);
  window.addEventListener('keyup', onShiftUp);
  canvas.addEventListener('wheel', onWheel, {passive:false});
  resizeHandler = onResize;
  window.addEventListener('resize', resizeHandler);

  var panelClose = document.getElementById('panel-close');
  if(panelClose) panelClose.addEventListener('click', function() { rightPanel.classList.add('hidden'); clearOrbitRing(); });

  if(ctaBtn) {
    ctaBtn.addEventListener('click', function() {
      if(!selectedBook) return;
      ctaBtn.textContent = '✦ 体验进行中...';
      ctaBtn.style.background = 'linear-gradient(135deg,#22d3ee,#0e7490)';

      var playedProg = markBookPlayed(selectedBook.id);
      var progressText = document.getElementById('panel-progress-text');
      var progressFill = document.getElementById('panel-progress-fill');
      if(progressText) progressText.textContent = playedProg + '%';
      if(progressFill) progressFill.style.width = playedProg + '%';

      // 构建bookId
      var bookKeyMap = {
        '三体':'sanTi','流浪地球':'liuLangDiQiu','基地':'jiDi','沙丘':'shaQiu',
        '神经漫游者':'shenJingYouZhe','你一生的故事':'niYiShengDeGuShi',
        '1984':'1984','美丽新世界':'MeiLiXinShiJie','时间简史':'ShiJianJianShi',
        '斗破苍穹':'douPoCangQiong','凡人修仙传':'fanRenXiuXianZhuan',
        '遮天':'zheTian','完美世界':'wanMeiShiJie','仙逆':'xianNi',
        '一念永恒':'YiNianYongHeng','大主宰':'DaZhuZai','武动乾坤':'WuDongQianKun',
        '剑来':'JianLai','雪中悍刀行':'XueZhongHanDaoXing',
        '红楼梦':'hongLouMeng','西游记':'xiYouJi','水浒传':'shuiHuZhuan',
        '三国演义':'sanGuoYanYi','百年孤独':'baiNianGuDu','活着':'huoZhe'
      };
      var bookId = currentNebulaType + '.' + (bookKeyMap[selectedBook.title] || selectedBook.title);

      // 传递给游戏引擎
      if(typeof initGame === 'function') {
        initGame(bookId, selectedBook);
      } else {
        alert('游戏引擎未加载');
      }

      setTimeout(function() {
        ctaBtn.textContent = '▸ 开启人生体验';
        ctaBtn.style.background = 'linear-gradient(135deg,#7c3aed,#4c1d95)';
      }, 2500);
    });
  }

  var searchInput = document.getElementById('search-input');
  if(searchInput) {
    searchInput.addEventListener('input', function(e) {
      var q = e.target.value.toLowerCase();
      searchHighlightIds = [];

      // 先重置所有标签为白色
      orbLabels.forEach(function(l) {
        l.material.map.dispose();
        l.material.map = regenerateLabelTexture(l.userData.parentOrb.userData.book, 256, '#ffffff');
        l.material.needsUpdate = true;
      });

      orbMeshes.forEach(function(m) {
        var b = m.userData.book;
        if(!q) { m.visible=true; searchHighlightIds=[]; return; }
        var match = b.title.toLowerCase().indexOf(q)>=0 || b.author.toLowerCase().indexOf(q)>=0;
        m.visible = true;
        if (match) {
          searchHighlightIds.push(m.userData.id);
          m.material.emissiveIntensity = 0.15;
        } else {
          m.material.emissiveIntensity = 0.02;
          m.material.opacity = 0.3;
          m.material.transparent = true;
        }
      });

      // 匹配的标签变为保护壳颜色
      orbLabels.forEach(function(l) {
        var pid = l.userData.parentOrb.userData.id;
        l.visible = true;
        if (q) {
          var isMatch = searchHighlightIds.indexOf(pid) >= 0;
          l.material.opacity = isMatch ? 1.0 : 0.2;
          if (isMatch) {
            l.material.map.dispose();
            l.material.map = regenerateLabelTexture(l.userData.parentOrb.userData.book, 256, l.userData.bookColor);
            l.material.needsUpdate = true;
          }
        }
      });
    });

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && searchHighlightIds.length > 0) {
        var firstId = searchHighlightIds[0];
        var books = NEBULA_BOOKS[currentNebulaType] || [];
        var book = null;
        for (var bi = 0; bi < books.length; bi++) {
          if (books[bi].id === firstId) { book = books[bi]; break; }
        }
        if (book) {
          selectBook(book);
          searchInput.value = '';
          searchHighlightIds = [];
        }
      }
    });
  }

  canvas.style.pointerEvents = 'auto';
  animate();
};

window.destroyConstellation = function() {
  if(animationId) { cancelAnimationFrame(animationId); animationId=null; }

  if(canvas) {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseleave', onMouseLeave);
    canvas.removeEventListener('wheel', onWheel);
  }
  if(keyDownHandler) window.removeEventListener('keydown', keyDownHandler);
  if(keyUpHandler) window.removeEventListener('keyup', keyUpHandler);
  window.removeEventListener('keydown', onShiftDown);
  window.removeEventListener('keyup', onShiftUp);
  if(resizeHandler) window.removeEventListener('resize', resizeHandler);

  if(composer) composer.dispose && composer.dispose();
  if(renderer) { renderer.dispose(); renderer=null; }
  clearOrbitRing();
  if(scene) {
    scene.traverse(function(obj) {
      if(obj.geometry) obj.geometry.dispose();
      if(obj.material) {
        if(obj.material.map) obj.material.map.dispose();
        obj.material.dispose();
      }
    });
    scene = null;
  }
  camera=null; controls=null; composer=null; bloomPass=null;
  orbMeshes=[]; orbLabels=[]; connFlows=[];
  stars=null; nodeDots=null; selectedBook=null;
  dynamicNebula=null; nebulaRipple=0; centralStar=null;
  hoveredMesh=null; searchHighlightIds=[]; entranceAnim=0;
  orbitDustSystems=[];

  if(rightPanel) rightPanel.classList.add('hidden');
  // 清除搜索框
  var searchInput = document.getElementById('search-input');
  if(searchInput) searchInput.value = '';
};

console.log('%c✦ 星球模块已加载', 'color:#a855f7;font-size:12px');
})();
