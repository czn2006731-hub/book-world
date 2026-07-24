// 主逻辑文件

// 星云数据
const nebulaData = {
    scifi: {
        name: '科幻宇宙',
        colors: ['#4a90e2', '#7b68ee'],
        books: [
            { title: '三体', author: '刘慈欣', desc: '地球文明向宇宙发出的第一声啼鸣，引来三体文明的入侵。在这个宏大的叙事中，人类将面临前所未有的生存危机。' },
            { title: '流浪地球', author: '刘慈欣', desc: '太阳即将毁灭，人类带着地球逃亡，在宇宙中寻找新的家园。一场跨越2500年的星际流浪就此展开。' },
            { title: '基地', author: '艾萨克·阿西莫夫', desc: '银河帝国即将崩溃，一群科学家试图保存人类的知识，以缩短即将到来的黑暗时代。' },
            { title: '沙丘', author: '弗兰克·赫伯特', desc: '在沙漠星球阿拉基斯上，控制着宇宙珍贵香料的家族展开了一场史诗般的权力斗争。' },
            { title: '神经漫游者', author: '威廉·吉布森', desc: '一个被人工智能雇佣的黑客，在赛博空间中展开了一场改变世界的任务。' }
        ]
    },
    xianxia: {
        name: '修仙宇宙',
        colors: ['#f39c12', '#e67e22'],
        books: [
            { title: '凡人修仙传', author: '忘语', desc: '一个普通山村少年韩立，偶入修仙门派，凭借坚韧不拔的意志，一步步踏上修仙巅峰。' },
            { title: '遮天', author: '辰东', desc: '冰冷与黑暗并存的宇宙深处，九具仙尸拉着巨棺划过星空，拉开了一场波澜壮阔的修仙大幕。' },
            { title: '完美世界', author: '辰东', desc: '一粒尘可填海，一根草斩尽日月星辰。少年石昊从大荒走出，踏上追求极致的道路。' },
            { title: '斗破苍穹', author: '天蚕土豆', desc: '萧炎从天才沦为废物，又从废物逆袭成强者，在斗气大陆书写属于自己的传奇。' },
            { title: '仙逆', author: '耳根', desc: '王林逆天而行，以凡人之躯踏入修仙之路，成就一代传奇。' }
        ]
    },
    romance: {
        name: '文学宇宙',
        colors: ['#e74c3c', '#9b59b6'],
        books: [
            { title: '红楼梦', author: '曹雪芹', desc: '以贾宝玉与林黛玉、薛宝钗的爱情悲剧为主线，揭示了贾、史、王、薛四大家族的兴衰。' },
            { title: '西游记', author: '吴承恩', desc: '唐僧师徒四人西天取经，历经九九八十一难。一部充满想象力的神魔小说。' },
            { title: '水浒传', author: '施耐庵', desc: '一百零八将梁山聚义，替天行道。一部充满血性与侠义的英雄史诗。' },
            { title: '三国演义', author: '罗贯中', desc: '东汉末年的群雄逐鹿，魏蜀吴三足鼎立。权谋与武力的较量。' },
            { title: '百年孤独', author: '加西亚·马尔克斯', desc: '布恩迪亚家族七代人的传奇故事，魔幻现实主义的巅峰之作。' }
        ]
    }
};

// 当前状态
let currentScreen = 'login';
let currentNebula = null;
const NEBULA_SCREEN_MAP = { scifi: 'scifi', xianxia: 'xianxia', literature: 'literature' };

// 页面切换
function switchScreen(screenId) {
    // 暂停/恢复3D场景
    if (currentScreen === 'main' && screenId !== 'main') {
        pauseNebulaScene();
    }

    // 从游戏返回星座界面时，重新初始化场景
    var prevScreen = currentScreen;

    if (screenId === 'explore-life') {
        if (typeof window.initExploreLife === 'function') {
            setTimeout(function() {
                window.initExploreLife();
            }, 100);
        }
    }

    // 销毁星座界面（封面页不销毁）
    if (currentScreen === 'book' && screenId !== 'book' && screenId !== 'book-landing') {
        if (typeof window.destroyConstellation === 'function') {
            window.destroyConstellation();
        }
    }

    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenId}-screen`).classList.add('active');
    currentScreen = screenId;

    // 强制触发resize确保canvas尺寸正确（修复IDEA内置浏览器模糊问题）
    setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
    }, 50);

    // 游戏界面星空背景
    if (screenId === 'game') {
        // 星星动画由 game.js/initStarCanvas 管理
    }

    if (screenId === 'main') {
        resumeNebulaScene();
    }

    // 从游戏/封面页回到星座时，重新初始化星座场景
    if (screenId === 'book' && prevScreen !== 'book' && typeof window.initConstellation === 'function') {
        if (currentNebula) window.initConstellation(currentNebula);
    }

    // ── BGM 控制 ──
    if (typeof bgmPlay === 'function') {
        if (screenId === 'login') {
            bgmPause();
        } else {
            bgmPlay();
        }
    }
}

// ── 退出登录 ──
function logoutToLogin() {
    if (typeof bgmPause === 'function') bgmPause();
    closeAllGlobalMenus();
    switchScreen('login');
}

// ── 全局菜单开关 ──
function toggleGlobalMenu(menuId) {
    var menu = document.getElementById(menuId);
    if (!menu) return;
    var isOpen = menu.classList.contains('open');
    closeAllGlobalMenus();
    if (!isOpen) menu.classList.add('open');
}

function closeAllGlobalMenus() {
    document.querySelectorAll('.global-menu-drop').forEach(function(el) {
        el.classList.remove('open');
    });
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.global-menu-btn') && !e.target.closest('.global-menu-drop')) {
        closeAllGlobalMenus();
    }
});

// 初始化深空背景
function initStarsBackground(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let w, h;
    
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    // === 星云团 ===
    const nebulaClouds = [];
    for (let i = 0; i < 6; i++) {
        nebulaClouds.push({
            x: Math.random() * w,
            y: Math.random() * h,
            radius: 200 + Math.random() * 350,
            color: [
                [40, 20, 80],   // 深紫
                [20, 40, 90],   // 深蓝
                [60, 15, 50],   // 暗红紫
                [15, 35, 65],   // 深青蓝
                [50, 25, 70],   // 紫罗兰
                [25, 20, 55],   // 暗靛蓝
            ][i],
            drift: { x: (Math.random() - 0.5) * 0.08, y: (Math.random() - 0.5) * 0.06 },
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.003 + Math.random() * 0.004,
        });
    }
    
    // === 远景星（小、暗、多） ===
    const farStars = [];
    for (let i = 0; i < 400; i++) {
        farStars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 1.2 + 0.3,
            baseOpacity: Math.random() * 0.4 + 0.1,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.01 + Math.random() * 0.02,
        });
    }
    
    // === 中景星（中等大小，微亮） ===
    const midStars = [];
    for (let i = 0; i < 120; i++) {
        midStars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 1.8 + 1.0,
            baseOpacity: Math.random() * 0.5 + 0.3,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.015 + Math.random() * 0.025,
            // 微弱色偏
            tint: Math.random() < 0.3 ? (Math.random() < 0.5 ? [200, 210, 255] : [255, 220, 200]) : [255, 255, 255],
        });
    }
    
    // === 近景星（大、亮、少，有十字光芒） ===
    const nearStars = [];
    for (let i = 0; i < 25; i++) {
        nearStars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 2.0 + 1.5,
            baseOpacity: Math.random() * 0.4 + 0.5,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.02 + Math.random() * 0.03,
            spikeLen: 4 + Math.random() * 8,
            tint: Math.random() < 0.4 ? (Math.random() < 0.5 ? [180, 200, 255] : [255, 200, 180]) : [255, 255, 255],
        });
    }
    
    // === 缓慢漂浮的尘埃粒子 ===
    const dustParticles = [];
    for (let i = 0; i < 50; i++) {
        dustParticles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.12 + 0.03,
            speed: Math.random() * 0.15 + 0.05,
            drift: (Math.random() - 0.5) * 0.3,
        });
    }
    
    let frame = 0;
    
    function drawNebulaCloud(cloud, t) {
        const pulseFactor = 0.9 + 0.1 * Math.sin(cloud.pulse + t * cloud.pulseSpeed);
        const r = cloud.radius * pulseFactor;
        const [cr, cg, cb] = cloud.color;
        
        // 移动星云
        cloud.x += cloud.drift.x;
        cloud.y += cloud.drift.y;
        if (cloud.x < -r) cloud.x = w + r;
        if (cloud.x > w + r) cloud.x = -r;
        if (cloud.y < -r) cloud.y = h + r;
        if (cloud.y > h + r) cloud.y = -r;
        
        const grad = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, r);
        grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.12)`);
        grad.addColorStop(0.4, `rgba(${cr}, ${cg}, ${cb}, 0.06)`);
        grad.addColorStop(0.7, `rgba(${cr}, ${cg}, ${cb}, 0.02)`);
        grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(cloud.x - r, cloud.y - r, r * 2, r * 2);
    }
    
    function drawStar(x, y, size, opacity, tint, spikes, spikeLen) {
        const [tr, tg, tb] = tint;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tr}, ${tg}, ${tb}, ${opacity})`;
        ctx.fill();
        
        // 十字光芒
        if (spikes && spikeLen > 0) {
            ctx.strokeStyle = `rgba(${tr}, ${tg}, ${tb}, ${opacity * 0.35})`;
            ctx.lineWidth = 0.6;
            // 横
            ctx.beginPath();
            ctx.moveTo(x - spikeLen, y);
            ctx.lineTo(x + spikeLen, y);
            ctx.stroke();
            // 竖
            ctx.beginPath();
            ctx.moveTo(x, y - spikeLen);
            ctx.lineTo(x, y + spikeLen);
            ctx.stroke();
            // 中心高光
            const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
            glow.addColorStop(0, `rgba(${tr}, ${tg}, ${tb}, ${opacity * 0.2})`);
            glow.addColorStop(1, `rgba(${tr}, ${tg}, ${tb}, 0)`);
            ctx.fillStyle = glow;
            ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);
        }
    }
    
    function animate() {
        frame++;
        
        // 深空底色
        const bg = ctx.createLinearGradient(0, 0, w, h);
        bg.addColorStop(0, '#050510');
        bg.addColorStop(0.3, '#0a0818');
        bg.addColorStop(0.6, '#08061a');
        bg.addColorStop(1, '#060414');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
        
        // 星云
        nebulaClouds.forEach(c => drawNebulaCloud(c, frame));
        
        // 远景星
        farStars.forEach(s => {
            s.twinkle += s.twinkleSpeed;
            const opacity = s.baseOpacity * (0.7 + 0.3 * Math.sin(s.twinkle));
            drawStar(s.x, s.y, s.size, opacity, [255, 255, 255], false, 0);
        });
        
        // 中景星
        midStars.forEach(s => {
            s.twinkle += s.twinkleSpeed;
            const opacity = s.baseOpacity * (0.6 + 0.4 * Math.sin(s.twinkle));
            drawStar(s.x, s.y, s.size, opacity, s.tint, false, 0);
        });
        
        // 近景星
        nearStars.forEach(s => {
            s.twinkle += s.twinkleSpeed;
            const opacity = s.baseOpacity * (0.5 + 0.5 * Math.sin(s.twinkle));
            drawStar(s.x, s.y, s.size, opacity, s.tint, true, s.spikeLen);
        });
        
        // 尘埃
        dustParticles.forEach(p => {
            p.y -= p.speed;
            p.x += p.drift;
            if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 170, 220, ${p.opacity})`;
            ctx.fill();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    return animationId;
}

// 登录表单处理
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (username && password) {
            localStorage.setItem('bookemu_username', username);
            switchScreen('main');
            initNebulas();
        }
    });
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        if (password !== confirm) {
            if (typeof showGameAlert === 'function') {
                showGameAlert('两次密码输入不一致', '注册提示');
            } else {
                alert('两次密码输入不一致');
            }
            return;
        }
        
        if (username && password) {
            // 模拟注册成功，自动切换到登录
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            if (typeof showGameAlert === 'function') {
                showGameAlert('注册成功，请登录', '注册提示');
            } else {
                alert('注册成功，请登录');
            }
        }
    });
}

// 初始化星云
function initNebulas() {
    initNebulaScene();
}

// 进入星座界面
function enterConstellation(type) {
    currentNebula = type;
    if (typeof window.initConstellation === 'function') {
        window.initConstellation(type);
    }
}

// 返回按钮
function initBackButton() {
    document.getElementById('back-btn').addEventListener('click', () => {
        window.switchScreen('main');
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
    initBackButton();
});
