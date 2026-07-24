/**
 * 鎺㈢储浜虹敓浜ゅ弸涓栫晫妯″潡 v3.0
 * 瀹炵幇绉戝够娴极涓讳箟椋庢牸鐨?D绀句氦瀹囧畽
 * 鍖呭惈锛欰PI瀵规帴銆乄ebSocket瀹炴椂鍚屾銆佹儏缁槦鐞?D娓叉煋
 */
window.__social_loaded__ = 1;
window.__social_error__ = 'none';
try {
(function() {
    window.__social_loaded__ = 2;
    // 鈹€鈹€鈹€ 鍏ㄥ眬鐘舵€?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
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
    
    // 3D瀵硅薄
    let stars = null;
    let nebulaClouds = [];
    let planetMeshes = [];
    let planetRings = [];
    let planetLabels = [];
    let planetDustSystems = [];
    let centralStar = null;
    let emotionParticles = []; // 鎯呯华绮掑瓙绯荤粺
    
    // 鍔ㄧ敾鐘舵€?    let warpProgress = 0;
    let isWarping = false;
    let warpDirection = 'in';
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let hoverPlanet = null;
    let selectedPlanet = null;
    
    // API鐘舵€?    let authToken = localStorage.getItem('book_realm_token') || null;
    let currentUser = null;
    let ws = null;
    let wsReconnectAttempts = 0;
    const MAX_WS_RECONNECT = 5;
    
    // 鏁版嵁缂撳瓨
    let friendsData = [];
    let postsData = [];
    let threadsData = [];
    let recordsData = [];
    let emotionSpectrum = {};
    
    // 鈹€鈹€鈹€ 鎯呯华閰嶇疆 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    const EMOTION_CONFIG = {
        'RED_EXCITED': { color: 0xff4757, hex: '#ff4757', icon: '馃挮', name: '闇囨捈', intensity: 1.0 },
        'PINK_LOVE': { color: 0xff6b81, hex: '#ff6b81', icon: '馃ス', name: '鎰熷姩', intensity: 0.9 },
        'ORANGE_HAPPY': { color: 0xffa502, hex: '#ffa502', icon: '馃槉', name: '寮€蹇?, intensity: 0.85 },
        'BLUE_THINK': { color: 0x1e90ff, hex: '#1e90ff', icon: '馃', name: '鎬濊€?, intensity: 0.7 },
        'BLUE_SAD': { color: 0x70a1ff, hex: '#70a1ff', icon: '馃槩', name: '蹇т激', intensity: 0.6 },
        'GREEN_CALM': { color: 0x2ed573, hex: '#2ed573', icon: '馃崈', name: '骞抽潤', intensity: 0.5 },
        'ORANGE_EXCITE': { color: 0xff7f50, hex: '#ff7f50', icon: '馃ぉ', name: '鍏村', intensity: 0.95 },
        'PURPLE_WISDOM': { color: 0xa855f7, hex: '#a855f7', icon: '馃挕', name: '鎰熸偀', intensity: 0.75 }
    };

    // 鈹€鈹€鈹€ API璇锋眰灏佽 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
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
                throw new Error(error.error || '璇锋眰澶辫触');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API璇锋眰閿欒:', error);
            throw error;
        }
    }

    // 鈹€鈹€鈹€ WebSocket杩炴帴 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    function connectWebSocket() {
        if (!authToken) return;
        
        ws = new WebSocket('ws://localhost:3000');
        
        ws.onopen = () => {
            console.log('WebSocket杩炴帴鎴愬姛');
            wsReconnectAttempts = 0;
            
            // 鍙戦€佽璇?            ws.send(JSON.stringify({
                type: 'auth',
                token: authToken
            }));
        };
        
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleWebSocketMessage(message);
        };
        
        ws.onclose = () => {
            console.log('WebSocket杩炴帴鍏抽棴');
            if (wsReconnectAttempts < MAX_WS_RECONNECT) {
                setTimeout(() => {
                    wsReconnectAttempts++;
                    connectWebSocket();
                }, 3000 * wsReconnectAttempts);
            }
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket閿欒:', error);
        };
    }

    function handleWebSocketMessage(message) {
        switch(message.type) {
            case 'auth_success':
                console.log('WebSocket璁よ瘉鎴愬姛');
                break;
            case 'new_post':
                // 鏂板姩鎬?                postsData.unshift(message.data);
                if (document.getElementById('life-share-modal') && !document.getElementById('life-share-modal').classList.contains('hidden')) {
                    renderLifeSharePosts();
                }
                break;
            case 'new_comment':
                // 鏂拌瘎璁?                const post = postsData.find(p => p.id == message.data.post_id);
                if (post) {
                    post.comment_count = (post.comment_count || 0) + 1;
                }
                break;
            case 'new_reply':
                // 鏂板洖澶?                if (document.getElementById('book-discuss-modal') && !document.getElementById('book-discuss-modal').classList.contains('hidden')) {
                    const bookTitle = document.getElementById('discuss-book-title')?.textContent?.replace(/[銆娿€媇/g, '');
                    if (bookTitle) {
                        renderDiscussMessages(bookTitle);
                    }
                }
                break;
            case 'user_online':
            case 'user_offline':
                // 鐢ㄦ埛涓婁笅绾?                const friend = friendsData.find(f => f.id === message.data.user_id);
                if (friend) {
                    friend.online_status = message.type === 'user_online' ? 1 : 0;
                    renderFriendsList();
                }
                break;
            case 'notification':
                // 閫氱煡
                showNotification(message.data);
                break;
        }
    }

    function sendWSMessage(message) {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify(message));
        }
    }

    // 鈹€鈹€鈹€ 閫氱煡绯荤粺 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    function showNotification(data) {
        const notification = document.createElement('div');
        notification.className = 'ws-notification';
        notification.innerHTML = `
            <div class="notification-icon">${data.type === 'like' ? '鉁? : '馃挰'}</div>
            <div class="notification-content">${data.content}</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 鈹€鈹€鈹€ 鏁版嵁鍔犺浇 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    async function loadFriendsData() {
        try {
            friendsData = await apiRequest('/friends');
            renderFriendsList();
        } catch (error) {
            console.log('浣跨敤妯℃嫙濂藉弸鏁版嵁');
            // QQ椋庢牸澶村儚鍗￠€氫汉鐗╂暟鎹?            friendsData = [
                { id: 1, nickname: '钀岃悓灏忎功铏?, username: 'MoeBookworm', online_status: true, current_book: '銆婁笁浣撱€?, progress: 85, avatar_style: 'qq-style-1', rank: '閽荤煶', total_read: 127 },
                { id: 2, nickname: '闃冲厜涔?Boy', username: 'SunnyReader', online_status: true, current_book: '銆婁笁浣撱€?, progress: 60, avatar_style: 'qq-style-2', rank: '榛勯噾', total_read: 89 },
                { id: 3, nickname: '澶滅尗鏅氳', username: 'NightOwlRead', online_status: false, current_book: '銆婁汉鎬т箣鍏夈€?, progress: 15, avatar_style: 'qq-style-3', rank: '鐧介摱', total_read: 67 },
                { id: 4, nickname: '鎮犳偁涔︽捣', username: 'SeaOfBooks', online_status: true, current_book: '銆婂洿鍩庛€?, progress: 30, avatar_style: 'qq-style-4', rank: '闈掗摐', total_read: 45 },
                { id: 5, nickname: '涔﹂灏戝コ', username: 'BookGirl', online_status: true, current_book: '銆婃矙涓樸€?, progress: 95, avatar_style: 'qq-style-5', rank: '閽荤煶', total_read: 154 },
                { id: 6, nickname: '灏忛獜椹?, username: 'LittleCamel', online_status: false, current_book: null, progress: 0, avatar_style: 'qq-style-6', rank: '閾滅墝', total_read: 12 },
                { id: 7, nickname: '鐤媯涔﹁糠', username: 'BookCrazy', online_status: true, current_book: '銆婂北娴风粡銆?, progress: 70, avatar_style: 'qq-style-7', rank: '澶у笀', total_read: 235 },
                { id: 8, nickname: '瀹夐潤鐨勭伒榄?, username: 'QuietSoul', online_status: true, current_book: '銆婃椿鐫€銆?, progress: 40, avatar_style: 'qq-style-8', rank: '鍒濆', total_read: 31 },
                { id: 9, nickname: '杩芥ⅵ灏戝勾', username: 'DreamChaser', online_status: false, current_book: '銆婄櫨骞村鐙€?, progress: 25, avatar_style: 'qq-style-9', rank: '杩涢樁', total_read: 78 }
            ];
            renderFriendsList();
        }
    }
    }

    async function loadPostsData() {
        try {
            postsData = await apiRequest('/moments');
            renderLifeSharePosts();
        } catch (error) {
            console.log('浣跨敤妯℃嫙鍔ㄦ€佹暟鎹?);
            postsData = [
                {
                    id: 1, nickname: '涔﹂闂ㄧ',
                    content: '浠婂ぉ璇诲畬浜嗐€婁笁浣撱€嬶紝闇囨捈浜哄績锛侀粦鏆楁．鏋楁硶鍒欑湡鐨勮浜虹粏鎬濇瀬鎭愩€傚畤瀹欑殑骞胯ⅳ涓庡喎閰凤紝鍦ㄥ垬鎱堟绗斾笅灞曠幇寰楁穻婕撳敖鑷淬€?,
                    created_at: new Date(Date.now() - 600000).toISOString(),
                    like_count: 99, comment_count: 2, is_liked: 0,
                    comments: [
                        { nickname: '澧ㄦ煋杞昏垷', content: '鍚屾劅锛佹渶鍠滄绗簩閮?, created_at: new Date(Date.now() - 300000).toISOString() },
                        { nickname: '鏄熻景澶ф捣', content: '鏈棩鎴樺焦閭ｄ竴娈电湅鍝簡', created_at: new Date(Date.now() - 200000).toISOString() }
                    ]
                },
                {
                    id: 2, nickname: '浜戜腑婕',
                    content: '鍛ㄦ湯鐨勫崍鍚庯紝涓€鏉挅鍟★紝涓€鏈ソ涔︼紝杩欏氨鏄垜鎯宠鐨勭敓娲汇€傜獥澶栫殑闃冲厜姝ｅソ锛屼功椤甸棿鐨勬枃瀛椾豢浣涙湁浜嗙敓鍛姐€?,
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

    // 鈹€鈹€鈹€ 娓叉煋鍑芥暟 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    function renderFriendsList() {
        const container = document.getElementById('friends-list');
        if (!container) return;

        container.innerHTML = '';
        friendsData.forEach((friend, index) => {
            const avatar = friend.nickname ? friend.nickname[0] : '?';
            const statusText = friend.online_status ? '鍦ㄧ嚎' : '绂荤嚎';
            const reading = friend.current_book ? `闃呰銆?{friend.current_book}銆媊 : (friend.progress > 0 ? `宸插畬鎴?{friend.progress}%` : '鏆傛湭闃呰');
            const ranking = friend.rank || (index < 3 ? (index + 1) : '');
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
                        <span class="friend-ranking">${ranking}</span>
                    </div>
                    <div class="friend-reading">
                        <svg class="friend-book-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                        ${reading}
                    </div>
                    ${totalRead ? `<div class="friend-total-read">鍏遍槄瑙?{totalRead}鏈?/div>` : ''}
                    <div class="friend-progress">
                        <div class="friend-progress-fill" style="width: ${friend.progress || 0}%"></div>
                    </div>
                </div>
            `;

            // 娣诲姞澶村儚鏍峰紡鍒囨崲鏁堟灉
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
            container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--text-muted);font-size:14px">杩樻病鏈夊姩鎬侊紝鐐瑰嚮鍙充笅瑙?+ 鍙戝竷绗竴鏉″惂</div>';
            return;
        }
        postsData.forEach(post => {
            const postElement = createPostElement(post);
            container.appendChild(postElement);
        });

        const user = JSON.parse(localStorage.getItem('book_realm_user') || '{}');
        const avatar = document.getElementById('ls-user-avatar');
        const name = document.getElementById('ls-user-name');
        if (avatar) avatar.textContent = (user.nickname || '鎴?)[0];
        if (name) name.textContent = user.nickname || '鎺㈢储鑰?;
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
                    return '<div class="ls-post-img-wrap"><div class="img-placeholder">馃柤锔?/div></div>';
                }).join('') +
                '</div>';
        }

        div.innerHTML =
            '<div class="ls-post-header">' +
                '<div class="ls-post-avatar">' + avatarChar + '</div>' +
                '<div class="ls-post-meta">' +
                    '<div class="ls-post-name">' + (post.nickname || post.username || '鎺㈢储鑰?) + '</div>' +
                    '<div class="ls-post-time">' + timeAgo + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="ls-post-body">' + escapeHtml(post.content || '') + '</div>' +
            imageHTML +
            '<div class="ls-post-actions-row">' +
                '<button class="ls-act-btn like-btn' + (post.is_liked ? ' liked' : '') + '" data-id="' + post.id + '">' +
                    '<span class="act-icon">' + (post.is_liked ? '鉂わ笍' : '馃') + '</span>' + (post.like_count || 0) +
                '</button>' +
                '<button class="ls-act-btn comment-btn" data-id="' + post.id + '">' +
                    '<span class="act-icon">馃挰</span>' + (post.comment_count || post.comments?.length || 0) +
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
            list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);font-size:13px">杩樻病鏈夎瘎璁猴紝鏉ヨ鐐逛粈涔堝惂</div>';
        } else {
            post.comments.forEach((c, i) => {
                const item = document.createElement('div');
                item.className = 'ls-comment-item';
                item.innerHTML =
                    '<div class="ls-comment-avatar">' + (c.nickname || '?')[0] + '</div>' +
                    '<div class="ls-comment-body">' +
                        '<div class="ls-comment-name">' + (c.nickname || '涔﹀弸') + '</div>' +
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
            nickname: '鎴?,
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
        likeBtn.innerHTML = '<span class="act-icon">' + (post.is_liked ? '鉂わ笍' : '馃') + '</span>' + post.like_count;
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
            container.innerHTML = '<div class="bd-empty-state"><div class="bd-empty-icon">馃挰</div><p>杩樻病鏈夎璁猴紝鏉ヨ鐐逛粈涔堝惂</p></div>';
            return;
        }

        messages.forEach((msg, idx) => {
            const card = document.createElement('div');
            card.className = 'bd-thread-card';
            const avatar = (msg.nickname || msg.username || '涔﹀弸')[0];
            
            const comments = msg.comments || [];
            let commentsHTML = '';
            if (comments.length > 0) {
                commentsHTML = '<div class="bd-thread-comments">' +
                    comments.map(c => 
                        '<div class="bd-comment-item"><span class="bd-comment-author">' + (c.nickname || '涔﹀弸') + '</span>' + (c.content || '') + '</div>'
                    ).join('') +
                    '</div>';
            }

            card.innerHTML =
                '<div class="bd-thread-header">' +
                    '<div class="bd-thread-avatar">' + avatar + '</div>' +
                    '<div class="bd-thread-meta">' +
                        '<div class="bd-thread-author">' + (msg.nickname || msg.username || '鍖垮悕涔﹀弸') + '</div>' +
                        '<div class="bd-thread-time">' + getTimeAgo(msg.created_at) + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="bd-thread-content">' + (msg.content || '') + '</div>' +
                '<div class="bd-thread-footer">' +
                    '<button class="bd-thread-act like-discuss-btn' + (msg.is_liked ? ' liked' : '') + '" data-idx="' + idx + '">' +
                        (msg.is_liked ? '鉂わ笍' : '馃') + ' ' + (msg.like_count || 0) +
                    '</button>' +
                    '<button class="bd-thread-act reply-discuss-btn" data-idx="' + idx + '">' +
                        '馃挰 ' + (comments.length || 0) +
                    '</button>' +
                '</div>' +
                commentsHTML +
                '<div class="bd-comment-reply-input" style="display:none" data-idx="' + idx + '">' +
                    '<input type="text" class="bd-reply-input" placeholder="鍥炲...">' +
                    '<button class="bd-reply-send-btn">鍙戦€?/button>' +
                '</div>';

            const likeBtn = card.querySelector('.like-discuss-btn');
            if (likeBtn) {
                likeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    msg.is_liked = msg.is_liked ? 0 : 1;
                    msg.like_count = msg.is_liked ? (msg.like_count || 0) + 1 : Math.max(0, (msg.like_count || 0) - 1);
                    likeBtn.innerHTML = (msg.is_liked ? '鉂わ笍' : '馃') + ' ' + msg.like_count;
                    likeBtn.classList.toggle('liked', !!msg.is_liked);
                });
            }

            const replyBtn = card.querySelector('.reply-discuss-btn');
            const replyInput = card.querySelector('.bd-comment-reply-input');
            if (replyBtn && replyInput) {
                replyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    replyInput.style.display = replyInput.style.display === 'none' ? 'flex' : 'none';
                    if (replyInput.style.display === 'flex') {
                        replyInput.querySelector('input').focus();
                    }
                });
                const sendBtn = replyInput.querySelector('.bd-reply-send-btn');
                const input = replyInput.querySelector('input');
                if (sendBtn && input) {
                    sendBtn.addEventListener('click', () => {
                        if (!input.value.trim()) return;
                        if (!msg.comments) msg.comments = [];
                        msg.comments.push({ nickname: '鎴?, content: input.value.trim() });
                        input.value = '';
                        renderDiscussMessages(bookName);
                    });
                }
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

        if (countEl) countEl.textContent = recordsData.length + ' 鏉¤褰?;

        if (recordsData.length === 0) {
            if (emptyEl) emptyEl.style.display = 'flex';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';

        recordsData.forEach(record => {
            const emotionConfig = EMOTION_CONFIG[record.emotion_code] || EMOTION_CONFIG['GREEN_CALM'];
            const date = new Date(record.created_at);
            const dateStr = date.getFullYear() + '骞? +
                (date.getMonth() + 1).toString().padStart(2, '0') + '鏈? +
                date.getDate().toString().padStart(2, '0') + '鏃?' +
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
                    ' title="' + config.name + ': ' + (data.count || Math.round(data.percentage)) + '鏉?>' +
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

    // 鈹€鈹€鈹€ 鎯呯华鏄熺悆3D娓叉煋 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    function updateEmotionPlanet() {
        const recordStar = planetMeshes.find(p => p.userData.type === 'record');
        if (!recordStar || !recordStar.userData.group) return;

        const group = recordStar.userData.group;
        const dominantEmotion = getDominantEmotion();

        if (dominantEmotion) {
            const config = EMOTION_CONFIG[dominantEmotion];
            if (config) {
                // 鏇存柊鏄熸槦缁勭殑鐐瑰厜婧愰鑹?                group.children.forEach(child => {
                    if (child.isPointLight) {
                        child.color.setHex(config.color);
                    }
                });

                // 鏇存柊鎯呯华绮掑瓙
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
        // 娓呴櫎鏃х矑瀛?        emotionParticles.forEach(p => {
            if (p.parent) p.parent.remove(p);
            if (p.geometry) p.geometry.dispose();
            if (p.material) p.material.dispose();
        });
        emotionParticles = [];
        
        if (!emotionCode || !socialScene || !planet) return;
        
        const config = EMOTION_CONFIG[emotionCode];
        if (!config) return;
        
        // 鍒涘缓绮掑瓙绯荤粺
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
            
            // 鑴夊啿鏁堟灉
            const intensity = EMOTION_CONFIG[particles.userData.emotionCode]?.intensity || 3;
            particles.material.opacity = 0.5 + Math.sin(time * 2) * 0.2 * intensity;
        });
    }

    // 鈹€鈹€鈹€ 宸ュ叿鍑芥暟 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    function getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return '鍒氬垰';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}鍒嗛挓鍓峘;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}灏忔椂鍓峘;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}澶╁墠`;
        return date.toLocaleDateString('zh-CN');
    }

    // 鈹€鈹€鈹€ 3D鍦烘櫙鍒濆鍖?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    function initSocialScene() {
        socialCanvas = document.getElementById('social-canvas');
        if (!socialCanvas) return;

        // 鍦烘櫙
        socialScene = new THREE.Scene();
        socialScene.fog = new THREE.FogExp2(0x0a0a25, 0.005);

        // 鐩告満
        socialCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        socialCamera.position.set(0, 5, 30);

        // 娓叉煋鍣?        socialRenderer = new THREE.WebGLRenderer({ 
            canvas: socialCanvas, 
            antialias: true, 
            alpha: true 
        });
        socialRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        socialRenderer.setSize(window.innerWidth, window.innerHeight);
        socialRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        socialRenderer.toneMappingExposure = 1.2;

        // 鍚庡鐞?- Bloom
        composer = new THREE.EffectComposer(socialRenderer);
        const renderPass = new THREE.RenderPass(socialScene, socialCamera);
        composer.addPass(renderPass);
        
        bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.5, 0.4, 0.85
        );
        composer.addPass(bloomPass);

        // 鐏厜
        setupLights();

        // 鍒涘缓鍦烘櫙鍏冪礌
        createStarField();
        createNebulaClouds();
        createPlanets();

        // 浜嬩欢鐩戝惉
        setupEventListeners();

        // 鍔犺浇鏁版嵁
        loadFriendsData();
        loadPostsData();
        loadEmotionSpectrum();

        // 寮€濮嬪姩鐢?        animateSocial();
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
            gradient.addColorStop(0.5, `rgba(${color.r * 2
})();
} catch(e) { window.__social_error__ = e.message; }
