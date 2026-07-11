# 书籍人生模拟器 UI 设计

## HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>书籍人生模拟器</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>
    <!-- 登录注册界面 -->
    <div id="login-screen" class="screen active">
        <canvas id="stars-canvas-login"></canvas>
        <div class="login-container">
            <div class="login-box">
                <h1 class="login-title">书籍人生模拟器</h1>
                <p class="login-subtitle">穿越书籍，体验不同人生</p>
                
                <!-- 登录表单 -->
                <form id="login-form" class="auth-form active">
                    <div class="form-group">
                        <input type="text" id="login-username" placeholder="用户名" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="login-password" placeholder="密码" required>
                    </div>
                    <button type="submit" class="btn-primary">登录</button>
                    <p class="switch-text">还没有账号？<a href="#" id="show-register">立即注册</a></p>
                </form>
                
                <!-- 注册表单 -->
                <form id="register-form" class="auth-form">
                    <div class="form-group">
                        <input type="text" id="register-username" placeholder="用户名" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="register-password" placeholder="密码" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="register-confirm" placeholder="确认密码" required>
                    </div>
                    <button type="submit" class="btn-primary">注册</button>
                    <p class="switch-text">已有账号？<a href="#" id="show-login">立即登录</a></p>
                </form>
            </div>
        </div>
    </div>

    <!-- 主界面 - 宇宙星空 -->
    <div id="main-screen" class="screen">
        <canvas id="three-canvas"></canvas>
        <div class="main-container">
            <h1 class="main-title">选择你的宇宙</h1>
            <p class="main-subtitle">点击星云，穿越到不同的书籍世界 · 拖拽旋转 · 滚轮缩放</p>
        </div>
        <div class="nebula-overlays">
            <div class="nebula-info" id="info-scifi">
                <h3>科幻星云</h3>
                <div class="book-list">
                    <p>代表书籍：</p>
                    <ul>
                        <li>《三体》- 刘慈欣</li>
                        <li>《流浪地球》- 刘慈欣</li>
                        <li>《基地》- 阿西莫夫</li>
                    </ul>
                </div>
                <p class="nebula-desc">探索宇宙的奥秘，见证文明的兴衰</p>
            </div>
            <div class="nebula-info" id="info-xianxia">
                <h3>修仙星云</h3>
                <div class="book-list">
                    <p>代表书籍：</p>
                    <ul>
                        <li>《凡人修仙传》- 忘语</li>
                        <li>《遮天》- 辰东</li>
                        <li>《完美世界》- 辰东</li>
                    </ul>
                </div>
                <p class="nebula-desc">踏上修仙之路，追求长生大道</p>
            </div>
            <div class="nebula-info" id="info-romance">
                <h3>言情星云</h3>
                <div class="book-list">
                    <p>代表书籍：</p>
                    <ul>
                        <li>《微微一笑很倾城》- 顾漫</li>
                        <li>《何以笙箫默》- 顾漫</li>
                        <li>《致青春》- 辛夷坞</li>
                    </ul>
                </div>
                <p class="nebula-desc">体验心动瞬间，感受浪漫爱情</p>
            </div>
        </div>
    </div>

    <!-- 星座界面 - 书籍选择 -->
    <div id="book-screen" class="screen">
        <canvas id="constellation-canvas"></canvas>
        
        <div id="constellation-overlay" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;pointer-events:none;">
            <!-- 迪士尼风格标题 -->
            <div class="disney-title" id="disney-title">
                <div class="disney-text">BookVerse</div>
            </div>

            <!-- 顶部导航 -->
            <header id="constellation-nav">
                <button class="back-btn-constellation" id="back-btn">← 返回星云</button>
                <div class="constellation-title" id="constellation-title">科幻星云</div>
                <div class="nav-search-wrap">
                    <div class="search-box">
                        <span class="search-icon">⌕</span>
                        <input type="text" id="search-input" placeholder="搜索书籍或作者...">
                    </div>
                </div>
            </header>

            <!-- 右侧书籍信息面板 -->
            <aside id="right-panel" class="hidden">
                <div class="panel-close" id="panel-close">✕</div>
                <div class="panel-book-cover" id="panel-cover"></div>
                <div class="panel-book-title" id="panel-title">选择一颗星球</div>
                <div class="panel-book-author" id="panel-author"></div>
                <div class="panel-book-genre" id="panel-genre"></div>
                <div class="panel-section-title">AI Insights</div>
                <div class="panel-ai-insight" id="panel-insight">在浩瀚的书籍宇宙中点击任意星球，AI 将为你揭示其叙事内核与跨文本关联。</div>
                <div class="audio-status">
                    <div class="audio-dot"></div>
                    <span class="audio-label" id="audio-label">沉浸式音频 · 就绪</span>
                </div>
                <button class="cta-button" id="cta-btn">▸ 开启人生体验</button>
            </aside>

            <!-- 纸条便签 -->
            <div id="paper-note">
                <div class="tape"></div>
                <div class="note-icon">☕</div>
                点击星球，查看书籍名言。
            </div>

            <!-- 底部控制提示 -->
            <footer id="constellation-footer">
                <div class="controls-hint">
                    <span>WASD</span> 飞行 · <span>拖拽</span> 旋转视角 · <span>滚轮</span> 缩放 · <span>点击星球</span> 查看书籍
                </div>
            </footer>
        </div>
    </div>

    <!-- 游戏界面 -->
    <div id="game-screen" class="screen">
        <div class="game-container">
            <div class="game-header">
                <div class="player-stats">
                    <div class="stat-item">
                        <span class="stat-label">角色</span>
                        <span class="stat-value" id="player-name">穿越者</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">境界</span>
                        <span class="stat-value" id="player-cultivation">炼气期一层</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">地点</span>
                        <span class="stat-value location" id="player-location">黄枫谷</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">任务</span>
                        <span class="stat-value task" id="player-task">了解当前处境</span>
                    </div>
                </div>
                <div class="game-title-display">
                    <span class="book-icon">📖</span>
                    <span id="game-book-title">凡人修仙传</span>
                </div>
                <button class="game-back-btn" id="game-back-btn">返回选择</button>
            </div>

            <div class="game-main">
                <div class="narrative-area" id="narrative-area"></div>
                <div class="action-area">
                    <div class="action-label">选择你的行动：</div>
                    <div class="action-buttons" id="action-buttons"></div>
                    <div class="free-input-area">
                        <textarea class="free-input" id="free-input" placeholder="或者输入你想做的事..." rows="1"></textarea>
                        <button class="free-input-btn" id="free-input-btn">发送</button>
                    </div>
                </div>
            </div>

            <div class="game-sidebar">
                <div class="system-panel">
                    <div class="panel-header">
                        <span>📋</span>
                        <span>系统提示</span>
                    </div>
                    <div class="panel-content" id="system-messages"></div>
                </div>
                <div class="npc-panel">
                    <div class="panel-header">
                        <span>💬</span>
                        <span>NPC对话</span>
                    </div>
                    <div class="npc-messages" id="npc-messages"></div>
                    <div class="npc-select-area">
                        <div class="npc-select-label">选择对话对象：</div>
                        <div class="npc-select-buttons" id="npc-buttons"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/main.js"></script>
    <script src="js/nebula.js"></script>
    <script src="js/constellation.js"></script>
</body>
</html>
```

## CSS 样式

```css
/* 全局样式和变量 */
:root {
    --bg-dark: #0a0a1a;
    --bg-darker: #050510;
    --text-white: #ffffff;
    --text-light: rgba(255, 255, 255, 0.8);
    --text-muted: rgba(255, 255, 255, 0.6);
    
    /* 星云颜色 */
    --scifi-primary: #4a90e2;
    --scifi-secondary: #7b68ee;
    --scifi-glow: rgba(74, 144, 226, 0.6);
    
    --xianxia-primary: #f39c12;
    --xianxia-secondary: #e67e22;
    --xianxia-glow: rgba(243, 156, 18, 0.6);
    
    --romance-primary: #e91e63;
    --romance-secondary: #ff6b9d;
    --romance-glow: rgba(233, 30, 99, 0.6);
    
    /* 玻璃拟态 */
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
    background: var(--bg-dark);
    color: var(--text-white);
    overflow: hidden;
    height: 100vh;
    width: 100vw;
}

/* 界面基础样式 */
.screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

.screen.active {
    opacity: 1;
    visibility: visible;
}

/* Canvas星空背景 */
canvas[id^="stars-canvas"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

/* ==================== 登录界面 ==================== */
.login-container {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 20px;
}

.login-box {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    box-shadow: var(--glass-shadow);
    text-align: center;
}

.login-title {
    font-size: 2rem;
    margin-bottom: 10px;
    background: linear-gradient(135deg, var(--scifi-primary), var(--xianxia-primary), var(--romance-primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.login-subtitle {
    color: var(--text-muted);
    margin-bottom: 30px;
    font-size: 0.9rem;
}

.auth-form {
    display: none;
}

.auth-form.active {
    display: block;
}

.form-group {
    margin-bottom: 20px;
}

.form-group input {
    width: 100%;
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    color: var(--text-white);
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--scifi-primary);
    box-shadow: 0 0 20px rgba(74, 144, 226, 0.3);
}

.form-group input::placeholder {
    color: var(--text-muted);
}

.btn-primary {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, var(--scifi-primary), var(--scifi-secondary));
    border: none;
    border-radius: 10px;
    color: var(--text-white);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(74, 144, 226, 0.4);
}

.switch-text {
    margin-top: 20px;
    color: var(--text-muted);
    font-size: 0.9rem;
}

.switch-text a {
    color: var(--scifi-primary);
    text-decoration: none;
    transition: color 0.3s ease;
}

.switch-text a:hover {
    color: var(--scifi-secondary);
}

/* ==================== 主界面 ==================== */
#three-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.main-container {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    pointer-events: none;
}

.main-title {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.main-subtitle {
    color: var(--text-muted);
    font-size: 0.9rem;
}

/* 浮动信息卡片层 */
.nebula-overlays {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
}

.nebula-info {
    position: absolute;
    background: var(--glass-bg);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid var(--glass-border);
    border-radius: 15px;
    padding: 25px;
    width: 250px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    pointer-events: none;
    box-shadow: var(--glass-shadow);
    transform: translate(-50%, -50%);
}

.nebula-info.visible {
    opacity: 1;
    visibility: visible;
}

.nebula-info h3 {
    font-size: 1.3rem;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--glass-border);
}

#info-scifi h3 { color: var(--scifi-primary); }
#info-xianxia h3 { color: var(--xianxia-primary); }
#info-romance h3 { color: var(--romance-primary); }

.book-list {
    margin-bottom: 15px;
}

.book-list p {
    color: var(--text-muted);
    font-size: 0.85rem;
    margin-bottom: 8px;
}

.book-list ul {
    list-style: none;
    padding: 0;
}

.book-list li {
    padding: 5px 0;
    font-size: 0.9rem;
    color: var(--text-light);
}

.nebula-desc {
    color: var(--text-muted);
    font-size: 0.85rem;
    font-style: italic;
}

/* ==================== 星座界面 ==================== */
#constellation-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

/* 迪士尼风格标题 */
.disney-title {
    position: absolute;
    top: 20px;
    right: 30px;
    z-index: 25;
    pointer-events: auto;
}

.disney-text {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 32px;
    font-weight: 900;
    background: linear-gradient(135deg, #ffd700 0%, #ffec8b 25%, #fff8dc 50%, #ffec8b 75%, #ffd700 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
    filter: drop-shadow(0 0 12px rgba(255,215,0,0.4)) drop-shadow(0 0 25px rgba(255,180,0,0.2));
    animation: disneyShimmer 4s ease-in-out infinite;
    letter-spacing: 3px;
}

@keyframes disneyShimmer {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

#constellation-nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 22px;
    padding: 18px 30px;
    background: linear-gradient(180deg, rgba(6,4,18,0.97) 0%, rgba(6,4,18,0.4) 75%, transparent 100%);
    backdrop-filter: blur(14px);
    z-index: 20;
    pointer-events: auto;
}

.back-btn-constellation {
    padding: 10px 20px;
    border-radius: 22px;
    font-size: 14px;
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    transition: all 0.25s;
    white-space: nowrap;
}

.back-btn-constellation:hover {
    background: rgba(150,90,230,0.24);
    color: #fff;
    border-color: rgba(150,90,230,0.4);
    box-shadow: 0 0 22px rgba(120,60,220,0.3);
}

.constellation-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: #fff;
    text-shadow: 0 0 20px rgba(200,180,255,0.35);
}

.constellation-stats {
    display: flex;
    gap: 24px;
}

.const-stat {
    text-align: center;
}

.const-stat span:last-child {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
}

.const-val {
    font-size: 20px;
    font-weight: 700;
    color: #22d3ee;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 0 12px rgba(34,211,238,0.4);
}

.nav-search-wrap {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    border-radius: 24px;
    background: rgba(12,10,30,0.72);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(150,100,230,0.22);
    transition: all 0.3s;
}

.search-box:focus-within {
    border-color: rgba(150,90,230,0.55);
    box-shadow: 0 0 25px rgba(120,60,220,0.3);
}

.search-box input {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 13px;
    width: 320px;
}

.search-box input::placeholder {
    color: rgba(106,93,128,0.8);
}

.search-icon {
    color: rgba(106,93,128,0.8);
    font-size: 15px;
}

/* 左侧分类导航 */
#side-cats {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 20;
    pointer-events: auto;
}

.nav-cat {
    text-align: center;
    writing-mode: vertical-lr;
    letter-spacing: 2px;
    padding: 14px 10px;
    border-radius: 22px;
    font-size: 12px;
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.05);
    cursor: pointer;
    transition: all 0.25s;
    white-space: nowrap;
}

.nav-cat:hover,
.nav-cat.active {
    background: rgba(150,90,230,0.24);
    color: #fff;
    border-color: rgba(150,90,230,0.4);
    box-shadow: 0 0 22px rgba(120,60,220,0.3);
}

/* 右侧书籍信息面板 */
#right-panel {
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    width: 280px;
    padding: 24px;
    border-radius: 20px;
    background: rgba(12,10,30,0.72);
    backdrop-filter: blur(28px);
    border: 1px solid rgba(150,100,230,0.22);
    box-shadow: 0 0 50px rgba(100,60,200,0.2), 0 0 100px rgba(34,211,238,0.08);
    transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
    z-index: 15;
    max-height: 82vh;
    overflow-y: auto;
    pointer-events: auto;
}

#right-panel.hidden {
    opacity: 0;
    transform: translateY(-50%) translateX(50px);
    pointer-events: none;
}

.panel-close {
    position: absolute;
    top: 16px;
    right: 18px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.6);
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.22s;
}

.panel-close:hover {
    background: rgba(239,68,68,0.25);
    border-color: rgba(239,68,68,0.5);
    color: #f87171;
}

.panel-book-cover {
    width: 100%;
    height: 190px;
    border-radius: 14px;
    margin-bottom: 22px;
    background: #0c0a24;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 35px rgba(100,50,200,0.2), inset 0 0 30px rgba(0,0,0,0.3);
}

.panel-book-cover canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.panel-book-title {
    font-size: 23px;
    font-weight: 700;
    margin-bottom: 5px;
    line-height: 1.3;
    text-shadow: 0 0 20px rgba(200,180,255,0.35);
}

.panel-book-author {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 18px;
}

.panel-book-genre {
    display: inline-block;
    padding: 4px 14px;
    border-radius: 14px;
    font-size: 11px;
    background: rgba(150,90,230,0.22);
    color: #a855f7;
    margin-bottom: 18px;
    border: 1px solid rgba(150,90,230,0.28);
}

.panel-section-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: #22d3ee;
    margin-bottom: 10px;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(34,211,238,0.35);
}

.panel-ai-insight {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    line-height: 1.75;
    padding: 15px;
    border-radius: 12px;
    background: rgba(34,211,238,0.05);
    border-left: 3px solid #22d3ee;
    margin-bottom: 18px;
    max-height: 130px;
    overflow-y: auto;
}

.audio-status {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 12px;
    background: rgba(52,211,153,0.06);
    border: 1px solid rgba(52,211,153,0.18);
    margin-bottom: 22px;
}

.audio-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #34d399;
    animation: audioPulse 1.4s infinite;
}

@keyframes audioPulse {
    0%, 100% { box-shadow: 0 0 6px #34d399; }
    50% { box-shadow: 0 0 22px #34d399, 0 0 40px rgba(52,211,153,0.5); }
}

.audio-label {
    font-size: 12px;
    color: #34d399;
}

.cta-button {
    display: block;
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, #7c3aed, #4c1d95);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
    box-shadow: 0 4px 30px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
    position: relative;
    overflow: hidden;
}

.cta-button::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transition: left 0.7s;
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 40px rgba(124,58,237,0.65), 0 0 70px rgba(34,211,238,0.2);
}

.cta-button:hover::after {
    left: 100%;
}

.cta-button:active {
    transform: translateY(0);
}

/* 纸条便签 */
#paper-note {
    position: absolute;
    bottom: 70px;
    left: 90px;
    z-index: 15;
    width: 280px;
    padding: 22px 20px 18px;
    background: linear-gradient(175deg, #fff8ee, #f5ead6, #ede0c8);
    color: #2a2018;
    border-radius: 4px 18px 10px 7px;
    box-shadow: 5px 7px 28px rgba(0,0,0,0.45), inset 0 0 35px rgba(255,255,255,0.3);
    transform: rotate(-2.5deg);
    font-family: 'KaiTi', 'STKaiti', serif;
    font-size: 14px;
    line-height: 1.9;
    letter-spacing: 0.6px;
    clip-path: polygon(0% 7%, 3% 0%, 97% 0%, 100% 3%, 100% 87%, 95% 93%, 100% 97%, 93% 100%, 5% 100%, 0% 95%, 2% 91%, 0% 86%);
    pointer-events: auto;
}

#paper-note .tape {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%) rotate(-3deg);
    width: 58px;
    height: 24px;
    background: rgba(210,195,160,0.75);
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.18);
}

#paper-note .note-icon {
    font-size: 20px;
    margin-bottom: 5px;
    opacity: 0.65;
}

/* 底部控制提示 */
#constellation-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 14px 30px;
    background: linear-gradient(0deg, rgba(6,4,18,0.97) 0%, rgba(6,4,18,0.5) 70%, transparent 100%);
    backdrop-filter: blur(12px);
    z-index: 20;
    pointer-events: auto;
}

.controls-hint {
    font-size: 12px;
    color: rgba(106,93,128,0.8);
}

.controls-hint span {
    color: #22d3ee;
    font-weight: 600;
    text-shadow: 0 0 8px rgba(34,211,238,0.4);
}

/* ==================== 游戏界面 ==================== */
#game-screen {
    background: var(--bg-dark);
}

.game-container {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: 1fr 320px;
    grid-template-rows: 60px 1fr;
    height: 100vh;
    gap: 0;
    padding: 0;
}

/* 顶部状态栏 */
.game-header {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
    background: rgba(10, 10, 26, 0.95);
    border-bottom: 1px solid var(--glass-border);
    backdrop-filter: blur(10px);
}

.player-stats {
    display: flex;
    gap: 30px;
    align-items: center;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
}

.stat-label {
    color: var(--text-muted);
}

.stat-value {
    color: var(--xianxia-primary);
    font-weight: 600;
}

.stat-value.location {
    color: var(--scifi-primary);
}

.stat-value.task {
    color: var(--romance-primary);
}

.game-title-display {
    font-size: 1.1rem;
    color: var(--text-light);
    display: flex;
    align-items: center;
    gap: 10px;
}

.game-title-display .book-icon {
    font-size: 1.3rem;
}

.game-back-btn {
    background: transparent;
    border: 1px solid var(--glass-border);
    border-radius: 8px;
    padding: 8px 16px;
    color: var(--text-white);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.game-back-btn:hover {
    background: var(--glass-bg);
    border-color: var(--scifi-primary);
}

/* 主内容区域 */
.game-main {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid var(--glass-border);
}

/* 叙事文本区 */
.narrative-area {
    flex: 1;
    overflow-y: auto;
    padding: 30px;
    background: rgba(10, 10, 26, 0.6);
}

.narrative-message {
    margin-bottom: 20px;
    animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.narrative-message.system {
    padding: 15px 20px;
    background: rgba(74, 144, 226, 0.1);
    border-left: 3px solid var(--scifi-primary);
    border-radius: 0 10px 10px 0;
}

.narrative-message.system .msg-header {
    color: var(--scifi-primary);
    font-size: 0.85rem;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.narrative-message.npc {
    padding: 15px 20px;
    background: rgba(243, 156, 18, 0.1);
    border-left: 3px solid var(--xianxia-primary);
    border-radius: 0 10px 10px 0;
}

.narrative-message.npc .msg-header {
    color: var(--xianxia-primary);
    font-size: 0.85rem;
    margin-bottom: 8px;
}

.narrative-message.player {
    padding: 15px 20px;
    background: rgba(233, 30, 99, 0.1);
    border-left: 3px solid var(--romance-primary);
    border-radius: 0 10px 10px 0;
}

.narrative-message.player .msg-header {
    color: var(--romance-primary);
    font-size: 0.85rem;
    margin-bottom: 8px;
}

.narrative-message.narrative {
    padding: 20px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    line-height: 1.8;
    color: var(--text-light);
    font-size: 1.05rem;
}

.msg-content {
    line-height: 1.7;
    color: var(--text-light);
}

.msg-content p {
    margin-bottom: 10px;
}

/* 行动选择区 */
.action-area {
    padding: 20px 30px;
    background: rgba(10, 10, 26, 0.95);
    border-top: 1px solid var(--glass-border);
}

.action-label {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 12px;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.action-btn {
    width: 100%;
    padding: 14px 20px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    color: var(--text-white);
    font-size: 0.95rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 12px;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: var(--scifi-primary);
    transform: translateX(5px);
}

.action-btn .action-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, var(--scifi-primary), var(--scifi-secondary));
    border-radius: 50%;
    font-size: 0.8rem;
    font-weight: 600;
    flex-shrink: 0;
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* 自由输入区 */
.free-input-area {
    margin-top: 15px;
    display: flex;
    gap: 10px;
}

.free-input {
    flex: 1;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    color: var(--text-white);
    font-size: 0.95rem;
    resize: none;
    min-height: 45px;
    max-height: 100px;
}

.free-input:focus {
    outline: none;
    border-color: var(--scifi-primary);
}

.free-input::placeholder {
    color: var(--text-muted);
}

.free-input-btn {
    padding: 12px 20px;
    background: linear-gradient(135deg, var(--xianxia-primary), var(--xianxia-secondary));
    border: none;
    border-radius: 10px;
    color: var(--text-white);
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.free-input-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px var(--xianxia-glow);
}

.free-input-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* 右侧面板 */
.game-sidebar {
    display: flex;
    flex-direction: column;
    background: rgba(10, 10, 26, 0.95);
    overflow: hidden;
}

/* 系统提示区 */
.system-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--glass-border);
}

.panel-header {
    padding: 15px 20px;
    background: rgba(74, 144, 226, 0.1);
    border-bottom: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: var(--scifi-primary);
    font-weight: 600;
}

.panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px 20px;
}

.system-message {
    margin-bottom: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    font-size: 0.85rem;
    line-height: 1.6;
    color: var(--text-light);
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.system-message.warning {
    background: rgba(233, 30, 99, 0.15);
    border-left: 3px solid var(--romance-primary);
}

.system-message .sys-label {
    color: var(--scifi-primary);
    font-weight: 600;
    margin-bottom: 5px;
    font-size: 0.8rem;
}

/* NPC对话区 */
.npc-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.npc-panel .panel-header {
    background: rgba(243, 156, 18, 0.1);
    color: var(--xianxia-primary);
}

.npc-messages {
    flex: 1;
    overflow-y: auto;
    padding: 15px 20px;
}

.npc-message {
    margin-bottom: 12px;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    animation: fadeIn 0.3s ease;
}

.npc-message .npc-name {
    font-size: 0.8rem;
    color: var(--xianxia-primary);
    margin-bottom: 4px;
    font-weight: 600;
}

.npc-message .npc-text {
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--text-light);
}

/* NPC选择区 */
.npc-select-area {
    padding: 12px 20px;
    background: rgba(10, 10, 26, 0.95);
    border-top: 1px solid var(--glass-border);
}

.npc-select-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 8px;
}

.npc-select-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.npc-btn {
    padding: 6px 14px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 15px;
    color: var(--text-white);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.npc-btn:hover {
    background: rgba(243, 156, 18, 0.2);
    border-color: var(--xianxia-primary);
}

/* Loading动画 */
.typing-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 15px 20px;
    color: var(--text-muted);
    font-size: 0.9rem;
}

.typing-dots {
    display: flex;
    gap: 4px;
}

.typing-dots span {
    width: 6px;
    height: 6px;
    background: var(--scifi-primary);
    border-radius: 50%;
    animation: typingBounce 1.4s infinite;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-8px); opacity: 1; }
}

/* 响应式设计 */
@media (max-width: 900px) {
    #constellation-nav {
        padding: 10px 14px;
        gap: 10px;
    }

    #side-cats {
        left: 8px;
        gap: 5px;
    }

    #side-cats .nav-cat {
        padding: 10px 7px;
        font-size: 11px;
    }

    .constellation-stats {
        gap: 10px;
    }

    .const-val {
        font-size: 15px;
    }

    #right-panel {
        width: 240px;
        right: 10px;
        padding: 20px;
    }

    #paper-note {
        width: 220px;
        left: 70px;
        font-size: 12px;
        padding: 16px 12px 12px;
    }

    .search-box input {
        width: 160px;
    }

    .controls-hint {
        gap: 10px;
        font-size: 10px;
    }

    .game-container {
        grid-template-columns: 1fr;
        grid-template-rows: 60px 1fr auto;
    }

    .game-sidebar {
        display: none;
    }

    .game-main {
        border-right: none;
    }
}

@media (max-width: 600px) {
    #side-cats {
        left: 4px;
        gap: 3px;
    }

    #side-cats .nav-cat {
        padding: 8px 5px;
        font-size: 10px;
        letter-spacing: 1px;
    }

    .constellation-title {
        font-size: 16px;
    }

    .constellation-stats {
        font-size: 10px;
    }

    #right-panel {
        width: calc(100% - 20px);
        right: 10px;
        left: 10px;
        top: auto;
        bottom: 130px;
        transform: none;
        max-height: 48vh;
    }

    #right-panel.hidden {
        transform: translateY(120px);
        opacity: 0;
    }

    #paper-note {
        bottom: 190px;
        width: calc(100% - 60px);
        left: 50px;
    }

    .search-box input {
        width: 140px;
    }
}
```

## 设计概述

这是一个书籍人生模拟器的UI设计，包含四个主要界面：

1. **登录/注册界面** - 玻璃拟态风格，星空背景
2. **主界面（宇宙星空）** - Three.js 3D星云场景，可交互的星云
3. **星座界面（书籍选择）** - 书籍星球可视化，带有迪士尼风格标题和详细信息面板
4. **游戏界面** - 角色扮演游戏界面，包含叙事、行动选择和NPC对话

设计特点：
- 深色宇宙主题，使用CSS变量管理颜色
- 玻璃拟态效果（backdrop-filter）
- 丰富的动画和过渡效果
- 响应式设计，适配不同屏幕尺寸
- 3D交互场景使用Three.js实现
