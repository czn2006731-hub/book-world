// ==================== 系统面板 ====================
var SYSTEM_API = 'http://localhost:8080/api';
var SYSTEM_VOICE = 'Cherry';
var SYSTEM_INSTRUCTION = '冰冷机械的AI系统音，字正腔圆，毫无感情起伏，字句之间有微弱的停顿，像一个没有情绪的电子广播';

var _sysPanel = null;
var _sysTab = null;
var _sysMessages = null;
var _sysInput = null;
var _sysOpen = false;
var _collectedItems = [];
var _sysWelcomeShown = false;

// ── 系统命名 ──
function getSystemName() {
    var name = localStorage.getItem('bookemu_system_name');
    if (!name || name === '陈昭南' || name.indexOf('陈昭南') !== -1) {
        localStorage.setItem('bookemu_system_name', '系统');
        return '系统';
    }
    return name;
}

function setSystemName(name) {
    localStorage.setItem('bookemu_system_name', name);
    _updateSystemNameUI();
}

function _updateSystemNameUI() {
    var name = getSystemName();
    var header = document.getElementById('sys-name-header');
    if (header) header.textContent = name.toUpperCase();
    var tabText = document.getElementById('sys-tab-text');
    if (tabText) tabText.textContent = name.toUpperCase();
}

function initSystemPanel() {
    try {
        _sysPanel = document.getElementById('system-panel');
        _sysTab = document.getElementById('system-panel-tab');
        _sysMessages = document.getElementById('system-messages');
        _sysInput = document.getElementById('system-input');

        _updateSystemNameUI();

        if (_sysTab) _sysTab.addEventListener('click', function() { toggleSystemPanel(true); });

        var closeBtn = document.getElementById('system-panel-close');
        if (closeBtn) closeBtn.addEventListener('click', function() { toggleSystemPanel(false); });

        var sendBtn = document.getElementById('system-send-btn');
        if (sendBtn) sendBtn.addEventListener('click', sendSystemQuestion);
        if (_sysInput) _sysInput.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) sendSystemQuestion();
        });

        // 快捷键 H 切换面板
        document.addEventListener('keydown', function(e) {
            if (e.keyCode === 72 && !e.target.closest('input, textarea') && _isGameScreen()) {
                toggleSystemPanel();
            }
        });

        // 点击其他区域关闭积分规则浮窗
        document.addEventListener('click', function(e) {
            var bubble = document.getElementById('sys-points-explanation');
            if (bubble && !bubble.classList.contains('hidden')) {
                var trigger = document.querySelector('.sys-points-info-trigger');
                if (trigger && !trigger.contains(e.target) && !bubble.contains(e.target)) {
                    bubble.classList.add('hidden');
                }
            }
        });

        // 初始化系统标签页切换
        _initSystemTabs();
        
        // 初始化波纹特效与属性编辑
        _initRippleEffects();
        
        // 初始化系统积分
        _initSystemPoints();

        // 默认非聊天界面，初始时隐藏命令行区和快捷提示
        var inputArea = document.getElementById('system-input-area');
        var shortcutHint = document.getElementById('system-panel-shortcut');
        if (inputArea) inputArea.style.display = 'none';
        if (shortcutHint) shortcutHint.style.display = 'none';

        // 轮询更新状态卡片
        setInterval(updateSystemHostCard, 1000);
    } catch (err) {
        console.log('[System Panel Init Warning] ' + err.message);
    }
}

// ── 模块标签切换逻辑 ──
function _initSystemTabs() {
    var tabs = document.querySelectorAll('.sys-nav-tab');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var targetTab = tab.getAttribute('data-tab');
            
            // 激活标签按钮
            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');

            // 激活对应页面
            var pages = document.querySelectorAll('.sys-tab-page');
            pages.forEach(function(page) {
                page.classList.remove('active');
                if (page.id === 'sys-page-' + targetTab) {
                    page.classList.add('active');
                }
            });

            // 只有在对话标签(chat)下才显示底部命令行区域，其他标签页隐藏它
            var inputArea = document.getElementById('system-input-area');
            var shortcutHint = document.getElementById('system-panel-shortcut');
            if (inputArea) {
                if (targetTab === 'chat') {
                    inputArea.style.display = 'flex';
                    if (shortcutHint) shortcutHint.style.display = 'block';
                } else {
                    inputArea.style.display = 'none';
                    if (shortcutHint) shortcutHint.style.display = 'none';
                }
            }

            // 如果是空间页，渲染空间物品
            if (targetTab === 'space') {
                renderSystemSpace();
            }
            // 如果是成就图鉴页，渲染成就图鉴
            if (targetTab === 'achievement') {
                renderAchievementGallery();
            }
        });
    });
}

// ── 波纹特效绑定 ──
function _initRippleEffects() {
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.cyber-btn-ripple');
        if (!btn) return;
        
        var rect = btn.getBoundingClientRect();
        var circle = document.createElement('span');
        var diameter = Math.max(rect.width, rect.height);
        var radius = diameter / 2;

        circle.style.width = circle.style.height = diameter + 'px';
        circle.style.left = (e.clientX - rect.left - radius) + 'px';
        circle.style.top = (e.clientY - rect.top - radius) + 'px';
        circle.className = 'ripple-effect';

        var existingRipple = btn.getElementsByClassName('ripple-effect')[0];
        if (existingRipple) {
            existingRipple.remove();
        }

        btn.appendChild(circle);
    });
}

// ── 全息 Toast 系统提示框 ──
function showCyberToast(msg, type) {
    var container = document.getElementById('cyber-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'cyber-toast-container';
        document.body.appendChild(container);
    }

    var icons = {
        'error': '❌',
        'warning': '⚠️',
        'success': '🎉',
        'info': '📡'
    };

    var toast = document.createElement('div');
    toast.className = 'cyber-toast toast-' + (type || 'info');
    toast.innerHTML = '<span class="cyber-toast-icon">' + (icons[type] || '⚡') + '</span><span>' + msg + '</span>';

    container.appendChild(toast);

    setTimeout(function() {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3300);
}

// ── 积分滚数字动画 ──
var _systemPoints = 0;
var _displayedPoints = 0;
var _pointsRollingAnim = null;

// ── 获取当前书籍和存档隔离存储的 Key 前缀 ──
function _getSysStorePrefix() {
    var bookId = (window.gameState && window.gameState.bookId) ? window.gameState.bookId : 'default';
    var slotId = window._currentSaveSlotId ? window._currentSaveSlotId : 'slot_default';
    return 'sys_' + bookId + '_' + slotId + '_';
}

function _initSystemPoints() {
    var prefix = _getSysStorePrefix();
    var savedPoints = localStorage.getItem(prefix + 'points');
    var parsed = parseInt(savedPoints, 10);
    _systemPoints = isNaN(parsed) ? 0 : parsed;
    _displayedPoints = _systemPoints;
    _updatePointsUI(true);
}

function _updatePointsUI(immediate) {
    var el = document.getElementById('sys-points-val');
    if (!el) return;
    
    // 强制过滤防止 NaN 污染 UI 与本地存储
    if (isNaN(_systemPoints)) _systemPoints = 0;
    var prefix = _getSysStorePrefix();
    localStorage.setItem(prefix + 'points', _systemPoints);

    if (immediate) {
        _displayedPoints = _systemPoints;
        el.textContent = _displayedPoints;
        return;
    }

    if (_pointsRollingAnim) clearInterval(_pointsRollingAnim);

    var start = isNaN(_displayedPoints) ? 0 : _displayedPoints;
    var end = _systemPoints;
    if (start === end) {
        el.textContent = end;
        return;
    }

    var duration = 800; // ms
    var startTime = Date.now();

    _pointsRollingAnim = setInterval(function() {
        var elapsed = Date.now() - startTime;
        var progress = Math.min(1, elapsed / duration);
        var current = Math.floor(start + (end - start) * progress);
        _displayedPoints = isNaN(current) ? end : current;
        el.textContent = _displayedPoints;

        if (progress >= 1) {
            clearInterval(_pointsRollingAnim);
            _pointsRollingAnim = null;
            _displayedPoints = end;
            el.textContent = end;
        }
    }, 30);
}

function addSystemPoints(pts) {
    _systemPoints += pts;
    _updatePointsUI();
    sysMsg('🏆 逆天而行！获得系统积分 +' + pts + ' PT！', 'system', false);
}

// ── 全局成就数据结构表 (成就图鉴 & 里程碑) ──
var GAME_ACHIEVEMENTS = [
    { id: 'ach_qixuan_fall', title: '入门破局 · 考核落榜', desc: '未通过七玄门常规峭壁比试，顺势被墨大夫选为神手谷采药童子', pts: 30, icon: '🏔️', dpPrefix: 'qm_1' },
    { id: 'ach_changchun_start', title: '仙路初启 · 长春法门', desc: '成功从墨大夫手中接过《长春功残卷》，迈出修仙第一步', pts: 50, icon: '📜', dpPrefix: 'qm_1a' },
    { id: 'ach_zhangtie_friend', title: '金兰结义 · 结交张铁', desc: '与张铁夜间竹房谈心，得知象甲功真相，结为生死知己', pts: 30, icon: '🤝', dpPrefix: 'qm_1c' },
    { id: 'ach_green_bottle', title: '掌天神器 · 发现小绿瓶', desc: '在神手谷药园杂物房泥土中发掘出可吸收月光的神秘小瓶', pts: 100, icon: '🧪', dpPrefix: 'qm_3c' },
    { id: 'ach_rabbit_test', title: '谨慎行事 · 灵液剧毒', desc: '将绿液喂给野兔测试，发现绿液含有剧毒无法直接服用', pts: 50, icon: '🐇', dpPrefix: 'qm_4b' },
    { id: 'ach_herb_boost', title: '逆天催熟 · 灵草狂长', desc: '利用小绿瓶绿液成功将枯萎灵草迅速催熟成长', pts: 50, icon: '🌿', dpPrefix: 'qm_4c' },
    { id: 'ach_mo_defeat', title: '神手斩魔 · 避劫突围', desc: '识破夺舍阴谋，在木屋决战中彻底击败墨居仁大夫', pts: 150, icon: '⚔️', dpPrefix: 'qm_5a' },
    { id: 'ach_quhun_battle', title: '昔日旧友 · 傀儡曲魂', desc: '发现张铁被炼为傀儡曲魂，成功从曲魂围攻中脱身', pts: 80, icon: '🤖', dpPrefix: 'qm_5c' },
    { id: 'ach_huangfeng_enter', title: '踏入仙途 · 黄枫谷外门', desc: '凭升仙令顺利拜入越国黄枫谷，开启正统修仙名门之路', pts: 100, icon: '🍁', dpPrefix: 'hg_' },
    { id: 'ach_blood_trial', title: '血色惨烈 · 秘境生还', desc: '在七大派残酷的血色试炼中活着走出一片血海', pts: 200, icon: '🩸', dpPrefix: 'bt_' },
    { id: 'ach_modao_escape', title: '魔道风云 · 古阵大逃杀', desc: '在越国魔道六宗入侵中启动古传送阵脱险', pts: 250, icon: '🌀', dpPrefix: 'md_' },
    { id: 'ach_chaos_star', title: '远赴重洋 · 乱星海立足', desc: '跨越无尽海域抵达天星城，在乱星海外海斩妖立足', pts: 300, icon: '🌊', dpPrefix: 'lx_' },
    { id: 'ach_xutian_ding', title: '上古神器 · 强夺虚天鼎', desc: '在虚天殿混战中力压正魔两道老怪，得人界至宝虚天鼎', pts: 500, icon: '👑', dpPrefix: 'xt_' },
    { id: 'ach_nascent_soul', title: '元婴大成 · 乱星海称尊', desc: '渡过元婴天劫凝结元婴，成为震慑乱星海的绝顶大能', pts: 1000, icon: '⚡', dpPrefix: 'jy_' }
];

function getUnlockedAchievements() {
    var save = _getCurrentAchievementSave();
    if (save && Array.isArray(save.unlockedAchievements)) {
        return save.unlockedAchievements.slice();
    }
    var prefix = _getSysStorePrefix();
    var raw = localStorage.getItem(prefix + 'achievements');
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch(e) {
        return [];
    }
}

function _getCurrentAchievementSave() {
    if (!window.gameState || !window.gameState.bookId || !window._currentSaveSlotId || typeof getSaveList !== 'function') return null;
    var saves = getSaveList(window.gameState.bookId);
    return saves.find(function(s) { return s.id === window._currentSaveSlotId; }) || null;
}

function _saveUnlockedAchievements(unlocked) {
    var prefix = _getSysStorePrefix();
    localStorage.setItem(prefix + 'achievements', JSON.stringify(unlocked));
    var save = _getCurrentAchievementSave();
    if (!save || typeof getSaveKey !== 'function') return;
    save.unlockedAchievements = unlocked.slice();
    var saves = getSaveList(window.gameState.bookId);
    var target = saves.find(function(s) { return s.id === save.id; });
    if (target) target.unlockedAchievements = unlocked.slice();
    localStorage.setItem(getSaveKey(window.gameState.bookId), JSON.stringify(saves));
}

function isAchievementUnlocked(achId) {
    var unlocked = getUnlockedAchievements();
    return unlocked.indexOf(achId) !== -1;
}

function unlockAchievement(achId) {
    if (isAchievementUnlocked(achId)) return;
    
    var ach = GAME_ACHIEVEMENTS.find(function(a) { return a.id === achId; });
    if (!ach) return;

    var unlocked = getUnlockedAchievements();
    unlocked.push(achId);
    _saveUnlockedAchievements(unlocked);

    // 奖励积分
    addSystemPoints(ach.pts);

    // 游戏界面上方非侵入式弹窗通告，不强制打开系统面板
    showAchievementToast(ach.title, ach.pts);
}

// ── 顶部非侵入式成就通告 ──
var _achieveToastTimer = null;

function showAchievementToast(title, pts) {
    var banner = document.getElementById('achievement-toast-banner');
    var titleEl = document.getElementById('achieve-toast-title');
    var ptsEl = document.getElementById('achieve-toast-pts');

    if (!banner || !titleEl) return;

    titleEl.textContent = title;
    if (ptsEl) ptsEl.textContent = '+' + pts + ' PT';

    banner.classList.remove('hidden');

    if (_achieveToastTimer) clearTimeout(_achieveToastTimer);
    _achieveToastTimer = setTimeout(function() {
        banner.classList.add('hidden');
        _achieveToastTimer = null;
    }, 4000);
}

// ── 检查触发成就与里程碑 ──
function checkAchievementsAndMilestones() {
    if (typeof ArcEngine === 'undefined') return;
    var save = _getCurrentAchievementSave();
    if (!save) return;
    var completedDpIds = Array.isArray(save.completedDpIds) ? save.completedDpIds : [];
    var completedArcIds = Array.isArray(save.completedArcIds) ? save.completedArcIds : [];
    var items = ArcEngine.getAllItems ? (ArcEngine.getAllItems() || []) : [];

    function completed(dpId) { return completedDpIds.indexOf(dpId) !== -1; }
    function completedPrefix(prefix) {
        return completedDpIds.some(function(id) { return id.indexOf(prefix) === 0; });
    }
    function hasItem(name) { return items.some(function(it) { return it.name === name; }); }
    function conditionMet(achId) {
        if (achId === 'ach_qixuan_fall') return completed('qm_1');
        if (achId === 'ach_changchun_start') return completed('qm_1a') && hasItem('长春功残卷');
        if (achId === 'ach_zhangtie_friend') return completed('qm_1c');
        if (achId === 'ach_green_bottle') return completed('qm_3c') && hasItem('神秘小瓶');
        if (achId === 'ach_rabbit_test') return completed('qm_4b');
        if (achId === 'ach_herb_boost') return completed('qm_4c');
        if (achId === 'ach_mo_defeat') return completed('qm_5a');
        if (achId === 'ach_quhun_battle') return completed('qm_5c');
        if (achId === 'ach_huangfeng_enter') return completedArcIds.indexOf('qixuanmen') !== -1 || completedPrefix('hg_');
        if (achId === 'ach_blood_trial') return completedArcIds.indexOf('blood-trial') !== -1;
        if (achId === 'ach_modao_escape') return completedPrefix('md_');
        if (achId === 'ach_chaos_star') return completedPrefix('lx_');
        if (achId === 'ach_xutian_ding') return completedPrefix('xt_');
        if (achId === 'ach_nascent_soul') return completedPrefix('jy_');
        return false;
    }

    // 1. 检查成就解锁条件
    GAME_ACHIEVEMENTS.forEach(function(ach) {
        if (!isAchievementUnlocked(ach.id) && conditionMet(ach.id)) unlockAchievement(ach.id);
    });

    // 2. 更新主线任务页面的里程碑 (只展示未完成的项)
    renderMilestonesOnlyPending();
}

// ── 渲染里程碑 (仅展示待完成项) ──
function renderMilestonesOnlyPending() {
    var container = document.getElementById('sys-milestone-list');
    if (!container) return;

    var pendingAch = GAME_ACHIEVEMENTS.filter(function(ach) {
        return !isAchievementUnlocked(ach.id);
    });

    if (pendingAch.length === 0) {
        container.innerHTML = '<div style="color:#00ff88;font-size:12px;text-align:center;padding:15px 0;">🎉 所有逆天改命里程碑已全数完成！你已踏上大道之巅！</div>';
        return;
    }

    var html = '';
    // 只取前 4 个待完成里程碑展示
    pendingAch.slice(0, 4).forEach(function(ach) {
        html += '<div class="milestone-item">' +
            '<div class="ms-dot">?</div>' +
            '<div class="ms-info">' +
            '<div class="ms-title">' + ach.icon + ' ' + ach.title + ' <span style="font-size:10px;color:#ffe066;margin-left:6px;">(可获 +' + ach.pts + ' PT)</span></div>' +
            '<div class="ms-desc">' + ach.desc + '</div>' +
            '</div>' +
            '</div>';
    });

    container.innerHTML = html;
}

// ── 渲染成就图鉴 (已完成点亮，未完成置灰) ──
function renderAchievementGallery() {
    var countEl = document.getElementById('achieve-count-num');
    var totalEl = document.getElementById('achieve-total-num');
    var ptsEl = document.getElementById('achieve-pts-num');
    var grid = document.getElementById('sys-achievement-grid');

    if (!grid) return;

    var unlocked = getUnlockedAchievements();
    var unlockedCount = unlocked.length;
    var totalCount = GAME_ACHIEVEMENTS.length;
    var totalEarnedPts = 0;

    GAME_ACHIEVEMENTS.forEach(function(ach) {
        if (unlocked.indexOf(ach.id) !== -1) {
            totalEarnedPts += ach.pts;
        }
    });

    if (countEl) countEl.textContent = unlockedCount;
    if (totalEl) totalEl.textContent = totalCount;
    if (ptsEl) ptsEl.textContent = totalEarnedPts;

    var html = '';
    GAME_ACHIEVEMENTS.forEach(function(ach) {
        var isDone = unlocked.indexOf(ach.id) !== -1;
        var statusCls = isDone ? 'unlocked' : 'locked';
        var badgeText = isDone ? '已点亮' : '未解锁';
        var badgeCls = isDone ? 'badge-unlocked' : 'badge-locked';

        html += '<div class="sys-achieve-card ' + statusCls + '">' +
            '<span class="achieve-status-badge ' + badgeCls + '">' + badgeText + '</span>' +
            '<div class="achieve-icon">' + ach.icon + '</div>' +
            '<div class="achieve-info">' +
            '<div class="achieve-title">' + ach.title + '</div>' +
            '<div class="achieve-desc">' + ach.desc + '</div>' +
            '<div class="achieve-pts">奖励积分: +' + ach.pts + ' PT</div>' +
            '</div>' +
            '</div>';
    });

    grid.innerHTML = html;
}

// ── 状态数据卡片实时渲染 ──
function updateSystemHostCard() {
    if (typeof ArcEngine === 'undefined') return;
    var getRef = ArcEngine.getPlayerStateRef;
    if (typeof getRef !== 'function') return;
    var state = getRef();
    if (!state) return;

    // 自动检测成就与里程碑更新
    checkAchievementsAndMilestones();

    // 绑定基础状态
    var nameEl = document.getElementById('sys-host-name');
    if (nameEl) nameEl.textContent = state.name || '韩立';

    // 境界
    var cult = state.cultivation || '炼气期一层';
    var cultTxt = document.getElementById('sys-cultivation-txt');
    if (cultTxt) cultTxt.textContent = cult;
    
    // 计算境界百分比 (以炼气层数为基础，例如三层 30%，筑基 100%)
    var cultProgress = 10;
    if (cult.indexOf('二') !== -1) cultProgress = 20;
    else if (cult.indexOf('三') !== -1) cultProgress = 35;
    else if (cult.indexOf('四') !== -1) cultProgress = 50;
    else if (cult.indexOf('五') !== -1) cultProgress = 65;
    else if (cult.indexOf('六') !== -1) cultProgress = 80;
    else if (cult.indexOf('筑基') !== -1) cultProgress = 100;
    var cultFill = document.getElementById('sys-gauge-cultivation');
    if (cultFill) cultFill.style.width = cultProgress + '%';

    // 灵力 MP
    var mana = state.mana || 0;
    var maxMana = state.maxMana || 50;
    var manaTxt = document.getElementById('sys-mana-txt');
    if (manaTxt) manaTxt.textContent = mana + '/' + maxMana;
    var manaFill = document.getElementById('sys-gauge-mana');
    if (manaFill) manaFill.style.width = Math.min(100, (mana / maxMana) * 100) + '%';

    // 生命 HP
    var hp = state.hp || 0;
    var maxHp = state.maxHp || 50;
    var hpTxt = document.getElementById('sys-hp-txt');
    if (hpTxt) hpTxt.textContent = hp + '/' + maxHp;
    var hpFill = document.getElementById('sys-gauge-hp');
    if (hpFill) hpFill.style.width = Math.min(100, (hp / maxHp) * 100) + '%';
    
    var editHp = document.getElementById('edit-hp-val');
    if (editHp) editHp.textContent = maxHp;
    var editMp = document.getElementById('edit-mp-val');
    if (editMp) editMp.textContent = maxMana;

    // 年龄寿元
    var age = state.age || 16;
    var maxAge = 120;
    if (cult.indexOf('筑基') !== -1) maxAge = 200;
    else if (cult.indexOf('结丹') !== -1) maxAge = 500;
    var ageEl = document.getElementById('sys-age-val');
    if (ageEl) ageEl.textContent = age + ' 岁 / ' + maxAge + ' 岁';

    // 逆天值
    var dev = window.deviationCount || 0;
    var fateEl = document.getElementById('sys-fate-val');
    if (fateEl) {
        var devText = '+' + dev + ' (正常因果)';
        if (dev > 10) devText = '+' + dev + ' (因果扭曲)';
        else if (dev > 2) devText = '+' + dev + ' (轻微改命)';
        fateEl.textContent = devText;
    }

    // 危机预警与主线任务同步
    var threatLvl = document.getElementById('sys-threat-lvl');
    var mainTitle = document.getElementById('sys-main-quest-title');
    var mainDesc = document.getElementById('sys-main-quest-desc');
    var dp = ArcEngine.getCurrentDecisionPoint();
    
    if (dp) {
        var dpId = dp.id || '';
        if (dpId.startsWith('qm_1')) {
            if (threatLvl) { threatLvl.textContent = '平稳日常'; threatLvl.style.color = '#34d399'; }
            if (mainTitle) mainTitle.textContent = '初入谷中';
            if (mainDesc) mainDesc.textContent = '学习辨识百草，熟悉谷内环境，并配合墨大夫进行前期修行。';
        } else if (dpId.startsWith('qm_3') || dpId.startsWith('qm_4')) {
            if (threatLvl) { threatLvl.textContent = '机缘隐现'; threatLvl.style.color = '#fbbf24'; }
            if (mainTitle) mainTitle.textContent = '药园探秘';
            if (mainDesc) mainDesc.textContent = '墨大夫传授长春功后，探查神手谷周围，寻找可改变灵根限制的先天宝物线索。';
        } else if (dpId.startsWith('qm_5')) {
            if (threatLvl) { threatLvl.textContent = '高危警报 ⚠️'; threatLvl.style.color = '#f87171'; }
            if (mainTitle) mainTitle.textContent = '神手谷避劫';
            if (mainDesc) mainDesc.textContent = '墨居仁夺舍危机降临！在木屋决战中果断出手，彻底击败墨大夫突围。';
        } else if (dpId.startsWith('hg_')) {
            if (threatLvl) { threatLvl.textContent = '名门修行'; threatLvl.style.color = '#38bdf8'; }
            if (mainTitle) mainTitle.textContent = '拜入黄枫谷';
            if (mainDesc) mainDesc.textContent = '凭借升仙令拜入越国黄枫谷，建立属于自己的洞府与药园，准备迎接升仙大会与血色试炼。';
        } else if (dpId.startsWith('bt_')) {
            if (threatLvl) { threatLvl.textContent = '高危禁地 ⚠️'; threatLvl.style.color = '#f87171'; }
            if (mainTitle) mainTitle.textContent = '血色试炼秘境';
            if (mainDesc) mainDesc.textContent = '在七大派残酷的血色禁地中搜集炼制筑基丹的珍稀灵药，击败竞争者存活到传送阵开启。';
        } else if (dpId.startsWith('md_')) {
            if (threatLvl) { threatLvl.textContent = '大战风暴 ⚠️'; threatLvl.style.color = '#ef4444'; }
            if (mainTitle) mainTitle.textContent = '魔道六宗入侵';
            if (mainDesc) mainDesc.textContent = '越国修仙界大战爆发！在黄枫谷败退之际寻找古传送阵，准备远赴未知海域避劫。';
        } else if (dpId.startsWith('lx_')) {
            if (threatLvl) { threatLvl.textContent = '海域雄霸'; threatLvl.style.color = '#a78bfa'; }
            if (mainTitle) mainTitle.textContent = '乱星海风云';
            if (mainDesc) mainDesc.textContent = '抵达天星城，在无尽外海猎杀高阶妖兽积攒灵石，图谋凝结元婴大道。';
        } else {
            // AI 动态续写通用任务
            if (threatLvl) { threatLvl.textContent = '无限篇章'; threatLvl.style.color = '#a78bfa'; }
            if (mainTitle) mainTitle.textContent = '万界天道大道';
            if (mainDesc) mainDesc.textContent = '剧情已无缝接续至 AI 动态续写篇章，请根据抉择卡片继续推进宿主的穿书传奇。';
        }
    }
}

// ── 灵识扫描器 (重构：结果持久在专区框，不写入AI终端，重新打开面板或再次扫描时更新) ──
var _lastScanLog = '';

function runSpiritSenseScan() {
    if (typeof ArcEngine === 'undefined') return;
    var dp = ArcEngine.getCurrentDecisionPoint();
    if (!dp) return;

    var dpId = dp.id || '';
    var scanLog = '';
    var toastMsg = '';
    
    if (dpId.startsWith('qm_1')) {
        scanLog = '神手谷内灵气微弱。张铁气血充沛但经脉无灵气波动；墨大夫体内气血枯竭、经脉有死气凝聚，正在暗中观察你。';
        toastMsg = '扫描完成：发现神手谷灵力分布与墨大夫死气预警！';
    } else if (dpId.startsWith('qm_3') || dpId.startsWith('qm_4')) {
        scanLog = '药园杂物房附近有微弱的时空灵力涟漪。墨大夫对你的功法进度极度关注，注意掩饰真实灵力状态。';
        toastMsg = '扫描完成：发现杂物房时空灵力涟漪，注意隐藏修为！';
    } else if (dpId.startsWith('qm_5')) {
        scanLog = '🚨 【高危预警】：墨大夫内室检测到有夺舍大阵与灵魂吞噬术的残留痕迹！墨大夫本人战力炼气期四层，身边潜藏一只名为余子童的元神体，极度危险！建议使用罗烟步和毒粉克制！';
        toastMsg = '高危预警！墨大夫潜藏夺舍大阵与余子童元神，极度危险！';
    } else if (dpId.startsWith('hg_')) {
        scanLog = '黄枫谷苍梧山脉灵气浓郁。周围有大量炼气期四~六层修士汇聚。检测到丹房与藏经阁方向有古老阵法禁制波动。';
        toastMsg = '扫描完成：苍梧山脉灵气充沛，检测到多处阵法禁制。';
    } else if (dpId.startsWith('bt_')) {
        scanLog = '🚨 【血色试炼高危预警】：当前区域充满煞气与上古残留死气。检测到周围有其他门派试炼者潜伏，小心伏击！';
        toastMsg = '高危预警：血色试炼秘境煞气弥漫，注意暗处伏击！';
    } else if (dpId.startsWith('md_')) {
        scanLog = '🚨 【魔道大战预警】：血鬼气弥漫！燕家堡大阵出现严重破损，魔道六宗高手正在快速接近。';
        toastMsg = '高危预警：魔道入侵血气弥漫，速寻古传送阵！';
    } else if (dpId.startsWith('lx_')) {
        scanLog = '乱星海浩瀚灵海区。天星城巨灵阵运转正常，外海深处检测到高阶妖兽（三级/四级妖丹）波动。';
        toastMsg = '扫描完成：天星城大阵稳定，外海发现高阶妖兽！';
    } else if (dpId.startsWith('xt_')) {
        scanLog = '🚨 【虚天殿极危扫描】：上古第一宝殿！四周充斥极寒乾蓝冰焰与上古杀阵。正魔两道元婴老怪正在暗中较劲！';
        toastMsg = '极危扫描：发现乾蓝冰焰与上古虚天鼎波动！';
    } else if (dpId.startsWith('jy_')) {
        scanLog = '元婴级天地灵压！乱星海逆星盟与天星双圣决战在即。附近天地灵气狂暴，宜渡劫突破！';
        toastMsg = '扫描完成：感应到元婴天劫灵压与异象！';
    } else {
        scanLog = '当前场景安全，灵气稀薄。无高危生命体接近。';
        toastMsg = '扫描完成：当前环境安全，无高危威胁。';
    }
    
    _lastScanLog = scanLog;
    showCyberToast(toastMsg, (dpId.startsWith('qm_5') || dpId.startsWith('bt_') || dpId.startsWith('md_') || dpId.startsWith('xt_')) ? 'warning' : 'info');
    
    var resultBox = document.getElementById('sys-scan-result-box');
    var resultContent = document.getElementById('sys-scan-result-content');
    if (resultBox && resultContent) {
        resultContent.textContent = scanLog;
        resultBox.classList.remove('hidden');
    }
}

function _isGameScreen() {
    var gs = document.getElementById('game-screen');
    return gs && gs.style.display !== 'none';
}

function toggleSystemPanel(force) {
    _sysOpen = (typeof force === 'boolean') ? force : !_sysOpen;
    if (typeof window.setFateRiverSystemMode === 'function') {
        window.setFateRiverSystemMode(_sysOpen);
    }
    var backdrop = document.getElementById('system-panel-backdrop');
    if (_sysOpen) {
        _sysPanel.classList.add('open');
        if (backdrop) backdrop.classList.add('show');
        // 打开面板时，如果不重新灵识扫描，清空旧扫描框
        var resultBox = document.getElementById('sys-scan-result-box');
        if (resultBox) resultBox.classList.add('hidden');
    } else {
        _sysPanel.classList.remove('open');
        if (backdrop) backdrop.classList.remove('show');
    }
}
window.toggleSystemPanel = toggleSystemPanel;

// 播放科幻电流/开机音效已移除
function _playSystemOpenSound() {
    // 已经移除了科幻电流音效，避免影响性能与阻断UI线程
}

// ==================== 系统消息 ====================
function _getTimestamp() {
    var d = new Date();
    var hh = ('0' + d.getHours()).slice(-2);
    var mm = ('0' + d.getMinutes()).slice(-2);
    var ss = ('0' + d.getSeconds()).slice(-2);
    return hh + ':' + mm + ':' + ss;
}

// ── 系统对话消息按书籍/存档加载与持久化 ──
function _saveSystemMessagesHistory() {
    if (!_sysMessages) return;
    var prefix = _getSysStorePrefix();
    localStorage.setItem(prefix + 'msg_history', _sysMessages.innerHTML);
}

function _loadSystemMessagesHistory() {
    if (!_sysMessages) return;
    var prefix = _getSysStorePrefix();
    var historyHtml = localStorage.getItem(prefix + 'msg_history');
    if (historyHtml) {
        _sysMessages.innerHTML = historyHtml;
    } else {
        _sysMessages.innerHTML = '';
    }
}

function sysMsg(text, type, autoSpeak) {
    if (!_sysMessages) return;
    var div = document.createElement('div');
    div.className = 'sys-log sys-log--' + (type || 'system');
    var time = _getTimestamp();
    var sysName = getSystemName();
    var labels = {
        'intro': 'SYSTEM',
        'item': 'ITEM',
        'deviation': 'DEVIATE',
        'plot': 'PLOT',
        'answer': sysName.toUpperCase(),
        'question': 'QUERY'
    };
    var label = labels[type] || 'SYSTEM';
    var tagClass = 'log-tag log-tag--' + (type || 'system');
    
    div.innerHTML = '<span class="log-time">[' + time + ']</span>' +
                    '<span class="' + tagClass + '">' + label + '</span>' +
                    '<span class="log-text">' + text + '</span>';
    
    _sysMessages.appendChild(div);
    _sysMessages.scrollTop = _sysMessages.scrollHeight;

    // 持久化当前日志到书籍/存档专属空间
    _saveSystemMessagesHistory();

    // 系统自动朗读自己的话
    if (autoSpeak !== false && typeof _sysSpeak === 'function') {
        _sysSpeak(text);
    }
}

// 玩家提问显示
function sysQuestion(text) {
    if (!_sysMessages) return;
    var div = document.createElement('div');
    div.className = 'sys-log sys-log--question';
    var time = _getTimestamp();
    div.innerHTML = '<span class="log-time">[' + time + ']</span>' +
                    '<span class="log-tag log-tag--question">QUERY</span>' +
                    '<span class="log-text">' + text + '</span>';
    _sysMessages.appendChild(div);
    _sysMessages.scrollTop = _sysMessages.scrollHeight;

    // 持久化当前日志到书籍/存档专属空间
    _saveSystemMessagesHistory();
}

// 清理文本中的 HTML 标签和 Emoji 表情，防止 TTS API 报错或朗读怪异
function _cleanTtsText(text) {
    if (!text) return '';
    // 移除 HTML 标签
    var cleaned = text.replace(/<[^>]*>/g, '');
    // 移除常见 Emoji 和特殊符号 (如 ❌, 🎉, 💊, 📜, ⚔, ❓, 🎰, 🧪, 🌿, 🏆, ✨ 等)
    cleaned = cleaned.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');
    cleaned = cleaned.replace(/[❌🎉💊📜⚔❓🎰🧪🌿🏆✨]/g, '');
    return cleaned.trim();
}

// 系统自己念话
var _sysSpeakAudio = null; // 用于缓存当前播放 of 系统语音

function _sysSpeak(text) {
    if (!text || !SYSTEM_API) return;
    
    var cleanedText = _cleanTtsText(text);
    if (!cleanedText) return;

    if (_sysSpeakAudio) {
        _sysSpeakAudio.pause();
        _sysSpeakAudio = null;
    }

    var reqBody = {
        message: cleanedText,
        npcName: SYSTEM_VOICE,
        playerAction: SYSTEM_INSTRUCTION,
        cloneName: 'system'
    };

    fetch(SYSTEM_API + '/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
        if (d.audioBase64) {
            _sysSpeakAudio = new Audio('data:audio/wav;base64,' + d.audioBase64);
            _sysSpeakAudio.play().catch(function(e) {
                console.log('[System Speak] 播放失败:', e.message);
            });
        }
    })
    .catch(function(){});
}

// ==================== 玩家提问 ====================
function sendSystemQuestion() {
    var question = _sysInput.value.trim();
    if (!question) return;
    _sysInput.value = '';
    sysQuestion(question);
    fetch(SYSTEM_API + '/system/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId: (window.gameState && window.gameState.sessionId) || '',
            bookId: (window.gameState && window.gameState.bookId) || '',
            message: question
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
        if (d.answer) sysMsg(d.answer, 'answer', true);
        else if (d.error) sysMsg('[错误] ' + d.error);
    })
    .catch(function() { sysMsg('[错误] 连接失败'); });
}

// ==================== 系统命名 UI ====================
function _showNamingUI(callback) {
    var namingHtml = '<div class="sys-naming-box">' +
        '<div style="color:#00f0ff;margin-bottom:8px;font-size:11px">检测到未命名核心。请输入新系统标识名：</div>' +
        '<input type="text" id="sys-naming-input" class="sys-naming-input" placeholder="系统标识（如：小书、书灵）" />' +
        '<button id="sys-naming-confirm" class="sys-naming-btn">INIT NAME</button>' +
        '</div>';

    var div = document.createElement('div');
    div.className = 'sys-log sys-log--intro';
    var time = _getTimestamp();
    div.innerHTML = '<span class="log-time">[' + time + ']</span>' +
                    '<span class="log-tag log-tag--system">SYSTEM</span>' +
                    '<span class="log-text">' + namingHtml + '</span>';
    _sysMessages.appendChild(div);
    _sysMessages.scrollTop = _sysMessages.scrollHeight;

    var input = document.getElementById('sys-naming-input');
    var confirmBtn = document.getElementById('sys-naming-confirm');

    function doConfirm() {
        var name = input.value.trim() || '系统';
        setSystemName(name);
        div.remove();
        if (callback) callback(name);
    }

    if (confirmBtn) confirmBtn.addEventListener('click', doConfirm);
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) doConfirm();
        });
        input.focus();
    }
}

// ==================== 欢迎语 ====================
function showSystemWelcome() {
    if (_sysWelcomeShown) return;
    _sysWelcomeShown = true;

    var currentGameState = (window.gameState) || {};
    var bookId = currentGameState.bookId || '';
    var playerName = currentGameState.playerName || '穿越者';
    var welcomeKey = 'bookemu_welcome_' + bookId;

    // 读回归数据
    var saved = null;
    try {
        var raw = localStorage.getItem(welcomeKey);
        if (raw) saved = JSON.parse(raw);
    } catch(e) {}

    var totalPlays = saved ? (saved.totalPlays || 0) + 1 : 1;
    var isFirstTime = (totalPlays <= 1);

    // 保存本次
    localStorage.setItem(welcomeKey, JSON.stringify({
        lastPlayTime: Date.now(),
        totalPlays: totalPlays,
        deviationTotal: saved ? (saved.deviationTotal || 0) : 0,
        playerName: playerName
    }));

    // 自动打开面板
    if (!_sysOpen) {
        setTimeout(function() { toggleSystemPanel(true); }, 500);
    }

    if (isFirstTime) {
        // ── 首次体验：欢迎 ──
        var bookTitle = currentGameState.bookTitle || '这个世界';
        setTimeout(function() {
            sysMsg('系统启动中……绑定成功。欢迎您，宿主！欢迎来到《' + bookTitle + '》的世界。我是你的系统助手，随时为您提供协助。按 H 键可以随时呼叫我。', 'intro', true);
        }, 800);
    }
}

function _timeAgoLocal(ts) {
    var diff = Date.now() - ts;
    var m = Math.floor(diff / 60000);
    if (m < 1) return '刚刚';
    if (m < 60) return m + '分钟';
    var h = Math.floor(m / 60);
    if (h < 24) return h + '小时' + (m % 60) + '分钟';
    var d = Math.floor(h / 24);
    return d + '天' + (h % 24) + '小时';
}

// 更新回归数据
function _updateWelcomeData() {
    var currentGameState = (window.gameState) || {};
    var bookId = currentGameState.bookId || '';
    var welcomeKey = 'bookemu_welcome_' + bookId;
    var saved = null;
    try {
        var raw = localStorage.getItem(welcomeKey);
        if (raw) saved = JSON.parse(raw);
    } catch(e) {}
    localStorage.setItem(welcomeKey, JSON.stringify({
        lastPlayTime: Date.now(),
        totalPlays: (saved ? saved.totalPlays : 0),
        deviationTotal: (saved ? saved.deviationTotal : 0) + 1,
        playerName: currentGameState.playerName || '穿越者'
    }));
}

// ── 随身物品 (储物袋) 按书籍/存档加载与持久化 ──
function _saveSystemSpaceItems() {
    var prefix = _getSysStorePrefix();
    localStorage.setItem(prefix + 'space_items', JSON.stringify(_collectedItems || []));
}

function _loadSystemSpaceItems() {
    var prefix = _getSysStorePrefix();
    var raw = localStorage.getItem(prefix + 'space_items');
    if (raw) {
        try {
            _collectedItems = JSON.parse(raw);
        } catch(e) {
            _collectedItems = [];
        }
    } else {
        _collectedItems = [];
    }
}

// ==================== 道具系统 ====================
function triggerItem(item) {
    if (!item || !item.name) return;

    // 加入储物袋
    var exists = _collectedItems.find(function(it) { return it.name === item.name; });
    if (!exists) {
        _collectedItems.push(item);
        _saveSystemSpaceItems();
    }

    // AI 解释道具
    fetch(SYSTEM_API + '/system/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId: (window.gameState && window.gameState.sessionId) || '',
            bookId: (window.gameState && window.gameState.bookId) || '',
            message: item.name || '',
            npcName: SYSTEM_VOICE,
            playerAction: SYSTEM_INSTRUCTION
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
        if (d.explanation) {
            sysMsg(d.explanation, 'item', true);
        }
    })
    .catch(function() {});

    // 如果系统面板没打开，自动弹出
    if (!_sysOpen) {
        setTimeout(function() { toggleSystemPanel(true); }, 800);
        setTimeout(function() { toggleSystemPanel(false); }, 8000);
    }
}

// ==================== 地图查看 ====================
function viewMap(itemIdx) {
    var item = _collectedItems[itemIdx];
    if (!item) return;
    openMapItem(item);
}

function openMapItem(item) {
    if (!item) return;
    sysMsg('正在打开【' + item.name + '】……', 'plot', false);

    var overlay = document.getElementById('map-overlay');
    if (!overlay) return;
    document.getElementById('map-title').textContent = item.name;
    document.getElementById('map-desc').textContent = item.desc || item.description || item.effect || '';
    document.getElementById('map-image').innerHTML = _mapImageHtml(item.name);

    overlay.style.display = 'flex';
    document.getElementById('map-close').onclick = function() {
        overlay.style.display = 'none';
    };
    overlay.onclick = function(e) {
        if (e.target === overlay) overlay.style.display = 'none';
    };
}
window.openMapItem = openMapItem;

function _mapImageHtml(name) {
    if (name.indexOf('天南') !== -1) {
        return '<svg class="tiannan-map-svg" viewBox="0 0 900 560" role="img" aria-label="天南大陆势力示意图">' +
            '<defs><filter id="mapGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
            '<pattern id="paperGrain" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="4" cy="7" r="1" fill="#806b42" opacity=".13"/><path d="M0 25 Q12 20 32 27" fill="none" stroke="#806b42" opacity=".08"/></pattern></defs>' +
            '<rect width="900" height="560" rx="20" fill="#171a1a"/><rect x="10" y="10" width="880" height="540" rx="16" fill="url(#paperGrain)" stroke="#b89a5d" opacity=".9"/>' +
            '<path class="map-land" d="M115 137 Q203 58 328 95 Q429 36 544 104 Q682 70 787 168 Q837 268 755 357 Q693 472 551 453 Q424 521 311 445 Q183 467 102 366 Q45 252 115 137Z"/>' +
            '<path class="map-river" d="M194 112 Q256 197 329 207 T449 306 T642 401"/><path class="map-river" d="M696 126 Q622 192 651 257 T561 421"/>' +
            '<g class="map-mountains"><path d="M155 188l28-47 28 47 25-38 29 45M593 154l31-52 31 52 28-42 32 50M397 420l31-49 30 49 22-34 25 36"/></g>' +
            '<g class="map-region"><path d="M278 169 Q431 112 570 187 L599 340 Q465 426 288 352Z"/><text x="442" y="273">越 国</text></g>' +
            '<g class="map-region muted"><text x="153" y="301">天罗国</text><text x="690" y="285">元武国</text><text x="446" y="482">紫金国</text></g>' +
            '<g class="map-site"><circle cx="360" cy="230" r="8"/><text x="375" y="225">镜州 · 七玄门</text></g>' +
            '<g class="map-site important" filter="url(#mapGlow)"><circle cx="496" cy="324" r="9"/><text x="511" y="320">黄枫谷</text></g>' +
            '<g class="map-site"><circle cx="544" cy="216" r="6"/><text x="557" y="211">掩月宗</text><circle cx="406" cy="352" r="6"/><text x="419" y="375">灵兽山</text></g>' +
            '<g class="map-route"><path d="M360 230 Q419 252 496 324"/><text x="397" y="288">韩立初行路线</text></g>' +
            '<text class="map-title-svg" x="450" y="62">天 南 大 陆 舆 图</text><text class="map-note" x="450" y="535">系统推演简图 · 山河万里 · 仙路初开</text>' +
            '</svg>';
    }
    if (name.indexOf('黄枫谷') !== -1) {
        return '<div class="map-placeholder">' +
            '<div style="font-size:80px;margin-bottom:20px">🏔️</div>' +
            '<div style="color:#8be0e0">黄枫谷 — 内门地形图</div>' +
            '<div style="color:#666;margin-top:10px">宗门大殿 · 丹药阁 · 藏经阁</div>' +
            '<div style="color:#555;margin-top:5px">演武场 · 外门弟子区 · 后山禁地</div>' +
            '</div>';
    }
    return '<div class="map-placeholder"><div style="font-size:80px">📜</div><div style="color:#888;margin-top:15px">暂无地图图像</div></div>';
}

// ==================== 随身系统空间与法宝鉴定 ====================
var _currentAppraisedItem = null;
function renderSystemSpace() {
    closeSystemItemSelector();
}

function openSystemItemSelector() {
    var modal = document.getElementById('sys-item-selector-modal');
    var listEl = document.getElementById('sys-selector-list');
    if (!modal || !listEl) return;

    var items = [];
    if (typeof ArcEngine !== 'undefined') {
        items = ArcEngine.getAllItems() || [];
    }

    if (items.length === 0) {
        listEl.innerHTML = '<div style="grid-column:span 2;color:rgba(0,240,255,0.4);text-align:center;padding:30px;font-size:13px;">储物袋空空如也，无法进行天道鉴定...</div>';
        modal.classList.remove('hidden');
        return;
    }

    var html = '';
    items.forEach(function(item) {
        var cleanName = (item.name || '').replace(/"/g, '&quot;');
        var typeStr = (item.type === 'weapon' ? '⚔ 法宝' : item.type === 'scroll' ? '📜 功法/卷轴' : '💊 灵丹妙药');
        html += '<div class="sys-select-item-card" onclick="selectItemForAppraisal(\'' + cleanName + '\')">' +
            '<span class="sys-select-item-name">' + item.name + '</span>' +
            '<span class="sys-select-item-type">' + typeStr + '</span>' +
            '</div>';
    });
    listEl.innerHTML = html;
    modal.classList.remove('hidden');
}

function closeSystemItemSelector() {
    var modal = document.getElementById('sys-item-selector-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function selectItemForAppraisal(itemName) {
    closeSystemItemSelector();
    appraiseSystemItem(itemName);
}

function appraiseSystemItem(itemName) {
    var items = [];
    if (typeof ArcEngine !== 'undefined') {
        items = ArcEngine.getAllItems() || [];
    }
    var item = items.find(function(it) { return it.name === itemName; });
    if (!item) return;

    _currentAppraisedItem = item;
    var contentEl = document.getElementById('sys-appraisal-content');
    if (!contentEl) return;

    // 解析当前弧中定义好的详细来历和具体效果
    var currentArc = typeof ArcEngine !== 'undefined' ? ArcEngine.getCurrentArc() : null;
    var arcItem = currentArc && currentArc.keyItems ? currentArc.keyItems.find(function(ki) { return ki.name === itemName; }) : null;

    var originText = arcItem && arcItem.origin ? arcItem.origin : '此物品在修仙界较为稀缺，其本源似与天地灵气有丝缕共鸣。';
    var effectText = arcItem && arcItem.specificEffect ? arcItem.specificEffect : '携带或使用此物可提升修行速度。灵药类建议配合高阶炼丹术炼制，请勿盲目生服。';

    var displayType = (item.type === 'weapon' ? '⚔ 法宝' : item.type === 'scroll' ? '📜 功法/卷轴' : '💊 灵丹药石');

    var html = '<div style="font-size: 20px; color: #00ffff; font-weight: bold; margin-bottom: 12px; text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);">' +
               '【鉴定品类】：' + displayType + ' — ' + item.name + '</div>' +
               '<div style="margin-bottom: 14px; line-height: 1.8; font-size: 16px;">' +
               '<strong style="color: #ff00ff; text-shadow: 0 0 6px rgba(255, 0, 255, 0.4);">【因果本源】：</strong>' + originText + '</div>' +
               '<div style="line-height: 1.8; font-size: 16px;">' +
               '<strong style="color: #ffd700; text-shadow: 0 0 6px rgba(255, 215, 0, 0.4);">【天道法则效力】：</strong>' + effectText + '</div>';

    // 如果是神秘小瓶，天道鉴定显示其属性，无催熟按钮
    if (itemName === '神秘小瓶') {
        html += '<div style="margin-top: 18px; border-top: 1px dashed rgba(0, 240, 255, 0.3); padding-top: 12px; color: #34d399; font-size: 15px; font-weight: bold; line-height: 1.6;">' +
                '提示：检测到该神器内部蕴藏天地造化之绿液。催化灵药功能需在游戏主界面的【储物袋】中直接选中该道具并点击【使用】进行触发。' +
                '</div>';
    }

    contentEl.innerHTML = html;
}

// 在储物袋中使用绿液催熟（由 game.js 调用，每日限制一次）
function triggerGreenLiquidCatalysis() {
    if (typeof ArcEngine !== 'undefined') {
        var state = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : null;
        if (state) {
            var today = new Date().toDateString();
            if (state.lastCatalysisDate === today) {
                showCyberToast('催熟失败：神秘小瓶的绿液每日仅能凝聚一滴（每日限一次）！', 'error');
                return false;
            }
            // 记录使用日期
            state.lastCatalysisDate = today;
            // 获得五百年培元草
            ArcEngine.addItem('五百年培元草', '吸收小绿瓶绿液催熟而成的珍稀年份灵药，药性极佳', 'pill', 'pill');
            addSystemPoints(50);
            showCyberToast('催熟成功！获得【五百年培元草】且因果天道积分 +50 PT！', 'success');
            return true;
        }
    }
    return false;
}

// ── 系统积分兑换功能 ──
function buyShopItem(itemName, price) {
    if (_systemPoints < price) {
        var failMsg = '兑换失败！系统积分不足 (' + _systemPoints + '/' + price + ' PT)';
        showCyberToast(failMsg, 'error');
        return;
    }
    
    _systemPoints -= price;
    _updatePointsUI(false);
    
    if (typeof ArcEngine !== 'undefined') {
        var catalog = {
            '洗髓丹': { type:'pill', icon:'pill', desc:'改善伪灵根资质，略微提升吸收灵气的速度。' },
            '隐气符': { type:'talisman', icon:'scroll', desc:'隐匿自身修为与气息，防止高阶修士窥探。' },
            '聚灵草种子': { type:'pill', icon:'pill', desc:'极适宜用掌天瓶绿液催熟的基础灵药种子。' },
            '眨眼剑法完整心得': { type:'scroll', icon:'scroll', desc:'记载眨眼剑法完整修炼心得，近身出剑迅疾如电。' },
            '天南大陆舆图': { type:'map', icon:'', desc:'标注越国、镜州、七玄门、黄枫谷及周边修仙国度的系统绘制舆图。', origin:'系统天道积分商城', specificEffect:'可在储物袋的卷轴分类中点击查看天南大陆势力与路线示意图。' }
        };
        var product = catalog[itemName] || { type:'other', icon:'', desc:'由万界修仙系统积分兑换的珍贵物资。' };
        var added = ArcEngine.addItem(itemName, product.desc, product.type, product.icon, {
            origin: product.origin || '系统天道积分商城',
            specificEffect: product.specificEffect || ''
        });
        if (!added) {
            _systemPoints += price;
            _updatePointsUI(false);
            showCyberToast('兑换失败：储物袋中已存在【' + itemName + '】', 'warning');
            return;
        }
    }
    
    var succMsg = '成功兑换【' + itemName + '】！已存入随身空间';
    showCyberToast(succMsg, 'success');
    if (typeof ArcEngine !== 'undefined' && window.gameState && window.gameState.bookId) {
        ArcEngine.save(window.gameState.bookId);
    }
    if (typeof saveProgress === 'function') saveProgress();
    renderSystemSpace();

    // 联动刷新储物袋UI (若处于打开状态)
    if (typeof renderBagItems === 'function' && typeof _bagCurrentTab !== 'undefined') {
        var bagOverlay = document.getElementById('bag-overlay');
        if (bagOverlay && !bagOverlay.classList.contains('hidden')) {
            renderBagItems(_bagCurrentTab);
        }
    }
}

// ── 抽奖逻辑 ──
var _gachaSpanning = false;
function spinGachaWheel(times) {
    if (_gachaSpanning) return;
    
    var cost = times === 1 ? 50 : 450;
    if (_systemPoints < cost) {
        var failMsg = '抽奖失败！积分不足 (' + _systemPoints + '/' + cost + ' PT)';
        showCyberToast(failMsg, 'error');
        return;
    }

    _systemPoints -= cost;
    _updatePointsUI(false);
    _gachaSpanning = true;

    var wheel = document.getElementById('sys-gacha-wheel');
    var resultEl = document.getElementById('sys-gacha-result');
    
    if (wheel) {
        var currentRotation = 360 * 5 + Math.floor(Math.random() * 360);
        wheel.style.transform = 'rotate(' + currentRotation + 'deg)';
    }
    
    if (resultEl) resultEl.textContent = '天道气运转盘疯狂转动中...';
    showCyberToast('天道气运转盘开始转动！', 'info');

    setTimeout(function() {
        _gachaSpanning = false;
        if (wheel) wheel.style.transform = 'rotate(0deg)';
        
        var pool = [
            { name: '低阶聚灵散', type: 'pill', rate: 0.4, desc: '炼气期辅助丹药，提升少许灵力' },
            { name: '隐气符', type: 'talisman', rate: 0.2, desc: '隐藏修为的珍稀纸符' },
            { name: '灵石×5', type: 'pill', rate: 0.2, desc: '基础修仙灵石' },
            { name: '风雷双翼残页', type: 'scroll', rate: 0.1, desc: '变异风雷属性遁法残页，能大幅提升速度' },
            { name: '筑基丹残方', type: 'scroll', rate: 0.08, desc: '筑基丹的部分丹方药引' },
            { name: '万界洗髓神髓', type: 'pill', rate: 0.02, desc: '可将五行伪灵根净化为双属性真灵根的逆天圣物' }
        ];

        var gachaResults = [];
        for (var t = 0; t < times; t++) {
            var rand = Math.random();
            var accumulated = 0;
            var prize = pool[0];
            for (var i = 0; i < pool.length; i++) {
                accumulated += pool[i].rate;
                if (rand <= accumulated) {
                    prize = pool[i];
                    break;
                }
            }
            gachaResults.push(prize);
        }

        if (times === 1) {
            var single = gachaResults[0];
            if (resultEl) resultEl.innerHTML = '恭喜抽中：<span style="color:#ffd700;font-weight:bold">' + single.name + '</span>！已放入储物袋';
            if (typeof ArcEngine !== 'undefined') {
                ArcEngine.addItem(single.name, single.desc, single.type, 'pill');
            }
            showCyberToast('抽奖成功！获得【' + single.name + '】', 'success');
        } else {
            var titlesArr = gachaResults.map(function(r) { return r.name; });
            if (resultEl) resultEl.innerHTML = '十连抽结果：<br>' + titlesArr.slice(0, 5).join('、') + '<br>' + titlesArr.slice(5).join('、');
            gachaResults.forEach(function(item) {
                if (typeof ArcEngine !== 'undefined') {
                    ArcEngine.addItem(item.name, item.desc, item.type, 'pill');
                }
            });
            showCyberToast('十连抽完成！已获得 10 件宝物', 'success');
        }
        
        renderSystemSpace();

        // 联动刷新储物袋UI (若处于打开状态)
        if (typeof renderBagItems === 'function' && typeof _bagCurrentTab !== 'undefined') {
            var bagOverlay = document.getElementById('bag-overlay');
            if (bagOverlay && !bagOverlay.classList.contains('hidden')) {
                renderBagItems(_bagCurrentTab);
            }
        }
    }, 3000);
}

// ── 主线任务交互逻辑 ──
function checkMainQuestStatus() {
    var feedbackEl = document.getElementById('sys-quest-interactive-feedback');
    if (!feedbackEl) return;

    if (typeof ArcEngine === 'undefined') {
        feedbackEl.innerHTML = '<span style="color:#f87171">🔍 异常：系统核心未装载。</span>';
        return;
    }

    var dp = ArcEngine.getCurrentDecisionPoint();
    var dpId = dp ? dp.id : '';
    
    // 盘点线索
    var clueText = '';
    if (dpId.startsWith('qm_1')) {
        clueText = '💡 任务线索分析：你刚刚拜入墨大夫门下。此时墨大夫仍在装作儒雅神医，但他频繁探查你的灵力与体质，暗示在图谋不轨。需抓紧时间修炼。';
    } else if (dpId.startsWith('qm_3') || dpId.startsWith('qm_4')) {
        clueText = '💡 任务线索分析：你已经掌握了长春功基础。系统在药园泥土中发现了极强时空灵力反应。暗中调查可触发因果节点，找到神物【神秘小瓶】！';
    } else if (dpId.startsWith('qm_5')) {
        clueText = '🚨 终极线索警告：墨居仁已经撕下伪善面具！夺舍危在旦夕！你必须在此战中使用罗烟步等身法灵活闪避其偷袭，且他气血枯竭难以持久战。';
    } else {
        clueText = '💡 任务线索分析：当前的历练相对平稳。建议在各选择支中选择符合“韩立行事原则”的低调稳妥选项以赚取天道逆天值。';
    }

    feedbackEl.innerHTML = '<span style="color:#00ffff; font-size: 13px; font-weight: bold;">[线索盘点完成]</span><br>' + clueText;
    showCyberToast('任务线索盘点完成', 'success');
}

function claimQuestRewards() {
    var feedbackEl = document.getElementById('sys-quest-interactive-feedback');
    if (!feedbackEl) return;

    if (typeof ArcEngine === 'undefined') {
        feedbackEl.innerHTML = '<span style="color:#f87171">❌ 异常：无法连接天道网络。</span>';
        return;
    }

    var dp = ArcEngine.getCurrentDecisionPoint();
    var dpId = dp ? dp.id : '';
    
    // 只有在击败墨大夫后或完成七玄门系列后（例如已打倒墨大夫）才能领奖
    var hasKilledMo = false;
    var state = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : null;
    if (state && state.moKilled) {
        hasKilledMo = true;
    }

    if (hasKilledMo) {
        if (state.questRewardClaimed) {
            feedbackEl.innerHTML = '<span style="color:#ffe066">⚠️ 提示：你已经领取过该主线任务的天道积分奖励，不可重复申领。</span>';
            showCyberToast('请勿重复领取奖励', 'warning');
        } else {
            state.questRewardClaimed = true;
            addSystemPoints(200);
            var statusBadge = document.getElementById('sys-quest-status-badge');
            if (statusBadge) {
                statusBadge.textContent = '已完成';
                statusBadge.style.color = '#00ff88';
                statusBadge.style.borderColor = '#00ff88';
            }
            feedbackEl.innerHTML = '<span style="color:#00ff88; font-weight:bold; font-size:14px;">🎉 恭喜！天道判定你已彻底斩杀墨居仁夺舍危机。奖励 200 PT 积分与 10 点逆天值已到账！</span>';
            showCyberToast('主线任务奖励领取成功！', 'success');
            saveProgress();
        }
    } else {
        feedbackEl.innerHTML = '<span style="color:#f87171">❌ 天道驳回：你尚未斩杀墨居仁避过夺舍危机！当前危机四伏，请在主线剧情中设法战胜墨居仁后再来领取奖励！</span>';
        showCyberToast('任务尚未完成！', 'error');
    }
}

function togglePointsExplanation(event) {
    if (event) {
        event.stopPropagation();
    }
    var bubble = document.getElementById('sys-points-explanation');
    if (bubble) {
        bubble.classList.toggle('hidden');
    }
}
function sysTriggerItem(item) { triggerItem(item); }
function sysTriggerDeviation() {
    _updateWelcomeData();
    sysMsg('命运线发生偏移。' + getSystemName() + '正在重新计算当前路线的风险……', 'deviation', true);
}
function sysTriggerPlot(text) {
    sysMsg(text, 'plot', true);
}

// 页面加载初始化
document.addEventListener('DOMContentLoaded', function() {
    var check = setInterval(function() {
        if (document.getElementById('system-panel')) {
            initSystemPanel();
            clearInterval(check);
        }
    }, 500);
});
