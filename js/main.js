// 主逻辑文件

// 星云数据
const nebulaData = {
    scifi: {
        name: '科幻星云',
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
        name: '修仙星云',
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
        name: '文学星云',
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

// 页面切换
function switchScreen(screenId) {
    // 暂停/恢复3D场景
    if (currentScreen === 'main' && screenId !== 'main') {
        pauseNebulaScene();
    }

    // 销毁星座界面
    if (currentScreen === 'book' && screenId !== 'book') {
        if (typeof window.destroyConstellation === 'function') {
            window.destroyConstellation();
        }
    }

    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenId}-screen`).classList.add('active');
    currentScreen = screenId;

    if (screenId === 'main') {
        resumeNebulaScene();
    }

    if (screenId === 'book' && currentNebula) {
        if (typeof window.initConstellation === 'function') {
            window.initConstellation(currentNebula);
        }
    }
}

// 初始化星空背景
function initStarsBackground(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    const stars = [];
    const numStars = 200;
    
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.8 + 0.2
        });
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
            
            star.y -= star.speed;
            if (star.y < 0) {
                star.y = canvas.height;
                star.x = Math.random() * canvas.width;
            }
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
            // 模拟登录成功
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
            alert('两次密码输入不一致');
            return;
        }
        
        if (username && password) {
            // 模拟注册成功，自动切换到登录
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
            alert('注册成功，请登录');
        }
    });
}

// 初始化星云
function initNebulas() {
    initNebulaScene();
}

// 进入星座界面
function enterConstellation(type) {
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

// 移动端 UI 初始化
function initMobileUI() {
    // 汉堡菜单 - 切换左侧分类栏和搜索栏的可见性
    var menuBtn = document.getElementById('mobile-menu-btn');
    var sideCats = document.getElementById('side-cats');
    var navSearch = document.querySelector('.nav-search-wrap');
    var menuOpen = false;

    if (menuBtn && sideCats) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menuOpen = !menuOpen;
            if (menuOpen) {
                sideCats.style.display = 'flex';
                if (navSearch) navSearch.style.display = 'block';
                menuBtn.textContent = '✕';
            } else {
                sideCats.style.display = '';
                if (navSearch) navSearch.style.display = '';
                menuBtn.textContent = '☰';
            }
        });
    }

    // 移动端游戏侧边栏切换
    var sidebar = document.querySelector('.game-sidebar');
    var tabs = null;
    var sidebarTabs = document.getElementById('mobile-sidebar-tabs');
    if (sidebarTabs) {
        tabs = sidebarTabs.querySelectorAll('.mobile-sidebar-tab');

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var target = tab.getAttribute('data-target');
                if (!target) {
                    // 关闭按钮
                    if (sidebar) sidebar.classList.remove('mobile-open');
                    tabs.forEach(function(t) { t.classList.remove('active'); });
                    return;
                }
                // 高亮当前标签
                tabs.forEach(function(t) {
                    if (t.getAttribute('data-target')) {
                        t.classList.toggle('active', t === tab);
                    }
                });
                // 显示侧边栏并切换面板
                if (sidebar) {
                    sidebar.classList.add('mobile-open');
                    var sysPanel = sidebar.querySelector('.system-panel');
                    var npcPanel = sidebar.querySelector('.npc-panel');
                    if (sysPanel) sysPanel.style.display = (target === 'system') ? 'flex' : 'none';
                    if (npcPanel) npcPanel.style.display = (target === 'npc') ? 'flex' : 'none';
                }
            });
        });
    }

    // 点击遮罩层关闭侧边栏
    document.addEventListener('click', function(e) {
        if (menuOpen && sideCats && !sideCats.contains(e.target) && e.target !== menuBtn
            && (!navSearch || !navSearch.contains(e.target))) {
            menuOpen = false;
            sideCats.style.display = '';
            if (navSearch) navSearch.style.display = '';
            menuBtn.textContent = '☰';
        }

        // 移动端游戏侧边栏：点击外部关闭
        if (sidebar) {
            var sidebarTabsEl = document.getElementById('mobile-sidebar-tabs');
            if (sidebar.classList.contains('mobile-open') &&
                !sidebar.contains(e.target) &&
                (!sidebarTabsEl || !sidebarTabsEl.contains(e.target))) {
                sidebar.classList.remove('mobile-open');
                if (tabs) {
                    tabs.forEach(function(t) { t.classList.remove('active'); });
                }
                // 恢复第一个标签为active
                var firstTab = sidebarTabsEl && sidebarTabsEl.querySelector('.mobile-sidebar-tab[data-target]');
                if (firstTab) firstTab.classList.add('active');
            }
        }
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
    initBackButton();
    initMobileUI();
});
