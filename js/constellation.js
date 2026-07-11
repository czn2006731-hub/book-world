(function() {

// ─── 星云对应书籍数据 ───────────────────────────
const NEBULA_BOOKS = {
  scifi: [
    {id:'s1',title:'三体',author:'刘慈欣',color:'#5dade2',insight:'地球文明向宇宙发出的第一声啼鸣，引来三体文明的入侵。黑暗森林法则揭示了宇宙文明之间残酷的生存逻辑。',quote:'给岁月以文明，而不是给文明以岁月。'},
    {id:'s2',title:'流浪地球',author:'刘慈欣',color:'#3498db',insight:'太阳即将毁灭，人类带着地球逃亡，在宇宙中寻找新的家园。一场跨越2500年的星际流浪就此展开。',quote:'地球啊，我的流浪地球。'},
    {id:'s3',title:'银河帝国',author:'阿西莫夫',color:'#c9a825',insight:'心理史学预测未来的宏篇巨制。阿西莫夫用基地系列证明了科幻可以同时是史诗、政治寓言和哲学思考。',quote:'暴力是无能者的最后庇护所。'},
    {id:'s4',title:'沙丘',author:'弗兰克·赫伯特',color:'#d4a050',insight:'在沙漠星球阿拉基斯上，控制着宇宙珍贵香料的家族展开了一场史诗般的权力斗争。',quote:'恐惧是思维的杀手。'},
    {id:'s5',title:'神经漫游者',author:'威廉·吉布森',color:'#1abc9c',insight:'赛博朋克的开山之作。在霓虹与暗巷交织的未来，吉布森预见了网络与AI将如何重塑人类定义。',quote:'天空是完美的电视，调到了死寂的频道。'},
    {id:'s6',title:'你一生的故事',author:'特德·姜',color:'#76d7ea',insight:'语言学家在学习外星语言的过程中获得了预知未来的能力。用语言学重新阐释了自由意志与时间的本质。',quote:'如果你已经知道自己的整个人生，你会改变什么吗？'},
    {id:'s7',title:'1984',author:'乔治·奥威尔',color:'#5d6d7e',insight:'极权主义的终极预言。老大哥无处不在，思想警察监视一切，真理被篡改，自由被剥夺。',quote:'谁控制了过去，谁就控制了未来。'},
    {id:'s8',title:'美丽新世界',author:'赫胥黎',color:'#a569bd',insight:'与《1984》齐名的反乌托邦经典。一个没有痛苦但也没有爱的世界，娱乐至死比压迫更可怕。',quote:'我不要舒适。我要上帝，我要诗歌，我要真正的危险。'},
    {id:'s9',title:'基地',author:'阿西莫夫',color:'#85c1e9',insight:'银河帝国即将崩溃，一群科学家试图保存人类的知识，以缩短即将到来的黑暗时代。',quote:'帝国的衰落已经开始。'},
    {id:'s10',title:'时间简史',author:'霍金',color:'#2c3e50',insight:'一本让全世界普通人有机会触碰宇宙学的奇书。从大爆炸到黑洞，霍金用最少的公式讲述了最大的故事。',quote:'我们只是在一颗普通恒星的普通行星上的一群高级猴子。'},
  ],
  xianxia: [
    {id:'x1',title:'斗破苍穹',author:'天蚕土豆',color:'#c0392b',insight:'萧炎从天才沦为废物，又从废物逆袭成强者，在斗气大陆书写属于自己的传奇。三十年河东，三十年河西。',quote:'三十年河东，三十年河西，莫欺少年穷！'},
    {id:'x2',title:'凡人修仙传',author:'忘语',color:'#27ae60',insight:'一个普通山村少年韩立，偶入修仙门派，凭借坚韧不拔的意志，一步步踏上修仙巅峰。',quote:'修仙之路，逆天而行。'},
    {id:'x3',title:'遮天',author:'辰东',color:'#8e44ad',insight:'冰冷与黑暗并存的宇宙深处，九具仙尸拉着巨棺划过星空，拉开了一场波澜壮阔的修仙大幕。',quote:'天地不仁，以万物为刍狗。'},
    {id:'x4',title:'完美世界',author:'辰东',color:'#f39c12',insight:'一粒尘可填海，一根草斩尽日月星辰。少年石昊从大荒走出，踏上追求极致的道路。',quote:'我要这天，再遮不住我眼。'},
    {id:'x5',title:'仙逆',author:'耳根',color:'#2980b9',insight:'王林逆天而行，以凡人之躯踏入修仙之路，成就一代传奇。修仙，修的是心。',quote:'顺为凡，逆为仙。'},
    {id:'x6',title:'一念永恒',author:'耳根',color:'#9b59b6',insight:'一个怕死的少年走上修仙路，从胆小怕事到一代至尊。一念成沧海，一念化为永恒。',quote:'一念成沧海，一念化桑田。'},
    {id:'x7',title:'大主宰',author:'天蚕土豆',color:'#e74c3c',insight:'牧尘从大炎帝国走出，踏入大千世界，追求那凌驾于万物之上的至尊之路。',quote:'天地之间，我为主宰。'},
    {id:'x8',title:'武动乾坤',author:'天蚕土豆',color:'#e67e22',insight:'林动从青阳镇走出，经历无数磨难，最终掌握符师传承，走上武道巅峰。',quote:'乾坤未定，你我皆是黑马。'},
    {id:'x9',title:'剑来',author:'烽火戏诸侯',color:'#1abc9c',insight:'小镇少年陈平安，一把剑走天涯。剑气纵横三万里，一剑光寒十九洲。',quote:'天下熙熙，皆为利来。'},
    {id:'x10',title:'雪中悍刀行',author:'烽火戏诸侯',color:'#7f8c8d',insight:'北凉王世子徐凤年，以刀入武，以武入道。江湖庙堂，皆在一刀之间。',quote:'天不生我李淳罡，剑道万古如长夜。'},
  ],
  romance: [
    {id:'r1',title:'微微一笑很倾城',author:'顾漫',color:'#f8a5c2',insight:'网游里的爱情延伸到现实，一段甜蜜的校园恋爱。他在游戏里是大神，在现实里是学霸，而她都是他的女主角。',quote:'如果早知道会这么爱你，我一定对你一见钟情。'},
    {id:'r2',title:'何以笙箫默',author:'顾漫',color:'#e77f9c',insight:'一段年少时的爱情，牵出一生的纠缠。七年后的重逢，是破镜重圆还是再次错过？',quote:'如果世界上曾经有那个人出现过，其他人都会变成将就。'},
    {id:'r3',title:'致青春',author:'辛夷坞',color:'#f1948a',insight:'青春是一场盛大的遇见。郑微在大学里遇见了林静和陈孝正，三个人的爱情纠葛贯穿了整个青春。',quote:'青春是场远行，回不去了。'},
    {id:'r4',title:'你好，旧时光',author:'八月长安',color:'#f5b7b1',insight:'余周周的成长故事，关于友情、爱情和青春的美好回忆。旧时光里的每一个人都是最好的。',quote:'当时的他是最好的他，后来的我是最好的我。'},
    {id:'r5',title:'最美的时光',author:'桐华',color:'#c39bd3',insight:'时光流逝，那些曾经的美好是否还能重现？苏蔓在爱情与事业之间寻找着属于自己的答案。',quote:'最美的时光，是有你的时光。'},
    {id:'r6',title:'三生三世十里桃花',author:'唐七',color:'#f0b27a',insight:'青丘白浅与天族夜华的三世爱恨纠葛。桃花树下，十里春风，不如你。',quote:'三生三世，十里桃花。'},
    {id:'r7',title:'花千骨',author:'Fresh果果',color:'#bb8fce',insight:'花千骨与白子画的师徒虐恋。一个是长留上仙，一个是花妖之女，注定的爱情悲剧。',quote:'我没有师父，没有朋友，没有爱人，没有孩子。'},
    {id:'r8',title:'杉杉来了',author:'顾漫',color:'#fadbd8',insight:'呆萌小职员薛杉杉与霸道总裁封腾的甜蜜爱情故事。每天被投喂的幸福日常。',quote:'我要让全世界都知道，这片鱼塘被你承包了。'},
    {id:'r9',title:'十年一品温如言',author:'书海沧生',color:'#d2b4de',insight:'言温衡与一品的十年纠葛。从青梅竹马到形同陌路，再到重逢，十年间的爱恨情仇。',quote:'十年，你是我唯一的温暖。'},
    {id:'r10',title:'那些年',author:'九把刀',color:'#f5cba7',insight:'每个人都有自己的青春故事。柯景腾与沈佳宜的校园爱情，是最纯真的遗憾。',quote:'那些年，我们一起追的女孩。'},
  ]
};

const NEBULA_NAMES = { scifi:'科幻星云', xianxia:'修仙星云', romance:'言情星云' };

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
let stars, nodeDots, nodeDotsTex;
let rightPanel, panelTitle, panelAuthor, panelGenre, panelInsight, panelCover, audioLabel, ctaBtn, paperNote;
let selectedBook = null;
let currentNebulaType = null;
let keys = { w:false, a:false, s:false, d:false };
let wasdSpeed = 5.5;
let speedOnWheel = false;
let lastRebuild = 0;
let keyDownHandler, keyUpHandler, wheelHandler, resizeHandler;
let canvas;

const ORB_RADIUS = 0.8;
const ORB_SEGMENTS = 64;
const FLOW_PARTICLES = 35;

// 星云连线配色 - 统一使用相同风格
const CONN_COLOR_MAP = {
  scifi:   {hue:0.13, sat:0.55, light:0.55},
  xianxia: {hue:0.13, sat:0.55, light:0.55},
  romance: {hue:0.13, sat:0.55, light:0.55}
};

// ─── 星球纹理生成 ─────────────────────────────────
function generatePlanetTexture(hexColor, seed) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d');
  const [r,g,b] = hexToRGB(hexColor);
  const rand = seededRandom(seed || 42);

  // 主色渐变 - 用书籍本身的颜色，有明显明暗对比
  const baseGrad = ctx.createRadialGradient(200,200,0,256,256,280);
  baseGrad.addColorStop(0, rgbStr(Math.min(255,r*1.1), Math.min(255,g*1.1), Math.min(255,b*1.1)));
  baseGrad.addColorStop(0.3, rgbStr(r, g, b));
  baseGrad.addColorStop(0.6, rgbStr(r*0.7, g*0.7, b*0.7));
  baseGrad.addColorStop(1, rgbStr(r*0.3, g*0.3, b*0.3));
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0,0,512,512);

  // 星辉高光区 - 左上角亮区
  const highlightGrad = ctx.createRadialGradient(150,120,0,150,120,180);
  highlightGrad.addColorStop(0, `rgba(${Math.min(255,r+80)},${Math.min(255,g+80)},${Math.min(255,b+80)},0.4)`);
  highlightGrad.addColorStop(0.4, `rgba(${Math.min(255,r+40)},${Math.min(255,g+40)},${Math.min(255,b+40)},0.15)`);
  highlightGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = highlightGrad;
  ctx.fillRect(0,0,512,512);

  // 阴影区 - 右下角暗区
  const shadowGrad = ctx.createRadialGradient(380,400,0,380,400,200);
  shadowGrad.addColorStop(0, `rgba(0,0,0,0.35)`);
  shadowGrad.addColorStop(0.5, `rgba(0,0,0,0.15)`);
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(0,0,512,512);

  // 书籍纹理 - 横向书页线条
  const numLines = 8 + Math.floor(rand()*12);
  for (let i=0; i<numLines; i++) {
    const y = rand()*512;
    const h = 1 + rand()*3;
    const shift = (rand()-0.5)*30;
    ctx.fillStyle = `rgba(${clamp(r+shift)},${clamp(g+shift)},${clamp(b+shift)},${0.15+rand()*0.2})`;
    ctx.fillRect(0,y,512,h);
  }

  // 书籍纹理 - 竖向书脊纹路
  const numSpines = 2 + Math.floor(rand()*3);
  for (let i=0; i<numSpines; i++) {
    const x = 80 + rand()*352;
    const w = 3 + rand()*8;
    ctx.fillStyle = `rgba(${clamp(r*0.6)},${clamp(g*0.6)},${clamp(b*0.6)},${0.1+rand()*0.15})`;
    ctx.fillRect(x,0,w,512);
  }

  // 书籍纹理 - 角落装饰图案
  for (let i=0; i<4; i++) {
    const cx = rand()*512;
    const cy = rand()*512;
    const size = 15 + rand()*30;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rand()*Math.PI*2);
    ctx.strokeStyle = `rgba(${clamp(r*1.2)},${clamp(g*1.2)},${clamp(b*1.2)},0.12)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-size,0);
    ctx.quadraticCurveTo(0,-size*0.5,size,0);
    ctx.stroke();
    ctx.restore();
  }

  // 书籍纹理 - 圆点装饰
  const numDots = 6 + Math.floor(rand()*10);
  for (let i=0; i<numDots; i++) {
    const x = rand()*512;
    const y = rand()*512;
    const radius = 2 + rand()*5;
    ctx.fillStyle = `rgba(${clamp(r*1.3)},${clamp(g*1.3)},${clamp(b*1.3)},${0.08+rand()*0.1})`;
    ctx.beginPath(); ctx.arc(x,y,radius,0,Math.PI*2); ctx.fill();
  }

  // 边缘柔化 - 不是黑色渐变，是颜色变暗
  const edgeGrad = ctx.createRadialGradient(256,256,180,256,256,256);
  edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
  edgeGrad.addColorStop(0.7, 'rgba(0,0,0,0)');
  edgeGrad.addColorStop(1, `rgba(0,0,0,0.35)`);
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0,0,512,512);

  return c;
}

function generateAtmosphereTexture(hexColor) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  const [r,g,b] = hexToRGB(hexColor);
  const grad = ctx.createRadialGradient(128,128,50,128,128,128);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.5, `rgba(${r},${g},${b},0.03)`);
  grad.addColorStop(0.75, `rgba(${r},${g},${b},0.08)`);
  grad.addColorStop(0.9, `rgba(${r},${g},${b},0.04)`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,256,256);
  return c;
}

function generateLabelSprite(book, size) {
  size = size || 256;
  const c = document.createElement('canvas');
  c.width = size*2.0; c.height = size*1.0;
  const ctx = c.getContext('2d');
  
  // 清除为透明背景
  ctx.clearRect(0, 0, c.width, c.height);
  
  // 文字 - 纯白色
  ctx.fillStyle = '#ffffff';
  const fs = book.title.length<=4 ? size*0.35 : size*(0.35-(book.title.length-4)*0.025);
  ctx.font = `900 ${fs}px "PingFang SC","Microsoft YaHei","SimHei","Noto Sans SC",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  
  ctx.fillText(book.title, c.width/2, c.height/2);
  
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
  // 透明背景，不被遮挡
  const mat = new THREE.SpriteMaterial({map:tex, blending:THREE.NormalBlending, transparent:true, depthWrite:false, depthTest:false});
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(3.2,1.6,1);
  return sprite;
}

function generatePanelCover(book, size) {
  size = size || 350;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  const [r,g,b] = hexToRGB(book.color);
  const cx = size/2, cy = size/2;

  const bg = ctx.createRadialGradient(cx,cy,0,cx,cy,size*0.5);
  bg.addColorStop(0, rgbStr(r*0.9, g*0.9, b*0.9));
  bg.addColorStop(0.5, rgbStr(r*0.5, g*0.5, b*0.5));
  bg.addColorStop(1, rgbStr(r*0.15, g*0.15, b*0.15));
  ctx.fillStyle = bg; ctx.fillRect(0,0,size,size);

  ctx.fillStyle = '#ffffff';
  const fs = book.title.length<=4 ? size*0.22 : size*(0.22-(book.title.length-4)*0.03);
  ctx.font = `900 ${fs}px "PingFang SC","Microsoft YaHei","SimHei",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = book.color; ctx.shadowBlur = 18;
  ctx.fillText(book.title, cx, cy);
  return c;
}

// ─── 场景构建 ──────────────────────────────────────
function buildScene(nebulaType) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#030308');
  scene.fog = new THREE.FogExp2('#030308', 0.00012);

  camera = new THREE.PerspectiveCamera(58, window.innerWidth/window.innerHeight, 0.4, 100);
  camera.position.set(0,0.8,22);
  camera.lookAt(0,0,0);

  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.07;
  controls.enableZoom = true; controls.zoomSpeed = 1.1;
  controls.minDistance = 2.5; controls.maxDistance = 35;
  controls.enablePan = false; controls.target.set(0,0,0); controls.update();

  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth,window.innerHeight), 0.35, 0.40, 0.08);
  composer.addPass(bloomPass);

  scene.add(new THREE.AmbientLight(0x1a1535, 0.5));
  scene.add(new THREE.HemisphereLight(0x5040a0, 0x0a0a1a, 0.4));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
  keyLight.position.set(8,6,15); scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x403070, 0.3);
  fillLight.position.set(-6,0,4); scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0x6050a0, 0.8);
  rimLight.position.set(0,-4,-10); scene.add(rimLight);
  // 星辉点光源 - 增强自转时的光影变化
  const starLight1 = new THREE.PointLight(0xffffff, 3, 25, 1.5);
  starLight1.position.set(10,3,8); scene.add(starLight1);
  const starLight2 = new THREE.PointLight(0xffe0c0, 2, 20, 1.5);
  starLight2.position.set(-8,-2,10); scene.add(starLight2);

  const poiLights = [
    {c:0xc084fc, p:[0,4,6], in:8, dist:20},
    {c:0x22d3ee, p:[6,-1,5], in:7, dist:18},
    {c:0xf0abfc, p:[-5,2,6], in:7, dist:18},
    {c:0x34d399, p:[4,-4,7], in:6, dist:16},
    {c:0xfbbf24, p:[-2,5,4], in:5, dist:14},
  ];
  poiLights.forEach(function(pl) {
    var l = new THREE.PointLight(pl.c, pl.in, pl.dist, 1.0);
    l.position.set(pl.p[0],pl.p[1],pl.p[2]); scene.add(l);
  });

  buildNebulae();
  buildStars();
  buildOrbs(nebulaType);
  buildConnections();
  buildDisneySparkles();
}

// 迪士尼魔法粒子
var disneySparkles = [];
function buildDisneySparkles() {
  var sparkleColors = [0xffd700, 0xffec8b, 0xfff8dc, 0xffffff, 0xffb6c1, 0x87ceeb];
  for (var i = 0; i < 30; i++) {
    var geo = new THREE.SphereGeometry(0.03 + Math.random()*0.04, 8, 8);
    var mat = new THREE.MeshBasicMaterial({
      color: sparkleColors[Math.floor(Math.random()*sparkleColors.length)],
      transparent: true,
      opacity: 0.8
    });
    var sparkle = new THREE.Mesh(geo, mat);
    sparkle.position.set(
      (Math.random()-0.5)*25,
      (Math.random()-0.5)*18,
      (Math.random()-0.5)*15
    );
    sparkle.userData = {
      baseY: sparkle.position.y,
      floatSpeed: 0.5 + Math.random()*1.5,
      floatAmp: 0.3 + Math.random()*0.5,
      phase: Math.random()*Math.PI*2,
      twinkleSpeed: 1 + Math.random()*2
    };
    scene.add(sparkle);
    disneySparkles.push(sparkle);
  }
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
    {colors:['rgba(34,211,238,1)','rgba(56,189,248,1)','rgba(167,139,250,1)'], size:22, opacity:0.15},
    {colors:['rgba(168,85,247,1)','rgba(232,121,249,1)','rgba(192,132,252,1)'], size:24, opacity:0.16},
    {colors:['rgba(52,211,153,1)','rgba(45,212,191,1)','rgba(34,211,238,1)'], size:20, opacity:0.13},
    {colors:['rgba(232,121,249,1)','rgba(244,114,182,1)','rgba(168,85,247,1)'], size:23, opacity:0.15},
    {colors:['rgba(56,189,248,1)','rgba(125,211,252,1)','rgba(34,211,238,1)'], size:25, opacity:0.12},
    {colors:['rgba(124,58,237,1)','rgba(168,85,247,1)','rgba(99,102,241,1)'], size:21, opacity:0.16},
    {colors:['rgba(250,204,21,1)','rgba(251,191,36,1)','rgba(252,165,34,1)'], size:20, opacity:0.13},
    {colors:['rgba(244,114,182,1)','rgba(232,121,249,1)','rgba(251,113,133,1)'], size:18, opacity:0.14},
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
  scene.add(stars);
}

function buildOrbs(nebulaType) {
  orbMeshes = [];
  orbLabels = [];
  var orbGroup = new THREE.Group(); scene.add(orbGroup);

  var books = NEBULA_BOOKS[nebulaType] || [];
  var goldR = (1+Math.sqrt(5))/2;
  var nodePosArr = new Float32Array(books.length*3);

  // 更均匀的分布 - 使用斐波那契球面
  books.forEach(function(book,i) {
    // 星球纹理
    var texCanvas = generatePlanetTexture(book.color, (i+1)*137);
    var tex = new THREE.CanvasTexture(texCanvas);
    tex.encoding = THREE.sRGBEncoding;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;

    // 球体增强3D渲染 - 金属质感，更强立体感，有星辉和阴影
    var mat = new THREE.MeshStandardMaterial({
      map:tex, 
      roughness:0.3, 
      metalness:0.5, 
      emissive:new THREE.Color(book.color), 
      emissiveIntensity:0.12, 
      transparent:false,
      opacity:1.0,
      depthWrite:true,
      envMapIntensity:1.5
    });
    var geo = new THREE.SphereGeometry(ORB_RADIUS, ORB_SEGMENTS, ORB_SEGMENTS);
    var mesh = new THREE.Mesh(geo, mat);

    // 斐波那契球面分布 - 更均匀
    var phi = Math.acos(1-2*(i+0.5)/books.length);
    var theta = 2*Math.PI*(i+0.5)/goldR;
    var r = 5.0 + (i%3)*2.0; // 交替距离，更均匀
    mesh.position.set(r*Math.sin(phi)*Math.cos(theta), r*Math.sin(phi)*Math.sin(theta), r*Math.cos(phi));
    mesh.userData = {book:book, id:book.id, basePos:mesh.position.clone(), floatSpeed:0.08+Math.random()*0.15, floatAmp:0.015+Math.random()*0.04, baseRotSpeed:0.08+Math.random()*0.12};
    orbGroup.add(mesh); orbMeshes.push(mesh);

    // 微弱光晕 - 不要太亮
    var atmoCanvas = generateAtmosphereTexture(book.color);
    var atmoTex = new THREE.CanvasTexture(atmoCanvas);
    var atmoMat = new THREE.SpriteMaterial({map:atmoTex, blending:THREE.AdditiveBlending, transparent:true, opacity:0.15, depthWrite:false});
    var atmo = new THREE.Sprite(atmoMat);
    atmo.scale.set(ORB_RADIUS*2.2, ORB_RADIUS*2.2, 1);
    atmo.userData = {parentOrb:mesh};
    orbGroup.add(atmo);

    // 标签 - 放在球体上方
    var label = generateLabelSprite(book);
    label.position.copy(mesh.position);
    label.position.y += ORB_RADIUS+0.6;
    label.renderOrder = 2;
    label.userData = {parentOrb:mesh};
    orbGroup.add(label); orbLabels.push(label);

    nodePosArr[i*3] = mesh.position.x;
    nodePosArr[i*3+1] = mesh.position.y;
    nodePosArr[i*3+2] = mesh.position.z;
  });
}

function buildConnections() {
  var oldConns = [];
  scene.traverse(function(child) {
    if (child.userData && child.userData.from !== undefined) oldConns.push(child);
  });
  oldConns.forEach(function(c) { scene.remove(c); if(c.geometry)c.geometry.dispose(); if(c.material)c.material.dispose(); });
  connFlows = [];

  var ccfg = CONN_COLOR_MAP[currentNebulaType] || CONN_COLOR_MAP.scifi;
  var maxDist = 9;

  for (var i=0; i<orbMeshes.length; i++) {
    var d = [];
    for (var j=0; j<orbMeshes.length; j++) {
      if(i===j) continue;
      d.push({idx:j, dist:orbMeshes[i].position.distanceTo(orbMeshes[j].position)});
    }
    d.sort(function(a,b) { return a.dist-b.dist; });
    d.slice(0,2).forEach(function(c) {
      if(c.dist>maxDist) return;

      // 每颗粒独立的进度和速度
      var particleProgress = new Float32Array(FLOW_PARTICLES);
      var particleSpeeds = new Float32Array(FLOW_PARTICLES);
      var particleSizes = new Float32Array(FLOW_PARTICLES);
      var particleOpacities = new Float32Array(FLOW_PARTICLES);
      for (var p=0; p<FLOW_PARTICLES; p++) {
        particleProgress[p] = Math.random();
        particleSpeeds[p] = 0.015 + Math.random()*0.04;
        particleSizes[p] = 0.015 + Math.random()*0.025;
        particleOpacities[p] = 0.15 + Math.random()*0.3;
      }

      // 颜色：在星云基础色调上随机偏移
      var hueJitter = (Math.random()-0.5)*0.06;
      var col = new THREE.Color().setHSL(ccfg.hue+hueJitter, ccfg.sat, ccfg.light);

      var pGeo = new THREE.BufferGeometry();
      var pPositions = new Float32Array(FLOW_PARTICLES*3);
      var pColors = new Float32Array(FLOW_PARTICLES*3);
      var pSizes = new Float32Array(FLOW_PARTICLES);
      var pi = orbMeshes[i].position;
      var pj = orbMeshes[c.idx].position;

      for (var p=0; p<FLOW_PARTICLES; p++) {
        var tp = particleProgress[p];
        pPositions[p*3] = pi.x+(pj.x-pi.x)*tp;
        pPositions[p*3+1] = pi.y+(pj.y-pi.y)*tp;
        pPositions[p*3+2] = pi.z+(pj.z-pi.z)*tp;
        pColors[p*3] = col.r; pColors[p*3+1] = col.g; pColors[p*3+2] = col.b;
        pSizes[p] = particleSizes[p];
      }

      pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions,3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(pColors,3));
      pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes,1));

      var pMat = new THREE.PointsMaterial({
        size:0.03, vertexColors:true, blending:THREE.AdditiveBlending,
        depthWrite:false, transparent:true, opacity:0.35
      });
      var pts = new THREE.Points(pGeo, pMat);
      pts.userData = {
        from:i, to:c.idx,
        particleProgress:particleProgress,
        particleSpeeds:particleSpeeds,
        particleOpacities:particleOpacities
      };
      scene.add(pts); connFlows.push(pts);
    });
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

function selectBook(book) {
  selectedBook = book;
  panelTitle.textContent = book.title;
  panelAuthor.textContent = book.author;
  var genreMap = {scifi:'科幻',xianxia:'修仙',romance:'言情'};
  panelGenre.textContent = genreMap[currentNebulaType] || '';
  panelInsight.textContent = book.insight;
  audioLabel.textContent = '沉浸式音频 · '+book.title;
  rightPanel.classList.remove('hidden');

  paperNote.innerHTML = '<div class="tape"></div><div class="note-icon">📖</div>「'+book.quote+'」<br><span style="font-size:11px;opacity:0.6">—— 《'+book.title+'》</span>';

  panelCover.innerHTML = '';
  var pc = generatePanelCover(book, 350);
  var pv = document.createElement('canvas');
  pv.width = pc.width; pv.height = pc.height;
  pv.getContext('2d').drawImage(pc,0,0);
  pv.style.width = '100%'; pv.style.height = '100%'; pv.style.objectFit = 'contain';
  panelCover.appendChild(pv);
}

// ─── 动画循环 ──────────────────────────────────────
function animate() {
  if (!renderer) return;
  animationId = requestAnimationFrame(animate);
  var dt = Math.min(0.1, 0.016);
  var t = performance.now()*0.001;
  controls.update();

  var fwd = new THREE.Vector3(); camera.getWorldDirection(fwd); fwd.y=0; fwd.normalize();
  var rgt = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0,1,0)).normalize();
  var mv = new THREE.Vector3();
  if(keys.w) mv.add(fwd); if(keys.s) mv.sub(fwd); if(keys.d) mv.add(rgt); if(keys.a) mv.sub(rgt);
  if(mv.length()>0) { mv.normalize().multiplyScalar(wasdSpeed*dt); controls.target.add(mv); }

  stars.rotation.y += dt*0.012;
  stars.rotation.x += dt*0.005;

  orbMeshes.forEach(function(m) {
    var ud = m.userData;
    m.position.x = ud.basePos.x+Math.sin(t*ud.floatSpeed)*ud.floatAmp;
    m.position.y = ud.basePos.y+Math.cos(t*ud.floatSpeed*0.6)*ud.floatAmp*1.25;
    m.position.z = ud.basePos.z+Math.cos(t*ud.floatSpeed*0.45)*ud.floatAmp*0.75;
    // 水平自转
    m.rotation.y += dt*ud.baseRotSpeed;
  });

  orbLabels.forEach(function(l) {
    var parent = l.userData.parentOrb;
    l.position.copy(parent.position);
    l.position.y += ORB_RADIUS+0.6;
    l.visible = parent.visible;
  });

  // 大气层跟随
  scene.traverse(function(child) {
    if (child.userData && child.userData.parentOrb && child.isSprite && child.material.blending === THREE.AdditiveBlending) {
      var p = child.userData.parentOrb;
      child.position.copy(p.position);
      child.visible = p.visible;
    }
  });

  if(t-lastRebuild>5.0) { buildConnections(); lastRebuild=t; }

  connFlows.forEach(function(obj) {
    var ud = obj.userData;
    var f = orbMeshes[ud.from], tt = orbMeshes[ud.to];
    if(!f||!tt||!f.visible||!tt.visible) { obj.visible=false; return; }
    obj.visible = true;
    var posArr = obj.geometry.attributes.position.array;
    var pi = f.position, pj = tt.position;
    for(var p=0; p<FLOW_PARTICLES; p++) {
      ud.particleProgress[p] += ud.particleSpeeds[p]*dt;
      if(ud.particleProgress[p]>1) ud.particleProgress[p]-=1;
      var pp = ud.particleProgress[p];
      posArr[p*3] = pi.x+(pj.x-pi.x)*pp;
      posArr[p*3+1] = pi.y+(pj.y-pi.y)*pp;
      posArr[p*3+2] = pi.z+(pj.z-pi.z)*pp;
    }
    obj.geometry.attributes.position.needsUpdate = true;
  });

  // 迪士尼魔法粒子动画
  disneySparkles.forEach(function(sparkle) {
    var ud = sparkle.userData;
    sparkle.position.y = ud.baseY + Math.sin(t*ud.floatSpeed + ud.phase)*ud.floatAmp;
    sparkle.material.opacity = 0.4 + Math.sin(t*ud.twinkleSpeed + ud.phase)*0.4;
    var sc = 0.8 + Math.sin(t*ud.twinkleSpeed*0.7 + ud.phase)*0.4;
    sparkle.scale.set(sc, sc, sc);
  });

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

  rightPanel = document.getElementById('right-panel');
  panelTitle = document.getElementById('panel-title');
  panelAuthor = document.getElementById('panel-author');
  panelGenre = document.getElementById('panel-genre');
  panelInsight = document.getElementById('panel-insight');
  panelCover = document.getElementById('panel-cover');
  audioLabel = document.getElementById('audio-label');
  ctaBtn = document.getElementById('cta-btn');
  paperNote = document.getElementById('paper-note');

  var titleEl = document.getElementById('constellation-title');
  if(titleEl) titleEl.textContent = NEBULA_NAMES[nebulaType] || '书籍宇宙';

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('mousemove', onMouseMove);
  keyDownHandler = onKeyDown; keyUpHandler = onKeyUp;
  window.addEventListener('keydown', keyDownHandler);
  window.addEventListener('keyup', keyUpHandler);
  window.addEventListener('keydown', onShiftDown);
  window.addEventListener('keyup', onShiftUp);
  canvas.addEventListener('wheel', onWheel, {passive:false});
  resizeHandler = onResize;
  window.addEventListener('resize', resizeHandler);

  var panelClose = document.getElementById('panel-close');
  if(panelClose) panelClose.addEventListener('click', function() { rightPanel.classList.add('hidden'); });

  if(ctaBtn) {
    ctaBtn.addEventListener('click', function() {
      if(!selectedBook) return;
      // 打开书籍体验家聊天界面
      if(typeof window.startBookExperience === 'function') {
        window.startBookExperience(selectedBook);
      }
    });
  }

  var searchInput = document.getElementById('search-input');
  if(searchInput) {
    searchInput.addEventListener('input', function(e) {
      var q = e.target.value.toLowerCase();
      orbMeshes.forEach(function(m) {
        var b = m.userData.book;
        if(!q) { m.visible=true; return; }
        m.visible = b.title.toLowerCase().indexOf(q)>=0 || b.author.toLowerCase().indexOf(q)>=0;
      });
      orbLabels.forEach(function(l) { l.visible = l.userData.parentOrb.visible; });
      buildConnections();
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
    canvas.removeEventListener('wheel', onWheel);
  }
  if(keyDownHandler) window.removeEventListener('keydown', keyDownHandler);
  if(keyUpHandler) window.removeEventListener('keyup', keyUpHandler);
  window.removeEventListener('keydown', onShiftDown);
  window.removeEventListener('keyup', onShiftUp);
  if(resizeHandler) window.removeEventListener('resize', resizeHandler);

  if(composer) composer.dispose && composer.dispose();
  if(renderer) { renderer.dispose(); renderer=null; }
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
  disneySparkles=[];
  stars=null; nodeDots=null; selectedBook=null;

  if(rightPanel) rightPanel.classList.add('hidden');
};

console.log('%c✦ 星球模块已加载', 'color:#a855f7;font-size:12px');
})();
