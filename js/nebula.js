// 3D星云场景 - Three.js（高级视觉版）

const nebulaColors = {
    scifi: {
        primary: new THREE.Color('#5b8dee'),
        secondary: new THREE.Color('#9b7aed'),
        tertiary: new THREE.Color('#c084fc'),
        css: '#5b8dee'
    },
    xianxia: {
        primary: new THREE.Color('#f59e0b'),
        secondary: new THREE.Color('#ef4444'),
        tertiary: new THREE.Color('#fb923c'),
        css: '#f59e0b'
    },
    romance: {
        primary: new THREE.Color('#ec4899'),
        secondary: new THREE.Color('#f43f5e'),
        tertiary: new THREE.Color('#fb7185'),
        css: '#ec4899'
    }
};

let scene, camera, renderer;
let nebulaGroups = {};
let starField, starData;
let meteors = [];
let bgNebulaClouds = [];
let randomFlashes = [];
let animationId = null;
let isPaused = false;
let raycaster, mouse;
let hoveredNebula = null;
let targetCameraZ = 28;
const CAMERA_Z_MIN = 12;
const CAMERA_Z_MAX = 55;
const CAMERA_LERP = 0.06;

let cameraTheta = 0.3;
let cameraPhi = 0.1;
let targetTheta = 0.3;
let targetPhi = 0.1;
const ORBIT_SPEED = 0.004;
const ORBIT_LERP = 0.06;
let isDragging = false;
let lastMouse = { x: 0, y: 0 };
let cameraRadius = 28;
let targetRadius = 28;

const nebulaPositions = {
    scifi: new THREE.Vector3(-13, 2.5, -4),
    xianxia: new THREE.Vector3(2, -3.5, 3),
    romance: new THREE.Vector3(11, 4, -6)
};

// ====== 纹理生成 ======

let particleTex, softGlowTex, nebulaCloudTex;

function generateTextures() {
    // 星星/粒子纹理：柔和圆形
    const c1 = document.createElement('canvas');
    c1.width = 64; c1.height = 64;
    const g1 = c1.getContext('2d');
    const grad1 = g1.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad1.addColorStop(0, 'rgba(255,255,255,1)');
    grad1.addColorStop(0.15, 'rgba(255,255,255,0.9)');
    grad1.addColorStop(0.4, 'rgba(255,255,255,0.4)');
    grad1.addColorStop(1, 'rgba(255,255,255,0)');
    g1.fillStyle = grad1;
    g1.fillRect(0, 0, 64, 64);
    particleTex = new THREE.CanvasTexture(c1);

    // 柔和光晕纹理
    const c2 = document.createElement('canvas');
    c2.width = 128; c2.height = 128;
    const g2 = c2.getContext('2d');
    const grad2 = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad2.addColorStop(0, 'rgba(255,255,255,1)');
    grad2.addColorStop(0.2, 'rgba(255,255,255,0.6)');
    grad2.addColorStop(0.5, 'rgba(255,255,255,0.15)');
    grad2.addColorStop(1, 'rgba(255,255,255,0)');
    g2.fillStyle = grad2;
    g2.fillRect(0, 0, 128, 128);
    softGlowTex = new THREE.CanvasTexture(c2);

    // 星云气体云纹理：更大更柔和
    const c3 = document.createElement('canvas');
    c3.width = 256; c3.height = 256;
    const g3 = c3.getContext('2d');
    const grad3 = g3.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad3.addColorStop(0, 'rgba(255,255,255,0.5)');
    grad3.addColorStop(0.25, 'rgba(255,255,255,0.25)');
    grad3.addColorStop(0.5, 'rgba(255,255,255,0.08)');
    grad3.addColorStop(0.8, 'rgba(255,255,255,0.02)');
    grad3.addColorStop(1, 'rgba(255,255,255,0)');
    g3.fillStyle = grad3;
    g3.fillRect(0, 0, 256, 256);
    nebulaCloudTex = new THREE.CanvasTexture(c3);
}

// ====== 星云气体云 ======

function createNebulaClouds(color, count) {
    const group = new THREE.Group();
    for (let i = 0; i < count; i++) {
        const mat = new THREE.SpriteMaterial({
            map: nebulaCloudTex,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.18 + Math.random() * 0.25
        });
        const mixColor = color.clone();
        const r = Math.random();
        if (r > 0.4) mixColor.lerp(nebulaColors.scifi.tertiary, Math.random() * 0.35);
        mat.color = mixColor;

        const sprite = new THREE.Sprite(mat);
        const scale = 8 + Math.random() * 14;
        sprite.scale.set(scale, scale * (0.5 + Math.random() * 0.5), 1);
        sprite.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 6
        );
        sprite.userData = {
            baseOpacity: mat.opacity,
            driftX: (Math.random() - 0.5) * 0.004,
            driftY: (Math.random() - 0.5) * 0.003,
            phase: Math.random() * Math.PI * 2
        };
        group.add(sprite);
    }
    return group;
}

// ====== 环形粒子 ======

function createRingParticles(innerR, outerR, count, color, size) {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const opacities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = innerR + Math.random() * (outerR - innerR);
        pos[i * 3] = Math.cos(angle) * r;
        pos[i * 3 + 1] = (Math.random() - 0.5) * (outerR - innerR) * 0.25;
        pos[i * 3 + 2] = Math.sin(angle) * r;

        const mix = Math.random() * 0.35;
        col[i * 3] = color.r + (1 - color.r) * mix;
        col[i * 3 + 1] = color.g + (1 - color.g) * mix;
        col[i * 3 + 2] = color.b + (1 - color.b) * mix;
        opacities[i] = 0.5 + Math.random() * 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
        size, vertexColors: true, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
        sizeAttenuation: true, map: particleTex
    });

    return new THREE.Points(geo, mat);
}

// ====== 星云组 ======

function createNebula(type) {
    const colors = nebulaColors[type];
    const group = new THREE.Group();
    group.userData = { type, targetScale: 1 };

    // 核心球体（更大）
    const coreMat = new THREE.MeshBasicMaterial({ color: colors.primary, transparent: true, opacity: 1 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), coreMat);
    core.userData = { type, isCore: true };
    group.add(core);

    // 核心强光（多层Bloom模拟，更大更亮）
    const bloomLayers = [
        { color: new THREE.Color('#ffffff'), size: 5, opacity: 0.8 },
        { color: colors.primary, size: 8, opacity: 0.45 },
        { color: colors.secondary, size: 13, opacity: 0.2 },
        { color: colors.tertiary || colors.primary, size: 20, opacity: 0.1 }
    ];
    bloomLayers.forEach(cfg => {
        const mat = new THREE.SpriteMaterial({
            map: softGlowTex, transparent: true, blending: THREE.AdditiveBlending,
            depthWrite: false, opacity: cfg.opacity
        });
        mat.color = cfg.color;
        const s = new THREE.Sprite(mat);
        s.scale.set(cfg.size, cfg.size, 1);
        group.add(s);
    });

    // 核心点光源（更强）
    const light = new THREE.PointLight(colors.primary, 8, 40);
    group.add(light);

    // 星云气体云雾（更多更大）
    const clouds = createNebulaClouds(colors.primary, 16);
    group.add(clouds);

    // 环形粒子（更大半径）
    const ringConfigs = [
        { inner: 6.0, outer: 7.5, count: 800, size: 0.07, speed: 0.0018, dir: 1, tilt: 0.12 },
        { inner: 4.5, outer: 5.8, count: 700, size: 0.085, speed: 0.0028, dir: -1, tilt: -0.09 },
        { inner: 3.0, outer: 4.3, count: 600, size: 0.1, speed: 0.0045, dir: 1, tilt: 0.06 },
        { inner: 1.8, outer: 2.9, count: 500, size: 0.12, speed: 0.007, dir: -1, tilt: -0.04 },
        { inner: 0.8, outer: 1.7, count: 400, size: 0.15, speed: 0.01, dir: 1, tilt: 0.02 }
    ];

    const rings = [];
    ringConfigs.forEach(cfg => {
        const ring = createRingParticles(cfg.inner, cfg.outer, cfg.count, colors.primary, cfg.size);
        ring.userData = { speed: cfg.speed, baseSpeed: cfg.speed, dir: cfg.dir, tilt: cfg.tilt };
        group.add(ring);
        rings.push(ring);
    });

    group.userData.rings = rings;
    group.userData.core = core;
    group.userData.clouds = clouds;
    group.userData.light = light;

    return group;
}

// ====== 动态星空 ======

function createStarField() {
    const count = 28000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    starData = [];

    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 200;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 160;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 140 - 10;

        const vx = (Math.random() - 0.5) * 0.015;
        const vy = (Math.random() - 0.5) * 0.015;
        const vz = (Math.random() - 0.5) * 0.01;
        starData.push({ vx, vy, vz, flicker: Math.random() * Math.PI * 2, flickerSpeed: 0.02 + Math.random() * 0.06 });

        const t = Math.random();
        if (t < 0.5) {
            col[i*3]=1; col[i*3+1]=1; col[i*3+2]=1;
        } else if (t < 0.7) {
            col[i*3]=0.82; col[i*3+1]=0.9; col[i*3+2]=1;
        } else if (t < 0.82) {
            col[i*3]=1; col[i*3+1]=0.96; col[i*3+2]=0.82;
        } else if (t < 0.9) {
            col[i*3]=1; col[i*3+1]=0.82; col[i*3+2]=0.62;
        } else if (t < 0.96) {
            col[i*3]=0.72; col[i*3+1]=0.86; col[i*3+2]=1;
        } else {
            col[i*3]=1; col[i*3+1]=0.72; col[i*3+2]=0.72;
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.28, vertexColors: true, transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false,
        sizeAttenuation: true, map: particleTex
    });

    return new THREE.Points(geo, mat);
}

// ====== 背景星云雾 ======

function createBgNebulaClouds() {
    const configs = [
        { pos: [-40, 15, -60], color: '#4a2080', scale: 60, opacity: 0.08 },
        { pos: [50, -20, -70], color: '#8b1a3a', scale: 50, opacity: 0.06 },
        { pos: [-20, -30, -80], color: '#1a3a6b', scale: 70, opacity: 0.07 },
        { pos: [30, 25, -55], color: '#6b2a4a', scale: 45, opacity: 0.05 },
        { pos: [0, 0, -90], color: '#2a1a50', scale: 80, opacity: 0.06 }
    ];

    const clouds = [];
    configs.forEach(cfg => {
        const mat = new THREE.SpriteMaterial({
            map: nebulaCloudTex, transparent: true, blending: THREE.AdditiveBlending,
            depthWrite: false, opacity: cfg.opacity
        });
        mat.color = new THREE.Color(cfg.color);
        const s = new THREE.Sprite(mat);
        s.scale.set(cfg.scale, cfg.scale * 0.6, 1);
        s.position.set(...cfg.pos);
        s.userData = { baseOpacity: cfg.opacity, phase: Math.random() * Math.PI * 2 };
        scene.add(s);
        clouds.push(s);
    });
    return clouds;
}

// ====== 流星 ======

function createMeteor() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6);
    const colors = new Float32Array(6);

    const side = Math.floor(Math.random() * 4);
    let x, y, z;
    switch (side) {
        case 0: x = -80; y = (Math.random()-0.5)*100; z = (Math.random()-0.5)*70; break;
        case 1: x = 80; y = (Math.random()-0.5)*100; z = (Math.random()-0.5)*70; break;
        case 2: y = 55; x = (Math.random()-0.5)*140; z = (Math.random()-0.5)*70; break;
        case 3: y = -55; x = (Math.random()-0.5)*140; z = (Math.random()-0.5)*70; break;
    }
    positions[0]=x; positions[1]=y; positions[2]=z;
    positions[3]=x; positions[4]=y; positions[5]=z;

    const dx = (Math.random()-0.5)*60;
    const dy = (Math.random()-0.5)*50;
    const dz = (Math.random()-0.5)*30;
    const b = 1.0;
    colors[0]=b; colors[1]=b; colors[2]=b;
    colors[3]=b; colors[4]=b; colors[5]=b;

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({
        vertexColors: true, transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false
    });

    const line = new THREE.Line(geo, mat);
    line.userData = { dx, dy, dz, life: 0, maxLife: 60+Math.random()*60, speed: 0.4+Math.random()*0.35 };

    // 流星头部光晕（更大更亮）
    const glowMat = new THREE.SpriteMaterial({
        map: softGlowTex, transparent: true, blending: THREE.AdditiveBlending,
        depthWrite: false, opacity: 0.8, color: new THREE.Color('#ddeeff')
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(3.5, 3.5, 1);
    line.add(glow);
    line.userData.glow = glow;

    // 流星拖尾光晕（第二层）
    const tailMat = new THREE.SpriteMaterial({
        map: softGlowTex, transparent: true, blending: THREE.AdditiveBlending,
        depthWrite: false, opacity: 0.4, color: new THREE.Color('#aaccff')
    });
    const tail = new THREE.Sprite(tailMat);
    tail.scale.set(2, 2, 1);
    tail.position.set(-dx*0.01, -dy*0.01, -dz*0.01);
    line.add(tail);
    line.userData.tail = tail;

    return line;
}

function updateMeteor(m) {
    const d = m.userData;
    d.life++;
    const p = m.geometry.attributes.position;
    const hx=p.array[0], hy=p.array[1], hz=p.array[2];
    p.array[0] += d.dx*d.speed*0.022;
    p.array[1] += d.dy*d.speed*0.022;
    p.array[2] += d.dz*d.speed*0.022;
    p.array[3] = hx+(p.array[0]-hx)*0.15;
    p.array[4] = hy+(p.array[1]-hy)*0.15;
    p.array[5] = hz+(p.array[2]-hz)*0.15;
    p.needsUpdate = true;

    if (d.glow) {
        d.glow.position.set(p.array[0], p.array[1], p.array[2]);
        d.glow.material.opacity = 0.7 * (1 - d.life/d.maxLife);
        d.glow.scale.setScalar(3.5 * (1 - d.life/d.maxLife*0.5));
    }
    if (d.tail) {
        d.tail.position.set(p.array[3], p.array[4], p.array[5]);
        d.tail.material.opacity = 0.35 * (1 - d.life/d.maxLife);
    }
    m.material.opacity = 1 - d.life/d.maxLife;
    return d.life < d.maxLife;
}

// ====== 初始化 ======

let meteorTimer = null;

function initNebulaScene() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a1e');
    scene.fog = new THREE.FogExp2('#0a0a1e', 0.006);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 400);
    camera.position.set(0, 0, targetCameraZ);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    generateTextures();

    // 环境光
    scene.add(new THREE.AmbientLight(0x101028, 1.2));

    // 星空
    starField = createStarField();
    scene.add(starField);

    // 背景星云雾
    bgNebulaClouds = createBgNebulaClouds();

    // 随机闪烁光点
    for (let i = 0; i < 15; i++) {
        const flashColors = ['#ffffff', '#aaccff', '#ffddaa', '#ddaaff', '#aaffdd'];
        const mat = new THREE.SpriteMaterial({
            map: softGlowTex, transparent: true, blending: THREE.AdditiveBlending,
            depthWrite: false, opacity: 0,
            color: new THREE.Color(flashColors[Math.floor(Math.random()*flashColors.length)])
        });
        const s = new THREE.Sprite(mat);
        s.scale.set(1.5, 1.5, 1);
        s.position.set(
            (Math.random()-0.5)*120,
            (Math.random()-0.5)*90,
            (Math.random()-0.5)*80 - 20
        );
        s.userData = {
            phase: Math.random()*Math.PI*2,
            speed: 0.3+Math.random()*0.8,
            maxOpacity: 0.3+Math.random()*0.5,
            baseScale: 1+Math.random()*2
        };
        scene.add(s);
        randomFlashes.push(s);
    }

    // 三个星云
    ['scifi','xianxia','romance'].forEach(type => {
        const n = createNebula(type);
        n.position.copy(nebulaPositions[type]);
        scene.add(n);
        nebulaGroups[type] = n;
    });

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(-999, -999);

    const c = renderer.domElement;
    window.addEventListener('resize', onResize);
    window.addEventListener('wheel', onWheel, { passive: false });
    c.addEventListener('mousedown', onDown);
    c.addEventListener('mousemove', onMove);
    c.addEventListener('mouseup', onUp);
    c.addEventListener('mouseleave', onUp);
    c.addEventListener('click', onClick);

    meteorTimer = setInterval(spawnMeteor, 900 + Math.random()*1100);
    for (let i=0; i<4; i++) { const m=createMeteor(); scene.add(m); meteors.push(m); }

    isPaused = false;
    animate();
}

function spawnMeteor() {
    if (isPaused||!scene) return;
    const n = Math.random()<0.25 ? 3 : Math.random()<0.45 ? 2 : 1;
    for (let i=0; i<n; i++) {
        setTimeout(() => {
            if (isPaused||!scene) return;
            const m = createMeteor(); scene.add(m); meteors.push(m);
        }, i*120);
    }
}

function onResize() {
    if (!camera||!renderer) return;
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onWheel(e) {
    if (isPaused) return;
    e.preventDefault();
    targetRadius += e.deltaY*0.015;
    targetRadius = Math.max(CAMERA_Z_MIN, Math.min(CAMERA_Z_MAX, targetRadius));
}

function onDown(e) { isDragging=true; lastMouse.x=e.clientX; lastMouse.y=e.clientY; }

function onMove(e) {
    if (isPaused) return;
    mouse.x = (e.clientX/window.innerWidth)*2-1;
    mouse.y = -(e.clientY/window.innerHeight)*2+1;
    if (isDragging) {
        targetTheta -= (e.clientX-lastMouse.x)*ORBIT_SPEED;
        targetPhi -= (e.clientY-lastMouse.y)*ORBIT_SPEED;
        targetPhi = Math.max(-0.6, Math.min(0.6, targetPhi));
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;
    }
}

function onUp() { isDragging=false; }

function onClick() {
    if (isPaused||isDragging||!hoveredNebula) return;
    currentNebula = hoveredNebula;
    switchScreen('book');
    // 初始化星座界面
    if (typeof window.initConstellation === 'function') {
        window.initConstellation(hoveredNebula);
    }
}

function updateInfoCards() {
    ['scifi','xianxia','romance'].forEach(type => {
        const el = document.getElementById(`info-${type}`);
        if (!el) return;
        if (hoveredNebula === type) {
            const v = new THREE.Vector3().copy(nebulaGroups[type].position).project(camera);
            const x = (v.x*0.5+0.5)*renderer.domElement.clientWidth;
            const y = (-v.y*0.5+0.5)*renderer.domElement.clientHeight;
            let cx = x+130, cy = y;
            if (cx+260>window.innerWidth) cx=x-380;
            if (cy+160>window.innerHeight) cy=window.innerHeight-170;
            if (cy<10) cy=10;
            el.style.left=cx+'px'; el.style.top=cy+'px';
            el.classList.add('visible');
        } else {
            el.classList.remove('visible');
        }
    });
}

function animate() {
    if (isPaused) return;
    animationId = requestAnimationFrame(animate);

    const t = Date.now() * 0.001;

    // 相机
    cameraTheta += (targetTheta-cameraTheta)*ORBIT_LERP;
    cameraPhi += (targetPhi-cameraPhi)*ORBIT_LERP;
    cameraRadius += (targetRadius-cameraRadius)*CAMERA_LERP;
    camera.position.x = cameraRadius*Math.sin(cameraTheta)*Math.cos(cameraPhi);
    camera.position.y = cameraRadius*Math.sin(cameraPhi);
    camera.position.z = cameraRadius*Math.cos(cameraTheta)*Math.cos(cameraPhi);
    camera.lookAt(0, 0, 0);

    // 星空飘动+闪烁
    if (starField) {
        const p = starField.geometry.attributes.position;
        for (let i=0; i<p.count; i++) {
            const sd = starData[i];
            p.array[i*3] += sd.vx;
            p.array[i*3+1] += sd.vy;
            p.array[i*3+2] += sd.vz;
            if (p.array[i*3]>100) p.array[i*3]=-100;
            if (p.array[i*3]<-100) p.array[i*3]=100;
            if (p.array[i*3+1]>80) p.array[i*3+1]=-80;
            if (p.array[i*3+1]<-80) p.array[i*3+1]=80;
            if (p.array[i*3+2]>60) p.array[i*3+2]=-80;
            if (p.array[i*3+2]<-80) p.array[i*3+2]=60;
        }
        p.needsUpdate = true;
        // 星星整体微弱呼吸
        starField.material.size = 0.28 + Math.sin(t*0.4)*0.03;
    }

    // 背景星云雾呼吸
    bgNebulaClouds.forEach(c => {
        c.material.opacity = c.userData.baseOpacity + Math.sin(t*0.3+c.userData.phase)*0.015;
    });

    // 随机闪烁光点
    randomFlashes.forEach(s => {
        const d = s.userData;
        d.phase += d.speed * 0.02;
        const v = (Math.sin(d.phase) + 1) * 0.5;
        s.material.opacity = v * d.maxOpacity;
        const sc = d.baseScale * (0.8 + v * 0.4);
        s.scale.set(sc, sc, 1);
    });

    // 流星
    for (let i=meteors.length-1; i>=0; i--) {
        if (!updateMeteor(meteors[i])) {
            scene.remove(meteors[i]);
            meteors[i].geometry.dispose();
            meteors[i].material.dispose();
            meteors.splice(i, 1);
        }
    }

    // Raycaster
    raycaster.setFromCamera(mouse, camera);
    const cores = Object.values(nebulaGroups).map(g=>g.userData.core);
    const hits = raycaster.intersectObjects(cores);
    let newH = hits.length>0 ? hits[0].object.userData.type : null;

    if (newH !== hoveredNebula) {
        if (hoveredNebula && nebulaGroups[hoveredNebula]) {
            const g = nebulaGroups[hoveredNebula];
            g.userData.targetScale = 1;
            g.userData.rings.forEach(r => r.userData.speed = r.userData.baseSpeed);
            g.userData.light.intensity = 5;
            g.userData.clouds.children.forEach(c => c.material.opacity = c.userData.baseOpacity);
        }
        if (newH && nebulaGroups[newH]) {
            const g = nebulaGroups[newH];
            g.userData.targetScale = 1.12;
            g.userData.rings.forEach(r => r.userData.speed = r.userData.baseSpeed*2.5);
            g.userData.light.intensity = 8;
            g.userData.clouds.children.forEach(c => c.material.opacity = Math.min(c.userData.baseOpacity*2, 0.5));
        }
        hoveredNebula = newH;
    }

    // 星云动画
    Object.values(nebulaGroups).forEach(g => {
        const s = g.scale.x;
        const ts = g.userData.targetScale;
        const ns = s+(ts-s)*0.08;
        g.scale.set(ns, ns, ns);

        g.userData.core.rotation.y += 0.006;
        g.userData.core.rotation.x += 0.002;

        g.userData.rings.forEach(r => {
            r.rotation.y += r.userData.speed * r.userData.dir;
        });

        // 气体云微漂移
        g.userData.clouds.children.forEach(c => {
            c.position.x += c.userData.driftX;
            c.position.y += c.userData.driftY;
            if (Math.abs(c.position.x)>4) c.userData.driftX *= -1;
            if (Math.abs(c.position.y)>2) c.userData.driftY *= -1;
        });
    });

    updateInfoCards();
    renderer.render(scene, camera);
}

function pauseNebulaScene() {
    isPaused = true;
    if (animationId) { cancelAnimationFrame(animationId); animationId=null; }
    if (meteorTimer) { clearInterval(meteorTimer); meteorTimer=null; }
    document.querySelectorAll('.nebula-info').forEach(el=>el.classList.remove('visible'));
}

function resumeNebulaScene() {
    if (!isPaused) return;
    isPaused = false;
    meteorTimer = setInterval(spawnMeteor, 900+Math.random()*1100);
    animate();
}

function destroyNebulaScene() {
    pauseNebulaScene();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('wheel', onWheel);
    const c = document.getElementById('three-canvas');
    if (c) {
        c.removeEventListener('mousedown', onDown);
        c.removeEventListener('mousemove', onMove);
        c.removeEventListener('mouseup', onUp);
        c.removeEventListener('mouseleave', onUp);
        c.removeEventListener('click', onClick);
    }
    if (renderer) renderer.dispose();
    scene=null; camera=null; renderer=null;
    nebulaGroups={}; starField=null; meteors=[]; bgNebulaClouds=[]; randomFlashes=[];
}
