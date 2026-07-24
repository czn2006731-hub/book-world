// 探索人生 - 游戏交友世界 核心逻辑
(function() {
    // ─── 段位划分配置 ─────────────────────────────────────
    const TIERS = [
        { min: 1, max: 3, name: '初读新人', color: '#9e9e9e', desc: '只是偶尔看书打发时间' },
        { min: 4, max: 10, name: '读书爱好者', color: '#26a69a', desc: '会主动挑选书籍、享受阅读过程' },
        { min: 11, max: 30, name: '资深书虫', color: '#7e57c2', desc: '长期大量阅读、收藏喜爱的读物' },
        { min: 31, max: 80, name: '思辨读者', color: '#ec407a', desc: '阅读时独立思考、辩证看待书中观点' },
        { min: 81, max: 150, name: '书籍研究者', color: '#ff7043', desc: '深挖作品背景、梳理完整阅读体系' },
        { min: 151, max: Infinity, name: '知行阅读者', color: '#ffd700', desc: '能够消化书本知识并运用到现实生活中' } // 金色最高段位
    ];

    function getTier(bookCount) {
        for (let i = TIERS.length - 1; i >= 0; i--) {
            if (bookCount >= TIERS[i].min) {
                return TIERS[i];
            }
        }
        return TIERS[0];
    }

    // ─── 预设QQ动漫头像 & 模拟好友数据 ─────────────────────
    const ANIME_AVATARS = [
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Zack&backgroundColor=d1d4f9',
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia&backgroundColor=ffd5dc',
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver&backgroundColor=ffdfbf',
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo&backgroundColor=c0aede',
        'https://api.dicebear.com/7.x/adventurer/svg?seed=Maya&backgroundColor=b6e3f4'
    ];

    let friendsData = [
        { id: 1, name: '叶凡 (遮天大帝)', avatar: ANIME_AVATARS[0], online: true, readCount: 168, currentBook: '《遮天》', unread: true, messages: ['兄弟，你到了哪个境界了？', '这本仙逆的感悟很深！'] },
        { id: 2, name: '韩立 (跑路真君)', avatar: ANIME_AVATARS[1], online: true, readCount: 142, currentBook: '《凡人修仙传》', unread: false, messages: ['杀伐果断，方得长生。'] },
        { id: 3, name: '罗辑 (执剑人)', avatar: ANIME_AVATARS[2], online: true, readCount: 65, currentBook: '《三体》', unread: true, messages: ['宇宙就是一座黑暗森林。'] },
        { id: 4, name: '保罗 (沙丘救世主)', avatar: ANIME_AVATARS[3], online: true, readCount: 28, currentBook: '《沙丘》', unread: false, messages: ['恐惧是思维的杀手。'] },
        { id: 5, name: '萧炎 (炎帝)', avatar: ANIME_AVATARS[4], online: true, readCount: 8, currentBook: '《斗破苍穹》', unread: false, messages: ['三十年河东，三十年河西！'] },
        { id: 6, name: '林黛玉 (潇湘妃子)', avatar: ANIME_AVATARS[5], online: false, readCount: 95, currentBook: '《红楼梦》', unread: false, messages: ['试看春残花落妹，便是红颜老死时。'] },
        { id: 7, name: '孙悟空 (齐天大圣)', avatar: ANIME_AVATARS[6], online: false, readCount: 2, currentBook: '《西游记》', unread: false, messages: ['俺老孙去也！'] }
    ];

    // ─── 个人信息数据 ─────────────────────────────────────
    let displayedProfileUserId = null; // 用于存储当前右侧面板显示的玩家ID，null代表显示我自己的主页

    let currentUser = {
        name: '星海探索者',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Explorer&backgroundColor=ffd5dc',
        currentBook: '《凡人修仙传》',
        interests: ['修仙玄幻', '硬核科幻', '古典文学', '哲学思考'],
        favorites: ['《三体》', '《凡人修仙传》', '《沙丘》', '《红楼梦》'],
        collectedPosts: [] // 存储在书籍交流世界里收藏的帖子
    };

    // ─── 朋友圈 (人生分享) 数据 ────────────────────────────
    let momentsData = [
        {
            id: 1,
            author: '叶凡 (遮天大帝)',
            avatar: ANIME_AVATARS[0],
            time: '10分钟前',
            content: '【万界生平总结】：在《遮天》经历了 3500 岁人生模拟，成就【遮天天帝】，逆天改命值 +18！登天路，踏歌行，弹指遮天！',
            image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
            likes: ['韩立 (跑路真君)', '萧炎 (炎帝)', '星海探索者'],
            comments: [
                { user: '萧炎 (炎帝)', text: '叶兄威武！斗气大陆也期待你的光临！' }
            ]
        },
        {
            id: 2,
            author: '罗辑 (执剑人)',
            avatar: ANIME_AVATARS[2],
            time: '1小时前',
            content: '【万界生平总结】：在《三体》经历了 120 岁人生模拟，成就【威慑执剑人】，给岁月以文明，而不是给文明以岁月。',
            image: null,
            likes: ['保罗 (沙丘救世主)', '星海探索者'],
            comments: [
                { user: '保罗 (沙丘救世主)', text: '深有同感，宇宙的浩瀚让人敬畏。' }
            ]
        }
    ];

    // 全局函数：允许游戏终章结算时自动发布人生生平到朋友圈
    window.addCustomMoment = function(text) {
        let newId = momentsData.length + 1;
        momentsData.unshift({
            id: newId,
            author: currentUser.name,
            avatar: currentUser.avatar,
            time: '刚刚',
            content: text,
            image: null,
            likes: ['系统小书'],
            comments: []
        });
        if (typeof renderMoments === 'function') {
            renderMoments();
        }
    };

    // ─── 书籍讨论 (QQ空间风格) 数据 ────────────────────────
    let bookDiscussions = {
        '凡人修仙传': [
            { id: 1, author: '韩立 (跑路真君)', avatar: ANIME_AVATARS[1], time: '昨天 18:20', title: '【深度探讨】掌天瓶的本质到底是什么？', content: '诸位到友，掌天瓶吸收日月精华产出绿液，催化灵药。大家觉得这是否是极品玄天之宝？', likes: 12, comments: 5 },
            { id: 2, author: '叶凡 (遮天大帝)', avatar: ANIME_AVATARS[0], time: '前天 12:30', title: '看凡人的感悟：苟道至尊！', content: '修仙界人心险恶，韩老魔的稳健性格值得所有年轻修士学习！', likes: 24, comments: 8 }
        ],
        '三体': [
            { id: 1, author: '罗辑 (执剑人)', avatar: ANIME_AVATARS[2], time: '3小时前', title: '【学术分析】黑暗森林法则的推导过程', content: '生存是飞速发展的文明的第一需要；文明不断增长，但宇宙中的物质总量保持不变。这两条公理是核心。', likes: 45, comments: 14 }
        ]
    };
    let currentDiscussionBook = '凡人修仙传';

    // ─── 个人备忘录 (情绪记录) 数据 ─────────────────────────
    let memoNotes = [
        { id: 1, time: '2026-07-20 10:15', content: '读到韩立在赤水峰苦修三十年，感叹持之以恒的伟力。现实生活中也要保持这份沉静。', emotion: '💡 顿悟' },
        { id: 2, time: '2026-07-19 22:40', content: '三体程心做出选择的那一刻，虽然遗憾，但感受到了文明的复杂性。', emotion: '🤔 思考' }
    ];

    // ─── 3D 渲染变量 ─────────────────────────────────────
    let elScene, elCamera, elRenderer, elAnimationId;
    let elPlanets = [];
    let activeChatFriendId = null;

    // ─── 初始化探索人生 宇宙星空+平面星星旋转场景 ───────────────────
    function initExploreLife2D() {
        const canvas = document.getElementById('explore-life-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        
        // 生成数以千万计的流光线 (网络织网背景)
        const floatingLines = [];
        const lineColors = ['#ec4899', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1', '#06b6d4'];
        
        // 书籍评论语录库 (点击线条时弹窗显示)
        const bookQuotes = [
            { book: '《三体》', quote: '给岁月以文明，而不是给文明以岁月。' },
            { book: '《三体》', quote: '失去人性，失去很多；失去兽性，失去一切。' },
            { book: '《凡人修仙传》', quote: '修仙之路，逆天而行，唯有坚持与稳健方能得道。' },
            { book: '《凡人修仙传》', quote: '韩立：杀伐果断，心如磐石。' },
            { book: '《遮天》', quote: '登天路，踏歌行，弹指遮天！' },
            { book: '《遮天》', quote: '吾为天帝，当镇杀世间一切敌！' },
            { book: '《沙丘》', quote: '恐惧是思维的杀手，恐惧是带来彻底毁灭的小小死亡。' },
            { book: '《斗破苍穹》', quote: '三十年河东，三十年河西，莫欺少年穷！' },
            { book: '《红楼梦》', quote: '满纸荒唐言，一把辛酸泪。都云作者痴，谁解其中味？' },
            { book: '《百年孤独》', quote: '生命中曾经有过的所有灿烂，原来终究都需要用寂寞来偿还。' },
            { book: '《活着》', quote: '人是为了活着本身而活着，而不是为了活着之外的任何事物而活着。' },
            { book: '《剑来》', quote: '言念君子，温其如玉。遇事不决，可问春风。' },
            { book: '《仙逆》', quote: '顺为凡，逆为仙，只在中间一念间。' }
        ];

        // 缩放与3D旋转角度相关变量（默认缩放拉到最广角 0.4）
        let scale = 0.4;
        const scaleMin = 0.3;
        const scaleMax = 3.0;

        // 3D 旋转角度 (左右为 theta, 上下为 phi)
        let rotTheta = 0;
        let rotPhi = 0;
        let isDragging = false;
        let lastMouseX = 0;
        let lastMouseY = 0;

            // 产生 5000 根从球体中心向外球面上三维放射的动态流光线段
            for (let i = 0; i < 5000; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                const maxR = 30 + Math.pow(Math.random(), 2.2) * Math.max(w, h) * 1.5;
                const initialR = Math.random() * maxR;

                const dirX = Math.sin(phi) * Math.cos(theta);
                const dirY = Math.sin(phi) * Math.sin(theta);
                const dirZ = Math.cos(phi);

                floatingLines.push({
                    dirX: dirX,
                    dirY: dirY,
                    dirZ: dirZ,
                    radius: initialR,
                    maxRadius: maxR,
                    flowSpeed: 0.5 + Math.random() * 1.0, // 增加流速让旋转感更强
                    length: 20 + Math.random() * 50,
                    color: lineColors[Math.floor(Math.random() * lineColors.length)],
                    width: 1.0 + Math.random() * 1.2,
                    alpha: 0.4 + Math.random() * 0.5, // 增加透明度让线条更清晰
                    quote: bookQuotes[Math.floor(Math.random() * bookQuotes.length)]
                });
            }

        // 世界黑洞数据：三颗黑洞 (黑洞依然放在 3D 空间的中心平面上)
        const starsData = [
            {
                name: '人生分享世界',
                sub: '朋友圈感悟分享',
                color: '#ec4899',
                action: () => openLifeSharingModal()
            },
            {
                name: '书籍交流世界',
                sub: '空间书友讨论',
                color: '#3b82f6',
                action: () => openBookSelectModal()
            },
            {
                name: '书籍记录世界',
                sub: '情绪备忘随笔',
                color: '#8b5cf6',
                action: () => openBookRecordModal()
            }
        ];
        
        // 旋转状态
        let angle = 0;
        let orbitRadius = Math.min(w, h) * 0.22;
        const blackHoleSize = 26;
        const speed = 0.002; // 大幅降低自转速度，使球体旋转非常缓慢柔和
        let animationId;

        // 交互逻辑：滚轮缩放 3D 视角
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            scale += e.deltaY * -0.0008;
            scale = Math.min(Math.max(scaleMin, scale), scaleMax);
        });

        // 鼠标按下：拖拽开始
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });

        // 鼠标移动
        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - lastMouseX;
                const deltaY = e.clientY - lastMouseY;
                
                // 改变旋转偏角 (增加拖拽交互旋转，增加极强互动立体感)
                rotTheta += deltaX * 0.003;
                rotPhi += deltaY * 0.003;
                
                // 限制仰角范围 (防止倒立旋转体验过差)
                rotPhi = Math.min(Math.max(-Math.PI / 2.5, rotPhi), Math.PI / 2.5);

                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        });

        // 鼠标松开或移出
        canvas.addEventListener('mouseup', () => isDragging = false);
        canvas.addEventListener('mouseleave', () => isDragging = false);

        // 移动端手势适配
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                lastMouseX = e.touches[0].clientX;
                lastMouseY = e.touches[0].clientY;
            }
        });
        canvas.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - lastMouseX;
                const deltaY = e.touches[0].clientY - lastMouseY;
                
                rotTheta += deltaX * 0.005;
                rotPhi += deltaY * 0.005;
                rotPhi = Math.min(Math.max(-Math.PI / 2.5, rotPhi), Math.PI / 2.5);

                lastMouseX = e.touches[0].clientX;
                lastMouseY = e.touches[0].clientY;
            }
        });
        canvas.addEventListener('touchend', () => isDragging = false);

        // 点击画布寻找点击中哪根线条
        canvas.addEventListener('click', (e) => {
            // 如果有任何弹窗已打开，忽略画布点击，防止背景误触弹出评论面板
            if (document.querySelector('.el-modal-overlay.active')) {
                e.stopPropagation();
                return;
            }

            // 首先判断是否点中了中心的三大社交黑洞 (2D UI 按钮)
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            const centerX = w / 2;
            const centerY = h / 2;

            for (let i = 0; i < starsData.length; i++) {
                const starAngle = angle + (i * (Math.PI * 2 / 3));
                
                // 纯 2D 平面顺时针旋转坐标计算 (不随 3D 旋转缩放改变位置与大小)
                const starX = centerX + orbitRadius * Math.cos(starAngle);
                const starY = centerY + orbitRadius * Math.sin(starAngle);

                // 距离判断 (固定大小 blackHoleSize)
                const dist = Math.hypot(clickX - starX, clickY - starY);
                if (dist < blackHoleSize + 25) {
                    e.stopPropagation();
                    starsData[i].action();
                    return; // 优先触发黑洞按钮，不再判断线条
                }
            }

            // 若没点中黑洞，则在附近寻找距离最近的投影线段进行提示展示语录
            let bestLine = null;
            let minDist = 15; // 限制判定距离，太远点不到
            
            for (let i = 0; i < floatingLines.length; i++) {
                const line = floatingLines[i];

                // 缓慢的圆弧极坐标自转微调
                line.radius += Math.sin(Date.now() * 0.0005) * 0.05;

                // 三维空间中的线条顶点坐标
                const startX3D = line.dirX * line.radius;
                const startY3D = line.dirY * line.radius;
                const startZ3D = line.dirZ * line.radius;

                // 绕 X 轴和 Y 轴进行拖拽交互视角旋转计算
                let y1 = startY3D * Math.cos(rotPhi) - startZ3D * Math.sin(rotPhi);
                let z1 = startY3D * Math.sin(rotPhi) + startZ3D * Math.cos(rotPhi);
                
                let x2 = startX3D * Math.cos(rotTheta) + z1 * Math.sin(rotTheta);
                
                // 计算 2D 投影位置
                const projX = centerX + x2 * scale;
                const projY = centerY + y1 * scale;

                const dist = Math.hypot(clickX - projX, clickY - projY);
                if (dist < minDist) {
                    minDist = dist;
                    bestLine = line;
                }
            }

            if (bestLine) {
                openQuoteModal(bestLine.quote);
            }
        });

        // 核心渲染循环：纯 2D Canvas 绘制极其酷炫的 3D 线条透视球体
        function renderLoop() {
            // 绘制纯白背景
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);

            const centerX = w / 2;
            const centerY = h / 2;

            // 1. 绘制放射的 5000 条三维透视流光线段
            // 自动顺时针自转
            if (!isDragging) {
                rotTheta += 0.001; // 不拖拽时平滑自动顺时针自转
            }

            const cosRot = Math.cos(angle);
            const sinRot = Math.sin(angle);
            const cosT = Math.cos(rotTheta);
            const sinT = Math.sin(rotTheta);
            const cosP = Math.cos(rotPhi);
            const sinP = Math.sin(rotPhi);

            for (let i = 0; i < floatingLines.length; i++) {
                const line = floatingLines[i];

                // 静态线条，不进行流光重置：没有 line.radius += line.flowSpeed!
                // 仅绕自转轴做 360 度顺时针旋转，使整体结构看起来是一个由密集柱状线组成的、完美对称的三维星云球
                
                // 三维空间中球体自转变换 (绕 Y 轴顺时针自转旋转)
                const lx_orig = line.dirX * line.radius;
                const ly_orig = line.dirY * line.radius;
                const lz_orig = line.dirZ * line.radius;

                // 绕自转轴自转
                const lx_self = lx_orig * cosRot - lz_orig * sinRot;
                const lz_self = lx_orig * sinRot + lz_orig * cosRot;
                const ly_self = ly_orig;

                // 旋转变换：绕 Y 轴转 (左右)
                const x1 = lx_self * cosT - lz_self * sinT;
                const z1 = lx_self * sinT + lz_self * cosT;
                
                // 绕 X 轴转 (上下)
                const y2 = ly_self * cosP - z1 * sinP;
                const z2 = ly_self * sinP + z1 * cosP;

                // 3. 屏幕透视投影 (近大远小)
                const focus = 600;
                const scale3D = focus / (focus + z2);
                const totalScale = scale * scale3D;

                const projX = centerX + x1 * totalScale;
                const projY = centerY + y2 * totalScale;

                // 超出屏幕太多则不渲染
                if (projX < -100 || projX > w + 100 || projY < -100 || projY > h + 100) continue;

                // 绘制投影线段 (更清晰)
                ctx.beginPath();
                const halfLen = (line.length / 2) * totalScale;
                const norm = Math.sqrt(x1*x1 + y2*y2) || 1;
                const dxScreen = (x1 / norm) * halfLen;
                const dyScreen = (y2 / norm) * halfLen;

                ctx.moveTo(projX - dxScreen, projY - dyScreen);
                ctx.lineTo(projX + dxScreen, projY + dyScreen);
                
                const finalAlpha = line.alpha * (scale3D * 0.8 + 0.2);
                ctx.strokeStyle = line.color;
                ctx.globalAlpha = Math.min(1.0, Math.max(0.15, finalAlpha));
                ctx.lineWidth = line.width * totalScale;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
            
            // 重置透明度
            ctx.globalAlpha = 1.0;

            // 2. 绘制星轨与三颗核心旋转黑洞世界按钮 (人生分享/书籍讨论/私密记录)
            angle += speed;

            // 绘制三颗中心大黑洞星体 (2D 平面顺时针旋转)
            for (let i = 0; i < starsData.length; i++) {
                const star = starsData[i];
                const starAngle = angle + (i * (Math.PI * 2 / 3));

                const starX = centerX + orbitRadius * Math.cos(starAngle);
                const starY = centerY + orbitRadius * Math.sin(starAngle);

                const currentSize = blackHoleSize + Math.sin(Date.now() * 0.003 + i) * 1.5;
                
                ctx.save();

                // 1. 强烈的白色光晕 (White Aura)
                const whiteAuraGrad = ctx.createRadialGradient(starX, starY, currentSize * 0.6, starX, starY, currentSize * 3.8);
                whiteAuraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                whiteAuraGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.6)');
                whiteAuraGrad.addColorStop(0.55, star.color);
                whiteAuraGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.15)');
                whiteAuraGrad.addColorStop(1, 'transparent');
                
                ctx.fillStyle = whiteAuraGrad;
                ctx.beginPath();
                ctx.arc(starX, starY, currentSize * 3.8, 0, Math.PI * 2);
                ctx.fill();

                // 2. 柔和白色光芒四射
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2.0;
                ctx.globalAlpha = 0.75;
                for (let j = 0; j < 6; j++) {
                    const rayAngle = starAngle * 1.5 + (j * Math.PI / 3);
                    ctx.beginPath();
                    ctx.arc(starX, starY, currentSize * (1.1 + j * 0.35), rayAngle, rayAngle + Math.PI * 0.8);
                    ctx.stroke();
                }

                // 3. 黑洞边缘纯白炽亮环
                ctx.globalAlpha = 1.0;
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 25;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(starX, starY, currentSize * 0.9, 0, Math.PI * 2);
                ctx.fill();

                // 4. 中心深邃黑暗黑洞视界
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#050505';
                ctx.beginPath();
                ctx.arc(starX, starY, currentSize * 0.75, 0, Math.PI * 2);
                ctx.fill();

                // 5. 绘制黑洞名称与副标题 (在下方)
                ctx.font = 'bold 13px "PingFang SC", "Microsoft YaHei", sans-serif';
                ctx.fillStyle = '#111827';
                ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
                ctx.shadowBlur = 6;
                ctx.textAlign = 'center';
                ctx.fillText(star.name, starX, starY + currentSize + 24);

                ctx.font = '10px "PingFang SC", "Microsoft YaHei", sans-serif';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
                ctx.fillText(star.sub, starX, starY + currentSize + 38);

                ctx.restore();
            }

            // 循环调用
            animationId = requestAnimationFrame(renderLoop);
        }

        renderLoop();

        // 监听视口改变
        window.addEventListener('resize', onCanvasResize);
        function onCanvasResize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            orbitRadius = Math.min(w, h) * 0.22;
        }

        // 返回销毁句柄
        return function destroy2DScene() {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', onCanvasResize);
        };
    }

    // ─── 页面社交功能实现代码 ────────────────────────────────────
    
    // 打开弹窗通用函数
    function openElModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            // 阻止弹窗遮罩层的点击事件冒泡到画布，防止误触弹出评论面板
            if (!modal._stopPropBound) {
                modal._stopPropBound = true;
                modal.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
        }
    }
    // 关闭弹窗通用函数
    window.closeElModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    };

    // 1. 打开语录名言弹窗
    function openQuoteModal(quoteObj) {
        const titleEl = document.getElementById('quote-book-title');
        const textEl = document.getElementById('quote-modal-text');
        const authorEl = document.getElementById('quote-modal-author');
        if (titleEl && textEl && authorEl) {
            titleEl.textContent = `📖 书籍名言 - ${quoteObj.book}`;
            textEl.textContent = `“ ${quoteObj.quote} ”`;
            authorEl.textContent = `—— 摘自 ${quoteObj.book}`;
            openElModal('el-quote-modal');
        }
    }

    // 2. 朋友圈分享人生世界
    function openLifeSharingModal() {
        renderMomentsList();
        openElModal('el-sharing-modal');
    }

    function renderMomentsList() {
        const container = document.getElementById('moments-list-container');
        if (!container) return;

        let html = '';
        momentsData.forEach(moment => {
            const hasLiked = moment.likes.includes(currentUser.name);
            const imageHtml = moment.image ? `<img src="${moment.image}" class="moment-img" onclick="zoomImage('${moment.image}')">` : '';
            
            let likesHtml = '';
            if (moment.likes.length > 0) {
                likesHtml = `<div class="moment-likes">❤️ ${moment.likes.join(', ')}</div>`;
            }

            let commentsHtml = '';
            moment.comments.forEach(comment => {
                commentsHtml += `<div class="moment-comment-line"><b>${comment.user}：</b>${comment.text}</div>`;
            });

            html += `
                <div class="moment-item" id="moment-item-${moment.id}">
                    <img src="${moment.avatar}" class="moment-avatar" onclick="showUserProfileOnRightSide(${moment.userId || ''})" style="cursor:pointer;" title="在右侧查看个人主页">
                    <div class="moment-content-wrap">
                        <div class="moment-author" onclick="showUserProfileOnRightSide(${moment.userId || ''})" style="cursor:pointer;" title="在右侧查看个人主页">${moment.author}</div>
                        <div class="moment-text">${moment.content}</div>
                        ${imageHtml}
                        <div class="moment-footer">
                            <span class="moment-time">${moment.time}</span>
                            <div class="moment-actions">
                                <button onclick="likeMoment(${moment.id})">${hasLiked ? '💔 取消赞' : '❤️ 点赞'}</button>
                                <button onclick="commentMoment(${moment.id})">💬 评论</button>
                            </div>
                        </div>
                        <div class="moment-comments-box">
                            ${likesHtml}
                            <div class="comments-list-wrap">${commentsHtml}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // 赞/取消赞
    window.likeMoment = function(id) {
        const moment = momentsData.find(m => m.id === id);
        if (!moment) return;

        const idx = moment.likes.indexOf(currentUser.name);
        if (idx >= 0) {
            moment.likes.splice(idx, 1);
        } else {
            moment.likes.push(currentUser.name);
        }
        renderMomentsList();
    };

    // 评论朋友圈动态
    window.commentMoment = function(id) {
        const promptFn = window.showGamePrompt || (window.parent && window.parent.showGamePrompt) || showGamePrompt;
        if (typeof promptFn === 'function') {
            promptFn('请输入你的评论内容：', '', '评论动态').then(function(text) {
                if (!text || !text.trim()) return;

                const moment = momentsData.find(m => m.id === id);
                if (moment) {
                    moment.comments.push({ user: currentUser.name, text: text.trim() });
                    renderMomentsList();
                }
            });
        } else {
            const text = prompt('请输入你的评论内容：');
            if (!text || !text.trim()) return;
            const moment = momentsData.find(m => m.id === id);
            if (moment) {
                moment.comments.push({ user: currentUser.name, text: text.trim() });
                renderMomentsList();
            }
        }
    };

    // 图片上传本地预览
    let uploadedImageBase64 = null;
    window.handleImageUpload = function(input, previewId) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImageBase64 = e.target.result;
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.innerHTML = `
                    <div class="preview-img-wrap">
                        <img src="${uploadedImageBase64}">
                        <span class="preview-img-remove" onclick="removeUploadedImage('${previewId}')">✕</span>
                    </div>
                `;
            }
        };
        reader.readAsDataURL(file);
    };

    window.removeUploadedImage = function(previewId) {
        uploadedImageBase64 = null;
        const preview = document.getElementById(previewId);
        if (preview) preview.innerHTML = '';
        
        // 重置上传表单值，使其能重复选择同一张图
        const momentFile = document.getElementById('moment-img-file');
        const qzoneFile = document.getElementById('qzone-img-file');
        if (momentFile) momentFile.value = '';
        if (qzoneFile) qzoneFile.value = '';
    };

    // 新增发布朋友圈动态
    window.publishMoment = function() {
        const textarea = document.getElementById('new-moment-text');
        if (!textarea) return;

        const val = textarea.value.trim();
        if (!val && !uploadedImageBase64) {
            const alertFn = window.showGameAlert || (window.parent && window.parent.showGameAlert) || showGameAlert;
            if (typeof alertFn === 'function') {
                alertFn('请先输入要分享的文字或上传图片！', '提示');
            } else {
                alert('请先输入要分享的文字或上传图片！');
            }
            return;
        }

        const newMoment = {
            id: Date.now(),
            author: currentUser.name + ' (我)',
            avatar: currentUser.avatar,
            time: '刚刚',
            content: val || '分享图片',
            image: uploadedImageBase64,
            likes: [],
            comments: []
        };

        momentsData.unshift(newMoment);

        // 如果后端连接正常，发到后端服务进行全服广播
        if (localUserId) {
            const activePort = window.location.port === '3000' ? '3000' : '8080';
            fetch(`http://localhost:${activePort}/api/social/post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: localUserId,
                    content: val || '分享图片',
                    bookTitle: currentUser.currentBook || '凡人修仙传'
                })
            }).catch(e => {});
        }

        textarea.value = '';
        removeUploadedImage('moment-img-preview');
        renderMomentsList();
    };
    let socket = null;
    let localUserId = null;

    function initSocialWebSocket() {
        // 动态检测后端接口与 WebSocket 端口 (同 AI 接口一致, 8080 或 3000)
        const activePort = window.location.port === '3000' ? '3000' : '8080';
        const API_BASE = `http://localhost:${activePort}`;
        const WS_BASE = `ws://localhost:${activePort}`;

        // 自动注册/登录后端账号
        fetch(API_BASE + '/api/social/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'user_' + (localStorage.getItem('bookemu_player_uid') || Date.now()),
                nickname: currentUser.name || '修仙道友',
                avatar: currentUser.avatar || '🧑‍🌾',
                cultivation: '炼气期'
            })
        })
        .then(res => res.json())
        .then(user => {
            if (user && user.id) {
                localUserId = user.id;
                if (!localStorage.getItem('bookemu_player_uid')) {
                    localStorage.setItem('bookemu_player_uid', user.id);
                }
                loadRemotePosts();
                loadRemoteFriends();
            }
        })
        .catch(err => console.log('后端登录通知 (如果未启动后端则走纯前端模式)'));

        // 建立 WebSocket 全服广播与点对点双向私信
        try {
            socket = new WebSocket(WS_BASE + '/ws/explore');
            socket.onopen = function() {
                if (localUserId) {
                    socket.send(JSON.stringify({ type: 'REGISTER_USER', userId: localUserId }));
                }
            };
            socket.onmessage = function(event) {
                try {
                    const msg = JSON.parse(event.data);
                    if (msg.type === 'NEW_POST' && msg.data) {
                        const post = msg.data;
                        const newMoment = {
                            id: post.id,
                            userId: post.userId,
                            author: post.authorName,
                            avatar: post.avatar || ANIME_AVATARS[0],
                            time: '刚刚',
                            content: post.content,
                            image: null,
                            likes: [],
                            comments: []
                        };
                        if (!momentsData.some(m => m.id === post.id)) {
                            momentsData.unshift(newMoment);
                            renderMomentsList();
                        }
                    } else if (msg.type === 'PRIVATE_CHAT' && msg.data) {
                        const chat = msg.data;
                        // 收到好友点对点实时私信
                        if (activeChatFriendId && (chat.senderId === activeChatFriendId || chat.receiverId === activeChatFriendId)) {
                            appendChatMessageUI(chat);
                        } else {
                            // 好友未在当前对话中，标注红点
                            const friend = friendsData.find(f => f.id === chat.senderId);
                            if (friend) {
                                friend.unread = true;
                                renderFriendsList();
                            }
                        }
                    }
                } catch(e) {}
            };
        } catch(e) {}
    }

    function loadRemotePosts() {
        const activePort = window.location.port === '3000' ? '3000' : '8080';
        fetch(`http://localhost:${activePort}/api/social/posts`)
            .then(res => res.json())
            .then(posts => {
                if (Array.isArray(posts) && posts.length > 0) {
                    posts.forEach(post => {
                        if (!momentsData.some(m => m.id === post.id)) {
                            momentsData.push({
                                id: post.id,
                                userId: post.userId,
                                author: post.authorName,
                                avatar: post.avatar || ANIME_AVATARS[0],
                                time: post.createdAt ? post.createdAt.split('T')[0] : '最近',
                                content: post.content,
                                image: null,
                                likes: [],
                                comments: []
                            });
                        }
                    });
                    renderMomentsList();
                }
            })
            .catch(e => {});
    }

    function loadRemoteFriends() {
        if (!localUserId) return;
        const activePort = window.location.port === '3000' ? '3000' : '8080';
        fetch(`http://localhost:${activePort}/api/social/friends/${localUserId}`)
            .then(res => res.json())
            .then(users => {
                if (Array.isArray(users)) {
                    users.forEach(u => {
                        if (!friendsData.some(f => f.id === u.id)) {
                            friendsData.unshift({
                                id: u.id,
                                name: u.nickname + ' (修仙书友)',
                                avatar: u.avatar || ANIME_AVATARS[0],
                                online: true,
                                readCount: 88,
                                currentBook: '《凡人修仙传》',
                                unread: false,
                                messages: ['幸会！道友也在研读此书？']
                            });
                        }
                    });
                    renderFriendsList();
                }
            }).catch(e => {});

        // 获取待结识的其他在线玩家
        fetch(`http://localhost:${activePort}/api/social/users/list/${localUserId}`)
            .then(res => res.json())
            .then(users => {
                if (Array.isArray(users)) {
                    users.forEach(u => {
                        if (!friendsData.some(f => f.id === u.id)) {
                            friendsData.push({
                                id: u.id,
                                name: u.nickname + ' (附近玩家)',
                                avatar: u.avatar || ANIME_AVATARS[1],
                                online: true,
                                readCount: 12,
                                currentBook: '《凡人修仙传》',
                                unread: false,
                                messages: ['点击申请添加好友']
                            });
                        }
                    });
                    renderFriendsList();
                }
            }).catch(e => {});
    }

    // 网页加载后立刻触发 WS 社交模块
    setTimeout(initSocialWebSocket, 1000);

    // 放大图片查看
    window.zoomImage = function(src) {
        // 创建一个简单的图片全屏蒙版查看器
        const viewer = document.createElement('div');
        viewer.style.position = 'fixed';
        viewer.style.inset = '0';
        viewer.style.background = 'rgba(0,0,0,0.85)';
        viewer.style.display = 'flex';
        viewer.style.alignItems = 'center';
        viewer.style.justifyContent = 'center';
        viewer.style.zIndex = '100000';
        viewer.style.cursor = 'zoom-out';
        
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
        
        viewer.appendChild(img);
        document.body.appendChild(viewer);

        viewer.onclick = function() {
            document.body.removeChild(viewer);
        };
    };

    // 3. 书籍讨论交流区：首先选择书籍名
    function openBookSelectModal() {
        const input = document.getElementById('book-name-input');
        if (input) {
            input.value = currentUser.currentBook.replace(/《|》/g, ''); // 默认填充当前正在阅读书籍
        }
        openElModal('el-book-select-modal');
    }

    window.confirmEnterBookDiscuss = function() {
        const input = document.getElementById('book-name-input');
        if (!input) return;

        let name = input.value.trim();
        if (!name) {
            const alertFn = window.showGameAlert || (window.parent && window.parent.showGameAlert) || showGameAlert;
            if (typeof alertFn === 'function') {
                alertFn('请输入想要进入交流的书籍名字！', '提示');
            } else {
                alert('请输入想要进入交流的书籍名字！');
            }
            return;
        }
        name = name.replace(/《|》/g, ''); // 去除括号
        currentDiscussionBook = name;

        // 如果尚不存在该书籍，为其初始化一个空白帖子列表
        if (!bookDiscussions[name]) {
            bookDiscussions[name] = [];
        }

        closeElModal('el-book-select-modal');
        openElModal('el-discuss-modal');
        renderBookDiscussPosts();
    };

    function renderBookDiscussPosts() {
        const titleEl = document.getElementById('discuss-book-title');
        const container = document.getElementById('discuss-posts-container');
        if (titleEl) titleEl.textContent = `📖 《${currentDiscussionBook}》交流空间`;
        if (!container) return;

        const posts = bookDiscussions[currentDiscussionBook] || [];
        if (posts.length === 0) {
            container.innerHTML = '<div style="color:rgba(0,0,0,0.4);text-align:center;padding:3rem 0;font-size:13px;">暂无讨论帖子，快来发表关于本书的第一个话题吧！</div>';
            return;
        }

        let html = '';
        posts.forEach(post => {
            // 判断是否已被当前用户收藏
            const isFav = currentUser.collectedPosts.some(p => p.id === post.id && p.book === currentDiscussionBook);

            html += `
                <div class="qzone-post" id="qzone-post-${post.id}">
                    <div class="qzone-post-header">
                        <img src="${post.avatar}" class="qzone-avatar">
                        <div class="qzone-meta">
                            <div class="qzone-author">${post.author}</div>
                            <div class="qzone-time">${post.time}</div>
                        </div>
                    </div>
                    <div class="qzone-title">${post.title}</div>
                    <div class="qzone-content">${post.content}</div>
                    <div class="qzone-footer">
                        <button class="qzone-btn" onclick="likeQzonePost(${post.id})">👍 赞 (${post.likes})</button>
                        <button class="qzone-btn" onclick="commentQzonePost(${post.id})">💬 评论 (${post.comments})</button>
                        <button class="qzone-btn fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavPost(${post.id})">
                            ${isFav ? '⭐ 已收藏' : '☆ 收藏'}
                        </button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // 赞交流帖子
    window.likeQzonePost = function(id) {
        const post = bookDiscussions[currentDiscussionBook].find(p => p.id === id);
        if (post) {
            post.likes++;
            renderBookDiscussPosts();
        }
    };

    // 评论帖子提示
    window.commentQzonePost = function(id) {
        const promptFn = window.showGamePrompt || (window.parent && window.parent.showGamePrompt) || showGamePrompt;
        if (typeof promptFn === 'function') {
            promptFn('请输入你的评论：', '', '评论帖子').then(function(text) {
                if (text && text.trim()) {
                    const post = bookDiscussions[currentDiscussionBook].find(p => p.id === id);
                    if (post) {
                        post.comments++;
                        renderBookDiscussPosts();
                    }
                }
            });
        } else {
            const text = prompt('请输入你的评论：');
            if (text && text.trim()) {
                const post = bookDiscussions[currentDiscussionBook].find(p => p.id === id);
                if (post) {
                    post.comments++;
                    renderBookDiscussPosts();
                }
            }
        }
    };

    // 收藏/取消收藏帖子
    window.toggleFavPost = function(id) {
        const post = bookDiscussions[currentDiscussionBook].find(p => p.id === id);
        if (!post) return;

        const favIdx = currentUser.collectedPosts.findIndex(p => p.id === id && p.book === currentDiscussionBook);
        if (favIdx >= 0) {
            currentUser.collectedPosts.splice(favIdx, 1);
        } else {
            currentUser.collectedPosts.push({
                id: post.id,
                book: currentDiscussionBook,
                title: post.title,
                author: post.author
            });
        }
        renderBookDiscussPosts();
        renderPersonalPanel(); // 刷新个人面板的收藏夹
    };

    // 发表空间帖子
    window.publishQzonePost = function() {
        const titleInput = document.getElementById('qzone-post-title');
        const contentText = document.getElementById('qzone-post-content');
        if (!titleInput || !contentText) return;

        const title = titleInput.value.trim();
        const content = contentText.value.trim();

        if (!title || !content) {
            const alertFn = window.showGameAlert || (window.parent && window.parent.showGameAlert) || showGameAlert;
            if (typeof alertFn === 'function') {
                alertFn('请先填写帖子的标题和具体见解内容！', '提示');
            } else {
                alert('请先填写帖子的标题和具体见解内容！');
            }
            return;
        }

        const newPost = {
            id: Date.now(),
            author: currentUser.name + ' (我)',
            avatar: currentUser.avatar,
            time: '刚刚',
            title: title,
            content: content,
            likes: 0,
            comments: 0
        };

        if (!bookDiscussions[currentDiscussionBook]) {
            bookDiscussions[currentDiscussionBook] = [];
        }
        bookDiscussions[currentDiscussionBook].unshift(newPost);
        
        titleInput.value = '';
        contentText.value = '';
        renderBookDiscussPosts();
    };

    // 4. 情绪书籍随笔记录备忘录
    function openBookRecordModal() {
        renderMemoNotes();
        openElModal('el-record-modal');
    }

    let activeSelectedEmotion = '😊 愉悦';
    window.selectEmotion = function(emotion, btn) {
        activeSelectedEmotion = emotion;
        
        // 去除其它按钮的选中状态
        const parent = btn.parentNode;
        parent.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    };

    function renderMemoNotes() {
        const container = document.getElementById('memo-notes-container');
        if (!container) return;

        if (memoNotes.length === 0) {
            container.innerHTML = '<div style="color:rgba(0,0,0,0.4);text-align:center;padding:3rem 0;font-size:13px;">暂无随笔备忘，记录下你在书海探索中的情感火花吧。</div>';
            return;
        }

        let html = '';
        memoNotes.forEach(note => {
            html += `
                <div class="memo-card">
                    <div class="memo-header">
                        <span class="memo-time">${note.time}</span>
                        <span class="memo-emotion-badge">${note.emotion}</span>
                    </div>
                    <div class="memo-content">${note.content}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // 保存个人私密随笔
    window.saveMemoNote = function() {
        const textarea = document.getElementById('memo-input-text');
        if (!textarea) return;

        const val = textarea.value.trim();
        if (!val) {
            const alertFn = window.showGameAlert || (window.parent && window.parent.showGameAlert) || showGameAlert;
            if (typeof alertFn === 'function') {
                alertFn('请先输入要记录的随笔内容！', '提示');
            } else {
                alert('请先输入要记录的随笔内容！');
            }
            return;
        }

        const date = new Date();
        const timeStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
        
        const newNote = {
            id: Date.now(),
            time: timeStr,
            content: val,
            emotion: activeSelectedEmotion
        };

        memoNotes.unshift(newNote);
        textarea.value = '';
        renderMemoNotes();
    };


    // 5. 右侧个人面板信息渲染 (支持渲染我自己的主页或好友/其他玩家的主页)
    function renderPersonalPanel(otherUser) {
        const panel = document.getElementById('el-personal-panel');
        if (!panel) return;

        // 如果传入了其他玩家的数据，渲染其他玩家主页
        if (otherUser) {
            displayedProfileUserId = otherUser.id;
            const uTier = getTier(otherUser.readCount || 30);
            
            panel.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <span style="font-size:10px;color:rgba(0,0,0,0.4);font-weight:bold;">玩家个人主页</span>
                    <button onclick="renderPersonalPanel()" style="background:rgba(0,0,0,0.06);border:none;color:#666;font-size:10px;padding:2px 6px;border-radius:4px;cursor:pointer;">← 返回我的主页</button>
                </div>
                <div class="user-header">
                    <div class="user-avatar-container">
                        <img src="${otherUser.avatar || ANIME_AVATARS[0]}" class="user-avatar">
                    </div>
                    <div class="user-main-info">
                        <div class="user-name-row">
                            <div class="user-name">${otherUser.nickname || otherUser.name}</div>
                        </div>
                        <div style="font-size:10px;color:#26a69a;margin:2px 0;font-weight:bold;">玩家ID: ${otherUser.id}</div>
                        <span class="user-tier-tag" style="background:${uTier.color}20; color:${uTier.color}; border:1px solid ${uTier.color}35;">${uTier.name}</span>
                    </div>
                </div>

                <div class="user-section" style="margin-top:8px;">
                    <div class="user-label">境界 / 状态</div>
                    <div class="user-book-val" style="color:#26a69a;">${otherUser.cultivation || '炼气期修士'}</div>
                </div>

                <div class="user-section">
                    <div class="user-label">正在研读</div>
                    <div class="user-book-val">${otherUser.currentBook || '《凡人修仙传》'}</div>
                </div>

                <div class="user-section" style="margin-top:12px;">
                    <button onclick="applyAddFriend(${otherUser.id})" style="width:100%;background:#26a69a;color:#fff;border:none;padding:8px 0;border-radius:8px;font-size:11px;cursor:pointer;font-weight:bold;box-shadow:0 2px 8px rgba(38,166,154,0.3);">+ 申请添加好友</button>
                </div>
            `;
            return;
        }

        // 默认渲染我自己的主页
        displayedProfileUserId = null;
        const tier = getTier(currentUser.favorites.length * 15);
        const playerUid = localStorage.getItem('bookemu_player_uid') || '待分配';

        let favListHtml = '';
        currentUser.favorites.forEach(book => {
            favListHtml += `<div class="fav-item"><span class="fav-icon-square"></span>${book}</div>`;
        });

        let collectedPostsHtml = '';
        if (currentUser.collectedPosts.length === 0) {
            collectedPostsHtml = '<div style="font-size:10px;color:rgba(0,0,0,0.3);text-align:center;padding:5px 0;">空无一物</div>';
        } else {
            currentUser.collectedPosts.forEach(post => {
                collectedPostsHtml += `
                    <div class="fav-item" onclick="openDiscussPost(${post.id}, '${post.book}')">
                        <span class="fav-icon">⭐</span>
                        <div class="fav-text">
                            <span class="fav-book-title">《${post.book}》</span>
                            <span class="fav-post-title">${post.title}</span>
                        </div>
                    </div>
                `;
            });
        }

        panel.innerHTML = `
            <div class="user-header">
                <div class="user-avatar-container" onclick="changeUserAvatar()">
                    <img src="${currentUser.avatar}" class="user-avatar">
                    <div class="avatar-edit-overlay">✍️</div>
                </div>
                <div class="user-main-info">
                    <div class="user-name-row">
                        <div class="user-name" id="el-username">${currentUser.name}</div>
                        <button class="edit-name-btn" onclick="editUsername()">✏️</button>
                    </div>
                    <div style="font-size:10px;color:#26a69a;margin:2px 0;font-weight:bold;">我的ID: ${playerUid}</div>
                    <span class="user-tier-tag" style="background:${tier.color}20; color:${tier.color}; border:1px solid ${tier.color}35;">${tier.name} (${currentUser.favorites.length * 15}本)</span>
                </div>
            </div>

            <div class="user-section">
                <div class="user-label">正在阅读</div>
                <div class="user-book-val">${currentUser.currentBook}</div>
            </div>

            <div class="user-section">
                <div class="user-label">阅读兴趣</div>
                <div class="interests-tags">
                    ${currentUser.interests.map(i => `<span class="interest-tag">${i} <span class="remove-interest" onclick="removeUserInterest('${i}')">×</span></span>`).join('')}
                    <button class="add-interest-btn" onclick="addUserInterest()">＋ 添加</button>
                </div>
            </div>

            <div class="user-section">
                <div class="user-label">品读书架</div>
                <div class="favorites-list">${favListHtml}</div>
            </div>

            <div class="user-section">
                <div class="user-label">抽藏夹 (${currentUser.collectedPosts.length})</div>
                <div class="favorites-list" style="gap:6px;">${collectedPostsHtml}</div>
            </div>
        `;
    }

    // 快捷打开已被收藏的帖子
    window.openDiscussPost = function(postId, bookName) {
        currentDiscussionBook = bookName;
        if (!bookDiscussions[bookName]) return;
        
        closeElModal('el-sharing-modal');
        closeElModal('el-record-modal');
        
        openElModal('el-discuss-modal');
        renderBookDiscussPosts();
        
        // 瞬间高亮闪烁闪烁滚动到该条目
        setTimeout(() => {
            const el = document.getElementById(`qzone-post-${postId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.style.boxShadow = '0 0 15px rgba(251,191,36,0.5)';
                el.style.borderColor = '#fbbf24';
                setTimeout(() => {
                    el.style.boxShadow = '';
                    el.style.borderColor = '';
                }, 1500);
            }
        }, 300);
    };

    // 编辑名字
    window.editUsername = function() {
        const promptFn = window.showGamePrompt || (window.parent && window.parent.showGamePrompt) || showGamePrompt;
        if (typeof promptFn === 'function') {
            promptFn('请输入你要修改的新昵称：', currentUser.name, '修改昵称').then(function(newName) {
                if (newName && newName.trim()) {
                    currentUser.name = newName.trim();
                    renderPersonalPanel();
                }
            });
        } else {
            const newName = prompt('请输入你要修改的新昵称：', currentUser.name);
            if (newName && newName.trim()) {
                currentUser.name = newName.trim();
                renderPersonalPanel();
            }
        }
    };

    // 换头像 (采用有趣的随机种子)
    window.changeUserAvatar = function() {
        const seeds = ['Loki', 'Mia', 'Jack', 'Daisy', 'Toby', 'Kiki', 'Bear', 'Coco'];
        const randSeed = seeds[Math.floor(Math.random() * seeds.length)] + Math.floor(Math.random() * 100);
        currentUser.avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randSeed}&backgroundColor=ffd5dc`;
        renderPersonalPanel();
    };

    // 添加喜好标签
    window.addUserInterest = function() {
        const promptFn = window.showGamePrompt || (window.parent && window.parent.showGamePrompt) || showGamePrompt;
        if (typeof promptFn === 'function') {
            promptFn('请输入你要增加的喜好领域：', '', '添加喜好').then(function(tag) {
                if (tag && tag.trim()) {
                    if (!currentUser.interests.includes(tag.trim())) {
                        currentUser.interests.push(tag.trim());
                        renderPersonalPanel();
                    }
                }
            });
        } else {
            const tag = prompt('请输入你要增加的喜好领域：');
            if (tag && tag.trim()) {
                if (!currentUser.interests.includes(tag.trim())) {
                    currentUser.interests.push(tag.trim());
                    renderPersonalPanel();
                }
            }
        }
    };

    // 删除喜好标签
    window.removeUserInterest = function(tag) {
        const idx = currentUser.interests.indexOf(tag);
        if (idx >= 0) {
            currentUser.interests.splice(idx, 1);
            renderPersonalPanel();
        }
    };

    // 6. 好友列表搜索与私聊面板
    function renderFriendsList(filterText = '') {
        const container = document.getElementById('el-friends-list');
        if (!container) return;

        const query = filterText.toLowerCase().trim();
        const filtered = friendsData.filter(f => f.name.toLowerCase().includes(query) || f.currentBook.toLowerCase().includes(query));

        if (filtered.length === 0) {
            container.innerHTML = '<div style="color:rgba(0,0,0,0.3);text-align:center;padding:2rem 0;font-size:12px;">未匹配到任何书友</div>';
            return;
        }

        // 分离在线和离线好友
        const onlineFriends = filtered.filter(f => f.online).sort((a,b) => b.readCount - a.readCount);
        const offlineFriends = filtered.filter(f => !f.online).sort((a,b) => b.readCount - a.readCount);

        let html = '';
        
        // 在线好友
        onlineFriends.forEach((friend, index) => {
            const fTier = getTier(friend.readCount);
            
            let rankClass = '';
            if (index === 0) rankClass = 'top-1';
            else if (index === 1) rankClass = 'top-2';
            else if (index === 2) rankClass = 'top-3';

            const rankNumBadge = `<span class="friend-rank-num ${rankClass}">NO.${index + 1}</span>`;
            const greenDot = friend.unread ? '<span class="unread-green-dot"></span>' : '';

            html += `
                <div class="friend-item">
                    <div class="friend-avatar-wrap" onclick="showUserProfileOnRightSide(${friend.id}); event.stopPropagation();" title="查看玩家个人主页" style="cursor:pointer;">
                        <img src="${friend.avatar}" class="friend-avatar">
                        <span class="status-indicator online"></span>
                        ${greenDot}
                    </div>
                    <div class="friend-info" onclick="openChatWithFriend(${friend.id})">
                        <div class="friend-name-row">
                            <span class="friend-name">${friend.name}</span>
                            ${rankNumBadge}
                        </div>
                        <div class="friend-book">正在阅读：${friend.currentBook}</div>
                        <span class="friend-tier" style="color:${fTier.color}; border-color:${fTier.color}35; background:${fTier.color}08">${fTier.name} (${friend.readCount}本)</span>
                    </div>
                </div>
            `;
        });

        // 离线好友分组
        if (offlineFriends.length > 0) {
            html += `<div class="offline-section-header">离线好友 (${offlineFriends.length})</div>`;
            
            offlineFriends.forEach((friend) => {
                const fTier = getTier(friend.readCount);

                html += `
                    <div class="friend-item offline">
                        <div class="friend-avatar-wrap" onclick="showUserProfileOnRightSide(${friend.id}); event.stopPropagation();" title="查看玩家个人主页" style="cursor:pointer;">
                            <img src="${friend.avatar}" class="friend-avatar offline-img">
                            <span class="status-indicator offline"></span>
                        </div>
                        <div class="friend-info" onclick="openChatWithFriend(${friend.id})">
                            <div class="friend-name-row">
                                <span class="friend-name">${friend.name}</span>
                                <span class="offline-badge-tag">离线</span>
                            </div>
                            <div class="friend-book">曾经阅读：${friend.currentBook}</div>
                            <span class="friend-tier offline-badge" style="color:${fTier.color}; border-color:${fTier.color}35; background:${fTier.color}08">${fTier.name}</span>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = html;
    }

    // 搜索输入框挂载监听
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('el-friends-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                renderFriendsList(e.target.value);
            });
        }
    });

    // 与某位好友开启对话聊天
    window.openChatWithFriend = function(id) {
        const friend = friendsData.find(f => f.id === id);
        if (!friend) return;

        activeChatFriendId = id;
        friend.unread = false; // 已读
        renderFriendsList(); // 刷新红点状态

        const avatarEl = document.getElementById('chat-friend-avatar');
        const nameEl = document.getElementById('chat-friend-name');
        const tierEl = document.getElementById('chat-friend-tier');

        if (avatarEl) avatarEl.src = friend.avatar;
        if (nameEl) nameEl.textContent = friend.name;
        if (tierEl) {
            const fTier = getTier(friend.readCount);
            tierEl.textContent = fTier.name;
            tierEl.style.color = fTier.color;
        }

        // 从后端拉取真实的历史聊天记录
        if (localUserId && typeof id === 'number') {
            const activePort = window.location.port === '3000' ? '3000' : '8080';
            fetch(`http://localhost:${activePort}/api/social/chat/history?userId=${localUserId}&friendId=${id}`)
                .then(res => res.json())
                .then(list => {
                    if (Array.isArray(list) && list.length > 0) {
                        friend.messages = list.map(m => (m.senderId === localUserId ? '我：' : '') + m.content);
                    }
                    renderChatMessages();
                }).catch(e => renderChatMessages());
        } else {
            renderChatMessages();
        }
        openElModal('el-chat-modal');
    };

    function appendChatMessageUI(chat) {
        const container = document.getElementById('chat-messages-box');
        if (!container) return;
        const isMe = chat.senderId === localUserId;
        const friend = friendsData.find(f => f.id === (isMe ? chat.receiverId : chat.senderId));
        const avatar = isMe ? currentUser.avatar : (friend ? friend.avatar : ANIME_AVATARS[0]);

        const div = document.createElement('div');
        div.className = `chat-msg ${isMe ? 'my-msg' : 'friend-msg'}`;
        div.innerHTML = `
            <img src="${avatar}" class="msg-avatar">
            <div class="msg-bubble">${chat.content}</div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function renderChatMessages() {
        const container = document.getElementById('chat-messages-box');
        if (!container || !activeChatFriendId) return;

        const friend = friendsData.find(f => f.id === activeChatFriendId);
        if (!friend) return;

        let html = '';
        friend.messages.forEach(msg => {
            const isMe = msg.startsWith('我：');
            const cleanText = isMe ? msg.replace('我：','') : msg;
            
            html += `
                <div class="chat-msg ${isMe ? 'my-msg' : 'friend-msg'}">
                    <img src="${isMe ? currentUser.avatar : friend.avatar}" class="msg-avatar">
                    <div class="msg-bubble">${cleanText}</div>
                </div>
            `;
        });
        container.innerHTML = html;
        
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }

    // 发送消息
    window.sendChatMessage = function() {
        const input = document.getElementById('chat-input-field');
        if (!input) return;

        const val = input.value.trim();
        if (!val) return;

        const friend = friendsData.find(f => f.id === activeChatFriendId);
        if (friend) {
            friend.messages.push('我：' + val);
            input.value = '';
            renderChatMessages();

            // 如果有真正的后端且对方也是整数ID玩家，发往后端
            if (localUserId && typeof friend.id === 'number') {
                const activePort = window.location.port === '3000' ? '3000' : '8080';
                fetch(`http://localhost:${activePort}/api/social/chat/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        senderId: localUserId,
                        receiverId: friend.id,
                        content: val
                    })
                }).catch(e => {});
            }
        }
    };

    // ─── 搜索玩家 Modal & 个人主页 Modal ──────────────────────────────
    window.openSearchUserModal = function() {
        openElModal('el-search-user-modal');
        const container = document.getElementById('user-search-results');
        if (container) container.innerHTML = '<div style="color:rgba(0,0,0,0.3);text-align:center;padding:1rem;">输入玩家ID或昵称开始搜索</div>';
    };

    window.searchUsersInServer = function() {
        const input = document.getElementById('user-search-input');
        const container = document.getElementById('user-search-results');
        if (!input || !container) return;
        const q = input.value.trim();
        if (!q) return;

        container.innerHTML = '<div style="color:#26a69a;text-align:center;padding:1rem;">正在向服务器查询玩家...</div>';

        const activePort = window.location.port === '3000' ? '3000' : '8080';
        fetch(`http://localhost:${activePort}/api/social/user/search?query=${encodeURIComponent(q)}`)
            .then(res => res.json())
            .then(users => {
                if (!Array.isArray(users) || users.length === 0) {
                    container.innerHTML = '<div style="color:rgba(0,0,0,0.3);text-align:center;padding:1rem;">未找到匹配的玩家</div>';
                    return;
                }
                let html = '';
                users.forEach(u => {
                    html += `
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(0,0,0,0.03);border-radius:8px;">
                            <div style="display:flex;align-items:center;gap:8px;cursor:pointer;" onclick="openUserProfileModal(${u.id})">
                                <span style="font-size:1.5rem;">${u.avatar || '🧑‍🌾'}</span>
                                <div>
                                    <div style="font-weight:bold;font-size:12px;">${u.nickname} (ID: ${u.id})</div>
                                    <div style="font-size:10px;color:rgba(0,0,0,0.4);">${u.cultivation || '炼气期'}</div>
                                </div>
                            </div>
                            <button onclick="applyAddFriend(${u.id})" style="background:rgba(38,166,154,0.15);color:#26a69a;border:1px solid rgba(38,166,154,0.3);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px;">+ 加好友</button>
                        </div>
                    `;
                });
                container.innerHTML = html;
            }).catch(e => {
                container.innerHTML = '<div style="color:#ec407a;text-align:center;padding:1rem;">搜索请求失败</div>';
            });
    };

    window.applyAddFriend = function(friendId) {
        if (!localUserId) {
            showGameAlert('服务器未连接或正在登录，请稍后', '提示');
            return;
        }
        const activePort = window.location.port === '3000' ? '3000' : '8080';
        fetch(`http://localhost:${activePort}/api/social/friend/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: localUserId, friendId: friendId })
        }).then(res => res.json())
        .then(data => {
            showGameAlert(data.message || '申请结果已返回', '申请状态');
        }).catch(e => showGameAlert('网络故障或接口连接超时', '错误提示'));
    };

    window.showUserProfileOnRightSide = function(userId) {
        if (!userId) return;
        // 先在本地好友数组里找
        const friend = friendsData.find(f => f.id === userId);
        if (friend) {
            renderPersonalPanel({
                id: friend.id,
                nickname: friend.name,
                avatar: friend.avatar,
                readCount: friend.readCount,
                cultivation: '修仙同道',
                currentBook: friend.currentBook
            });
            return;
        }

        // 如果本地没找到，向后端拉取玩家资料并显示在右侧
        const activePort = window.location.port === '3000' ? '3000' : '8080';
        fetch(`http://localhost:${activePort}/api/social/user/profile/${userId}`)
            .then(res => res.json())
            .then(u => {
                renderPersonalPanel({
                    id: u.id,
                    nickname: u.nickname,
                    avatar: u.avatar || ANIME_AVATARS[0],
                    readCount: 50,
                    cultivation: u.cultivation || '炼气期修士',
                    currentBook: '《凡人修仙传》'
                });
            }).catch(e => {
                const alertFn = window.showGameAlert || (window.parent && window.parent.showGameAlert) || showGameAlert;
                if (typeof alertFn === 'function') {
                    alertFn('获取该玩家资料失败', '提示');
                } else {
                    alert('获取该玩家资料失败');
                }
            });
    };

    window.openUserProfileModal = function(userId) {
        if (!userId) return;
        openElModal('el-user-profile-modal');
        const body = document.getElementById('user-profile-body');
        if (body) body.innerHTML = '<div style="color:#26a69a;padding:2rem;">正在读取玩家资料...</div>';

        const activePort = window.location.port === '3000' ? '3000' : '8080';
        fetch(`http://localhost:${activePort}/api/social/user/profile/${userId}`)
            .then(res => res.json())
            .then(u => {
                if (body) {
                    body.innerHTML = `
                        <div style="font-size:3.5rem;margin-bottom:0.5rem;">${u.avatar || '🧑‍🌾'}</div>
                        <div style="font-size:1.2rem;font-weight:bold;color:#333;">${u.nickname}</div>
                        <div style="font-size:11px;color:#26a69a;margin:4px 0 1rem 0;background:rgba(38,166,154,0.1);padding:2px 8px;border-radius:10px;">ID: ${u.id} · ${u.cultivation}</div>
                        
                        <div style="width:100%;text-align:left;background:rgba(0,0,0,0.03);border-radius:8px;padding:12px;margin-bottom:1rem;font-size:12px;color:#555;">
                            <div>📖 当前定位：发布感悟 ${u.postCount || 0} 条</div>
                            <div style="margin-top:4px;">⏱️ 上次活跃：${u.lastActiveTime ? u.lastActiveTime.split('T')[0] : '最近在线'}</div>
                        </div>

                        <div style="display:flex;gap:10px;width:100%;">
                            <button onclick="applyAddFriend(${u.id})" style="flex:1;background:#26a69a;color:#fff;border:none;padding:8px 0;border-radius:6px;cursor:pointer;font-weight:bold;">+ 加为好友</button>
                            <button onclick="closeElModal('el-user-profile-modal')" style="flex:1;background:rgba(0,0,0,0.06);color:#666;border:none;padding:8px 0;border-radius:6px;cursor:pointer;">关闭</button>
                        </div>
                    `;
                }
            }).catch(e => {
                if (body) body.innerHTML = '<div style="color:#ec407a;">读取玩家主页失败</div>';
            });
    };


    // ─── 提供给 main.js 的页面切换初始化和注销挂载 ──────────────
    let destroy2DSceneFn = null;

    window.initExploreLife = function() {
        // 先销毁可能在运行的历史场景，防多重渲染卡顿
        if (destroy2DSceneFn) {
            destroy2DSceneFn();
            destroy2DSceneFn = null;
        }

        // 初始化Canvas绘制
        destroy2DSceneFn = initExploreLife2D();

        // 渲染基础 UI 面板数据
        renderPersonalPanel();
        renderFriendsList();
    };

    window.destroyExploreLife = function() {
        if (destroy2DSceneFn) {
            destroy2DSceneFn();
            destroy2DSceneFn = null;
        }
    };

    console.log('%c✦ 探索人生交友世界模块已加载', 'color:#38bdf8;font-size:12px');
})();