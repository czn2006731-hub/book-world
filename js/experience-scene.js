(function() {

var renderer, scene, camera, composer;
var animationId = null;
var stars, nebulaClouds;
var canvas;

function createNebulaSprite(x, y, z, size, colorInputs, opacity) {
  var nc = document.createElement('canvas');
  nc.width = 512; nc.height = 512;
  var nctx = nc.getContext('2d');
  var colors = Array.isArray(colorInputs) ? colorInputs : [colorInputs];
  colors.forEach(function(color) {
    var cx = 256 + (Math.random()-0.5)*200;
    var cy = 256 + (Math.random()-0.5)*200;
    var r = 120 + Math.random()*180;
    var g = nctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, color);
    g.addColorStop(0.25, color.replace(/[\d.]+\)$/,'0.55)'));
    g.addColorStop(0.55, color.replace(/[\d.]+\)$/,'0.12)'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    nctx.fillStyle = g;
    nctx.fillRect(0, 0, 512, 512);
  });
  for (var i = 0; i < 50; i++) {
    var rx = 256 + (Math.random()-0.5)*420;
    var ry = 256 + (Math.random()-0.5)*420;
    var rr = 0.8 + Math.random()*3;
    nctx.fillStyle = 'rgba(255,255,255,' + (0.02+Math.random()*0.08) + ')';
    nctx.beginPath();
    nctx.arc(rx, ry, rr, 0, Math.PI*2);
    nctx.fill();
  }
  var tex = new THREE.CanvasTexture(nc);
  var mat = new THREE.SpriteMaterial({
    map: tex,
    blending: THREE.AdditiveBlending,
    opacity: opacity,
    depthWrite: false
  });
  var spr = new THREE.Sprite(mat);
  spr.position.set(x, y, z);
  spr.scale.set(size, size, 1);
  return spr;
}

function buildScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#030308');
  scene.fog = new THREE.FogExp2('#030308', 0.0001);

  camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.4, 120);
  camera.position.set(0, 0.5, 18);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  var bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.4, 0.4, 0.08
  );
  composer.addPass(bloomPass);

  // 灯光
  scene.add(new THREE.AmbientLight(0x1a1535, 0.5));
  scene.add(new THREE.HemisphereLight(0x5040a0, 0x0a0a1a, 0.4));
  var keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(8, 6, 15);
  scene.add(keyLight);

  var poiLights = [
    {c: 0xc084fc, p: [0,4,6], in: 7, dist: 18},
    {c: 0x22d3ee, p: [6,-1,5], in: 6, dist: 16},
    {c: 0xf0abfc, p: [-5,2,6], in: 6, dist: 16},
    {c: 0x34d399, p: [4,-4,7], in: 5, dist: 14},
  ];
  poiLights.forEach(function(pl) {
    var l = new THREE.PointLight(pl.c, pl.in, pl.dist, 1.0);
    l.position.set(pl.p[0], pl.p[1], pl.p[2]);
    scene.add(l);
  });

  buildStars();
  buildNebulaClouds();
}

function buildStars() {
  var COUNT = 6000;
  var geo = new THREE.BufferGeometry();
  var pos = new Float32Array(COUNT * 3);
  var col = new Float32Array(COUNT * 3);
  var sizes = new Float32Array(COUNT);

  for (var i = 0; i < COUNT; i++) {
    var r = 10 + Math.random() * 50;
    var th = Math.random() * Math.PI * 2;
    var ph = Math.acos(2 * Math.random() - 1);
    pos[i*3]   = r * Math.sin(ph) * Math.cos(th);
    pos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    pos[i*3+2] = r * Math.cos(ph);

    var cl = new THREE.Color().setHSL(
      0.55 + Math.random()*0.3,
      0.3 + Math.random()*0.5,
      0.55 + Math.random()*0.45
    );
    col[i*3]   = cl.r;
    col[i*3+1] = cl.g;
    col[i*3+2] = cl.b;
    sizes[i] = 0.06 + Math.random() * 0.08;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  stars = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 1.0
  }));
  scene.add(stars);
}

function buildNebulaClouds() {
  nebulaClouds = [];
  var defs = [
    {colors: ['rgba(34,211,238,1)','rgba(56,189,248,1)','rgba(167,139,250,1)'], size: 24, opacity: 0.15},
    {colors: ['rgba(168,85,247,1)','rgba(232,121,249,1)','rgba(192,132,252,1)'], size: 28, opacity: 0.16},
    {colors: ['rgba(52,211,153,1)','rgba(45,212,191,1)','rgba(34,211,238,1)'], size: 22, opacity: 0.13},
    {colors: ['rgba(232,121,249,1)','rgba(244,114,182,1)','rgba(168,85,247,1)'], size: 26, opacity: 0.15},
    {colors: ['rgba(56,189,248,1)','rgba(125,211,252,1)','rgba(34,211,238,1)'], size: 30, opacity: 0.12},
    {colors: ['rgba(124,58,237,1)','rgba(168,85,247,1)','rgba(99,102,241,1)'], size: 23, opacity: 0.16},
    {colors: ['rgba(250,204,21,1)','rgba(251,191,36,1)','rgba(252,165,34,1)'], size: 21, opacity: 0.13},
    {colors: ['rgba(244,114,182,1)','rgba(232,121,249,1)','rgba(251,113,133,1)'], size: 20, opacity: 0.14},
    {colors: ['rgba(59,130,246,1)','rgba(99,102,241,1)','rgba(139,92,246,1)'], size: 27, opacity: 0.14},
    {colors: ['rgba(16,185,129,1)','rgba(20,184,166,1)','rgba(6,182,212,1)'], size: 22, opacity: 0.12},
    {colors: ['rgba(244,63,94,1)','rgba(251,113,133,1)','rgba(244,114,182,1)'], size: 19, opacity: 0.13},
    {colors: ['rgba(14,165,233,1)','rgba(56,189,248,1)','rgba(34,211,238,1)'], size: 25, opacity: 0.11},
  ];

  var nebRadius = 28;
  var goldRatio = (1 + Math.sqrt(5)) / 2;
  defs.forEach(function(def, i) {
    var idx = i + 0.5;
    var phi = Math.acos(1 - 2*idx/defs.length);
    var theta = 2 * Math.PI * idx / goldRatio;
    var r = nebRadius + Math.random() * 8;
    var spr = createNebulaSprite(
      r*Math.sin(phi)*Math.cos(theta),
      r*Math.sin(phi)*Math.sin(theta),
      r*Math.cos(phi),
      def.size, def.colors, def.opacity
    );
    spr.userData = {
      basePos: spr.position.clone(),
      orbitSpeed: 0.03 + Math.random() * 0.06,
      orbitRadius: 0.5 + Math.random() * 1.5,
      floatSpeed: 0.2 + Math.random() * 0.4,
      floatAmp: 0.3 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      rotSpeed: 0.01 + Math.random() * 0.02
    };
    scene.add(spr);
    nebulaClouds.push(spr);
  });
}

function animate() {
  if (!renderer) return;
  animationId = requestAnimationFrame(animate);
  var dt = Math.min(0.1, 0.016);
  var t = performance.now() * 0.001;

  // 缓慢旋转星空
  stars.rotation.y += dt * 0.008;
  stars.rotation.x += dt * 0.003;

  // 星云3D动态：轨道运动 + 浮动 + 自转
  nebulaClouds.forEach(function(spr) {
    var ud = spr.userData;
    var t2 = t * ud.orbitSpeed + ud.phase;

    // 椭圆轨道运动
    spr.position.x = ud.basePos.x + Math.cos(t2) * ud.orbitRadius;
    spr.position.y = ud.basePos.y + Math.sin(t2 * 0.7) * ud.orbitRadius * 0.6;
    spr.position.z = ud.basePos.z + Math.sin(t2 * 0.5) * ud.orbitRadius * 0.4;

    // 上下浮动
    spr.position.y += Math.sin(t * ud.floatSpeed + ud.phase) * ud.floatAmp;

    // 缓慢自转
    spr.material.rotation += dt * ud.rotSpeed;
  });

  composer.render();
}

function onResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

// ─── 公开API ──────────────────────────────────────
window.initExperienceScene = function() {
  if (renderer) window.destroyExperienceScene();

  canvas = document.getElementById('experience-canvas');
  if (!canvas) return;

  buildScene();
  window.addEventListener('resize', onResize);
  animate();
};

window.destroyExperienceScene = function() {
  if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
  window.removeEventListener('resize', onResize);

  if (composer) composer.dispose && composer.dispose();
  if (renderer) { renderer.dispose(); renderer = null; }
  if (scene) {
    scene.traverse(function(obj) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (obj.material.map) obj.material.map.dispose();
        obj.material.dispose();
      }
    });
    scene = null;
  }
  camera = null;
  composer = null;
  stars = null;
  nebulaClouds = null;
};

console.log('%c✦ 体验场景模块已加载', 'color:#22d3ee;font-size:12px');
})();
