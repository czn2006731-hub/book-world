/**
 * 探索人生交友世界模块 v3.0
 * 实现科幻浪漫主义风格的3D社交宇宙
 * 包含：API对接、WebSocket实时同步、情绪星球3D渲染
 */
window.__social_loaded__ = 1;
(function() {
    window.__social_loaded__ = 2;
    // ─── 全局状态 ──────────────────────────────────────
    let currentNebulaType = null;
    let socialCanvas = null;
    let docMouseMoveHandler = null;
    let docClickHandler = null;
    let docResizeHandler = null;
    let socialScene = null;
    let socialCamera = null;
    let socialRenderer = null;
    let socialAnimationId = null;
    let composer = null;
    let bloomPass = null;
    
    // 3D对象
    let stars = null;
    let nebulaClouds = [];
    let planetMeshes = [];
    let planetRings = [];
    let planetLabels = [];
    let planetDustSystems = [];
    let centralStar = null; // 已移除中心星，保留变量兼容
    let emotionParticles = []; // 情绪粒子系统
    let socialPivotGroup = null; // 星星旋转枢轴
    
    // 动画状态
    let warpProgress = 0;
    let isWarping = false;
    let warpDirection = 'in';
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let hoverPlanet = null;
    let selectedPlanet = null;
    
    // API状态
    let authToken = localStorage.getItem('book_realm_token') || null;
    let currentUser = null;
    let ws = null;
    let wsReconnectAttempts = 0;
    const MAX_WS_RECONNECT = 5;
    
    // 数据缓存
    let friendsData = [];
    let postsData = [];
    let threadsData = [];
    let recordsData = [];
    let emotionSpectrum = {};
    let favData = [];

    // ─── 个人资料数据 ────────────────────────────────
    let profileData = {
        name: '星际读者',
        username: '@StarReader',
        book: '《三体》',
        total_read: 67,
        tags: ['科幻', '推理', '历史'],
        avatar: ''
    };
    function loadProfile() {
        try { var p = JSON.parse(localStorage.getItem('bookEmu_profile')); if (p) profileData = p; } catch(e) {}
    }
    function saveProfile() {
        try { 
            var data = JSON.stringify(profileData);
            if (data.length > 500000) { profileData.avatar = ''; data = JSON.stringify(profileData); }
            localStorage.setItem('bookEmu_profile', data);
        } catch(e) { profileData.avatar = ''; }
    }
    function handleAvatarUpload() {
        var input = document.getElementById('profile-avatar-input');
        if (input) input.click();
    }
    function setupProfilePanel() {
        loadProfile();
        updateProfileUI();

        var avatarWrap = document.getElementById('profile-avatar-wrap');
        if (avatarWrap) avatarWrap.addEventListener('click', function() {
            document.getElementById('profile-avatar-input').click();
        });

        var avatarInput = document.getElementById('profile-avatar-input');
        if (avatarInput) avatarInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
                profileData.avatar = ev.target.result;
                saveProfile();
                updateProfileUI();
            };
            reader.readAsDataURL(file);
        });

        var tagAdd = document.getElementById('profile-tag-add');
        if (tagAdd) tagAdd.addEventListener('click', function() {
            var tag = prompt('输入新的阅读偏好标签');
            if (tag && tag.trim()) {
                profileData.tags.push(tag.trim());
                saveProfile();
                updateProfileUI();
            }
        });

        var nameEl = document.getElementById('profile-name');
        if (nameEl) nameEl.addEventListener('dblclick', function() {
            var name = prompt('修改昵称', profileData.name);
            if (name && name.trim()) {
                profileData.name = name.trim();
                saveProfile();
                updateProfileUI();
            }
        });

        var favBtn = document.getElementById('profile-fav-btn');
        if (favBtn) favBtn.addEventListener('click', function() {
            showFavRecordsModal();
        });
    }

    function showFavRecordsModal() {
        var existing = document.getElementById('fav-records-modal');
        if (existing) { existing.classList.toggle('hidden'); return; }

        var modal = document.createElement('div');
        modal.id = 'fav-records-modal';
        modal.className = 'social-modal';
        modal.style.zIndex = '1100';
        modal.innerHTML = '<div class="modal-content" style="max-width:500px;width:90vw;max-height:80vh;border-radius:16px;margin:auto">' +
            '<div class="modal-header"><h2>我的收藏</h2><button class="modal-close-btn" id="fav-close">✕</button></div>' +
            '<div style="flex:1;overflow-y:auto;padding:16px" id="fav-records-list"></div>' +
            '</div>';
        document.body.appendChild(modal);
        modal.querySelector('#fav-close').addEventListener('click', function() { modal.classList.add('hidden'); });
        loadFavorites();
        renderFavRecords();
    }

    function renderFavRecords() {
        var list = document.getElementById('fav-records-list');
        if (!list) return;
        if (favData.length === 0) {
            list.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:30px">暂无收藏记录</div>';
            return;
        }
        list.innerHTML = favData.map(function(f, i) {
            return '<div style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.04);margin-bottom:8px">' +
                '<div style="font-size:14px;color:var(--text-primary);line-height:1.6">"' + f.content + '"</div>' +
                '<div style="font-size:12px;color:var(--text-muted);margin-top:4px">— ' + f.author + ' · ' + f.book + '</div>' +
                '</div>';
        }).join('');
    }

    // ─── 收藏夹功能 ──────────────────────────────────
    function loadFavorites() {
        try { favData = JSON.parse(localStorage.getItem('bookEmu_favorites') || '[]'); } catch(e) { favData = []; }
    }
    function saveFavorites() {
        localStorage.setItem('bookEmu_favorites', JSON.stringify(favData));
    }
    function isFaved(bookName, msg) {
        var author = msg.nickname || msg.username || '书友';
        return favData.some(function(f) { return f.book === bookName && f.content === msg.content && f.author === author; });
    }
    function toggleFav(bookName, msg) {
        var author = msg.nickname || msg.username || '书友';
        var idx = -1;
        for (var i = 0; i < favData.length; i++) {
            if (favData[i].book === bookName && favData[i].content === msg.content && favData[i].author === author) { idx = i; break; }
        }
        if (idx >= 0) {
            favData.splice(idx, 1);
        } else {
            favData.push({ book: bookName, content: msg.content, author: author, time: new Date().toISOString() });
        }
        saveFavorites();
        renderFavorites();
        renderDiscussMessages(bookName);
    }
    function renderFavorites() {
        var container = document.getElementById('bd-fav-list');
        if (!container) return;
        if (favData.length === 0) {
            container.innerHTML = '<div class="bd-fav-empty">点击语录旁的 ☆ 收藏</div>';
            return;
        }
        container.innerHTML = favData.map(function(f, i) {
            return '<div class="bd-fav-item">' +
                '<div class="bd-fav-quote">"' + f.content + '"</div>' +
                '<div class="bd-fav-author">— ' + f.author + ' · ' + f.book + '</div>' +
                '<button class="bd-fav-remove" data-idx="' + i + '">×</button>' +
            '</div>';
        }).join('');
        container.querySelectorAll('.bd-fav-remove').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                favData.splice(parseInt(this.dataset.idx), 1);
                saveFavorites();
                renderFavorites();
            });
        });
    }
    
    // ─── 情绪配置 ──────────────────────────────────────
    const EMOTION_CONFIG = {
        'RED_EXCITED': { color: 0xff4757, hex: '#ff4757', icon: '💫', name: '震撼', intensity: 1.0 },
        'PINK_LOVE': { color: 0xff6b81, hex: '#ff6b81', icon: '🥹', name: '感动', intensity: 0.9 },
        'ORANGE_HAPPY': { color: 0xffa502, hex: '#ffa502', icon: '😊', name: '开心', intensity: 0.85 },
        'BLUE_THINK': { color: 0x1e90ff, hex: '#1e90ff', icon: '🤔', name: '思考', intensity: 0.7 },
        'BLUE_SAD': { color: 0x70a1ff, hex: '#70a1ff', icon: '😢', name: '忧伤', intensity: 0.6 },
        'GREEN_CALM': { color: 0x2ed573, hex: '#2ed573', icon: '🍃', name: '平静', intensity: 0.5 },
        'ORANGE_EXCITE': { color: 0xff7f50, hex: '#ff7f50', icon: '🤩', name: '兴奋', intensity: 0.95 },
        'PURPLE_WISDOM': { color: 0xa855f7, hex: '#a855f7', icon: '💡', name: '感悟', intensity: 0.75 }
    };

    // ─── API请求封装 ──────────────────────────────────────
    async function apiRequest(endpoint, options = {}) {
        const url = `http://localhost:3000/api${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || '请求失败');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    }

    // ─── WebSocket连接 ──────────────────────────────────────
    function connectWebSocket() {
        if (!authToken) return;
        
        ws = new WebSocket('ws://localhost:3000');
        
        ws.onopen = () => {
            console.log('WebSocket连接成功');
            wsReconnectAttempts = 0;
            
            // 发送认证
            ws.send(JSON.stringify({
                type: 'auth',
                token: authToken
            }));
        };
        
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleWebSocketMessage(message);
        };
        
        ws.onclose = () => {
            console.log('WebSocket连接关闭');
            if (wsReconnectAttempts < MAX_WS_RECONNECT) {
                setTimeout(() => {
                    wsReconnectAttempts++;
                    connectWebSocket();
                }, 3000 * wsReconnectAttempts);
            }
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket错误:', error);
        };
    }

    function handleWebSocketMessage(message) {
        switch(message.type) {
            case 'auth_success':
                console.log('WebSocket认证成功');
                break;
            case 'new_post':
                // 新动态
                postsData.unshift(message.data);
                if (document.getElementById('life-share-modal') && !document.getElementById('life-share-modal').classList.contains('hidden')) {
                    renderLifeSharePosts();
                }
                break;
            case 'new_comment':
                // 新评论
                const post = postsData.find(p => p.id == message.data.post_id);
                if (post) {
                    post.comment_count = (post.comment_count || 0) + 1;
                }
                break;
            case 'new_reply':
                // 新回复
                if (document.getElementById('book-discuss-modal') && !document.getElementById('book-discuss-modal').classList.contains('hidden')) {
                    const bookTitle = document.getElementById('discuss-book-title')?.textContent?.replace(/[《》]/g, '');
                    if (bookTitle) {
                        renderDiscussMessages(bookTitle);
                    }
                }
                break;
            case 'user_online':
            case 'user_offline':
                // 用户上下线
                const friend = friendsData.find(f => f.id === message.data.user_id);
                if (friend) {
                    friend.online_status = message.type === 'user_online' ? 1 : 0;
                    renderFriendsList();
                }
                break;
            case 'notification':
                // 通知
                showNotification(message.data);
                break;
        }
    }

    function sendWSMessage(message) {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify(message));
        }
    }

    // ─── 通知系统 ──────────────────────────────────────
    function showNotification(data) {
        const notification = document.createElement('div');
        notification.className = 'ws-notification';
        notification.innerHTML = `
            <div class="notification-icon">${data.type === 'like' ? '✨' : '💬'}</div>
            <div class="notification-content">${data.content}</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ─── 数据加载 ──────────────────────────────────────
    async function loadFriendsData() {
        try {
            friendsData = await apiRequest('/friends');
            renderFriendsList();
        } catch (error) {
            console.log('使用模拟好友数据');
            // QQ风格头像卡通人物数据
            friendsData = [
                { id: 1, nickname: '萌萌小书虫', username: 'MoeBookworm', online_status: true, current_book: '《三体》', progress: 85, avatar_style: 'qq-style-1', rank: '钻石', total_read: 127 },
                { id: 2, nickname: '阳光书 Boy', username: 'SunnyReader', online_status: true, current_book: '《三体》', progress: 60, avatar_style: 'qq-style-2', rank: '黄金', total_read: 89 },
                { id: 3, nickname: '夜猫晚读', username: 'NightOwlRead', online_status: false, current_book: '《人性之光》', progress: 15, avatar_style: 'qq-style-3', rank: '白银', total_read: 67 },
                { id: 4, nickname: '悠悠书海', username: 'SeaOfBooks', online_status: true, current_book: '《围城》', progress: 30, avatar_style: 'qq-style-4', rank: '青铜', total_read: 45 },
                { id: 5, nickname: '书香少女', username: 'BookGirl', online_status: true, current_book: '《沙丘》', progress: 95, avatar_style: 'qq-style-5', rank: '钻石', total_read: 154 },
                { id: 6, nickname: '小骏驮', username: 'LittleCamel', online_status: false, current_book: null, progress: 0, avatar_style: 'qq-style-6', rank: '铜牌', total_read: 12 },
                { id: 7, nickname: '疯狂书迷', username: 'BookCrazy', online_status: true, current_book: '《山海经》', progress: 70, avatar_style: 'qq-style-7', rank: '大师', total_read: 235 },
                { id: 8, nickname: '安静的灵魂', username: 'QuietSoul', online_status: true, current_book: '《活着》', progress: 40, avatar_style: 'qq-style-8', rank: '初学', total_read: 31 },
                { id: 9, nickname: '追梦少年', username: 'DreamChaser', online_status: false, current_book: '《百年孤独》', progress: 25, avatar_style: 'qq-style-9', rank: '进阶', total_read: 78 }
            ];
            renderFriendsList();
        }
    }

    async function loadPostsData() {
        try {
            postsData = await apiRequest('/moments');
            renderLifeSharePosts();
        } catch (error) {
            console.log('使用模拟动态数据');
            postsData = [
                {
                    id: 1, nickname: '书香门第',
                    content: '今天读完了《三体》，震撼人心！黑暗森林法则真的让人细思极恐。宇宙的广袤与冷酷，在刘慈欣笔下展现得淋漓尽致。',
                    created_at: new Date(Date.now() - 600000).toISOString(),
                    like_count: 99, comment_count: 2, is_liked: 0,
                    comments: [
                        { nickname: '墨染轻舟', content: '同感！最喜欢第二部', created_at: new Date(Date.now() - 300000).toISOString() },
                        { nickname: '星辰大海', content: '末日战役那一段看哭了', created_at: new Date(Date.now() - 200000).toISOString() }
                    ]
                },
                {
                    id: 2, nickname: '云中漫步',
                    content: '周末的午后，一杯咖啡，一本好书，这就是我想要的生活。窗外的阳光正好，书页间的文字仿佛有了生命。',
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                    like_count: 42, comment_count: 0, is_liked: 0, comments: []
                }
            ];
            renderLifeSharePosts();
        }
    }

    async function loadEmotionSpectrum() {
        try {
            emotionSpectrum = await apiRequest('/emotional-logs/spectrum');
            updateEmotionSpectrum();
            updateEmotionPlanet();
        } catch (error) {
            recalculateLocalSpectrum();
        }
    }

    function recalculateLocalSpectrum() {
        const counts = {};
        recordsData.forEach(r => {
            const code = r.emotion_code || 'GREEN_CALM';
            counts[code] = (counts[code] || 0) + 1;
        });
        const total = recordsData.length || 1;
        emotionSpectrum = {};
        Object.entries(counts).forEach(([code, count]) => {
            emotionSpectrum[code] = { percentage: Math.round(count / total * 100), count, intensity: 3.0 };
        });
        if (Object.keys(emotionSpectrum).length === 0) {
            emotionSpectrum = { 'GREEN_CALM': { percentage: 100, count: 0, intensity: 3.0 } };
        }
        updateEmotionSpectrum();
        updateEmotionPlanet();
    }

    // ─── 渲染函数 ──────────────────────────────────────
    function getReadRank(totalRead) {
        if (totalRead >= 151) return '知行阅读者';
        if (totalRead >= 81) return '书籍研究者';
        if (totalRead >= 31) return '思辨读者';
        if (totalRead >= 11) return '资深书虫';
        if (totalRead >= 4) return '读书爱好者';
        return '初读新人';
    }
    function getRankColor(rank) {
        switch(rank) {
            case '知行阅读者': return '#f59e0b';
            case '书籍研究者': return '#a78bfa';
            case '思辨读者': return '#22d3ee';
            case '资深书虫': return '#34d399';
            case '读书爱好者': return '#60a5fa';
            default: return '#94a3b8';
        }
    }

    function renderFriendsList() {
        const container = document.getElementById('friends-list');
        if (!container) return;

        // 在线优先，离线排到最后
        var sorted = friendsData.slice().sort(function(a, b) {
            if (a.online_status && !b.online_status) return -1;
            if (!a.online_status && b.online_status) return 1;
            return 0;
        });

        container.innerHTML = '';
        sorted.forEach(function(friend) {
            const avatar = friend.nickname ? friend.nickname[0] : '?';
            const statusText = friend.online_status ? '在线' : '离线';
            const reading = friend.current_book || (friend.progress > 0 ? `已完成${friend.progress}%` : '暂未阅读');
            const ranking = getReadRank(friend.total_read || 0);
            const rankColor = getRankColor(ranking);
            const totalRead = friend.total_read || 0;

            const statusColor = friend.online_status ? 'var(--accent-green)' : 'var(--text-muted)';
            const avatarClass = friend.online_status ? (friend.avatar_style || 'qq-style') : '';
            const statusClass = friend.online_status ? 'online' : '';

            const div = document.createElement('div');
            div.className = `friend-item ${statusClass}`;
            div.innerHTML = `
                <div class="friend-avatar-wrapper">
                    <div class="friend-avatar ${avatarClass}">${avatar}</div>
                    <div class="friend-status ${statusClass}">${statusText}</div>
                </div>
                <div class="friend-info">
                    <div class="friend-name">
                        <span>${friend.nickname || friend.username}</span>
                    </div>
                    <div class="friend-reading">
                        <svg class="friend-book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                        ${reading}
                    </div>
                    <div class="friend-ranking" style="color:${rankColor}">${ranking}</div>
                    ${totalRead ? `<div class="friend-total-read">共阅览${totalRead}本</div>` : ''}
                    <div class="friend-progress">
                        <div class="friend-progress-fill" style="width: ${friend.progress || 0}%"></div>
                    </div>
                </div>
            `;

            // 添加头像样式切换效果
            const avatarEl = div.querySelector('.friend-avatar');
            avatarEl.addEventListener('click', (e) => {
                e.stopPropagation();
                let styles = ['qq-style', 'qq-style-2', 'qq-style-3', 'qq-style-4', 'qq-style-5', 'qq-style-6', 'qq-style-7', 'qq-style-8', 'qq-style-9'];
                let currentIndex = styles.indexOf(avatarClass);
                const nextIndex = (currentIndex + 1) % styles.length;
                avatarEl.className = 'friend-avatar ' + styles[nextIndex];
                friend.avatar_style = styles[nextIndex];
            });

            container.appendChild(div);
        });
    }

    function renderLifeSharePosts() {
        const container = document.getElementById('life-share-posts');
        if (!container) return;

        container.innerHTML = '';
        if (postsData.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--text-muted);font-size:14px">还没有动态，点击右下角 + 发布第一条吧</div>';
            return;
        }
        postsData.forEach(post => {
            const postElement = createPostElement(post);
            container.appendChild(postElement);
        });

        const user = JSON.parse(localStorage.getItem('book_realm_user') || '{}');
        const avatar = document.getElementById('ls-user-avatar');
        const name = document.getElementById('ls-user-name');
        if (avatar) avatar.textContent = (user.nickname || '我')[0];
        if (name) name.textContent = user.nickname || '探索者';
    }

    function createPostElement(post) {
        const div = document.createElement('div');
        div.className = 'ls-post';

        const timeAgo = getTimeAgo(post.created_at);
        const avatarChar = post.nickname ? post.nickname[0] : (post.username ? post.username[0] : '?');
        const images = post.images || [];
        const imageCount = Math.min(images.length, 9);

        let imageHTML = '';
        if (imageCount > 0) {
            let colClass = 'col-1';
            if (imageCount === 2 || imageCount === 4) colClass = 'col-2';
            else if (imageCount >= 3) colClass = 'col-3';
            imageHTML = '<div class="ls-post-images ' + colClass + '">' +
                images.slice(0, 9).map(src => {
                    if (src && src.startsWith('data:')) {
                        return '<div class="ls-post-img-wrap"><img src="' + src + '" alt="" loading="lazy" /></div>';
                    }
                    return '<div class="ls-post-img-wrap"><div class="img-placeholder">🖼️</div></div>';
                }).join('') +
                '</div>';
        }

        div.innerHTML =
            '<div class="ls-post-header">' +
                '<div class="ls-post-avatar">' + avatarChar + '</div>' +
                '<div class="ls-post-meta">' +
                    '<div class="ls-post-name">' + (post.nickname || post.username || '探索者') + '</div>' +
                    '<div class="ls-post-time">' + timeAgo + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="ls-post-body">' + escapeHtml(post.content || '') + '</div>' +
            imageHTML +
            '<div class="ls-post-actions-row">' +
                '<button class="ls-act-btn like-btn' + (post.is_liked ? ' liked' : '') + '" data-id="' + post.id + '">' +
                    '<span class="act-icon">' + (post.is_liked ? '❤️' : '🤍') + '</span>' + (post.like_count || 0) +
                '</button>' +
                '<button class="ls-act-btn comment-btn" data-id="' + post.id + '">' +
                    '<span class="act-icon">💬</span>' + (post.comment_count || post.comments?.length || 0) +
                '</button>' +
            '</div>';

        const likeBtn = div.querySelector('.like-btn');
        const commentBtn = div.querySelector('.comment-btn');

        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePostLike(post, likeBtn);
            });
        }

        if (commentBtn) {
            commentBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openCommentModal(post);
            });
        }

        return div;
    }

    function escapeHtml(text) {
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    let currentCommentPost = null;

    function openCommentModal(post) {
        currentCommentPost = post;
        const modal = document.getElementById('ls-comment-modal');
        const list = document.getElementById('ls-comment-list');
        if (!modal || !list) return;

        if (!post.comments) post.comments = [];

        list.innerHTML = '';
        if (post.comments.length === 0) {
            list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);font-size:13px">还没有评论，来说点什么吧</div>';
        } else {
            post.comments.forEach((c, i) => {
                const item = document.createElement('div');
                item.className = 'ls-comment-item';
                item.innerHTML =
                    '<div class="ls-comment-avatar">' + (c.nickname || '?')[0] + '</div>' +
                    '<div class="ls-comment-body">' +
                        '<div class="ls-comment-name">' + (c.nickname || '书友') + '</div>' +
                        '<div class="ls-comment-text">' + escapeHtml(c.content || c.text || '') + '</div>' +
                        '<div class="ls-comment-time">' + getTimeAgo(c.created_at) + '</div>' +
                    '</div>';
                list.appendChild(item);
            });
        }

        const input = document.getElementById('ls-comment-input');
        if (input) input.value = '';
        modal.classList.remove('hidden');
    }

    function sendComment() {
        if (!currentCommentPost) return;
        const input = document.getElementById('ls-comment-input');
        if (!input || !input.value.trim()) return;

        const comment = {
            nickname: '我',
            content: input.value.trim(),
            created_at: new Date().toISOString()
        };

        if (!currentCommentPost.comments) currentCommentPost.comments = [];
        currentCommentPost.comments.push(comment);
        currentCommentPost.comment_count = currentCommentPost.comments.length;

        input.value = '';
        openCommentModal(currentCommentPost);
        renderLifeSharePosts();
    }

    async function togglePostLike(post, likeBtn) {
        try {
            const result = await apiRequest('/moments/' + post.id + '/like', { method: 'POST' });
            post.is_liked = result.liked ? 1 : 0;
            post.like_count = result.liked ? (post.like_count || 0) + 1 : Math.max(0, (post.like_count || 0) - 1);
        } catch (error) {
            post.is_liked = post.is_liked ? 0 : 1;
            post.like_count = post.is_liked ? (post.like_count || 0) + 1 : Math.max(0, (post.like_count || 0) - 1);
        }
        likeBtn.innerHTML = '<span class="act-icon">' + (post.is_liked ? '❤️' : '🤍') + '</span>' + post.like_count;
        likeBtn.classList.toggle('liked', !!post.is_liked);
    }

    function createLikeParticles(element) {
        const rect = element.getBoundingClientRect();
        const particles = 12;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'like-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 8px;
                height: 8px;
                background: linear-gradient(135deg, #ffd700, #ff6b6b, #a855f7);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: likeParticle 1s ease-out forwards;
            `;
            document.body.appendChild(particle);
            
            const angle = (i / particles) * Math.PI * 2;
            const distance = 40 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance - 60;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    function renderDiscussMessages(bookName) {
        const container = document.getElementById('discuss-messages');
        if (!container) return;

        container.innerHTML = '';
        const messages = threadsData[bookName] || [];

        if (messages.length === 0) {
            container.innerHTML = '<div class="bd-empty-state"><div class="bd-empty-icon">💬</div><p>还没有讨论，来说点什么吧</p></div>';
            return;
        }

        messages.forEach(function(msg, idx) {
            var card = document.createElement('div');
            card.className = 'bd-feed-item';
            var avatar = (msg.nickname || msg.username || '书友')[0];
            var comments = msg.comments || [];
            var commentsHTML = '';
            if (comments.length > 0) {
                commentsHTML = '<div class="bd-feed-comments">' +
                    comments.map(function(c) {
                        return '<div class="bd-feed-comment"><span class="bd-feed-comment-author">' + (c.nickname || '书友') + '：</span>' + (c.content || '') + '</div>';
                    }).join('') +
                    '</div>';
            }

            card.innerHTML =
                '<div class="bd-feed-header">' +
                    '<div class="bd-feed-avatar">' + avatar + '</div>' +
                    '<div class="bd-feed-meta">' +
                        '<div class="bd-feed-name">' + (msg.nickname || msg.username || '匿名书友') + '</div>' +
                        '<div class="bd-feed-time">' + getTimeAgo(msg.created_at) + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="bd-feed-body">' + (msg.content || '') + '</div>' +
                '<div class="bd-feed-actions">' +
                    '<button class="bd-feed-act like-discuss-btn' + (msg.is_liked ? ' liked' : '') + '" data-idx="' + idx + '">' +
                        (msg.is_liked ? '❤️' : '🤍') + ' ' + (msg.like_count || 0) +
                    '</button>' +
                    '<button class="bd-feed-act reply-discuss-btn" data-idx="' + idx + '">' +
                        '💬 ' + comments.length +
                    '</button>' +
                    '<button class="bd-feed-fav' + (isFaved(bookName, msg) ? ' faved' : '') + '" data-idx="' + idx + '">☆ 收藏</button>' +
                '</div>' +
                commentsHTML +
                '<div class="bd-comment-reply-input" style="display:none" data-idx="' + idx + '">' +
                    '<input type="text" class="bd-reply-input" placeholder="回复...">' +
                    '<button class="bd-reply-send-btn">发送</button>' +
                '</div>';

            // Like button
            var likeBtn = card.querySelector('.like-discuss-btn');
            if (likeBtn) {
                likeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    msg.is_liked = msg.is_liked ? 0 : 1;
                    msg.like_count = msg.is_liked ? (msg.like_count || 0) + 1 : Math.max(0, (msg.like_count || 0) - 1);
                    renderDiscussMessages(bookName);
                });
            }

            // Reply button
            var replyBtn = card.querySelector('.reply-discuss-btn');
            var replyInput = card.querySelector('.bd-comment-reply-input');
            if (replyBtn && replyInput) {
                replyBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    replyInput.style.display = replyInput.style.display === 'none' ? 'flex' : 'none';
                    if (replyInput.style.display === 'flex') replyInput.querySelector('input').focus();
                });
                var sendBtn = replyInput.querySelector('.bd-reply-send-btn');
                var input = replyInput.querySelector('input');
                if (sendBtn && input) {
                    sendBtn.addEventListener('click', function() {
                        if (!input.value.trim()) return;
                        if (!msg.comments) msg.comments = [];
                        msg.comments.push({ nickname: '我', content: input.value.trim() });
                        input.value = '';
                        renderDiscussMessages(bookName);
                    });
                }
            }

            // Fav button
            var favBtn = card.querySelector('.bd-feed-fav');
            if (favBtn) {
                favBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleFav(bookName, msg);
                });
            }

            container.appendChild(card);
        });
        container.scrollTop = container.scrollHeight;
    }

    function renderRecords() {
        const container = document.getElementById('record-list');
        const emptyEl = document.getElementById('record-empty');
        const countEl = document.getElementById('record-count');
        if (!container) return;

        container.innerHTML = '<div class="br-timeline-line"></div>';

        if (countEl) countEl.textContent = recordsData.length + ' 条记录';

        if (recordsData.length === 0) {
            if (emptyEl) emptyEl.style.display = 'flex';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';

        recordsData.forEach(record => {
            const emotionConfig = EMOTION_CONFIG[record.emotion_code] || EMOTION_CONFIG['GREEN_CALM'];
            const date = new Date(record.created_at);
            const dateStr = date.getFullYear() + '年' +
                (date.getMonth() + 1).toString().padStart(2, '0') + '月' +
                date.getDate().toString().padStart(2, '0') + '日 ' +
                date.getHours().toString().padStart(2, '0') + ':' +
                date.getMinutes().toString().padStart(2, '0');

            const node = document.createElement('div');
            node.className = 'br-node';
            node.innerHTML =
                '<div class="br-node-dot" style="border-color:' + emotionConfig.hex + '; color:' + emotionConfig.hex + '"></div>' +
                '<div class="br-node-card" style="border-left: 3px solid ' + emotionConfig.hex + '30">' +
                    '<div class="br-node-top">' +
                        '<div class="br-node-date">' +
                            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
                            dateStr +
                        '</div>' +
                        '<div class="br-node-mood" style="background:' + emotionConfig.hex + '20; color:' + emotionConfig.hex + '">' +
                            emotionConfig.icon + ' ' + emotionConfig.name +
                        '</div>' +
                    '</div>' +
                    '<div class="br-node-text">' + escapeHtml(record.content) + '</div>' +
                '</div>';
            container.appendChild(node);
        });
    }

    function updateEmotionSpectrum() {
        const spectrum = document.getElementById('emotion-spectrum');
        const legend = document.getElementById('spectrum-legend');
        if (!spectrum) return;

        let spectrumHtml = '';
        let legendHtml = '';
        Object.entries(emotionSpectrum).forEach(([code, data]) => {
            const config = EMOTION_CONFIG[code] || EMOTION_CONFIG['GREEN_CALM'];
            spectrumHtml +=
                '<div class="spectrum-segment"' +
                    ' style="width:' + data.percentage + '%; background:' + config.hex + '"' +
                    ' title="' + config.name + ': ' + (data.count || Math.round(data.percentage)) + '条">' +
                '</div>';
            legendHtml +=
                '<div class="spectrum-legend-item">' +
                    '<span class="spectrum-legend-dot" style="background:' + config.hex + '"></span>' +
                    config.name + ' ' + (data.count || Math.round(data.percentage)) + '%' +
                '</div>';
        });

        spectrum.innerHTML = spectrumHtml;
        if (legend) legend.innerHTML = legendHtml;
    }

    // ─── 情绪星球3D渲染 ──────────────────────────────────────
    function updateEmotionPlanet() {
        const recordStar = planetMeshes.find(p => p.userData.type === 'record');
        if (!recordStar || !recordStar.userData.group) return;

        const group = recordStar.userData.group;
        const dominantEmotion = getDominantEmotion();

        if (dominantEmotion) {
            const config = EMOTION_CONFIG[dominantEmotion];
            if (config) {
                // 更新星星组的点光源颜色
                group.children.forEach(child => {
                    if (child.isPointLight) {
                        child.color.setHex(config.color);
                    }
                });

                // 更新情绪粒子
                createEmotionParticles(recordStar, dominantEmotion);
            }
        }
    }

    function getDominantEmotion() {
        let maxPercentage = 0;
        let dominant = null;
        
        Object.entries(emotionSpectrum).forEach(([code, data]) => {
            if (data.percentage > maxPercentage) {
                maxPercentage = data.percentage;
                dominant = code;
            }
        });
        
        return dominant;
    }

    function createEmotionParticles(planet, emotionCode) {
        // 清除旧粒子
        emotionParticles.forEach(p => {
            if (p.parent) p.parent.remove(p);
            if (p.geometry) p.geometry.dispose();
            if (p.material) p.material.dispose();
        });
        emotionParticles = [];
        
        if (!emotionCode || !socialScene || !planet) return;
        
        const config = EMOTION_CONFIG[emotionCode];
        if (!config) return;
        
        // 创建粒子系统
        const particleCount = 50 + Math.round(config.intensity * 30);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const color = new THREE.Color(config.color);
        const radius = planet.geometry.parameters.radius * 1.5;
        
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = radius + (Math.random() - 0.5) * 0.5;
            
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = 0.05 + Math.random() * 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.position.copy(planet.position);
        particles.userData = { type: 'emotion', emotionCode };
        
        socialScene.add(particles);
        emotionParticles.push(particles);
    }

    function updateEmotionParticles(time) {
        emotionParticles.forEach(particles => {
            particles.rotation.y += 0.01;
            particles.rotation.x += 0.005;
            
            // 脉冲效果
            const intensity = EMOTION_CONFIG[particles.userData.emotionCode]?.intensity || 3;
            particles.material.opacity = 0.5 + Math.sin(time * 2) * 0.2 * intensity;
        });
    }

    // ─── 工具函数 ──────────────────────────────────────
    function getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return '刚刚';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}天前`;
        return date.toLocaleDateString('zh-CN');
    }

    // ─── 3D场景初始化 ──────────────────────────────────────
    function initSocialScene() {
        socialCanvas = document.getElementById('social-canvas');
        if (!socialCanvas) return;

        socialScene = new THREE.Scene();
        socialScene.fog = new THREE.FogExp2(0x0a0a25, 0.003);

        socialCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        socialCamera.position.set(0, 3, 16);

        socialRenderer = new THREE.WebGLRenderer({ canvas: socialCanvas, antialias: true, alpha: false });
        socialRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        socialRenderer.setSize(window.innerWidth, window.innerHeight);
        socialRenderer.setClearColor(0x0a0a20, 1);

        composer = new THREE.EffectComposer(socialRenderer);
        composer.addPass(new THREE.RenderPass(socialScene, socialCamera));
        bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.3, 0.1);
        composer.addPass(bloomPass);

        setupLights();
        createStarField();
        createNebulaClouds();
        createPlanets();
        setupEventListeners();
        loadFriendsData();
        loadPostsData();
        loadEmotionSpectrum();
        setupProfilePanel();
        animateSocial();
    }

    function setupLights() {
        const ambientLight = new THREE.AmbientLight(0x2a2a4e, 0.6);
        socialScene.add(ambientLight);

        const hemisphereLight = new THREE.HemisphereLight(0x6a6aaa, 0x1a1a3a, 0.4);
        socialScene.add(hemisphereLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
        keyLight.position.set(10, 10, 10);
        socialScene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x6366f1, 0.35);
        fillLight.position.set(-10, 5, 5);
        socialScene.add(fillLight);
    }

    function createStarField() {
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 3000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const radius = 50 + Math.random() * 150;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            const colorChoice = Math.random();
            if (colorChoice < 0.7) {
                colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
            } else if (colorChoice < 0.85) {
                colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1;
            } else {
                colors[i * 3] = 1; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.8;
            }
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        stars = new THREE.Points(starsGeometry, starsMaterial);
        socialScene.add(stars);
    }

    function createNebulaClouds() {
        const nebulaColors = [
            { r: 0.3, g: 0.2, b: 0.8 },
            { r: 0.8, g: 0.3, b: 0.5 },
            { r: 0.2, g: 0.6, b: 0.9 }
        ];

        nebulaColors.forEach((color, i) => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');

            const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
            gradient.addColorStop(0, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.3)`);
            gradient.addColorStop(0.5, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0.1)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 256, 256);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const sprite = new THREE.Sprite(material);
            const angle = (i / nebulaColors.length) * Math.PI * 2;
            sprite.position.set(
                Math.cos(angle) * 30,
                (Math.random() - 0.5) * 15,
                Math.sin(angle) * 30 - 20
            );
            sprite.scale.set(25 + Math.random() * 15, 25 + Math.random() * 15, 1);
            sprite.userData = { 
                basePosition: sprite.position.clone(),
                driftSpeed: 0.1 + Math.random() * 0.2,
                driftRange: 2 + Math.random() * 3
            };
            
            socialScene.add(sprite);
            nebulaClouds.push(sprite);
        });
    }

    // ─── 正三角形 ───
    const TRI_RADIUS = 7.5; // 中心到顶点距离
    const TRI_Y_OFFSET = 1.0; // 整体上移
    const TRI_VERTICES = [
        new THREE.Vector3(0, TRI_RADIUS + TRI_Y_OFFSET, 0),
        new THREE.Vector3(-TRI_RADIUS * 0.866, -TRI_RADIUS * 0.5 + TRI_Y_OFFSET, 0),
        new THREE.Vector3(TRI_RADIUS * 0.866, -TRI_RADIUS * 0.5 + TRI_Y_OFFSET, 0)
    ];

    function createPlanets() {
        const planetConfigs = [
            {
                name: '人生分享世界',
                desc: '分享你的生活点滴',
                color: 0x22c55e,
                position: TRI_VERTICES[0],
                type: 'life'
            },
            {
                name: '书籍交流世界',
                desc: '与书友畅聊好书',
                color: 0x3b82f6,
                position: TRI_VERTICES[1],
                type: 'book'
            },
            {
                name: '书籍记录世界',
                desc: '记录你的阅读感悟',
                color: 0x8b5cf6,
                position: TRI_VERTICES[2],
                type: 'record'
            }
        ];

        // 3D旋转枢轴
        socialPivotGroup = new THREE.Group();
        socialScene.add(socialPivotGroup);

        planetConfigs.forEach((config, index) => {
            const group = new THREE.Group();
            group.position.copy(config.position);

            const c = new THREE.Color(config.color);

            // 黑洞核心 - 纯黑球体
            const coreGeo = new THREE.SphereGeometry(1.2, 32, 32);
            const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const core = new THREE.Mesh(coreGeo, coreMat);
            group.add(core);

            // 事件视界 - 暗色外层
            const horizonGeo = new THREE.SphereGeometry(1.5, 32, 32);
            const horizonMat = new THREE.MeshBasicMaterial({
                color: 0x0a0a15,
                transparent: true,
                opacity: 0.7,
                depthWrite: false
            });
            const horizon = new THREE.Mesh(horizonGeo, horizonMat);
            group.add(horizon);

            // 吸积盘 - 彩色光环 (torus)
            const ringGeo = new THREE.TorusGeometry(2.0, 0.15, 16, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.9,
                depthWrite: false
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI * 0.3;
            ring.rotation.y = index * 0.5;
            group.add(ring);

            // 第二层光环 - 更大更淡
            const ring2Geo = new THREE.TorusGeometry(2.3, 0.08, 16, 64);
            const ring2Mat = new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.5,
                depthWrite: false
            });
            const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
            ring2.rotation.x = Math.PI * 0.6;
            ring2.rotation.y = index * 0.7 + 0.3;
            group.add(ring2);

            // 外发光晕
            const glowCanvas = document.createElement('canvas');
            glowCanvas.width = 128;
            glowCanvas.height = 128;
            const glowCtx = glowCanvas.getContext('2d');
            const gradient = glowCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(0.3, `rgba(${c.r*255},${c.g*255},${c.b*255},0.0)`);
            gradient.addColorStop(0.5, `rgba(${c.r*255},${c.g*255},${c.b*255},0.3)`);
            gradient.addColorStop(0.8, `rgba(${c.r*255},${c.g*255},${c.b*255},0.1)`);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            glowCtx.fillStyle = gradient;
            glowCtx.fillRect(0, 0, 128, 128);
            const glowTex = new THREE.CanvasTexture(glowCanvas);
            const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: glowTex,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            }));
            glowSprite.scale.set(10, 10, 1);
            group.add(glowSprite);

            // 可见的点击目标球体（辅助 raycasting，较大范围）
            const hitGeo = new THREE.SphereGeometry(2.0, 16, 16);
            const hitMat = new THREE.MeshBasicMaterial({
                visible: true,
                transparent: true,
                opacity: 0,
                depthWrite: false
            });
            const hitMesh = new THREE.Mesh(hitGeo, hitMat);
            hitMesh.userData = {
                name: config.name,
                desc: config.desc,
                type: config.type,
                basePosition: config.position.clone(),
                index: index,
                isStar: true,
                group: group,
                starColor: config.color
            };
            group.add(hitMesh);

            // PointLight
            const pointLight = new THREE.PointLight(config.color, 1.8, 30);
            group.add(pointLight);

            socialPivotGroup.add(group);
            planetMeshes.push(hitMesh);

            // 创建标签 - 加入pivot以跟随旋转
            createStarLabel(config, index);

            // 存储 group 用于动画
            (function() {
                const g = group;
                planetDustSystems.push(g);
            })();
        });
    }

    function createStarLabel(config, index) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.shadowColor = '#' + config.color.toString(16).padStart(6, '0');
        ctx.shadowBlur = 25;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.name, 256, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.95,
            depthWrite: false
        });

        const label = new THREE.Sprite(material);
        label.position.set(
            config.position.x,
            config.position.y + 5.0,
            config.position.z
        );
        label.scale.set(6.0, 1.5, 1);
        label.userData = { 
            basePosition: label.position.clone(),
            index: index
        };
        
        socialPivotGroup.add(label);
        planetLabels.push(label);
    }

    // ─── 跃迁动画 ──────────────────────────────────────
    function startWarpAnimation(direction) {
        isWarping = true;
        warpDirection = direction;
        warpProgress = 0;
    }

    function updateWarpAnimation(dt) {
        if (!isWarping) return;

        warpProgress += dt * 0.8;

        if (warpDirection === 'in') {
            const progress = Math.min(1, warpProgress);
            const ease = 1 - Math.pow(1 - progress, 3);
            
            socialCamera.position.z = 60 - ease * 30;
            socialCamera.position.y = 10 - ease * 5;
            bloomPass.strength = 1.5 - ease * 1;

            if (progress >= 1) {
                isWarping = false;
                bloomPass.strength = 0.5;
            }
        } else {
            const progress = Math.min(1, warpProgress);
            const ease = Math.pow(progress, 3);
            
            socialCamera.position.z = 30 + ease * 30;
            socialCamera.position.y = 5 + ease * 5;
            bloomPass.strength = 0.5 + ease * 1;

            if (progress >= 1) {
                isWarping = false;
                hideSocialScreen();
            }
        }
    }

    // ─── 视差效果 ──────────────────────────────────────
    function updateParallax() {
        targetMouseX += (mouseX - targetMouseX) * 0.05;
        targetMouseY += (mouseY - targetMouseY) * 0.05;

        const parallaxX = targetMouseX * 0.3;
        const parallaxY = targetMouseY * 0.2;

        if (stars) {
            stars.rotation.y += 0.0001;
            stars.position.x = parallaxX * 0.1;
            stars.position.y = parallaxY * 0.1;
        }

        nebulaClouds.forEach((cloud) => {
            const basePos = cloud.userData.basePosition;
            const drift = Math.sin(Date.now() * 0.001 * cloud.userData.driftSpeed) * cloud.userData.driftRange;
            cloud.position.x = basePos.x + parallaxX * 0.2 + drift;
            cloud.position.y = basePos.y + parallaxY * 0.2;
        });

        planetMeshes.forEach((star) => {
            if (star.userData.isStar && star.userData.group) {
                const group = star.userData.group;
                const bp = star.userData.basePosition;
                group.position.x = bp.x + parallaxX * 0.3;
                group.position.y = bp.y + parallaxY * 0.3;
            }
        });

        // 情绪粒子跟随
        emotionParticles.forEach(particles => {
            const star = planetMeshes.find(p => p.userData.type === 'record');
            if (star && star.userData.group) {
                const pos = star.userData.group.position;
                particles.position.copy(pos);
            }
        });
    }

    // ─── 行星交互 ──────────────────────────────────────
    function checkPlanetHover(mouse) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, socialCamera);
        
        const intersects = raycaster.intersectObjects(planetMeshes);
        
        if (intersects.length > 0) {
            const planet = intersects[0].object;
            if (hoverPlanet !== planet) {
                hoverPlanet = planet;
                document.body.style.cursor = 'pointer';
                
                planetLabels.forEach(label => {
                    if (label.userData.index === planet.userData.index) {
                        label.material.opacity = 1;
                    }
                });
            }
        } else {
            if (hoverPlanet) {
                document.body.style.cursor = 'default';
                planetLabels.forEach(label => {
                    label.material.opacity = 0.9;
                });
                hoverPlanet = null;
            }
        }
    }

    function handlePlanetClick(planet) {
        selectedPlanet = planet;
        
        switch(planet.userData.type) {
            case 'life':
                showLifeShareModal();
                break;
            case 'book':
                showBookDiscussModal();
                break;
            case 'record':
                showBookRecordModal();
                break;
        }
    }

    // ─── 动画循环 ──────────────────────────────────────
    function animateSocial() {
        socialAnimationId = requestAnimationFrame(animateSocial);

        const dt = 0.016;
        const time = Date.now() * 0.001;

        updateWarpAnimation(dt);
        updateParallax();

        // 星星呼吸动画 & 悬停缩放
        planetMeshes.forEach((star, i) => {
            if (star.userData.isStar) {
                const group = star.userData.group;
                if (group) {
                    const breath = 1 + Math.sin(time * 1.8 + i * 2.0) * 0.04;
                    group.scale.setScalar(breath);

                    // 旋转吸积盘环
                    group.children.forEach(function(child) {
                        if (child.geometry && child.geometry.type === 'TorusGeometry') {
                            child.rotation.z += dt * 0.3;
                        }
                    });

                    if (hoverPlanet === star) {
                        const target = 1.15;
                        const current = group.scale.x;
                        group.scale.setScalar(current + (target - current) * 0.15);
                    }
                }
            }
        });

        // 标签跟随
        planetLabels.forEach((label, i) => {
            const star = planetMeshes[i];
            if (star && star.userData.basePosition) {
                const bp = star.userData.basePosition;
                const group = star.userData.group;
                const s = group ? group.scale.x : 1;
                label.position.set(
                    bp.x + targetMouseX * 0.3,
                    bp.y + 5.0 * s,
                    bp.z + targetMouseY * 0.3
                );
            }
        });

        // 更新情绪粒子
        updateEmotionParticles(time);

        composer.render();
    }

    // ─── 事件处理 ──────────────────────────────────────
    function onSocialCanvasClick(e) {
        if (!socialScene || !socialCamera) return;
        var mouse = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
        );
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, socialCamera);
        var hits = raycaster.intersectObjects(planetMeshes);
        if (hits.length > 0) {
            var obj = hits[0].object;
            if (obj.userData && obj.userData.isStar) {
                handlePlanetClick(obj);
            }
        }
    }


    function setupEventListeners() {
        if (docMouseMoveHandler) document.removeEventListener('mousemove', docMouseMoveHandler);
        if (docClickHandler) document.removeEventListener('click', docClickHandler);
        if (docResizeHandler) window.removeEventListener('resize', docResizeHandler);

        docMouseMoveHandler = function(e) {
            if (!socialScene || !socialCamera) return;
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

            const mouse = new THREE.Vector2(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1
            );
            checkPlanetHover(mouse);
        };

        docClickHandler = function(e) {
            if (!socialScene || !hoverPlanet) return;
            var target = e.target;
            if (target.closest('.social-modal') || target.closest('.friend-item') ||
                target.closest('#social-functions-panel') || target.closest('#social-friends-panel')) return;
            handlePlanetClick(hoverPlanet);
        };

        docResizeHandler = onSocialResize;

        document.addEventListener('mousemove', docMouseMoveHandler);
        document.addEventListener('click', docClickHandler);
        window.addEventListener('resize', docResizeHandler);

        var planetsArea = document.getElementById('social-planets-area');
        if (planetsArea) {
            planetsArea.removeEventListener('click', onSocialCanvasClick);
            planetsArea.addEventListener('click', onSocialCanvasClick);
        }
    }

    function onSocialResize() {
        if (!socialCamera || !socialRenderer) return;
        
        socialCamera.aspect = window.innerWidth / window.innerHeight;
        socialCamera.updateProjectionMatrix();
        socialRenderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    }

    // ─── 界面控制 ──────────────────────────────────────
    function showSocialScreen(nebulaType) {
        currentNebulaType = nebulaType;
        
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        var socialScreenEl = document.getElementById('social-screen');
        if (socialScreenEl) {
            socialScreenEl.classList.add('active');
        }
        
        updateSocialBackground(nebulaType);
        
        setTimeout(() => {
            initSocialScene();
            startWarpAnimation('in');
            connectWebSocket();
        }, 100);
    }

    function hideSocialScreen() {
        const savedNebulaType = currentNebulaType;
        destroySocialScene();
        
        document.getElementById('social-screen').classList.remove('active');
        document.getElementById('book-screen').classList.add('active');
        
        setTimeout(() => {
            if (typeof window.initConstellation === 'function' && savedNebulaType) {
                window.initConstellation(savedNebulaType);
            }
        }, 100);
        
        currentNebulaType = null;
        
        if (ws) {
            ws.close();
            ws = null;
        }
    }

    function updateSocialBackground(nebulaType) {
        const colors = {
            scifi: { primary: [74, 144, 226], secondary: [123, 104, 238], accent: [56, 189, 248] },
            xianxia: { primary: [243, 156, 18], secondary: [230, 126, 34], accent: [245, 158, 11] },
            romance: { primary: [233, 30, 99], secondary: [255, 107, 157], accent: [236, 72, 153] }
        };
        
        const colorSet = colors[nebulaType] || colors.scifi;
        const [r1, g1, b1] = colorSet.primary;
        const [r2, g2, b2] = colorSet.secondary;
        const [r3, g3, b3] = colorSet.accent;

        const socialScreen = document.getElementById('social-screen');
        if (socialScreen) {
            socialScreen.style.background = '#f0f0f5';
        }
    }

    function destroySocialScene() {
        if (socialAnimationId) {
            cancelAnimationFrame(socialAnimationId);
            socialAnimationId = null;
        }

        // 移除document级别的事件监听
        if (docMouseMoveHandler) {
            document.removeEventListener('mousemove', docMouseMoveHandler);
            docMouseMoveHandler = null;
        }
        if (docClickHandler) {
            document.removeEventListener('click', docClickHandler);
            docClickHandler = null;
        }
        if (docResizeHandler) {
            window.removeEventListener('resize', docResizeHandler);
            docResizeHandler = null;
        }

        if (composer) {
            composer.dispose && composer.dispose();
            composer = null;
        }

        if (socialRenderer) {
            socialRenderer.dispose();
            socialRenderer = null;
        }

        if (socialScene) {
            socialScene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (obj.material.map) obj.material.map.dispose();
                    obj.material.dispose();
                }
            });
            socialScene = null;
        }

        socialCamera = null;
        planetMeshes = [];
        planetRings = [];
        planetLabels = [];
        planetDustSystems = [];
        nebulaClouds = [];
        emotionParticles = [];
        socialPivotGroup = null;
        centralStar = null;
        stars = null;
        hoverPlanet = null;
        selectedPlanet = null;
    }

    // ─── 人生分享世界 ──────────────────────────────────────
    function showLifeShareModal() {
        const modal = document.getElementById('life-share-modal');
        if (modal) {
            modal.classList.remove('hidden');
            renderLifeSharePosts();
        }
    }

    // ─── 书籍交流世界 ──────────────────────────────────────
    function showBookDiscussModal() {
        const modal = document.getElementById('book-discuss-modal');
        if (modal) {
            modal.classList.remove('hidden');
            const inputWrap = document.getElementById('book-discuss-input-wrap');
            const discussArea = document.getElementById('book-discuss-area');
            if (inputWrap) inputWrap.classList.remove('hidden');
            if (discussArea) discussArea.classList.add('hidden');
            loadFavorites();
            renderFavorites();
        }
    }

    function handleBookDiscussSearch() {
        const input = document.getElementById('book-discuss-search');
        if (!input || !input.value.trim()) return;

        const bookName = input.value.trim();
        currentDiscussBook = bookName;
        const inputWrap = document.getElementById('book-discuss-input-wrap');
        const discussArea = document.getElementById('book-discuss-area');
        const bookTitle = document.getElementById('discuss-book-title');
        const bookAuthor = document.getElementById('bd-book-author');
        const emptyState = discussArea ? discussArea.querySelector('.bd-empty-state') : null;

        if (inputWrap) inputWrap.classList.add('hidden');
        if (discussArea) discussArea.classList.remove('hidden');
        if (bookTitle) bookTitle.textContent = '《' + bookName + '》';
        if (bookAuthor) bookAuthor.textContent = '书友讨论区';

        if (!threadsData[bookName]) {
            threadsData[bookName] = [];
        }

        renderDiscussMessages(bookName);
    }

    let currentDiscussBook = '';

    function backToBookSearch() {
        const inputWrap = document.getElementById('book-discuss-input-wrap');
        const discussArea = document.getElementById('book-discuss-area');
        if (inputWrap) inputWrap.classList.remove('hidden');
        if (discussArea) discussArea.classList.add('hidden');
    }

    function handleDiscussSend() {
        const input = document.getElementById('discuss-input');
        if (!input || !input.value.trim()) return;

        const bookName = currentDiscussBook;
        if (!bookName) return;

        const newMessage = {
            nickname: '我',
            content: input.value.trim(),
            created_at: new Date().toISOString(),
            like_count: 0,
            comments: []
        };

        if (!threadsData[bookName]) {
            threadsData[bookName] = [];
        }
        threadsData[bookName].push(newMessage);

        input.value = '';
        renderDiscussMessages(bookName);
    }

    // ─── 书籍记录世界 ──────────────────────────────────────
    function showBookRecordModal() {
        const modal = document.getElementById('book-record-modal');
        if (modal) {
            modal.classList.remove('hidden');
            loadRecordsLocal();
            renderRecords();
            recalculateLocalSpectrum();
            loadRecordsData();
        }
    }

    async function loadRecordsData() {
        try {
            recordsData = await apiRequest('/emotional-logs');
            saveRecordsLocal();
            renderRecords();
            loadEmotionSpectrum();
        } catch (error) {
            console.log('使用本地记录数据');
            loadRecordsLocal();
            renderRecords();
            recalculateLocalSpectrum();
        }
    }

    async function handleRecordSubmit() {
        const input = document.getElementById('record-input');
        if (!input || !input.value.trim()) return;

        const selectedEmotion = document.querySelector('.br-emo-btn.active');
        const emotionCode = selectedEmotion ? selectedEmotion.dataset.emotion : 'GREEN_CALM';

        try {
            await apiRequest('/emotional-logs', {
                method: 'POST',
                body: JSON.stringify({
                    content: input.value.trim(),
                    emotion_code: emotionCode,
                    emotion_intensity: 3
                })
            });
        } catch (error) {
            console.log('本地模拟保存');
        }

        const newRecord = {
            id: recordsData.length + 1,
            content: input.value.trim(),
            emotion_code: emotionCode,
            created_at: new Date().toISOString()
        };

        recordsData.unshift(newRecord);
        input.value = '';

        saveRecordsLocal();
        recalculateLocalSpectrum();
        renderRecords();
        document.getElementById('br-write-modal').classList.add('hidden');
        document.getElementById('book-record-modal').classList.remove('hidden');
    }

    function saveRecordsLocal() {
        try { localStorage.setItem('bookEmu_records', JSON.stringify(recordsData)); } catch(e) {}
    }
    function loadRecordsLocal() {
        try {
            var saved = localStorage.getItem('bookEmu_records');
            if (saved) recordsData = JSON.parse(saved);
        } catch(e) { recordsData = []; }
    }

    // ─── 聊天相关 ──────────────────────────────────────
    let currentChatFriend = null;
    let chatMessages = [];

    function openChatModal(friend) {
        currentChatFriend = friend;
        chatMessages = [];

        const modal = document.getElementById('chat-modal');
        const avatar = document.getElementById('chat-peer-avatar');
        const name = document.getElementById('chat-peer-name');
        const status = document.getElementById('chat-peer-status');
        const messagesEl = document.getElementById('chat-messages');

        if (avatar) avatar.textContent = friend.nickname ? friend.nickname[0] : '?';
        if (name) name.textContent = friend.nickname || friend.username || '好友';
        if (status) {
            status.textContent = friend.online_status ? '在线' : '离线';
            status.className = 'chat-peer-status' + (friend.online_status ? ' online' : '');
        }
        if (messagesEl) messagesEl.innerHTML = '<div class="chat-empty">开始和TA聊天吧 ✨</div>';

        if (modal) modal.classList.remove('hidden');
    }

    function sendChatMessage() {
        const input = document.getElementById('chat-input');
        const messagesEl = document.getElementById('chat-messages');
        if (!input || !messagesEl || !input.value.trim()) return;

        const text = input.value.trim();
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

        const emptyEl = messagesEl.querySelector('.chat-empty');
        if (emptyEl) emptyEl.remove();

        const msg = document.createElement('div');
        msg.className = 'chat-msg mine';
        msg.innerHTML = text + '<span class="chat-msg-time">' + timeStr + '</span>';
        messagesEl.appendChild(msg);

        chatMessages.push({ text, mine: true, time: now });
        input.value = '';
        messagesEl.scrollTop = messagesEl.scrollHeight;

        if (ws && ws.readyState === WebSocket.OPEN && currentChatFriend) {
            ws.send(JSON.stringify({
                type: 'chat_message',
                toUserId: currentChatFriend.id,
                content: text
            }));
        }

        setTimeout(() => {
            const reply = document.createElement('div');
            reply.className = 'chat-msg theirs';
            reply.innerHTML = (currentChatFriend.nickname || '好友') + ' 正在思考中...' + '<span class="chat-msg-time">' + timeStr + '</span>';
            messagesEl.appendChild(reply);
            messagesEl.scrollTop = messagesEl.scrollHeight;

            setTimeout(() => {
                reply.innerHTML = '收到~' + '<span class="chat-msg-time">' + timeStr + '</span>';
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }, 1200);
        }, 600);
    }

    function bindFriendClicks() {
        const container = document.getElementById('friends-list');
        if (!container) return;
        container.addEventListener('click', (e) => {
            const item = e.target.closest('.friend-item');
            if (!item) return;
            const idx = Array.from(container.children).indexOf(item);
            const friend = friendsData[idx] || {
                nickname: item.querySelector('.friend-name')?.textContent || '好友',
                online_status: item.classList.contains('online')
            };
            openChatModal(friend);
        });
    }

    // ─── 事件绑定 ──────────────────────────────────────
    function bindEvents() {
        const backBtn = document.getElementById('social-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                startWarpAnimation('out');
            });
        }

        const lsFabBtn = document.getElementById('ls-fab-btn');
        if (lsFabBtn) {
            lsFabBtn.addEventListener('click', () => {
                selectedImages = [];
                renderImagePreview();
                const input = document.getElementById('life-share-input');
                if (input) input.value = '';
                document.getElementById('life-share-modal').classList.add('hidden');
                document.getElementById('ls-post-modal').classList.remove('hidden');
            });
        }

        const lsPostBack = document.getElementById('ls-post-back');
        if (lsPostBack) {
            lsPostBack.addEventListener('click', () => {
                document.getElementById('ls-post-modal').classList.add('hidden');
                document.getElementById('life-share-modal').classList.remove('hidden');
            });
        }

        const lsPostClose = document.getElementById('ls-post-close');
        if (lsPostClose) {
            lsPostClose.addEventListener('click', () => {
                document.getElementById('ls-post-modal').classList.add('hidden');
                document.getElementById('life-share-modal').classList.remove('hidden');
            });
        }

        const lifeShareSubmit = document.getElementById('life-share-submit');
        if (lifeShareSubmit) {
            lifeShareSubmit.addEventListener('click', () => handleLifeShareSubmit());
        }

        const imgInput = document.getElementById('ls-img-input');
        if (imgInput) {
            imgInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files || []);
                files.forEach(file => {
                    if (selectedImages.length >= 9) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        selectedImages.push(ev.target.result);
                        renderImagePreview();
                    };
                    reader.readAsDataURL(file);
                });
                imgInput.value = '';
            });
        }

        const lsCommentBack = document.getElementById('ls-comment-back');
        if (lsCommentBack) {
            lsCommentBack.addEventListener('click', () => {
                document.getElementById('ls-comment-modal').classList.add('hidden');
            });
        }

        const lsCommentSend = document.getElementById('ls-comment-send');
        if (lsCommentSend) {
            lsCommentSend.addEventListener('click', sendComment);
        }

        const lsCommentInput = document.getElementById('ls-comment-input');
        if (lsCommentInput) {
            lsCommentInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') sendComment();
            });
        }

        const bookDiscussSearchBtn = document.getElementById('book-discuss-search-btn');
        if (bookDiscussSearchBtn) {
            bookDiscussSearchBtn.addEventListener('click', handleBookDiscussSearch);
        }

        const bookDiscussInput = document.getElementById('book-discuss-search');
        if (bookDiscussInput) {
            bookDiscussInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') handleBookDiscussSearch();
            });
        }

        const bdBackSearch = document.getElementById('bd-back-search');
        if (bdBackSearch) {
            bdBackSearch.addEventListener('click', backToBookSearch);
        }

        const discussSendBtn = document.getElementById('discuss-send-btn');
        if (discussSendBtn) {
            discussSendBtn.addEventListener('click', handleDiscussSend);
        }

        const discussInput = document.getElementById('discuss-input');
        if (discussInput) {
            discussInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') handleDiscussSend();
            });
        }

        const brWriteBtn = document.getElementById('br-write-btn');
        if (brWriteBtn) {
            brWriteBtn.addEventListener('click', () => {
                document.getElementById('book-record-modal').classList.add('hidden');
                document.getElementById('br-write-modal').classList.remove('hidden');
            });
        }

        const brWriteBack = document.getElementById('br-write-back');
        if (brWriteBack) {
            brWriteBack.addEventListener('click', () => {
                document.getElementById('br-write-modal').classList.add('hidden');
                document.getElementById('book-record-modal').classList.remove('hidden');
            });
        }

        const brWriteClose = document.getElementById('br-write-close');
        if (brWriteClose) {
            brWriteClose.addEventListener('click', () => {
                document.getElementById('br-write-modal').classList.add('hidden');
                document.getElementById('book-record-modal').classList.remove('hidden');
            });
        }

        const recordSubmit = document.getElementById('record-submit');
        if (recordSubmit) {
            recordSubmit.addEventListener('click', () => handleRecordSubmit());
        }

        document.querySelectorAll('.br-emo-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.br-emo-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.social-modal');
                if (modal) modal.classList.add('hidden');
            });
        });

        document.querySelectorAll('.modal-back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.social-modal');
                if (modal) modal.classList.add('hidden');
            });
        });

        const chatSendBtn = document.getElementById('chat-send-btn');
        if (chatSendBtn) {
            chatSendBtn.addEventListener('click', sendChatMessage);
        }

        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') sendChatMessage();
            });
        }

        bindFriendClicks();
    }

    async function handleLifeShareSubmit() {
        const input = document.getElementById('life-share-input');
        if (!input || !input.value.trim()) return;

        const imageDataUrls = Array.from(selectedImages);

        try {
            const result = await apiRequest('/moments', {
                method: 'POST',
                body: JSON.stringify({ content: input.value.trim(), images: imageDataUrls })
            });
            postsData.unshift(result);
        } catch (error) {
            console.log('本地模拟发布');
            const newPost = {
                id: postsData.length + 1,
                nickname: '我',
                content: input.value.trim(),
                images: imageDataUrls,
                created_at: new Date().toISOString(),
                like_count: 0,
                comment_count: 0,
                comments: [],
                is_liked: 0
            };
            postsData.unshift(newPost);
        }

        input.value = '';
        selectedImages = [];
        renderImagePreview();
        document.getElementById('ls-post-modal').classList.add('hidden');
        document.getElementById('life-share-modal').classList.remove('hidden');
        renderLifeSharePosts();
    }

    let selectedImages = [];

    function renderImagePreview() {
        const preview = document.getElementById('ls-img-preview');
        if (!preview) return;
        preview.innerHTML = '';
        selectedImages.forEach((url, i) => {
            const item = document.createElement('div');
            item.className = 'ls-img-preview-item';
            item.innerHTML =
                '<img src="' + url + '" alt="" />' +
                '<button class="remove-img" data-idx="' + i + '">&times;</button>';
            item.querySelector('.remove-img').addEventListener('click', () => {
                selectedImages.splice(i, 1);
                renderImagePreview();
            });
            preview.appendChild(item);
        });
    }

    // ─── 公开API ──────────────────────────────────────
    window.showSocialScreen = showSocialScreen;
    window.hideSocialScreen = hideSocialScreen;
    window.destroySocialScene = destroySocialScene;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindEvents);
    } else {
        bindEvents();
    }

    console.log('%c✦ 探索人生模块 v3.0 已加载 (API + WebSocket + 情绪星球)', 'color:#a855f7;font-size:12px');
})();
