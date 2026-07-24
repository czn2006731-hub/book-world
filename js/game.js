// ==================== 游戏界面逻辑（线性文字交互） ====================
const API_BASE = 'http://localhost:8080/api';

// ==================== 心态系统 ====================
const MOOD_LIST = [
    { id:'calm',name:'平静',color:'#7cb3f5',icon:'&#' },
    { id:'excited',name:'兴奋',color:'#f0a030' },
    { id:'nervous',name:'紧张',color:'#e06080' },
    { id:'angry',name:'愤怒',color:'#e04040' },
    { id:'sad',name:'低落',color:'#8090b0' },
    { id:'confident',name:'自信',color:'#50c878' },
    { id:'fearful',name:'恐惧',color:'#a060c0' },
    { id:'curious',name:'好奇',color:'#60c0d0' },
    { id:'determined',name:'坚定',color:'#e08040' },
    { id:'confused',name:'迷茫',color:'#9090a0' }
];

// ==================== 游戏状态 ====================
let gameState = {
    bookId: null,
    bookTitle: '',
    playerName: '',
    segIdx: 0,         // 当前段索引
    introIdx: 0,       // 序章索引
    inIntro: true,     // 是否在序章中
    currentMood: null,
    sessionId: null,   // 后端会话ID
    currentScene: '',   // 当前场景描述（给AI上下文）
};
window.gameState = gameState;

// 打字状态
var _twCancel = null;
var _typing = false;
var _typingDone = false;
var _choiceMade = false;
var _savedHtml = '';    // 保存当前段的完整HTML
var _segEl = null;
var _hintEl = null;
var _clickTarget = null;

// 偏离计数
let deviationCount = 0;

// ==================== 书籍数据 ====================
const BOOK_DATA = {};

function registerBook(bookId, data) {
    BOOK_DATA[bookId] = data;
}

// ==================== 保存 / 加载进度 ====================
function saveProgress() {
    var key = 'bookemu_progress_' + gameState.bookId;
    var data = {
        segIdx: gameState.segIdx,
        deviations: deviationCount,
        time: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));
    // 同步到星座探索进度
    syncExplorationProgress();
}

function loadProgress() {
    var key = 'bookemu_progress_' + gameState.bookId;
    var raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch(e) {
        return null;
    }
}

function clearProgress() {
    var key = 'bookemu_progress_' + gameState.bookId;
    localStorage.removeItem(key);
    // 重置探索进度
    syncExplorationProgress(0);
}

function syncExplorationProgress(forceValue) {
    if (!gameState.nebulaBookId) return;
    var expKey = 'bookEmu_exploration';
    var expData = {};
    try { expData = JSON.parse(localStorage.getItem(expKey) || '{}'); } catch(e) {}
    if (!expData[gameState.nebulaBookId]) expData[gameState.nebulaBookId] = {progress:0, played:false};
    expData[gameState.nebulaBookId].played = true;
    if (typeof forceValue !== 'undefined') {
        expData[gameState.nebulaBookId].progress = Math.max(0, Math.min(100, forceValue));
    } else {
        var bookData = BOOK_DATA[gameState.bookId];
        if (bookData && bookData.segments) {
            var total = bookData.segments.length;
            expData[gameState.nebulaBookId].progress = total > 0 ? Math.round((gameState.segIdx / total) * 100) : 0;
        }
    }
    localStorage.setItem(expKey, JSON.stringify(expData));
}

// ==================== Typewriter ====================
function typeWriter(container, html, onComplete) {
    var tokens = [];
    var i = 0;
    while (i < html.length) {
        if (html[i] === '<') {
            var end = html.indexOf('>', i);
            if (end !== -1) { tokens.push(html.substring(i, end + 1)); i = end + 1; }
            else { tokens.push(html[i]); i++; }
        } else { tokens.push(html[i]); i++; }
    }
    container.innerHTML = '';
    var idx = 0;
    var buffer = '';
    var key = {};
    _twCancel = key;
    function next() {
        if (_twCancel !== key) return;
        if (idx >= tokens.length) {
            _typing = false;
            if (onComplete) onComplete();
            return;
        }
        var token = tokens[idx]; idx++;
        buffer += token;
        container.innerHTML = buffer;
        var delay = 55;
        if (token.length === 1 && '，。！？；：、'.indexOf(token) !== -1) delay = 350;
        setTimeout(next, delay);
    }
    next();
}

// ==================== 术语标注 ====================
function annotateText(text, glossary, nameGlossary) {
    if (!text) return '';
    var result = text;
    var allTerms = {};
    if (glossary) Object.keys(glossary).forEach(function(k) { allTerms[k] = glossary[k]; });
    if (nameGlossary) Object.keys(nameGlossary).forEach(function(k) { allTerms[k] = nameGlossary[k]; });
    var sorted = Object.keys(allTerms).sort(function(a, b) { return b.length - a.length; });
    sorted.forEach(function(term) {
        var escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp(escaped, 'g');
        result = result.replace(regex, '<span class="glossary-term" title="' + allTerms[term].replace(/"/g, '&quot;') + '">' + term + '</span>');
    });
    return result;
}

// ==================== 命运长河 Canvas ====================
var _starCanvasRunning = false;
var _starAnimationFrame = null;
var _starResizeHandler = null;
var _fateRiverState = {
    hover: null,
    branches: [],
    ripples: [],
    systemMode: false,
    pointerX: 0,
    pointerY: 0,
    eventsBound: false
};

function _getFateTheme() {
    var id = (gameState.bookId || '').toLowerCase();
    var type = window.currentNebulaType || '';
    if (id.indexOf('scifi') !== -1 || id.indexOf('santi') !== -1 || type === 'scifi') {
        return { main:[84,192,229], accent:[121,141,255], warm:[110,231,255], glyph:'01' };
    }
    if (id.indexOf('romance') !== -1 || id.indexOf('honglou') !== -1 || type === 'romance') {
        return { main:[218,145,156], accent:[230,190,126], warm:[184,114,139], glyph:'诗' };
    }
    if (id.indexOf('fantasy') !== -1 || id.indexOf('dune') !== -1 || type === 'fantasy') {
        return { main:[222,169,86], accent:[164,108,68], warm:[240,203,125], glyph:'纹' };
    }
    return { main:[91,205,198], accent:[218,181,104], warm:[107,157,196], glyph:'道' };
}

function _bindFateRiverEvents() {
    if (_fateRiverState.eventsBound) return;
    _fateRiverState.eventsBound = true;
    document.addEventListener('mousemove', function(e) {
        _fateRiverState.pointerX = e.clientX;
        _fateRiverState.pointerY = e.clientY;
        var card = e.target.closest ? e.target.closest('.choice-card') : null;
        if (!card || !card.closest('#game-screen')) {
            _fateRiverState.hover = null;
            return;
        }
        var rect = card.getBoundingClientRect();
        _fateRiverState.hover = {
            x: rect.left,
            y: rect.top + rect.height / 2,
            original: card.classList.contains('choice-original')
        };
    });
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest && e.target.closest('.choice-card')) {
            var next = e.relatedTarget;
            if (!next || !next.closest || !next.closest('.choice-card')) _fateRiverState.hover = null;
        }
    });
    document.addEventListener('click', function(e) {
        var card = e.target.closest ? e.target.closest('.choice-card') : null;
        if (!card || !card.closest('#game-screen') || card.classList.contains('disabled')) return;
        var rect = card.getBoundingClientRect();
        triggerFateRiverChoice(card.classList.contains('choice-original'), {
            x: rect.left,
            y: rect.top + rect.height / 2
        });
    }, true);
}

function triggerFateRiverChoice(isOriginal, source) {
    var canvas = document.getElementById('game-stars-canvas');
    if (!canvas) return;
    var x = source && source.x != null ? source.x : canvas.width * 0.5;
    var y = source && source.y != null ? source.y : canvas.height * 0.55;
    _fateRiverState.branches.push({
        x: x,
        y: y,
        original: !!isOriginal,
        born: performance.now(),
        seed: Math.random() * 1000
    });
    _fateRiverState.ripples.push({ x:x, y:y, born:performance.now(), gold:!isOriginal });
}
window.triggerFateRiverChoice = triggerFateRiverChoice;

function setFateRiverSystemMode(active) {
    _fateRiverState.systemMode = !!active;
}
window.setFateRiverSystemMode = setFateRiverSystemMode;

function triggerFateRiverReward() {
    var canvas = document.getElementById('game-stars-canvas');
    if (!canvas) return;
    _fateRiverState.ripples.push({
        x: canvas.clientWidth * 0.5,
        y: canvas.clientHeight * 0.48,
        born: performance.now(),
        gold: true
    });
}
window.triggerFateRiverReward = triggerFateRiverReward;

function startStarCanvas() {
    var canvas = document.getElementById('game-stars-canvas');
    if (!canvas) return;
    canvas.style.display = '';
    if (_starCanvasRunning) return;
    _starCanvasRunning = true;
    _bindFateRiverEvents();
    var ctx = canvas.getContext('2d');
    var motes = [], pages = [], nodes = [];
    var W, H, DPR = 1;
    var systemMix = 0;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        DPR = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(W * DPR);
        canvas.height = Math.round(H * DPR);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    _starResizeHandler = resize;
    window.addEventListener('resize', _starResizeHandler);
    resize();

    var mobile = W < 760;
    for (var i = 0; i < (mobile ? 46 : 84); i++) {
        motes.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.6 + 0.4,
            speed: Math.random() * 0.09 + 0.025,
            phase: Math.random() * Math.PI * 2,
            lane: Math.floor(Math.random() * 4)
        });
    }
    for (var p = 0; p < (mobile ? 3 : 7); p++) {
        pages.push({
            x: Math.random() * W,
            y: Math.random() * H,
            w: Math.random() * 34 + 38,
            h: Math.random() * 48 + 56,
            speed: Math.random() * 0.04 + 0.018,
            angle: (Math.random() - 0.5) * 0.5,
            phase: Math.random() * Math.PI * 2
        });
    }
    for (var n = 0; n < 9; n++) nodes.push({ t:n / 8, phase:Math.random() * Math.PI * 2 });

    function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

    function riverY(x, lane, time) {
        var base = H * (0.48 + lane * 0.035);
        var systemStrength = 1 - systemMix * 0.82;
        return base + Math.sin(x * 0.006 + time * 0.00022 + lane * 1.55) * H * 0.075 * systemStrength +
            Math.sin(x * 0.012 - time * 0.00013 + lane) * H * 0.025 * systemStrength;
    }

    function drawSystemGrid(theme) {
        if (systemMix < 0.01) return;
        ctx.save();
        ctx.strokeStyle = rgba(theme.main, 0.065 * systemMix);
        ctx.lineWidth = 0.7;
        for (var x = 24; x < W; x += 48) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (var y = 24; y < H; y += 48) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawRiver(time, theme) {
        var parallaxX = (_fateRiverState.pointerX / Math.max(W, 1) - 0.5) * 16;
        var parallaxY = (_fateRiverState.pointerY / Math.max(H, 1) - 0.5) * 10;
        for (var lane = 0; lane < 4; lane++) {
            ctx.beginPath();
            for (var x = -40; x <= W + 40; x += 18) {
                var y = riverY(x + parallaxX, lane, time) + parallaxY;
                if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            var color = lane === 2 ? theme.accent : theme.main;
            ctx.strokeStyle = rgba(color, lane === 1 ? 0.42 : 0.2);
            ctx.lineWidth = lane === 1 ? 2.2 : 1.05;
            ctx.shadowColor = rgba(color, 0.7);
            ctx.shadowBlur = lane === 1 ? 16 : 8;
            ctx.stroke();
        }
        ctx.shadowBlur = 0;

        nodes.forEach(function(node, idx) {
            var x = ((node.t * 1.2 + time * 0.000012) % 1.2) * W - W * 0.1;
            var y = riverY(x, 1, time);
            var pulse = 0.55 + Math.sin(time * 0.002 + node.phase) * 0.25;
            ctx.beginPath();
            ctx.arc(x, y, idx % 3 === 0 ? 3.2 : 2.1, 0, Math.PI * 2);
            ctx.fillStyle = rgba(idx % 3 === 0 ? theme.accent : theme.main, pulse);
            ctx.shadowColor = rgba(theme.main, 0.85);
            ctx.shadowBlur = 12;
            ctx.fill();
        });
        ctx.shadowBlur = 0;
    }

    function drawPages(time, theme) {
        pages.forEach(function(page) {
            if (!reducedMotion) {
                page.y -= page.speed;
                page.x += Math.sin(time * 0.00035 + page.phase) * 0.025;
            }
            if (page.y < -page.h) { page.y = H + page.h; page.x = Math.random() * W; }
            ctx.save();
            ctx.translate(page.x, page.y);
            ctx.rotate(page.angle + Math.sin(time * 0.0002 + page.phase) * 0.08);
            ctx.fillStyle = rgba(theme.warm, 0.025);
            ctx.strokeStyle = rgba(theme.accent, 0.09);
            ctx.lineWidth = 0.8;
            ctx.fillRect(-page.w/2, -page.h/2, page.w, page.h);
            ctx.strokeRect(-page.w/2, -page.h/2, page.w, page.h);
            ctx.fillStyle = rgba(theme.accent, 0.08);
            ctx.font = '12px serif';
            ctx.textAlign = 'center';
            ctx.fillText(theme.glyph, 0, -page.h * 0.2);
            for (var l = 0; l < 4; l++) ctx.fillRect(-page.w * 0.28, l * 8, page.w * 0.56, 0.7);
            ctx.restore();
        });
    }

    function drawInteraction(time, theme) {
        var hover = _fateRiverState.hover;
        if (hover) {
            var targetY = riverY(W * 0.16, 1, time);
            var color = hover.original ? theme.main : theme.accent;
            ctx.beginPath();
            ctx.moveTo(hover.x, hover.y);
            ctx.bezierCurveTo(hover.x - 70, hover.y, W * 0.3, targetY, W * 0.08, targetY);
            ctx.strokeStyle = rgba(color, 0.4);
            ctx.lineWidth = 1.3;
            ctx.shadowColor = rgba(color, 0.8);
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        for (var i = _fateRiverState.branches.length - 1; i >= 0; i--) {
            var branch = _fateRiverState.branches[i];
            var age = (time - branch.born) / 2400;
            if (age >= 1) { _fateRiverState.branches.splice(i, 1); continue; }
            var color = branch.original ? theme.main : theme.accent;
            var endX = W * (branch.original ? 0.14 : 0.82);
            var endY = riverY(endX, branch.original ? 1 : 2, time) + (branch.original ? -12 : 34);
            ctx.beginPath();
            ctx.moveTo(branch.x, branch.y);
            ctx.bezierCurveTo(branch.x - 80, branch.y, endX + 100, endY + Math.sin(branch.seed) * 40, endX, endY);
            ctx.strokeStyle = rgba(color, Math.sin(Math.PI * age) * 0.85);
            ctx.lineWidth = branch.original ? 2 : 2.8;
            ctx.shadowColor = rgba(color, 0.9);
            ctx.shadowBlur = 18;
            ctx.stroke();
        }
        ctx.shadowBlur = 0;
        for (var r = _fateRiverState.ripples.length - 1; r >= 0; r--) {
            var ripple = _fateRiverState.ripples[r];
            var life = (time - ripple.born) / 1500;
            if (life >= 1) { _fateRiverState.ripples.splice(r, 1); continue; }
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, 12 + life * 85, 0, Math.PI * 2);
            ctx.strokeStyle = rgba(ripple.gold ? theme.accent : theme.main, (1-life) * 0.5);
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    function draw(time) {
        if (!_starCanvasRunning) return;
        time = time || 0;
        var targetSystemMix = _fateRiverState.systemMode ? 1 : 0;
        systemMix += (targetSystemMix - systemMix) * 0.035;
        ctx.clearRect(0, 0, W, H);
        var theme = _getFateTheme();
        var ambienceTime = reducedMotion ? 0 : time;
        drawSystemGrid(theme);
        drawPages(ambienceTime, theme);
        drawRiver(ambienceTime, theme);
        motes.forEach(function(mote) {
            mote.x += reducedMotion ? 0 : mote.speed;
            if (mote.x > W + 8) mote.x = -8;
            var y = riverY(mote.x, mote.lane, ambienceTime) + Math.sin(ambienceTime * 0.001 + mote.phase) * 10;
            ctx.beginPath();
            ctx.arc(mote.x, y, mote.r, 0, Math.PI * 2);
            ctx.fillStyle = rgba(mote.lane === 2 ? theme.accent : theme.main, 0.22 + mote.r * 0.12);
            ctx.fill();
        });
        drawInteraction(time, theme);
        _starAnimationFrame = requestAnimationFrame(draw);
    }
    draw();
}

function stopStarCanvas() {
    _starCanvasRunning = false;
    if (_starAnimationFrame) cancelAnimationFrame(_starAnimationFrame);
    if (_starResizeHandler) window.removeEventListener('resize', _starResizeHandler);
    _starAnimationFrame = null;
    _starResizeHandler = null;
    var canvas = document.getElementById('game-stars-canvas');
    if (canvas) {
        canvas.style.display = 'none';
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// ==================== 全星系通用 AI 穿书人生模拟引擎 ====================
function showUniversalAiLifeSegment(lastChoice) {
    var display = document.getElementById('game-chapter-display');
    if (!display) return;

    var bookTitle = gameState.bookTitle || (_landingBook ? _landingBook.title : '未知书籍');
    var bookAuthor = _landingBook ? _landingBook.author : '无名氏';

    // 实时更新顶部人生模拟状态栏
    if (typeof updateLifeSimBarUI === 'function') {
        updateLifeSimBarUI();
    }

    var html = '<div class="seg-page"><div class="seg-date">星历 · 穿书第 ' + (gameState.segIdx + 1) + ' 纪</div>';
    html += '<div class="seg-box act-box">';
    html += '<div class="seg-txt typing" id="game-segTxt">✨ 正在从万界时空长河中唤醒《' + bookTitle + '》的世界线...</div>';
    
    // 生成通用模拟大抉择按钮
    html += '<div class="choice-area" id="game-choiceArea" style="display:none;">';
    html += '<div class="choice-hint">万界天道分支——选择你的下一步人生道路</div>';
    html += '<div class="choice-cards" id="game-choiceCards">';
    
    var choiceList = [
        { label: '遵循本能：顺应《' + bookTitle + '》的大势发展', original: true },
        { label: '逆天改命：尝试打破《' + bookTitle + '》的既定宿命', original: false }
    ];

    choiceList.forEach(function(c, ci) {
        var extraClass = c.original ? ' choice-original' : '';
        var tag = c.original ? '<span class="choice-tag">顺应天意</span>' : '<span class="choice-tag tag-diverge">逆天改命</span>';
        html += '<div class="choice-card' + extraClass + '" data-idx="' + ci + '" onclick="onUniversalChoice(' + ci + ', \'' + c.label + '\', ' + c.original + ')">' +
            tag + '<div class="card-label">' + c.label + '</div></div>';
    });
    
    html += '</div></div>';
    html += '<div class="seg-hint" id="game-segHint" style="display:none;">按任意键继续</div>';
    html += '</div></div>';

    display.innerHTML = html;

    _segEl = document.getElementById('game-segTxt');
    _hintEl = document.getElementById('game-segHint');

    // 请求后端 AI 生成通用穿书人生历程
    fetch(API_BASE + '/story/universal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bookId: gameState.bookId,
            playerName: bookTitle,
            npcName: bookAuthor,
            message: lastChoice || '初入世界',
            playerAction: gameState.currentScene || '穿越降临'
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        var narrativeText = data.narrative || ('你成功穿越到了《' + bookTitle + '》的世界。四下里灵气涌动，风云变幻，属于你的传奇人生正式拉开帷幕。');
        gameState.currentScene = narrativeText;
        _savedHtml = narrativeText;
        _segEl.innerHTML = '';
        
        // 播放语音
        if (typeof playNarration === 'function') {
            playNarration(narrativeText, gameState.bookId);
        }

        _typing = true;
        typeWriter(_segEl, narrativeText, function() {
            _segEl.classList.remove('typing');
            _typing = false;
            _typingDone = true;
            if (_hintEl) _hintEl.style.display = '';
            var ca = document.getElementById('game-choiceArea');
            if (ca) ca.style.display = 'block';
        });
    })
    .catch(function(e) {
        var fallbackText = '你成功降临至《' + bookTitle + '》的世界。天地玄黄，宇宙洪荒，你凝视着这个波澜壮阔的新世界，迈出了人生的第一步。';
        _savedHtml = fallbackText;
        _segEl.innerHTML = fallbackText;
        _segEl.classList.remove('typing');
        var ca = document.getElementById('game-choiceArea');
        if (ca) ca.style.display = 'block';
    });
}

function onUniversalChoice(choiceIdx, label, isOriginal) {
    if (!isOriginal) window.deviationCount = (window.deviationCount || 0) + 1;
    _advancePlayerAgeOnChoice(isOriginal);
    gameState.segIdx++;

    // 体验满10个纪元后触发人生结算
    if (gameState.segIdx >= 10) {
        showLifeSummaryModal();
        return;
    }

    showUniversalAiLifeSegment(label);
}

// ==================== AI 动态接续无限长篇剧情引擎 ====================
function showContinuedAiStorySegment(lastChoiceLabel) {
    var display = document.getElementById('game-chapter-display');
    if (!display) return;

    var bookTitle = gameState.bookTitle || (_landingBook ? _landingBook.title : '修仙世界');

    // 实时更新顶部人生模拟状态栏
    if (typeof updateLifeSimBarUI === 'function') {
        updateLifeSimBarUI();
    }

    var html = '<div class="seg-page"><div class="seg-date">《' + bookTitle + '》· 续篇第 ' + (gameState.segIdx - 2 || 1) + ' 卷</div>';
    html += '<div class="seg-box act-box">';
    html += '<div class="seg-txt typing" id="game-segTxt">✨ 正在结合原著世界观与宿主历史因果，推演《' + bookTitle + '》后续篇章...</div>';
    
    html += '<div class="choice-area" id="game-choiceArea" style="display:none;">';
    html += '<div class="choice-hint">' + t('choice_hint') + '</div>';
    html += '<div class="choice-cards" id="game-choiceCards"></div>';
    html += '</div>';
    html += '<div class="seg-hint" id="game-segHint" style="display:none;">按任意键继续</div>';
    html += '</div></div>';

    display.innerHTML = html;

    _segEl = document.getElementById('game-segTxt');
    _hintEl = document.getElementById('game-segHint');

    // 调用后端结构化续写 API
    fetch(API_BASE + '/story/continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            bookId: gameState.bookId,
            playerName: bookTitle,
            message: lastChoiceLabel || '跨越当前大劫',
            playerAction: gameState.currentScene || '修为突破'
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        var narrativeText = data.narrative || ('宿主在《' + bookTitle + '》的大浪淘沙中勇往直前，克服重重劫难，迈向更高的境界。');
        var choicesList = data.choices || [
            { label: '顺应《' + bookTitle + '》大势发展', original: true },
            { label: '尝试改写当前命运劫数', original: false },
            { label: '潜心闭关修炼寻求突破', original: false },
            { label: '探寻秘境寻找远古传承', original: false }
        ];

        gameState.currentScene = narrativeText;
        _savedHtml = narrativeText;
        _segEl.innerHTML = '';

        // 渲染 4 个动态生成的命运选项卡片
        var choiceCardsEl = document.getElementById('game-choiceCards');
        if (choiceCardsEl) {
            var cardsHtml = '';
            choicesList.forEach(function(c, ci) {
                var extraClass = c.original ? ' choice-original' : '';
                var tag = c.original ? '<span class="choice-tag">' + t('tag_original') + '</span>' : '<span class="choice-tag tag-diverge">' + t('tag_diverge') + '</span>';
                cardsHtml += '<div class="choice-card' + extraClass + '" data-idx="' + ci + '" onclick="onContinuedChoice(' + ci + ', \'' + (c.label || '').replace(/'/g, "\\'") + '\', ' + !!c.original + ')">' +
                    tag + '<div class="card-label">' + (c.label || '进行选择') + '</div></div>';
            });
            choiceCardsEl.innerHTML = cardsHtml;
        }

        // 播放故事语音
        if (typeof playNarration === 'function') {
            playNarration(narrativeText, gameState.bookId);
        }

        _typing = true;
        typeWriter(_segEl, narrativeText, function() {
            _segEl.classList.remove('typing');
            _typing = false;
            _typingDone = true;
            if (_hintEl) _hintEl.style.display = '';
            var ca = document.getElementById('game-choiceArea');
            if (ca) ca.style.display = 'block';
        });
    })
    .catch(function(e) {
        var fallbackText = '你在《' + bookTitle + '》中继续修行，风云变幻，天地玄黄。';
        _savedHtml = fallbackText;
        _segEl.innerHTML = fallbackText;
        _segEl.classList.remove('typing');
        var ca = document.getElementById('game-choiceArea');
        if (ca) ca.style.display = 'block';
    });
}

function onContinuedChoice(choiceIdx, label, isOriginal) {
    if (!isOriginal) window.deviationCount = (window.deviationCount || 0) + 1;
    _advancePlayerAgeOnChoice(isOriginal);
    gameState.segIdx++;

    // 体验满 20 纪元（或达到大限寿元）后进入人生重开总结
    if (gameState.segIdx >= 20) {
        showLifeSummaryModal();
        return;
    }

    showContinuedAiStorySegment(label);
}

// ==================== 显示当前段 ====================
function showCurrentSegment() {
    var bookData = BOOK_DATA[gameState.bookId];
    if (!bookData || !bookData.segments) return;

    var segs = bookData.segments;
    if (gameState.segIdx >= segs.length) {
        // 静态剧本播放完毕 → 无缝接续 AI 动态生成后续长篇剧情与4个决策选项！
        showContinuedAiStorySegment();
        return;
    }

    var seg = segs[gameState.segIdx];
    var display = document.getElementById('game-chapter-display');
    var bookDate = seg.date || '';

    // 保存场景上下文给 AI
    gameState.currentScene = (seg.text || '').replace(/\n/g, ' ').substring(0, 200);

    // 实时更新顶部人生模拟状态栏
    if (typeof updateLifeSimBarUI === 'function') {
        updateLifeSimBarUI();
    }

    // 检查是否有道具触发
    if (seg.item && typeof triggerItem === 'function') {
        setTimeout(function() { triggerItem(seg.item); }, 1500);
    }

    var html = '<div class="seg-page"><div class="seg-date">' + bookDate + '</div>';
    html += '<div class="seg-box ' + (seg.type === 'event' ? 'ev-box' : 'act-box') + '">';

    // 文本区
    var annotated = annotateText(tl(seg.text).replace(/\n/g, '<br>'), tl(bookData.glossary), tl(bookData.nameGlossary));
    _savedHtml = annotated;
    html += '<div class="seg-txt" id="game-segTxt"></div>';

    if (seg.type === 'action' && seg.choices) {
        html += '<div class="choice-area" id="game-choiceArea">';
        html += '<div class="choice-hint">' + t('choice_hint') + '</div>';
        html += '<div class="choice-cards" id="game-choiceCards">';
        seg.choices.forEach(function(c, ci) {
            var extraClass = c.original ? ' choice-original' : '';
            var tag = c.original ? '<span class="choice-tag">' + t('tag_original') + '</span>' : '<span class="choice-tag tag-diverge">' + t('tag_diverge') + '</span>';
            html += '<div class="choice-card' + extraClass + '" data-idx="' + ci + '" onclick="onChoice(' + ci + ')">' +
                tag + '<div class="card-label">' + tl(c.label) + '</div></div>';
        });
        html += '</div>';
        html += '<div id="game-resultArea"></div>';
        html += '</div>';
    }

    html += '<div class="seg-hint" id="game-segHint">' + t('seg_hint') + '</div>';
    html += '</div></div>';

    display.innerHTML = html;

    _segEl = document.getElementById('game-segTxt');
    _hintEl = document.getElementById('game-segHint');
    _hintEl.style.display = 'none';

    // 点击事件：打字中 → 全显；全显后 → 下一段
    _clickTarget = document.getElementById('game-main-content');
    _clickTarget.style.cursor = 'pointer';
    _clickTarget.onclick = function(e) {
        if (e.target.closest('.glossary-term')) return;
        handleSegClick();
    };

    // 开始打字
    _typing = true;
    _typingDone = false;
    _choiceMade = false;
    _segEl.classList.add('typing');

    // 播放段落旁白 TTS
    if (typeof playNarration === 'function') {
        // 清理文本中的 HTML 标签后再朗读
        var plainText = seg.text.replace(/<[^>]*>/g, '');
        playNarration(plainText, gameState.bookId);
    }

    typeWriter(_segEl, _savedHtml, function() {
        _segEl.classList.remove('typing');
        _typing = false;
        _typingDone = true;
        _hintEl.style.display = '';
        var ca = document.getElementById('game-choiceArea');
        if (ca) ca.style.display = 'block';
    });

    // 保存进度
    saveProgress();
}

function handleSegClick() {
    if (_typing) {
        _twCancel = null;
        _segEl.classList.remove('typing');
        _segEl.innerHTML = _savedHtml;
        _typing = false;
        _typingDone = true;
        _hintEl.style.display = '';
        var ca = document.getElementById('game-choiceArea');
        if (ca) ca.style.display = 'block';
    } else if (_typingDone) {
        gameState.segIdx++;
        showCurrentSegment();
    }
}

// ==================== 选择处理 ====================
function onChoice(choiceIdx) {
    var bookData = BOOK_DATA[gameState.bookId];
    var seg = bookData.segments[gameState.segIdx];
    var choice = seg.choices[choiceIdx];

    // 禁用所有卡片
    document.querySelectorAll('.choice-card').forEach(function(c) { c.classList.add('disabled'); });
    var card = document.querySelector('.choice-card[data-idx="' + choiceIdx + '"]');
    if (card) card.classList.add('selected');

    if (!choice.original) {
        deviationCount++;
        showDevNotice();

        // 系统：命运偏移提醒
        if (typeof sysTriggerDeviation === 'function') {
            sysTriggerDeviation();
        }

        // AI 生成偏离原著的新剧情
        if (typeof generateAIStory === 'function') {
            var aiContainer = document.createElement('div');
            aiContainer.className = 'ai-story';
            aiContainer.innerHTML = '<div class="ai-loading">⭐ AI正在生成新的命运线...</div>';
            resultArea.appendChild(aiContainer);

            generateAIStory(choice.label, gameState.currentScene || seg.text, function(err, narrative) {
                if (err) {
                    aiContainer.innerHTML = '<div class="choice-result" style="color:#e06060">[AI生成失败: ' + err + ']</div>';
                } else {
                    var annotated = annotateText(narrative.replace(/\n/g, '<br>'), bookData.glossary, bookData.nameGlossary);
                    aiContainer.innerHTML = '<div class="ai-label">✨ 命运分支</div><div class="choice-result">' + annotated + '</div>';
                }
            });
        }
    }

    var resultArea = document.getElementById('game-resultArea');
    var devTag = choice.original ? '' : '<div class="deviation-badge">&#10026; ' + t('bad_original').slice(2) + '</div>';
    resultArea.innerHTML = devTag + '<div class="choice-result">' +
        annotateText(tl(choice.result).replace(/\n/g, '<br>'), tl(bookData.glossary), tl(bookData.nameGlossary)) +
        '</div>';

    // 隐藏继续提示，换成点击继续
    _hintEl.style.display = '';
    _typing = false;
    _typingDone = true;
    _choiceMade = true;

    // 向后端报告选择
    if (gameState.sessionId) {
        fetch(API_BASE + '/chat/choice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: gameState.sessionId,
                bookId: gameState.bookId,
                choiceIndex: choiceIdx,
                choiceLabel: choice.label,
                isOriginal: choice.original
            })
        }).catch(function() {});
    }

    saveProgress();
}

function showDevNotice() {
    var existing = document.getElementById('deviation-notice');
    if (existing) existing.remove();
    var msgs = [
        '你第一次偏离了原定的命运轨迹……',
        '命运之线正在悄然改变。',
        '这个世界开始因你而不同。',
        '你已多次改写命运，前方的路不再可预测。',
        '命运已经彻底改变，你走出了属于自己的道路。'
    ];
    var idx = Math.min(deviationCount - 1, msgs.length - 1);
    var el = document.createElement('div');
    el.id = 'deviation-notice';
    el.className = 'deviation-notice';
    el.textContent = msgs[idx];
    document.getElementById('game-main-content').appendChild(el);
    setTimeout(function() { el.classList.add('show'); }, 10);
    setTimeout(function() { el.classList.remove('show'); setTimeout(function() { el.remove(); }, 600); }, 3500);
}

// ==================== 序章 ====================
var _introEl = null;
var _introTxtEl = null;
var _introHintEl = null;

function startIntro() {
    var bookData = BOOK_DATA[gameState.bookId];
    if (!bookData || !bookData.intro || bookData.intro.length === 0) {
        finishIntro();
        return;
    }
    gameState.inIntro = true;
    gameState.introIdx = 0;

    // 星空背景
    startStarCanvas();
    document.getElementById('game-vignette').style.display = '';
    document.getElementById('game-bg-layer').style.display = 'none';
    document.getElementById('game-main-content').style.display = 'none';

    _introEl = document.getElementById('game-intro');
    _introTxtEl = document.getElementById('game-intro-text');
    _introHintEl = document.getElementById('game-intro-hint');
    _introHintEl.textContent = t('intro_hint');
    _introHintEl.style.display = 'none';

    _introEl.classList.add('active');
    _introEl.onclick = function() { handleIntroClick(); };

    showIntroText();
}

function showIntroText() {
    var bookData = BOOK_DATA[gameState.bookId];
    var data = bookData.intro[gameState.introIdx];
    if (!data) { finishIntro(); return; }

    document.getElementById('game-intro-title').textContent = tl(data.title) || '';
    _typing = true;
    _typingDone = false;
    _savedHtml = tl(data.html);
    _introTxtEl.classList.add('typing');
    _introTxtEl.innerHTML = '';
    _introHintEl.style.display = 'none';

    // 播放序章旁白 TTS
    if (typeof playNarration === 'function') {
        var plainText = tl(data.html).replace(/<[^>]*>/g, '');
        playNarration(plainText, gameState.bookId);
    }

    typeWriter(_introTxtEl, tl(data.html), function() {
        _introTxtEl.classList.remove('typing');
        _typing = false;
        _typingDone = true;
        _introHintEl.style.display = '';
    });
}

function handleIntroClick() {
    if (_typing) {
        _twCancel = null;
        _introTxtEl.classList.remove('typing');
        _introTxtEl.innerHTML = _savedHtml;
        _typing = false;
        _typingDone = true;
        _introHintEl.style.display = '';
    } else if (_typingDone) {
        gameState.introIdx++;
        var bookData = BOOK_DATA[gameState.bookId];
        if (gameState.introIdx >= bookData.intro.length) {
            finishIntro();
        } else {
            showIntroText();
        }
    }
}

function finishIntro() {
    document.getElementById('game-intro').classList.remove('active');
    _introEl.onclick = null;
    _typing = false;
    _typingDone = false;

    // 切到游戏界面
    startStarCanvas();
    document.getElementById('game-vignette').style.display = 'none';
    document.getElementById('game-bg-layer').style.display = '';
    document.getElementById('game-main-content').style.display = '';
    document.getElementById('gm-btn').style.display = '';

    gameState.inIntro = false;

    // 弧模式 → 进入第一个决策点
    if (gameState.useArcs) {
        showArcDecisionPoint();
        return;
    }

    // 检查是否有存档
    var saved = loadProgress();
    if (saved && saved.segIdx > 0) {
        gameState.segIdx = saved.segIdx;
        deviationCount = saved.deviations || 0;
    } else {
        gameState.segIdx = 0;
    }

    showCurrentSegment();

    // 系统欢迎语
    if (typeof showSystemWelcome === 'function') {
        setTimeout(function() { showSystemWelcome(); }, 1500);
    }
}

// ==================== 初始化游戏 ====================
function initGame(bookId, book) {
    try {
    gameState.bookId = bookId;
    gameState.bookTitle = book.title;
    gameState.nebulaBookId = book.id || null;
    gameState.playerName = localStorage.getItem('bookemu_username') || '穿越者';
    gameState.segIdx = 0;
    gameState.sessionId = null;
    deviationCount = 0;
    _typing = false;
    _typingDone = false;

    // 联动重置/加载系统面板小书在当前书籍/槽位下的专属数据（积分、对话历史、随身空间）
    if (typeof _loadSystemSpaceItems === 'function') _loadSystemSpaceItems();
    if (typeof _loadSystemMessagesHistory === 'function') _loadSystemMessagesHistory();
    if (typeof _initSystemPoints === 'function') _initSystemPoints();

    // 检查是否支持弧引擎
    var bkData = BOOK_DATA[bookId];
    gameState.useArcs = !!(bkData && bkData.arcs && bkData.arcs.length > 0);
    if (typeof ArcEngine !== 'undefined') {
        if (ArcEngine.setSaveSlotId) ArcEngine.setSaveSlotId(_currentSaveSlotId || 'slot_default');
        ArcEngine.init(bookId);
        if (gameState.useArcs) {
            ArcEngine.loadArcs(bkData.arcs);
            // 尝试读取弧存档
            if (!ArcEngine.load(bookId)) {
                ArcEngine.reset();
            }
        }
    }

    // 后台尝试连接后端（不阻塞）
    tryConnectBackend(bookId);

    switchScreen('game');
    startStarCanvas();

    // 检查是否有存档（判断是否为回归玩家）
    var hasSavedProgress = false;
    if (gameState.useArcs) {
        var savedData = null;
        try {
            var raw = localStorage.getItem('arc_engine_' + bookId + '_' + (_currentSaveSlotId || 'slot_default'));
            if (raw) savedData = JSON.parse(raw);
        } catch(e) {}
        hasSavedProgress = savedData && (savedData.dpIdx > 0 || savedData.arcIdx > 0);
    } else {
        var savedProg = loadProgress();
        hasSavedProgress = savedProg && savedProg.segIdx > 0;
    }

    if (hasSavedProgress) {
        // ── 回归玩家：跳过序章，直接进入游戏 ──
        document.getElementById('game-bg-layer').style.display = '';
        document.getElementById('game-main-content').style.display = '';
        document.getElementById('gm-btn').style.display = '';
        if (gameState.useArcs) {
            showArcDecisionPoint();
        } else {
            var saved2 = loadProgress();
            if (saved2 && saved2.segIdx > 0) {
                gameState.segIdx = saved2.segIdx;
                deviationCount = saved2.deviations || 0;
            }
            showCurrentSegment();
        }
        // 系统欢迎语（回归）
        if (typeof showSystemWelcome === 'function') {
            setTimeout(function() { showSystemWelcome(); }, 800);
        }
    } else if (bkData && bkData.intro && bkData.intro.length > 0) {
        // ── 首次体验：播放序章 ──
        startIntro();
    } else {
        // ── 无手写剧本书籍：启动全书目通用 AI 人生模拟 ──
        document.getElementById('game-bg-layer').style.display = '';
        document.getElementById('game-main-content').style.display = '';
        document.getElementById('gm-btn').style.display = '';
        showUniversalAiLifeSegment();
        if (typeof showSystemWelcome === 'function') {
            setTimeout(function() { showSystemWelcome(); }, 1500);
        }
    }
    } catch(e) {
        console.error('initGame error:', e);
        var display = document.getElementById('game-chapter-display');
        if (display) {
            document.getElementById('game-bg-layer').style.display = '';
            document.getElementById('game-main-content').style.display = '';
            display.innerHTML = '<div class="seg-page"><p style="color:#f07070;text-align:center;padding:2rem;">加载失败：' + e.message + '</p></div>';
        }
    }
}

function tryConnectBackend(bookId) {
    var controller = new AbortController();
    var timer = setTimeout(function() { controller.abort(); }, 30000);
    fetch(API_BASE + '/chat/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: bookId, playerName: gameState.playerName }),
        signal: controller.signal
    }).then(function(resp) {
        clearTimeout(timer);
        return resp.json();
    }).then(function(data) {
        gameState.sessionId = data.sessionId || null;
        console.log('[后端] 初始化成功, sessionId:', gameState.sessionId);
    }).catch(function(e) {
        clearTimeout(timer);
        console.log('[后端] 连接失败，使用本地模式');
    });
}

// ==================== 事件绑定 ====================
var TXT = {
    zh: {
        menu_settings:'设置', menu_quit:'退出游戏', menu_bag:'储物袋', menu_pet:'灵宠',
        intro_hint:'按任意键继续', seg_hint:'按任意键继续',
        choice_hint:'命运的岔路口——选择你的道路',
        tag_original:'原剧情', tag_diverge:'命运改写',
        bad_original:'✦ 命运已偏离原轨道',
        end_title:'— 本卷完 —', end_msg:'你的旅程暂告一段落。',
        end_dev:'偏离原剧情：', end_dev_unit:'次',
        confirm_quit:'确定要退出当前游戏吗？',
        settings:'设置', language:'语言',
        landing_hint:'你将穿越成为主角，亲历每一次命运的抉择',
        nav_font:'字体', nav_fontsize:'字号', nav_bgcolor:'背景',
        nav_voice:'朗读', nav_volume:'音量', nav_sound:'音效',
        nav_aistyle:'AI风格', nav_help:'帮助', nav_feedback:'反馈',
        nav_about:'关于', nav_logout:'退出登入',
        panel_lang_title:'语言',
        panel_font_title:'字体选择',
        font_default:'默认', font_song:'宋体', font_hei:'黑体', font_kai:'楷体',
        panel_fontsize_title:'字号大小',
        panel_bgcolor_title:'背景颜色',
        bg_dark:'暗夜', bg_cream:'米色', bg_eye:'护眼',
        panel_voice_title:'文字朗读',
        voice_auto:'自动朗读旁白',
        panel_volume_title:'音量大小',
        panel_sound_title:'背景音效',
        sound_env:'环境音效',
        panel_aistyle_title:'AI 对话风格',
        aistyle_formal:'正式', aistyle_casual:'轻松', aistyle_humor:'幽默',
        panel_help_title:'帮助中心',
        help_q1:'如何开始？',
        help_a1:'在星球界面选择一本书，点击「选择存档」弹出存档窗口，创建或选择存档后即可开始体验。',
        help_q2:'如何操作？',
        help_a2:'点击屏幕任意位置可显示全文，再次点击进入下一段。遇到选项时，选择不同的道路体验不同的命运。',
        help_q3:'存档在哪？',
        help_a3:'游戏进度自动保存，下次登录同一本书会自动回到上次离开的位置。',
        panel_feedback_title:'意见反馈',
        feedback_placeholder:'请写下你的意见或建议...',
        feedback_submit:'提交反馈',
        panel_about_title:'关于我们',
        about_project:'文学星球 · 项目介绍',
        about_why:'我们的初心',
        about_why_text:'在这个快节奏的时代，我们希望重新定义人与书的关系。文学星球不仅仅是一个阅读工具，更是一座连接读者与书籍深层世界的桥梁。我们致力于让每一位读者都能真正走进书本，与文字对话，与角色共情，与作者思想碰撞。',
        about_core:'核心体验',
        about_core_1:'📖 书籍深度理解',
        about_core_1_text:'通过AI智能体与苏格拉底式对谈，层层追问书中深意，帮助读者穿透文字表面，触摸作者的精神世界。',
        about_core_2:'🎭 书籍人生体验',
        about_core_2_text:'选择你的天赋，踏入书中的世界，成为故事的主角。在关键节点做出选择，体验不同命运的走向。你不是旁观者，而是亲历者——书中的悲欢离合，都将由你亲自感受。',
        about_core_3:'🌍 一书一世界',
        about_core_3_text:'每一本书都是一个完整的宇宙。我们构建了沉浸式的世界地图，让你自由探索书中的每一个角落。',
        about_vision:'星空设想',
        about_vision_text:'我们相信：一书一世界，一字一心境。文学星球正是基于这样的星空设想而诞生——我们希望用科技的力量，让每一个文字都活起来，让每一本书都成为可触碰、可体验、可对话的生命体。',
        about_goal:'我们的愿景',
        about_goal_text:'让更多人爱上读书，让阅读成为一种生活方式。文学星球——让每一本书，都成为你的人生旅程。',
        panel_logout_title:'退出登入',
        logout_desc:'退出后需要重新输入用户名登入。',
        logout_confirm:'确认退出',
        btn_confirm:'确 定',
        on:'开', off:'关'
    },
    en: {
        menu_settings:'Settings', menu_quit:'Quit Game', menu_bag:'Storage Bag', menu_pet:'Pets',
        intro_hint:'Press any key to continue', seg_hint:'Press any key to continue',
        choice_hint:'Crossroads of Fate — Choose Your Path',
        tag_original:'Original Plot', tag_diverge:'Fate Divergence',
        bad_original:'✦ Fate has left the original track',
        end_title:'— End of Volume —', end_msg:'Your journey pauses here.',
        end_dev:'Deviations: ', end_dev_unit:' times',
        confirm_quit:'Are you sure you want to quit?',
        settings:'Settings', language:'Language',
        landing_hint:'Become the protagonist — relive every fateful choice',
        nav_font:'Font', nav_fontsize:'Font Size', nav_bgcolor:'Background',
        nav_voice:'Read Aloud', nav_volume:'Volume', nav_sound:'Sound',
        nav_aistyle:'AI Style', nav_help:'Help', nav_feedback:'Feedback',
        nav_about:'About', nav_logout:'Log Out',
        panel_lang_title:'Language',
        panel_font_title:'Font Selection',
        font_default:'Default', font_song:'SimSun', font_hei:'SimHei', font_kai:'KaiTi',
        panel_fontsize_title:'Font Size',
        panel_bgcolor_title:'Background Color',
        bg_dark:'Dark', bg_cream:'Cream', bg_eye:'Eye Care',
        panel_voice_title:'Text-to-Speech',
        voice_auto:'Auto-read narration',
        panel_volume_title:'Volume',
        panel_sound_title:'Background Sound',
        sound_env:'Ambient Sound',
        panel_aistyle_title:'AI Conversation Style',
        aistyle_formal:'Formal', aistyle_casual:'Casual', aistyle_humor:'Humorous',
        panel_help_title:'Help Center',
        help_q1:'How to start?',
        help_a1:'Select a book on the star map, click "Enter Book" on the cover page, then click "Experience Life" to begin.',
        help_q2:'How to play?',
        help_a2:'Click anywhere to reveal the full text, click again to advance. When choices appear, pick different paths to experience different fates.',
        help_q3:'Where is my save data?',
        help_a3:'Progress is saved automatically. The next time you enter the same book, you\'ll resume from where you left off.',
        panel_feedback_title:'Feedback',
        feedback_placeholder:'Write your feedback or suggestions...',
        feedback_submit:'Submit',
        panel_about_title:'About Us',
        about_project:'Literary Planet · Project Introduction',
        about_why:'Our Mission',
        about_why_text:'In this fast-paced era, we aim to redefine the relationship between people and books. Literary Planet is more than a reading tool — it is a bridge connecting readers to the deeper world within books. We are committed to helping every reader truly step inside a book, converse with words, empathize with characters, and collide with the author\'s ideas.',
        about_core:'Core Experience',
        about_core_1:'📖 Deep Book Understanding',
        about_core_1_text:'Through AI-powered Socratic dialogue, we ask层层 questions about the book\'s deeper meaning, helping readers look past the surface and touch the author\'s spiritual world.',
        about_core_2:'🎭 Live the Book',
        about_core_2_text:'Choose your talent, step into the book\'s world, and become the protagonist. Make choices at critical moments and experience different fates. You are not a spectator — you are a participant who personally feels every joy and sorrow.',
        about_core_3:'🌍 One Book, One World',
        about_core_3_text:'Every book is a complete universe. We build immersive world maps that let you freely explore every corner of the story.',
        about_vision:'Our Vision',
        about_vision_text:'We believe: one book, one world, one word, one state of mind. Literary Planet was born from this stargazing vision — we want to use the power of technology to make every word come alive, and make every book a touchable, experienceable, conversable living entity.',
        about_goal:'Our Goal',
        about_goal_text:'To help more people fall in love with reading and make reading a way of life. Literary Planet — let every book become your life\'s journey.',
        panel_logout_title:'Log Out',
        logout_desc:'You\'ll need to log in again after logging out.',
        logout_confirm:'Confirm Logout',
        btn_confirm:'Confirm',
        on:'On', off:'Off'
    },
    ja: {
        menu_settings:'設定', menu_quit:'ゲーム終了', menu_bag:'収納袋', menu_pet:'霊獣',
        intro_hint:'クリックで続行',
        seg_hint:'クリックで続行',
        choice_hint:'運命の分岐点 — あなたの道を選べ',
        tag_original:'原作通り', tag_diverge:'運命改変',
        bad_original:'✦ 運命は原作の軌道を離れた',
        end_title:'— 巻末 —', end_msg:'あなたの旅はここで一区切り。',
        end_dev:'原作からの逸脱: ', end_dev_unit:'回',
        confirm_quit:'本当にゲームを終了しますか？',
        settings:'設定', language:'言語',
        landing_hint:'主人公となり、運命の選択を追体験せよ',
        nav_font:'フォント', nav_fontsize:'文字サイズ', nav_bgcolor:'背景色',
        nav_voice:'朗読', nav_volume:'音量', nav_sound:'効果音',
        nav_aistyle:'AIスタイル', nav_help:'ヘルプ', nav_feedback:'フィードバック',
        nav_about:'概要', nav_logout:'ログアウト',
        panel_lang_title:'言語',
        panel_font_title:'フォント選択',
        font_default:'デフォルト', font_song:'宋朝体', font_hei:'ゴシック体', font_kai:'楷書',
        panel_fontsize_title:'文字サイズ',
        panel_bgcolor_title:'背景色',
        bg_dark:'ダーク', bg_cream:'クリーム', bg_eye:'護眼',
        panel_voice_title:'テキスト読み上げ',
        voice_auto:'ナレーションを自動読み上げ',
        panel_volume_title:'音量',
        panel_sound_title:'BGM',
        sound_env:'環境音',
        panel_aistyle_title:'AI会話スタイル',
        aistyle_formal:'フォーマル', aistyle_casual:'カジュアル', aistyle_humor:'ユーモラス',
        panel_help_title:'ヘルプセンター',
        help_q1:'始め方',
        help_a1:'星図で本を選んで「書籍に入る」をクリックし、体験ページで「人生を体験」をクリックするとスタートします。',
        help_q2:'遊び方',
        help_a2:'画面をタップすると全文が表示され、もう一度タップで次の段落へ進みます。選択肢が出たら、異なる道を選んで異なる運命を体験しましょう。',
        help_q3:'セーブデータはどこ？',
        help_a3:'進行状況は自動保存されます。次に同じ本に入ると、前回の続きから再開できます。',
        panel_feedback_title:'フィードバック',
        feedback_placeholder:'ご意見やご建議をお書きください...',
        feedback_submit:'送信',
        panel_about_title:'私たちについて',
        about_project:'文学星球 · プロジェクト紹介',
        about_why:'私たちの使命',
        about_why_text:'この忙しい時代に、私たちは人と本の関係を再定義したいと考えています。文学星球は単なる読書ツールではなく、読者と本の深層世界をつなぐ架け橋です。すべての読者が本の中に本当に踏み込み、文字と対話し、キャラクターに共感し、著者の思想と碰撞できるよう全力を尽くします。',
        about_core:'コア体験',
        about_core_1:'📖 本の深層理解',
        about_core_1_text:'AI駆動のソクラテス式対話により、本の深い意味を次々と問い、文字の表面を見抜いて著者の精神世界に触れるお手伝いをします。',
        about_core_2:'🎭 本を生きる',
        about_core_2_text:'才能を選んで本の世界に踏み込み、主人公になります。重要な場面で選択し、異なる運命を体験します。傍観者ではなく、直接喜びと悲しみを味わう当事者です。',
        about_core_3:'🌍 一書一世界',
        about_core_3_text:'すべての本は一つの完全な宇宙です。没入型の世界地図を構築し、物語の隅々まで自由に探索できます。',
        about_vision:'星空構想',
        about_vision_text:'私たちは信じています：一書一世界、一字一心境。文学星球はこの星空構想に基づいて生まれました——テクノロジーの力で、すべての文字を生かし、すべての本を触れたり、体験したり、対話できる生命体にしたいのです。',
        about_goal:'私たちの目標',
        about_goal_text:'より多くの人に読書を愛し、読書をライフスタイルにすること。文学星球——すべての本を、あなた的人生の旅に。',
        panel_logout_title:'ログアウト',
        logout_desc:'ログアウト後、再度ログインが必要です。',
        logout_confirm:'ログアウト確認',
        btn_confirm:'確認',
        on:'オン', off:'オフ'
    }
};

function t(key) {
    var lang = localStorage.getItem('bookemu_lang') || 'zh';
    return (TXT[lang] && TXT[lang][key]) ? TXT[lang][key] : key;
}

// 选择中/英文内容
function tl(obj) {
    if (typeof obj === 'string') return obj;
    var lang = localStorage.getItem('bookemu_lang') || 'zh';
    if (obj && obj[lang]) return obj[lang];
    if (obj && obj.zh) return obj.zh;
    return obj;
}

document.addEventListener('DOMContentLoaded', function() {
    function refreshUI() {
        // 菜单按钮文字
        var gmBag = document.querySelector('.gm-drop [data-gm="bag"]');
        if (gmBag) gmBag.innerHTML = '🎒 ' + t('menu_bag');
        var gmPet = document.querySelector('.gm-drop [data-gm="pet"]');
        if (gmPet) gmPet.innerHTML = '🐾 ' + t('menu_pet');
        var gmSettings = document.querySelector('.gm-drop [data-gm="settings"]');
        if (gmSettings) gmSettings.innerHTML = '⚙ ' + t('menu_settings');
        var gmQuit = document.querySelector('.gm-drop .gm-quit');
        if (gmQuit) gmQuit.innerHTML = '✕ ' + t('menu_quit');

        // 序章提示
        var ih = document.getElementById('game-intro-hint');
        if (ih) ih.textContent = t('intro_hint');

        // 封面页提示
        var lh = document.querySelector('.landing-hint');
        if (lh) lh.textContent = t('landing_hint');

        // ─── 设置面板侧边栏导航 ───
        var navMap = {
            lang: t('language'), font: t('nav_font'), fontsize: t('nav_fontsize'),
            bgcolor: t('nav_bgcolor'), voice: t('nav_voice'), volume: t('nav_volume'),
            sound: t('nav_sound'), aistyle: t('nav_aistyle'), help: t('nav_help'),
            feedback: t('nav_feedback'), about: t('nav_about'), logout: t('nav_logout')
        };
        document.querySelectorAll('.gm-set-nav-item').forEach(function(el) {
            var key = el.getAttribute('data-panel');
            if (navMap[key]) el.textContent = navMap[key];
        });

        // ─── 语言面板 ───
        var langH3 = document.querySelector('#gm-panel-lang h3');
        if (langH3) langH3.textContent = t('panel_lang_title');
        var langConfirm = document.getElementById('gm-lang-confirm');
        if (langConfirm) langConfirm.textContent = t('btn_confirm');
        // 下拉标签
        var gml = document.getElementById('gm-lang-label');
        if (gml) {
            var curLang = localStorage.getItem('bookemu_lang') || 'zh';
            var names = {zh:'中文', en:'English', ja:'日本語'};
            gml.textContent = names[curLang] || '中文';
        }

        // ─── 字体面板 ───
        var fontH3 = document.querySelector('#gm-panel-font h3');
        if (fontH3) fontH3.textContent = t('panel_font_title');
        document.querySelectorAll('.gm-font-item').forEach(function(el) {
            var f = el.getAttribute('data-font');
            var k = 'font_' + f;
            if (t(k) !== k) el.textContent = t(k);
        });
        var fontLabel = document.getElementById('gm-font-label');
        var savedFont = localStorage.getItem('bookemu_font') || 'default';
        var fontK = 'font_' + savedFont;
        if (fontLabel && t(fontK) !== fontK) fontLabel.textContent = t(fontK);

        // ─── 字号面板 ───
        var fzH3 = document.querySelector('#gm-panel-fontsize h3');
        if (fzH3) fzH3.textContent = t('panel_fontsize_title');

        // ─── 背景面板 ───
        var bgH3 = document.querySelector('#gm-panel-bgcolor h3');
        if (bgH3) bgH3.textContent = t('panel_bgcolor_title');
        document.querySelectorAll('.gm-bg-opt[data-bg]').forEach(function(el) {
            var bg = el.getAttribute('data-bg');
            var k = 'bg_' + bg;
            if (t(k) !== k) {
                var swatch = el.querySelector('.gm-bg-swatch');
                el.textContent = '';
                if (swatch) el.appendChild(swatch);
                el.appendChild(document.createTextNode(' ' + t(k)));
            }
        });

        // ─── 朗读面板 ───
        var voiceH3 = document.querySelector('#gm-panel-voice h3');
        if (voiceH3) voiceH3.textContent = t('panel_voice_title');
        var voiceLabel = document.querySelector('#gm-panel-voice .gm-toggle-row span');
        if (voiceLabel) voiceLabel.textContent = t('voice_auto');
        var ttsToggle = document.getElementById('gm-tts-toggle');
        if (ttsToggle) {
            var isOn = ttsToggle.getAttribute('data-on') === 'true';
            ttsToggle.textContent = isOn ? t('on') : t('off');
        }

        // ─── 音量面板 ───
        var volH3 = document.querySelector('#gm-panel-volume h3');
        if (volH3) volH3.textContent = t('panel_volume_title');

        // ─── 音效面板 ───
        var soundH3 = document.querySelector('#gm-panel-sound h3');
        if (soundH3) soundH3.textContent = t('panel_sound_title');
        var soundLabel = document.querySelector('#gm-panel-sound .gm-toggle-row span');
        if (soundLabel) soundLabel.textContent = t('sound_env');
        var soundToggle = document.getElementById('gm-sound-toggle');
        if (soundToggle) {
            var isOn2 = soundToggle.getAttribute('data-on') === 'true';
            soundToggle.textContent = isOn2 ? t('on') : t('off');
        }

        // ─── AI风格面板 ───
        var aiH3 = document.querySelector('#gm-panel-aistyle h3');
        if (aiH3) aiH3.textContent = t('panel_aistyle_title');
        document.querySelectorAll('.gm-bg-opt[data-aistyle]').forEach(function(el) {
            var s = el.getAttribute('data-aistyle');
            var k = 'aistyle_' + s;
            if (t(k) !== k) el.textContent = t(k);
        });

        // ─── 帮助面板 ───
        var helpH3 = document.querySelector('#gm-panel-help h3');
        if (helpH3) helpH3.textContent = t('panel_help_title');
        var helpPs = document.querySelectorAll('#gm-panel-help .gm-help-text p');
        var helpKeys = [
            ['help_q1','help_a1'], ['help_q2','help_a2'], ['help_q3','help_a3']
        ];
        for (var i = 0; i < helpKeys.length && i < helpPs.length; i++) {
            helpPs[i].innerHTML = '<b>' + t(helpKeys[i][0]) + '</b><br>' + t(helpKeys[i][1]);
        }

        // ─── 反馈面板 ───
        var fbH3 = document.querySelector('#gm-panel-feedback h3');
        if (fbH3) fbH3.textContent = t('panel_feedback_title');
        var fbTa = document.querySelector('#gm-panel-feedback .gm-textarea');
        if (fbTa) fbTa.placeholder = t('feedback_placeholder');
        var fbBtn = document.querySelector('#gm-panel-feedback .gm-submit-btn');
        if (fbBtn) fbBtn.textContent = t('feedback_submit');

        // ─── 关于面板 ───
        var aboutH3 = document.querySelector('#gm-panel-about h3');
        if (aboutH3) aboutH3.textContent = t('panel_about_title');
        var aboutText = document.querySelector('#gm-panel-about .gm-about-text');
        if (aboutText) {
            aboutText.innerHTML =
                '<p class="gm-about-title">' + t('about_project') + '</p>' +
                '<p class="gm-about-subtitle">' + t('about_why') + '</p>' +
                '<p>' + t('about_why_text') + '</p>' +
                '<p class="gm-about-subtitle">' + t('about_core') + '</p>' +
                '<p>' + t('about_core_1') + '<br>' + t('about_core_1_text') + '</p>' +
                '<p>' + t('about_core_2') + '<br>' + t('about_core_2_text') + '</p>' +
                '<p>' + t('about_core_3') + '<br>' + t('about_core_3_text') + '</p>' +
                '<p class="gm-about-subtitle">' + t('about_vision') + '</p>' +
                '<p>' + t('about_vision_text') + '</p>' +
                '<p class="gm-about-subtitle">' + t('about_goal') + '</p>' +
                '<p>' + t('about_goal_text') + '</p>';
        }

        // ─── 菜单下拉 ───
        var gmDropQuit = document.querySelector('.gm-drop .gm-quit');
        if (gmDropQuit) gmDropQuit.innerHTML = '✕ ' + t('menu_quit');
        var gmDropBag = document.querySelector('.gm-drop [data-gm="bag"]');
        if (gmDropBag) gmDropBag.innerHTML = '🎒 ' + t('menu_bag');
        var gmDropPet = document.querySelector('.gm-drop [data-gm="pet"]');
        if (gmDropPet) gmDropPet.innerHTML = '🐾 ' + t('menu_pet');
        var gmDropSettings = document.querySelector('.gm-drop [data-gm="settings"]');
        if (gmDropSettings) gmDropSettings.innerHTML = '⚙ ' + t('menu_settings');

        // 重新渲染当前内容
        reRender();
    }

    function reRender() {
        var introEl = document.getElementById('game-intro');
        // 序章中 → 重建当前序章文本
        if (introEl && introEl.classList.contains('active') && gameState.inIntro) {
            var bookData = BOOK_DATA[gameState.bookId];
            if (bookData && bookData.intro && gameState.introIdx < bookData.intro.length) {
                var data = bookData.intro[gameState.introIdx];
                if (data) {
                    document.getElementById('game-intro-title').textContent = tl(data.title) || '';
                    var el = document.getElementById('game-intro-text');
                    if (!_typing && el) {
                        el.classList.remove('typing');
                        el.innerHTML = tl(data.html);
                    }
                    var ih = document.getElementById('game-intro-hint');
                    if (ih) ih.textContent = t('intro_hint');
                }
            }
        }
        // 游戏章节中 → 重建当前段
        if (!gameState.inIntro && gameState.bookId) {
            var bookData = BOOK_DATA[gameState.bookId];
            if (bookData && bookData.segments && gameState.segIdx < bookData.segments.length) {
                // 保存当前打字状态避免中断
                var wasTyping = _typing;
                _twCancel = null;
                showCurrentSegment();
                if (wasTyping) {
                    // 如果之前在打字中，重新显示全文
                    _twCancel = null;
                    var segEl = document.getElementById('game-segTxt');
                    if (segEl) {
                        segEl.classList.remove('typing');
                        segEl.innerHTML = _savedHtml;
                    }
                    _typing = false;
                    _typingDone = true;
                    var hint = document.getElementById('game-segHint');
                    if (hint) {
                        hint.textContent = t('seg_hint');
                        hint.style.display = '';
                    }
                    var ca = document.getElementById('game-choiceArea');
                    if (ca) ca.style.display = 'block';
                }
            }
        }
    }

    // 加载保存的语言
    refreshUI();

    // ─── 返回按钮 ───
    var backBtn = document.getElementById('game-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            showGameConfirm(t('confirm_quit'), '系统确认').then(function(yes) {
                if (!yes) return;
                _twCancel = null;
                _typing = false;
                stopStarCanvas();
                // 停止旁白播放
                if (typeof stopQuoteAudio === 'function') {
                    stopQuoteAudio();
                }
                switchScreen('book');
            });
        });
    }

    // ─── 游戏菜单 ───
    var gmBtn = document.getElementById('gm-btn');
    var gmDrop = document.getElementById('gm-drop');
    var gmOverlay = document.getElementById('gm-set-overlay');

    if (gmBtn) {
        gmBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var open = gmDrop.classList.toggle('open');
            gmBtn.textContent = open ? '✕' : '☰';
        });
    }

    document.addEventListener('click', function(e) {
        if (gmDrop && gmDrop.classList.contains('open') && !gmDrop.contains(e.target) && e.target !== gmBtn) {
            gmDrop.classList.remove('open');
            if (gmBtn) gmBtn.textContent = '☰';
        }
    });

    if (gmDrop) {
        gmDrop.addEventListener('click', function(e) {
            var item = e.target.closest('.gm-item');
            if (!item) return;
            gmDrop.classList.remove('open');
            if (gmBtn) gmBtn.textContent = '☰';
            var act = item.getAttribute('data-gm');
            if (act === 'quit') {
                showGameConfirm(t('confirm_quit'), '系统确认').then(function(yes) {
                    if (!yes) return;
                    _twCancel = null;
                    _typing = false;
                    stopStarCanvas();
                    switchScreen('book');
                });
            } else if (act === 'settings') {
                if (gmOverlay) gmOverlay.classList.add('open');
            } else if (act === 'bag') {
                openBag();
            } else if (act === 'pet') {
                openPetPanel();
            } else if (act === 'character') {
                openCharacterPanel();
            }
        });
    }

    // ─── 设置弹窗 ───
    var gmClose = document.getElementById('gm-set-close');
    if (gmClose) {
        gmClose.addEventListener('click', function() {
            if (gmOverlay) gmOverlay.classList.remove('open');
        });
    }
    if (gmOverlay) {
        gmOverlay.addEventListener('click', function(e) {
            if (e.target === gmOverlay) gmOverlay.classList.remove('open');
        });
    }

    // 设置侧边栏导航
    document.querySelectorAll('.gm-set-nav-item').forEach(function(nav) {
        nav.addEventListener('click', function() {
            document.querySelectorAll('.gm-set-nav-item').forEach(function(n) { n.classList.remove('active'); });
            nav.classList.add('active');
            var panelId = nav.getAttribute('data-panel');
            document.querySelectorAll('.gm-panel').forEach(function(p) { p.classList.remove('active'); });
            var panel = document.getElementById('gm-panel-' + panelId);
            if (panel) panel.classList.add('active');
        });
    });

    // 语言下拉框
    var langSelected = document.getElementById('gm-lang-selected');
    var langList = document.getElementById('gm-lang-list');
    var langLabel = document.getElementById('gm-lang-label');
    var langOpts = document.querySelectorAll('.gm-lang-opt');

    // 初始化选中状态
    var savedLang = localStorage.getItem('bookemu_lang') || 'zh';
    langOpts.forEach(function(opt) {
        var active = opt.getAttribute('data-gm-lang') === savedLang;
        opt.classList.toggle('active', active);
        if (active && langLabel) langLabel.textContent = opt.textContent;
    });

    if (langSelected) {
        langSelected.addEventListener('click', function(e) {
            e.stopPropagation();
            var open = langList.classList.toggle('open');
            langSelected.classList.toggle('open', open);
        });
    }

    // 语言下拉（选中的暂存，点确定才生效）
    var _pendingLang = localStorage.getItem('bookemu_lang') || 'zh';

    langOpts.forEach(function(opt) {
        opt.addEventListener('click', function() {
            var lang = opt.getAttribute('data-gm-lang');
            _pendingLang = lang;
            langOpts.forEach(function(o) { o.classList.remove('active'); });
            opt.classList.add('active');
            if (langLabel) langLabel.textContent = opt.textContent;
            langList.classList.remove('open');
            if (langSelected) langSelected.classList.remove('open');
            // 不立即刷新，等确定
        });
    });

    // 语言确定按钮
    var langConfirm = document.getElementById('gm-lang-confirm');
    if (langConfirm) {
        langConfirm.addEventListener('click', function() {
            localStorage.setItem('bookemu_lang', _pendingLang);
            refreshUI();
        });
    }

    // 点击外部关闭下拉
    document.addEventListener('click', function(e) {
        if (langList && langList.classList.contains('open')) {
            if (!langList.contains(e.target) && e.target !== langSelected) {
                langList.classList.remove('open');
                if (langSelected) langSelected.classList.remove('open');
            }
        }
        var fontList = document.getElementById('gm-font-list');
        var fontSel = document.getElementById('gm-font-selected');
        if (fontList && fontList.classList.contains('open')) {
            if (!fontList.contains(e.target) && e.target !== fontSel) {
                fontList.classList.remove('open');
                if (fontSel) fontSel.classList.remove('open');
            }
        }
    });

    // ─── 字体选择下拉 ───
    var fontSel = document.getElementById('gm-font-selected');
    var fontList = document.getElementById('gm-font-list');
    var fontLabel = document.getElementById('gm-font-label');
    var savedFont = localStorage.getItem('bookemu_font') || 'default';
    var fontNames = {default:'默认',song:'宋体',hei:'黑体',kai:'楷体'};
    var fontCSS = {default:'',song:'SimSun,serif',hei:'SimHei,sans-serif',kai:'KaiTi,STKaiti,serif'};

    document.querySelectorAll('.gm-font-item').forEach(function(f) {
        f.classList.toggle('active', f.getAttribute('data-font') === savedFont);
    });
    if (fontLabel) fontLabel.textContent = fontNames[savedFont] || '默认';
    applyFont(savedFont);

    if (fontSel) {
        fontSel.addEventListener('click', function(e) {
            e.stopPropagation();
            var o = fontList.classList.toggle('open');
            fontSel.classList.toggle('open', o);
        });
    }
    document.querySelectorAll('.gm-font-item').forEach(function(f) {
        f.addEventListener('click', function() {
            var font = f.getAttribute('data-font');
            localStorage.setItem('bookemu_font', font);
            document.querySelectorAll('.gm-font-item').forEach(function(x) { x.classList.remove('active'); });
            f.classList.add('active');
            fontLabel.textContent = fontNames[font];
            fontList.classList.remove('open');
            fontSel.classList.remove('open');
            applyFont(font);
        });
    });

    function applyFont(font) {
        var el = document.getElementById('game-main-content');
        var css = fontCSS[font] || '';
        if (el) { el.style.fontFamily = css; }
        document.getElementById('game-intro').style.fontFamily = css;
    }

    // ─── 字号滑块 ───
    var fzSlider = document.getElementById('gm-fontsize-slider');
    var fzVal = document.getElementById('gm-fontsize-val');
    var savedFz = localStorage.getItem('bookemu_fontsize');
    if (!savedFz || isNaN(parseInt(savedFz, 10))) {
        savedFz = '18';
    }
    if (fzSlider) { fzSlider.value = savedFz; applyFontsize(savedFz); }
    if (fzSlider) {
        fzSlider.addEventListener('input', function() {
            var v = fzSlider.value;
            fzVal.textContent = v + 'px';
            localStorage.setItem('bookemu_fontsize', v);
            applyFontsize(v);
        });
    }

    function applyFontsize(size) {
        var num = parseInt(size, 10);
        if (isNaN(num)) num = 18;
        document.getElementById('game-main-content').style.fontSize = num + 'px';
        document.getElementById('game-intro').style.fontSize = num + 'px';
        var segTxt = document.getElementById('game-segTxt');
        if (segTxt) segTxt.style.fontSize = num + 'px';
        fzVal.textContent = num + 'px';
    }

    // ─── 背景色 ───
    var savedBg = localStorage.getItem('bookemu_bg') || 'dark';
    document.querySelectorAll('.gm-bg-opt').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-bg') === savedBg);
        b.addEventListener('click', function() {
            document.querySelectorAll('.gm-bg-opt').forEach(function(x) { x.classList.remove('active'); });
            b.classList.add('active');
            var bg = b.getAttribute('data-bg');
            localStorage.setItem('bookemu_bg', bg);
            applyBg(bg);
        });
    });
    applyBg(savedBg);

    function applyBg(bg) {
        var bgLayer = document.getElementById('game-bg-layer');
        var gameScreen = document.getElementById('game-screen');
        if (gameScreen) gameScreen.setAttribute('data-game-theme', bg);
        if (bg === 'dark') {
            gameScreen.style.background = '#050914';
            if (bgLayer) {
                bgLayer.style.display = 'block';
                bgLayer.style.background = "linear-gradient(115deg, rgba(3,8,20,.9) 0%, rgba(7,16,35,.58) 44%, rgba(8,13,27,.86) 100%), radial-gradient(circle at 76% 24%, rgba(65,174,190,.18), transparent 34%), url('assets/gameGround.jpg') center/cover no-repeat";
                bgLayer.style.backgroundBlendMode = 'normal, screen, normal';
            }
        } else if (bg === 'cream') {
            gameScreen.style.background = '#f5f0e8';
            if (bgLayer) bgLayer.style.display = 'none';
        } else if (bg === 'eye') {
            gameScreen.style.background = '#c8e6c0';
            if (bgLayer) bgLayer.style.display = 'none';
        }
    }

    // ─── 朗读开关 ───
    var ttsToggle = document.getElementById('gm-tts-toggle');
    var ttsOn = localStorage.getItem('bookemu_tts') === 'true';
    if (ttsToggle) {
        ttsToggle.setAttribute('data-on', ttsOn ? 'true' : 'false');
        ttsToggle.textContent = ttsOn ? '开' : '关';
        ttsToggle.classList.toggle('on', ttsOn);
        ttsToggle.addEventListener('click', function() {
            ttsOn = !ttsOn;
            localStorage.setItem('bookemu_tts', ttsOn ? 'true' : 'false');
            ttsToggle.setAttribute('data-on', ttsOn ? 'true' : 'false');
            ttsToggle.textContent = ttsOn ? '开' : '关';
            ttsToggle.classList.toggle('on', ttsOn);
        });
    }

    // ─── 音效开关 ───
    var soundToggle = document.getElementById('gm-sound-toggle');
    var soundOn = localStorage.getItem('bookemu_sound') === 'true';
    if (soundToggle) {
        soundToggle.setAttribute('data-on', soundOn ? 'true' : 'false');
        soundToggle.textContent = soundOn ? '开' : '关';
        soundToggle.classList.toggle('on', soundOn);
        soundToggle.addEventListener('click', function() {
            soundOn = !soundOn;
            localStorage.setItem('bookemu_sound', soundOn ? 'true' : 'false');
            soundToggle.setAttribute('data-on', soundOn ? 'true' : 'false');
            soundToggle.textContent = soundOn ? '开' : '关';
            soundToggle.classList.toggle('on', soundOn);
        });
    }

    // ─── 音量滑块 ───
    var volSlider = document.getElementById('gm-volume-slider');
    var volVal = document.getElementById('gm-volume-val');
    var savedVol = localStorage.getItem('bookemu_volume') || '50';
    if (volSlider) { volSlider.value = savedVol; volVal.textContent = savedVol + '%'; }
    if (volSlider) {
        volSlider.addEventListener('input', function() {
            var v = volSlider.value;
            volVal.textContent = v + '%';
            localStorage.setItem('bookemu_volume', v);
        });
    }

    // ─── AI风格 ───
    var savedAi = localStorage.getItem('bookemu_aistyle') || 'formal';
    document.querySelectorAll('.gm-bg-opt[data-aistyle]').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-aistyle') === savedAi);
        b.addEventListener('click', function() {
            document.querySelectorAll('.gm-bg-opt[data-aistyle]').forEach(function(x) { x.classList.remove('active'); });
            b.classList.add('active');
            localStorage.setItem('bookemu_aistyle', b.getAttribute('data-aistyle'));
        });
    });

    // ─── 反馈提交 ───
    var fbBtn = document.querySelector('#gm-panel-feedback .gm-submit-btn');
    if (fbBtn) {
        fbBtn.addEventListener('click', function() {
            var ta = document.querySelector('#gm-panel-feedback .gm-textarea');
            if (ta && ta.value.trim()) {
                showGameAlert('感谢你的反馈！', '系统提示').then(function() {
                    ta.value = '';
                });
            }
        });
    }

});

// ══════════════════════════════════════════════
//  弧模式函数（AI驱动）
// ══════════════════════════════════════════════

// ── 全屏居中旁白展示 ──
function showNarrationOverlay(text) {
    return new Promise(function(resolve) {
        var gameIntro = document.getElementById('game-intro');
        var gameMainContent = document.getElementById('game-main-content');
        var gameBgLayer = document.getElementById('game-bg-layer');
        var titleEl = document.getElementById('game-intro-title');
        var textEl = document.getElementById('game-intro-text');
        var hintEl = document.getElementById('game-intro-hint');

        if (gameMainContent) gameMainContent.style.display = 'none';
        if (gameBgLayer) gameBgLayer.style.display = 'none';
        if (gameIntro) gameIntro.classList.add('active');
        if (titleEl) titleEl.textContent = '';
        if (hintEl) { hintEl.style.display = 'none'; hintEl.textContent = typeof t === 'function' ? t('seg_hint') : '点击继续'; }

        var ready = false;
        if (textEl) {
            textEl.innerHTML = '';
            typeWriter(textEl, text, function() {
                if (hintEl) hintEl.style.display = '';
                ready = true;
            });
        } else {
            ready = true;
        }

        if (gameIntro) {
            gameIntro.onclick = function() {
                if (!ready) {
                    _twCancel = null;
                    if (textEl) { textEl.classList.remove('typing'); textEl.innerHTML = text; }
                    if (hintEl) hintEl.style.display = '';
                    ready = true;
                } else {
                    gameIntro.classList.remove('active');
                    gameIntro.onclick = null;
                    if (gameMainContent) gameMainContent.style.display = '';
                    if (gameBgLayer) gameBgLayer.style.display = '';
                    resolve();
                }
            };
        } else {
            resolve();
        }
    });
}

// ── 显示弧决策点 ──
var _arcChoices = [];
async function showArcDecisionPoint() {
    var dp = ArcEngine.getCurrentDecisionPoint();
    if (!dp) {
        handleArcEnd();
        return;
    }

    // 背景切换
    document.getElementById('game-bg-layer').style.display = '';
    document.getElementById('game-main-content').style.display = '';
    document.getElementById('gm-btn').style.display = '';

    var display = document.getElementById('game-chapter-display');
    var arc = ArcEngine.getCurrentArc();
    var arcTitle = arc ? arc.title : '';

    // 上下文显示
    var context = tl(dp.context);
    _savedHtml = annotateText(context.replace(/\n/g,'<br>'),
        tl((BOOK_DATA[gameState.bookId]||{}).glossary),
        tl((BOOK_DATA[gameState.bookId]||{}).nameGlossary));

    // 弧标题
    var arcTitleText = tl(arcTitle);
    var html = '<div class="seg-page"><div class="seg-date">' + arcTitleText + '</div>';
    html += '<div class="seg-box ev-box">';
    html += '<div class="seg-txt" id="game-segTxt"></div>';

    // 选项区域（无标签）
    html += '<div class="choice-area" id="game-choiceArea">';
    html += '<div class="choice-hint">' + t('choice_hint') + '</div>';
    html += '<div class="choice-cards" id="game-choiceCards"></div>';
    html += '<div id="game-resultArea"></div>';
    html += '</div>';

    html += '<div class="seg-hint" id="game-segHint">' + t('seg_hint') + '</div>';
    html += '</div></div>';
    display.innerHTML = html;

    _segEl = document.getElementById('game-segTxt');
    _hintEl = document.getElementById('game-segHint');
    if (_hintEl) _hintEl.style.display = 'none';

    // 打字机展示上下文
    _typing = true;
    _typingDone = false;
    _arcChoices = [];
    var _generatingChoices = false;
    async function ensureChoices() {
        if (_generatingChoices) return;
        if (_arcChoices.length > 0) return;
        _generatingChoices = true;
        // 优先尝试从 API 动态补充/扩充选项（包含原著项与大模型推演项）
        var choices = [];
        if (dp.choices && dp.choices.length >= 4) {
            choices = dp.choices.map(function(c, i) {
                return { label: c.label, isOriginal: false, next: c.next, idx: i };
            });
        } else {
            // 当预设选项少于 4 个或为单向分支时，调用 AI API 结合原著与数据库动态填充生成 4 个选项
            var aiChoices = await AI.generateChoices(
                context,
                { choice: dp.originalChoice ? tl(dp.originalChoice) : (dp.choices && dp.choices[0] ? tl(dp.choices[0].label) : '顺应剧情') },
                ArcEngine.getChoiceHistory()
            );
            if (aiChoices && aiChoices.length > 0) {
                choices = aiChoices.map(function(c, i) {
                    var matchPreset = (dp.choices || []).find(function(pc) {
                        return tl(pc.label) === c.label || c.label.indexOf(tl(pc.label)) !== -1;
                    });
                    return {
                        label: c.label,
                        isOriginal: c.isOriginal || false,
                        next: matchPreset ? matchPreset.next : (dp.choices && dp.choices[0] ? dp.choices[0].next : null),
                        idx: i
                    };
                });
            } else if (dp.choices && dp.choices.length > 0) {
                choices = dp.choices.map(function(c, i) {
                    return { label: c.label, isOriginal: false, next: c.next, idx: i };
                });
            }
        }
        _arcChoices = choices;
        renderArcChoices(choices);
        if (_hintEl) _hintEl.style.display = '';
        var ca = document.getElementById('game-choiceArea');
        if (ca) ca.style.display = 'block';
        _generatingChoices = false;
    }
    if (_segEl) {
        _segEl.classList.add('typing');
        typeWriter(_segEl, _savedHtml, async function() {
            _segEl.classList.remove('typing');
            _typing = false;
            _typingDone = true;
            await ensureChoices();
        });
    }

    // 点击事件：打字中全显 / 全显后暂不跳（等选选项）
    _clickTarget = document.getElementById('game-main-content');
    if (_clickTarget) {
        _clickTarget.style.cursor = 'pointer';
        _clickTarget.onclick = async function(e) {
            if (e.target.closest('.glossary-term')) return;
            if (e.target.closest('.choice-card')) return;
            if (e.target.closest('.loot-popup')) return;
            if (_typing) {
                _twCancel = null;
                if (_segEl) {
                    _segEl.classList.remove('typing');
                    _segEl.innerHTML = _savedHtml;
                }
                _typing = false;
                _typingDone = true;
                if (_hintEl) _hintEl.style.display = '';
                var ca = document.getElementById('game-choiceArea');
                if (ca) ca.style.display = 'block';
                await ensureChoices();
            }
        };
    }

    ArcEngine.save(gameState.bookId);
    saveProgress();
}

// ── 渲染选项（不显示原剧情/命运改写标签） ──
function renderArcChoices(choices) {
    var cardsEl = document.getElementById('game-choiceCards');
    if (!cardsEl) return;
    var html = '';
    choices.forEach(function(c, ci) {
        var pathClass = c.isOriginal ? ' choice-original' : ' choice-diverge';
        html += '<div class="choice-card' + pathClass + '" data-idx="' + ci + '" onclick="onArcChoice(' + ci + ')">' +
            '<div class="card-label">' + tl(c.label) + '</div></div>';
    });
    cardsEl.innerHTML = html;
}

// ── 弧模式选择处理 ──
async function onArcChoice(choiceIdx) {
    if (_arcChoices.length === 0) return;
    var dp = ArcEngine.getCurrentDecisionPoint();
    var choice = _arcChoices[choiceIdx];
    var isOriginal = choice.isOriginal === true;

    // 禁用所有卡片
    document.querySelectorAll('.choice-card').forEach(function(c) { c.classList.add('disabled'); });
    var card = document.querySelector('.choice-card[data-idx="' + choiceIdx + '"]');
    if (card) card.classList.add('selected', 'chosen');

    // 记录
    if (!isOriginal) deviationCount++;
    if (isOriginal) {
        deviationCount = Math.max(0, deviationCount - 1);
    }

    _typing = false;
    _typingDone = true;

    // 年龄与时间流逝更新（每次抉择推进年龄与年代）
    _advancePlayerAgeOnChoice(isOriginal);

    // 条件性显示结果：只有 dp.showResult 为 true 时才显示叙述
    var fullResult = '';
    if (dp.showResult) {
        // AI生成结果叙述
        fullResult = await AI.narrateResult(
            choice,
            isOriginal,
            tl(dp.originalResult),
            tl(dp.context),
            null
        );

        ArcEngine.recordChoice(dp, tl(choice.label), isOriginal, fullResult);

        // 击杀搜刮
        if (dp.combatRelated || dp.lootOnKill) {
            var loot = ArcEngine.checkLootOnKill(dp);
            if (loot) {
                await showLootPopup(loot);
            }
        }

        // 关键特定道具触发检查
        var newItems = [];
        if (dp.grantItem) {
            var targetItemName = dp.grantItem;
            // 从当前篇章的 keyItems 中找到定义好的道具对象
            var currentArc = ArcEngine.getCurrentArc();
            var ki = currentArc && currentArc.keyItems ? currentArc.keyItems.find(function(item) { return item.name === targetItemName; }) : null;
            if (ki) {
                var added = ArcEngine.addItem(ki.name, ki.effect || ki.from, ki.type || '', ki.icon || '');
                if (added) newItems.push(added);
            }
        }
        if (newItems.length > 0) {
            await showItemGetNotices(newItems);
        }

        // 全屏居中显示结果叙述
        if (fullResult && fullResult.trim()) {
            await showNarrationOverlay(fullResult);
        }

        // 进入下一个决策点（支持分支）
        _advanceToNextDp(choice);
    } else {
        // 无结果：直接记录，跳到下一个决策点
        ArcEngine.recordChoice(dp, tl(choice.label), isOriginal, '');

        // 击杀搜刮
        if (dp.combatRelated || dp.lootOnKill) {
            var loot2 = ArcEngine.checkLootOnKill(dp);
            if (loot2) {
                await showLootPopup(loot2);
            }
        }

        // 关键特定道具触发检查
        var newItems2 = [];
        if (dp.grantItem) {
            var targetItemName2 = dp.grantItem;
            var currentArc2 = ArcEngine.getCurrentArc();
            var ki2 = currentArc2 && currentArc2.keyItems ? currentArc2.keyItems.find(function(item) { return item.name === targetItemName2; }) : null;
            if (ki2) {
                var added2 = ArcEngine.addItem(ki2.name, ki2.effect || ki2.from, ki2.type || '', ki2.icon || '');
                if (added2) newItems2.push(added2);
            }
        }
        if (newItems2.length > 0) {
            await showItemGetNotices(newItems2);
        }

        // 进入下一个决策点（支持分支）
        _advanceToNextDp(choice);
    }

    // 报告给后端
    if (gameState.sessionId) {
        AI.reportChoice(gameState.sessionId, gameState.bookId, choiceIdx, tl(choice.label), isOriginal);
    }

    ArcEngine.save(gameState.bookId);
    saveProgress();
}

// 分支导航：根据选择的 next 字段跳转
function _advanceToNextDp(choice) {
    _markCurrentDpCompleted(choice);
    // 如果选项有 next 字段，跳转到指定DP
    if (choice && choice.next) {
        if (choice.next === 'END' || choice.next === 'NEXT_ARC') {
            handleArcEnd();
            return;
        }
        var nextDp = ArcEngine.jumpToDp(choice.next);
        if (nextDp) {
            showArcDecisionPoint();
            return;
        }
    }
    // 否则线性前进
    var nextDp = ArcEngine.advanceDp();
    if (!nextDp) {
        handleArcEnd();
    } else {
        showArcDecisionPoint();
    }
}

// ── 击杀搜刮弹窗 ──
function showLootPopup(loot) {
    return new Promise(function(resolve) {
        var existing = document.querySelector('.loot-popup');
        if (existing) existing.remove();

        var items = tl(loot.items);
        var itemsArr = Array.isArray(items) ? items : [];
        var promptText = tl(loot.prompt);

        var el = document.createElement('div');
        el.className = 'loot-popup';
        el.innerHTML =
            '<div class="loot-popup-inner">' +
            '<p class="loot-popup-text">' + promptText + '</p>' +
            '<div class="loot-popup-items">' +
            itemsArr.map(function(n) { return '<span class="loot-item">' + n + '</span>'; }).join('') +
            '</div>' +
            '<div class="loot-popup-btns">' +
            '<button class="loot-btn loot-search-btn" data-action="search">搜储物袋</button>' +
            '<button class="loot-btn loot-leave-btn" data-action="leave">离开</button>' +
            '</div>' +
            '</div>';

        document.body.appendChild(el);

        el.querySelector('.loot-search-btn').onclick = function() {
            var added = ArcEngine.processLoot(itemsArr);
            el.classList.add('fade-out');
            setTimeout(function() { el.remove(); }, 400);
            if (added.length > 0) {
                showItemGetNotices(added).then(function() { resolve(added); });
            } else {
                resolve(added);
            }
        };

        el.querySelector('.loot-leave-btn').onclick = function() {
            el.classList.add('fade-out');
            setTimeout(function() { el.remove(); resolve([]); }, 400);
        };

        el.addEventListener('click', function(e) {
            if (e.target === el) {
                el.classList.add('fade-out');
                setTimeout(function() { el.remove(); resolve([]); }, 400);
            }
        });
    });
}

// ── 弧结束 → 过渡旁白 → 下一弧 / 无缝接续 AI 续写 ──
function handleArcEnd() {
    if (!ArcEngine.isArcFinished()) return;
    ArcEngine.playArcTransition(function(status, nextArc) {
        if (status === 'end') {
            // 全部原著手写弧结束 → 自动接续 AI 无限长篇动态推演引擎
            var display = document.getElementById('game-chapter-display');
            if (display) {
                display.innerHTML = '<div class="end-screen" style="text-align:center;padding:2rem;">' +
                    '<h2 class="end-title" style="font-size:1.6rem;color:#f0a030;margin-bottom:1rem;">— 原著手写卷完结 —</h2>' +
                    '<p class="end-msg" style="color:#a0a5b5;margin-bottom:1.5rem;">原著静态剧情已播放完毕。宿主在此世界的传奇未完，即将开启 AI 动态推演无尽后续篇章！</p>' +
                    '<button class="choice-card choice-original" onclick="showContinuedAiStorySegment(\'开启AI推演续篇\')" style="margin:0 auto;max-width:320px;padding:12px 24px;font-size:1.1rem;cursor:pointer;">✨ 开启 AI 无尽续写篇章</button>' +
                    '</div>';
            }
            return;
        }
        if (status === 'arc') {
            // 新弧开始，显示背景介绍
            showArcIntro(nextArc);
        }
    });
}

// ── 弧背景介绍 ──
function showArcIntro(arc) {
    var gameIntro = document.getElementById('game-intro');
    var gameMainContent = document.getElementById('game-main-content');
    var gameBgLayer = document.getElementById('game-bg-layer');
    var gameHint = document.getElementById('game-intro-hint');

    if (gameMainContent) gameMainContent.style.display = 'none';
    if (gameBgLayer) gameBgLayer.style.display = 'none';
    if (gameIntro) gameIntro.classList.add('active');
    if (gameHint) { gameHint.style.display = 'none'; gameHint.textContent = typeof t === 'function' ? t('intro_hint') : '点击继续'; }

    document.getElementById('game-intro-title').textContent = tl(arc.title);
    var txtEl = document.getElementById('game-intro-text');
    txtEl.innerHTML = '';

    var introText = tl(arc.background);
    var ready = false;

    typeWriter(txtEl, introText, function() {
        if (gameHint) gameHint.style.display = '';
        ready = true;
    });

    if (gameIntro) {
        gameIntro.onclick = function() {
            if (!ready) {
                _twCancel = null;
                txtEl.classList.remove('typing');
                txtEl.innerHTML = introText;
                if (gameHint) gameHint.style.display = '';
                ready = true;
            } else {
                gameIntro.classList.remove('active');
                gameIntro.onclick = null;
                if (gameMainContent) gameMainContent.style.display = '';
                if (gameBgLayer) gameBgLayer.style.display = '';
                showArcDecisionPoint();
            }
        };
    }
}

// 导出全局
window.onArcChoice = onArcChoice;

// ==================== 书籍封面页 ====================
var _landingBookId = null;
var _landingBook = null;

function showBookLanding(bookId, book, nebulaType) {
    _landingBookId = bookId;
    _landingBook = book;

    var bookColor = book.color || '#f59e0b';
    var r = parseInt(bookColor.slice(1,3), 16);
    var g = parseInt(bookColor.slice(3,5), 16);
    var b = parseInt(bookColor.slice(5,7), 16);
    var darkerColor = 'rgb(' + Math.floor(r*0.7) + ',' + Math.floor(g*0.7) + ',' + Math.floor(b*0.7) + ')';
    var glowColor = 'rgba(' + r + ',' + g + ',' + b + ',0.4)';

    var root = document.getElementById('book-landing-screen');
    root.style.setProperty('--landing-color', darkerColor);
    root.style.setProperty('--landing-glow', glowColor);

    var title = document.getElementById('landing-title');
    var subtitle = document.getElementById('landing-subtitle');
    var author = document.getElementById('landing-author');

    if(title) title.textContent = book.title;
    if(subtitle) subtitle.textContent = '— ' + book.title + ' —';
    if(author) author.textContent = (book.author || '') + ' 著';

    // 已经不需要重新玩/继续玩按钮，只留开始游戏
    var landingSingle = document.getElementById('landing-btn');
    if (landingSingle) {
        landingSingle.style.display = '';
        landingSingle.textContent = '开 始 游 戏';
    }

    switchScreen('book-landing');
}

document.addEventListener('DOMContentLoaded', function() {
    var backBtn = document.getElementById('landing-back');
    var startBtn = document.getElementById('landing-btn');
    var restartBtn = document.getElementById('landing-restart-btn');
    var continueBtn = document.getElementById('landing-continue-btn');

    if(backBtn) {
        backBtn.addEventListener('click', function() {
            switchScreen('book');
        });
    }

    if(startBtn) {
        startBtn.addEventListener('click', function() {
            if(_landingBookId && _landingBook && _currentSaveSlotId) {
                var list = getSaveList(_landingBookId);
                var save = list.find(function(s) { return s.id === _currentSaveSlotId; });
                if (save) {
                    initGameWithSave(_landingBookId, _landingBook, save);
                    return;
                }
            }
            // 没有选中存档时打开存档选择
            if(_landingBookId && _landingBook) {
                openSaveSlotsModal(_landingBookId, _landingBook);
            }
        });
    }

    if(restartBtn) {
        restartBtn.addEventListener('click', function() {
            if(!_landingBookId || !_landingBook) return;
            showGameConfirm('确定要重新体验吗？当前进度将被清空。', '系统确认').then(function(yes) {
                if (!yes) return;
                localStorage.removeItem('bookemu_progress_' + _landingBookId);
                localStorage.removeItem('arc_engine_' + _landingBookId + '_' + (_currentSaveSlotId || 'slot_default'));
                // 重置探索进度
                try {
                    var expData = JSON.parse(localStorage.getItem('bookEmu_exploration') || '{}');
                    if (expData[_landingBook.id]) {
                        expData[_landingBook.id].progress = 0;
                    }
                    localStorage.setItem('bookEmu_exploration', JSON.stringify(expData));
                } catch(e) {}
                initGame(_landingBookId, _landingBook);
            });
        });
    }

    if(continueBtn) {
        continueBtn.addEventListener('click', function() {
            if(_landingBookId && _landingBook) {
                initGame(_landingBookId, _landingBook);
            }
        });
    }

    // ── 储物袋弹窗 ──
    var bagOverlay = document.getElementById('bag-overlay');
    var bagCloseBtn = document.getElementById('bag-close-btn');
    if (bagCloseBtn) bagCloseBtn.addEventListener('click', function() { closeBag(); });
    if (bagOverlay) bagOverlay.addEventListener('click', function(e) { if (e.target === bagOverlay) closeBag(); });

    // ── 灵宠弹窗 ──
    var petOverlay = document.getElementById('pet-overlay');
    var petCloseBtn = document.getElementById('pet-close-btn');
    if (petCloseBtn) petCloseBtn.addEventListener('click', function() { closePetPanel(); });
    if (petOverlay) petOverlay.addEventListener('click', function(e) { if (e.target === petOverlay) closePetPanel(); });

    // ── 卷轴弹窗 ──
    var scrollOverlay = document.getElementById('scroll-overlay');
    var scrollCloseBtn = document.getElementById('scroll-close-btn');
    if (scrollCloseBtn) scrollCloseBtn.addEventListener('click', function() { closeScrollViewer(); });
    if (scrollOverlay) scrollOverlay.addEventListener('click', function(e) { if (e.target === scrollOverlay) closeScrollViewer(); });

    // ── 死亡画面 ──
    var deathRetryBtn = document.getElementById('death-retry-btn');
    var deathQuitBtn = document.getElementById('death-quit-btn');
    if (deathRetryBtn) deathRetryBtn.addEventListener('click', function() { retryFromDeath(); });
    if (deathQuitBtn) deathQuitBtn.addEventListener('click', function() { quitFromDeath(); });
});

// ══════════════════════════════════════════════
// ── 全局自定义弹窗提示（替代 alert, confirm, prompt） ──
var _dialogResolve = null;

window.showGameAlert = function(msg, title) {
    return new Promise(function(resolve) {
        var overlay = document.getElementById('game-dialog-overlay');
        var titleEl = document.getElementById('game-dialog-title');
        var bodyEl = document.getElementById('game-dialog-body');
        var inputWrap = document.getElementById('game-dialog-input-wrap');
        var confirmBtn = document.getElementById('game-dialog-confirm-btn');
        var cancelBtn = document.getElementById('game-dialog-cancel-btn');

        if (!overlay) { resolve(); return; }

        titleEl.textContent = title || '系统提示';
        bodyEl.textContent = msg;
        inputWrap.classList.add('hidden');
        cancelBtn.classList.add('hidden');

        overlay.classList.remove('hidden');

        _dialogResolve = function() {
            overlay.classList.add('hidden');
            resolve();
        };

        confirmBtn.onclick = function() {
            if (_dialogResolve) {
                var res = _dialogResolve;
                _dialogResolve = null;
                res();
            }
        };
    });
};

window.showGameConfirm = function(msg, title) {
    return new Promise(function(resolve) {
        var overlay = document.getElementById('game-dialog-overlay');
        var titleEl = document.getElementById('game-dialog-title');
        var bodyEl = document.getElementById('game-dialog-body');
        var inputWrap = document.getElementById('game-dialog-input-wrap');
        var confirmBtn = document.getElementById('game-dialog-confirm-btn');
        var cancelBtn = document.getElementById('game-dialog-cancel-btn');

        if (!overlay) { resolve(false); return; }

        titleEl.textContent = title || '系统确认';
        bodyEl.textContent = msg;
        inputWrap.classList.add('hidden');
        cancelBtn.classList.remove('hidden');

        overlay.classList.remove('hidden');

        _dialogResolve = function(val) {
            overlay.classList.add('hidden');
            resolve(val);
        };

        confirmBtn.onclick = function() {
            if (_dialogResolve) {
                var res = _dialogResolve;
                _dialogResolve = null;
                res(true);
            }
        };

        cancelBtn.onclick = function() {
            if (_dialogResolve) {
                var res = _dialogResolve;
                _dialogResolve = null;
                res(false);
            }
        };
    });
};

window.showGamePrompt = function(msg, defaultVal, title) {
    return new Promise(function(resolve) {
        var overlay = document.getElementById('game-dialog-overlay');
        var titleEl = document.getElementById('game-dialog-title');
        var bodyEl = document.getElementById('game-dialog-body');
        var inputWrap = document.getElementById('game-dialog-input-wrap');
        var inputEl = document.getElementById('game-dialog-input');
        var confirmBtn = document.getElementById('game-dialog-confirm-btn');
        var cancelBtn = document.getElementById('game-dialog-cancel-btn');

        if (!overlay) { resolve(null); return; }

        titleEl.textContent = title || '系统输入';
        bodyEl.textContent = msg;
        inputWrap.classList.remove('hidden');
        cancelBtn.classList.remove('hidden');
        if (inputEl) {
            inputEl.value = defaultVal || '';
            setTimeout(function() { inputEl.focus(); }, 100);
        }

        overlay.classList.remove('hidden');

        _dialogResolve = function(val) {
            overlay.classList.add('hidden');
            resolve(val);
        };

        confirmBtn.onclick = function() {
            if (_dialogResolve) {
                var val = inputEl ? inputEl.value : '';
                var res = _dialogResolve;
                _dialogResolve = null;
                res(val);
            }
        };

        cancelBtn.onclick = function() {
            if (_dialogResolve) {
                var res = _dialogResolve;
                _dialogResolve = null;
                res(null);
            }
        };
    });
};

window.closeGameDialog = function() {
    var overlay = document.getElementById('game-dialog-overlay');
    if (overlay) overlay.classList.add('hidden');
    if (_dialogResolve) {
        var res = _dialogResolve;
        _dialogResolve = null;
        res(null);
    }
};

// ══════════════════════════════════════════════
//  储物袋系统
// ══════════════════════════════════════════════
var _bagCurrentTab = 'weapon';

var _itemIcons = {
    'weapon': '⚔️', '法宝': '⚔️',
    'talisman': '📜', '符宝': '📜',
    'pill': '💊', '丹药': '💊',
    'scroll': '📋', '卷轴': '📋',
    'map': '🗺️', '地图': '🗺️',
    'material': '🧱', '材料': '🧱',
    'quest': '🔑', '任务': '🔑',
    'other': '📦', '其他': '📦'
};

function _getItemIcon(type) {
    if (!type) return '📦';
    var t = type.toLowerCase();
    return _itemIcons[t] || _itemIcons[type] || '📦';
}

function _getItemIconHtml(item, large) {
    if (item && item.icon) {
        var cls = 'item-custom-icon item-icon-' + item.icon + (large ? ' item-custom-icon-lg' : '');
        var inner = '';
        if (item.icon === 'small-green-bottle') {
            inner = '<div class="bottle-herb"></div><div class="bottle-sparkle"></div>';
        }
        return '<div class="' + cls + '">' + inner + '</div>';
    }
    var emoji = _getItemIcon(item ? item.type : '');
    var sz = large ? 'font-size:3rem' : '';
    return '<span style="' + sz + '">' + emoji + '</span>';
}

// ── 道具获得通知 ──────────────────────────────
function showItemGetNotice(item) {
    return new Promise(function(resolve) {
        var existing = document.querySelector('.item-get-overlay');
        if (existing) existing.remove();

    var icon = _getItemIconHtml(item, true);
        var el = document.createElement('div');
        el.className = 'item-get-overlay';
        el.innerHTML =
            '<div class="item-get-card">' +
            '<div class="item-get-icon">' + icon + '</div>' +
            '<div class="item-get-name">' + (item.name || '未知道具') + '</div>' +
            (item.description ? '<div class="item-get-desc">' + item.description + '</div>' : '') +
            '<div class="item-get-hint">按任意键继续</div>' +
            '</div>';

        document.body.appendChild(el);

        function dismiss() {
            document.removeEventListener('keydown', onKey);
            el.removeEventListener('click', onClick);
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s ease';
            setTimeout(function() { el.remove(); }, 300);
            flyItemToBag(icon).then(resolve);
        }

        function onKey(e) {
            e.preventDefault();
            dismiss();
        }
        function onClick(e) {
            e.preventDefault();
            dismiss();
        }

        setTimeout(function() {
            document.addEventListener('keydown', onKey);
            el.addEventListener('click', onClick);
        }, 100);
    });
}

function flyItemToBag(iconHtml) {
    return new Promise(function(resolve) {
        var bagBtn = document.querySelector('[data-gm="bag"]');
        if (!bagBtn) { resolve(); return; }

        var btnRect = bagBtn.getBoundingClientRect();
        var targetX = btnRect.left + btnRect.width / 2;
        var targetY = btnRect.top + btnRect.height / 2;

        var el = document.createElement('div');
        el.className = 'item-fly';
        el.innerHTML = iconHtml;
        el.style.left = '50%';
        el.style.top = '50%';
        el.style.transform = 'translate(-50%, -50%) scale(1)';
        el.style.opacity = '1';
        document.body.appendChild(el);

        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                el.style.left = targetX + 'px';
                el.style.top = targetY + 'px';
                el.style.transform = 'translate(-50%, -50%) scale(0.15)';
                el.style.opacity = '0';
            });
        });

        setTimeout(function() {
            el.remove();
            resolve();
        }, 850);
    });
}

function showItemGetNotices(items) {
    if (!items || items.length === 0) return Promise.resolve();
    if (typeof triggerFateRiverReward === 'function') triggerFateRiverReward();
    var chain = Promise.resolve();
    items.forEach(function(item) {
        chain = chain.then(function() {
            return showItemGetNotice(item);
        });
    });
    return chain;
}

function openBag() {
    var overlay = document.getElementById('bag-overlay');
    if (overlay) overlay.classList.remove('hidden');
    _bagCurrentTab = 'weapon';
    _selectedBagItem = null;

    // 绑定左侧分类按钮
    var cats = document.querySelectorAll('.bag-cat');
    cats.forEach(function(c) {
        c.classList.remove('active');
        c.onclick = function() {
            cats.forEach(function(x) { x.classList.remove('active'); });
            c.classList.add('active');
            _selectedBagItem = null;
            _clearBagDetail();
            renderBagItems(c.getAttribute('data-cat'));
        };
    });
    cats[0].classList.add('active');

    // 清空详情面板
    _clearBagDetail();
    renderBagItems('weapon');
}

function _clearBagDetail() {
    var detail = document.getElementById('bag-detail');
    if (detail) detail.innerHTML = '<div class="bag-detail-empty">选择一个道具查看详情</div>';
}

function closeBag() {
    var overlay = document.getElementById('bag-overlay');
    if (overlay) overlay.classList.add('hidden');
}

function _getAllBagItems() {
    var items = [];
    if (typeof ArcEngine !== 'undefined') {
        items = items.concat(ArcEngine.getAllItems() || []);
    }
    if (typeof _collectedItems !== 'undefined') {
        _collectedItems.forEach(function(it) {
            if (!items.some(function(e) { return e.name === it.name; })) {
                items.push(it);
            }
        });
    }
    return items;
}

function _filterBagItems(items, category) {
    var categoryMap = {
        'weapon': ['法宝', '法器', 'weapon'],
        'talisman': ['符宝', '符箓', 'talisman'],
        'pill': ['丹药', '药', 'pill'],
        'scroll': ['卷轴', '地图', '功法', '残卷', 'scroll', 'map']
    };
    
    if (category === 'other') {
        // 过滤不属于以上四类的
        return items.filter(function(it) {
            var itemType = (it.type || '').toLowerCase();
            var itemName = it.name || '';
            var isWeapon = categoryMap.weapon.some(function(t) { return itemType.indexOf(t) !== -1; });
            var isTalisman = categoryMap.talisman.some(function(t) { return itemType.indexOf(t) !== -1; });
            var isPill = categoryMap.pill.some(function(t) { return itemType.indexOf(t) !== -1; });
            var isScroll = categoryMap.scroll.some(function(t) { return itemType.indexOf(t) !== -1; }) ||
                           itemName.indexOf('地图') !== -1 || itemName.indexOf('功法') !== -1 ||
                           itemName.indexOf('残卷') !== -1 || itemName.indexOf('残图') !== -1 ||
                           itemName.indexOf('卷轴') !== -1 || itemName.indexOf('书') !== -1 ||
                           itemName.indexOf('手札') !== -1 || itemName.indexOf('图鉴') !== -1;
            return !isWeapon && !isTalisman && !isPill && !isScroll;
        });
    }

    var matchTypes = categoryMap[category] || [];
    return items.filter(function(it) {
        var itemType = (it.type || '').toLowerCase();
        var itemName = it.name || '';
        if (category === 'scroll') {
            return matchTypes.some(function(t) { return itemType.indexOf(t) !== -1; }) ||
                   itemName.indexOf('地图') !== -1 || itemName.indexOf('功法') !== -1 ||
                   itemName.indexOf('残卷') !== -1 || itemName.indexOf('残图') !== -1 ||
                   itemName.indexOf('卷轴') !== -1 || itemName.indexOf('书') !== -1 ||
                   itemName.indexOf('手札') !== -1 || itemName.indexOf('图鉴') !== -1;
        }
        return matchTypes.some(function(t) { return itemType.indexOf(t) !== -1; });
    });
}

var _selectedBagItem = null;

function renderBagItems(category) {
    _bagCurrentTab = category;
    var content = document.getElementById('bag-content');
    if (!content) return;

    var allItems = _getAllBagItems();
    var filtered = _filterBagItems(allItems, category);

    if (filtered.length === 0) {
        content.innerHTML = '<div class="bag-empty">这里空无一物</div>';
        return;
    }

    var html = '';
    filtered.forEach(function(it) {
        var iconHtml = _getItemIconHtml(it);
        var isActive = _selectedBagItem && _selectedBagItem.name === it.name;
        html += '<div class="bag-pedestal' + (isActive ? ' active' : '') + '" data-item="' + (it.name || '').replace(/"/g, '&quot;') + '">' +
            '<div class="pedestal-icon">' + iconHtml + '</div>' +
            '<div class="pedestal-platform"></div>' +
            '<div class="pedestal-name">' + (it.name || '') + '</div>' +
            '</div>';
    });
    content.innerHTML = html;

    // 绑定点击
    content.querySelectorAll('.bag-pedestal').forEach(function(el) {
        el.addEventListener('click', function() {
            var itemName = el.getAttribute('data-item');
            var all = _getAllBagItems();
            var item = null;
            for (var i = 0; i < all.length; i++) {
                if (all[i].name === itemName) { item = all[i]; break; }
            }
            if (!item) return;
            _selectedBagItem = item;
            // 高亮
            content.querySelectorAll('.bag-pedestal').forEach(function(p) { p.classList.remove('active'); });
            el.classList.add('active');
            _showBagDetail(item);
        });
    });
}

function _showBagDetail(item) {
    var detail = document.getElementById('bag-detail');
    if (!detail) return;

    var icon = _getItemIcon(item.type);
    var desc = item.effect || item.desc || item.description || '暂无描述';
    var origin = item.origin || '未知来历';
    var specificEffect = item.specificEffect || '';
    var typeName = _getBagTypeName(item.type);
    
    var isScroll = (item.type === 'scroll' || item.type === '卷轴' || item.type === '地图' ||
        (item.name && (item.name.indexOf('地图') !== -1 || item.name.indexOf('功法') !== -1 ||
         item.name.indexOf('残卷') !== -1 || item.name.indexOf('书') !== -1 || item.name.indexOf('手札') !== -1)));
    var isUsable = (item.type === 'pill' || item.type === '丹药' || item.type === '药' ||
        (item.name && (item.name.indexOf('丹') !== -1 || item.name.indexOf('药') !== -1)));
    var isBottle = (item.name === '神秘小瓶');

    var html = '<div class="detail-icon">' + icon + '</div>' +
        '<div class="detail-name">' + (item.name || '') + '</div>' +
        '<div class="detail-type">' + typeName + '</div>' +
        '<div class="detail-origin">来历：' + origin + '</div>' +
        '<div class="detail-desc">' + desc + '</div>';

    if (specificEffect) {
        html += '<div class="detail-specific">具体作用：' + specificEffect + '</div>';
    }

    html += '<div class="detail-actions">';
    if (isScroll) {
        html += '<button class="detail-btn detail-btn-view" onclick="viewBagItem(\'' +
            (item.name || '').replace(/'/g, "\\'") + '\')">📖 查看</button>';
    }
    if (isUsable || isBottle) {
        html += '<button class="detail-btn detail-btn-use" onclick="useBagItem(\'' +
            (item.name || '').replace(/'/g, "\\'") + '\')">' + (isBottle ? '🧪 催化灵药' : '💊 服用') + '</button>';
    }
    if (!isScroll && !isUsable && !isBottle) {
        html += '<button class="detail-btn detail-btn-view" onclick="viewBagItem(\'' +
            (item.name || '').replace(/'/g, "\\'") + '\')">👁 查看</button>';
    }
    html += '</div>';

    detail.innerHTML = html;
}

function _getBagTypeName(type) {
    if (!type) return '未知';
    var map = { 'weapon': '法宝', 'talisman': '符宝', 'pill': '丹药', 'scroll': '卷轴', 'map': '地图' };
    return map[type.toLowerCase()] || type;
}

function useBagItem(name) {
    var allItems = _getAllBagItems();
    var item = null;
    for (var i = 0; i < allItems.length; i++) {
        if (allItems[i].name === name) { item = allItems[i]; break; }
    }
    if (!item) return;
    
    // 如果是神秘小瓶
    if (name === '神秘小瓶') {
        var state = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : null;
        var today = new Date().toDateString();
        if (state && state.lastCatalysisDate === today) {
            showGameAlert('❌ 神秘小瓶催熟失败！\n瓶内的天道绿液每日仅能凝聚出一滴（每日限制使用一次），今日额度已用尽。请明日再试。', '催化失败');
            return;
        }

        if (typeof triggerGreenLiquidCatalysis === 'function') {
            var success = triggerGreenLiquidCatalysis();
            if (success) {
                showGameAlert('🧪 倒出了神秘小瓶内凝聚的翠绿绿液。滴入了一株灵草幼苗中，眨眼间催熟获得了一株【五百年培元草】！因果扰动天道积分奖励 50 PT！', '催化成功');
                _selectedBagItem = null;
                _clearBagDetail();
                renderBagItems(_bagCurrentTab);
                saveProgress();
                return;
            }
        }
    }
    
    // 如果是消耗性丹药
    var isUsable = (item.type === 'pill' || item.type === '丹药' || item.type === '药' ||
        (item.name && (item.name.indexOf('丹') !== -1 || item.name.indexOf('药') !== -1)));
    
    if (isUsable && typeof ArcEngine !== 'undefined') {
        var pState = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : null;
        if (pState) {
            // 简单解析加法力或血量的数值
            var manaAdd = 0;
            var hpAdd = 0;
            if (name.indexOf('筑基丹') !== -1) {
                manaAdd = 50;
            } else if (name.indexOf('疗伤丹') !== -1) {
                hpAdd = 30;
            } else if (name.indexOf('金髓丸') !== -1) {
                manaAdd = 15;
            } else if (name.indexOf('黄丝草') !== -1) {
                manaAdd = 5;
            } else {
                manaAdd = 10;
            }

            if (manaAdd > 0) {
                pState.mana = Math.min(pState.maxMana, pState.mana + manaAdd);
            }
            if (hpAdd > 0) {
                pState.hp = Math.min(pState.maxHp, pState.hp + hpAdd);
            }

            // 从背包扣除
            var items = pState.items || [];
            var idx = items.findIndex(function(it) { return it.name === name; });
            if (idx !== -1) {
                items.splice(idx, 1);
            }

            var tipMsg = '服下了【' + name + '】！\n';
            if (manaAdd > 0) tipMsg += '法力增加 ' + manaAdd + ' 点！\n';
            if (hpAdd > 0) tipMsg += '生命恢复 ' + hpAdd + ' 点！\n';
            showGameAlert(tipMsg, '服用成功');

            // 重新刷新背包
            _selectedBagItem = null;
            _clearBagDetail();
            renderBagItems(_bagCurrentTab);

            // 保存状态
            saveProgress();
            
            // 刷新属性面板
            if (!document.getElementById('character-overlay').classList.contains('hidden')) {
                renderCharacterPanel();
            }
            return;
        }
    }

    var desc = item.effect || item.desc || item.description || '';
    showGameAlert('使用了【' + name + '】\n' + (desc ? '效果：' + desc : ''), '使用法宝');
}

function viewBagItem(name) {
    var allItems = _getAllBagItems();
    var item = null;
    for (var i = 0; i < allItems.length; i++) {
        if (allItems[i].name === name) { item = allItems[i]; break; }
    }
    if (!item) return;

    var type = item.type || '';
    if (type === '卷轴' || type === '地图' || type === 'scroll' || type === 'map' ||
        name.indexOf('地图') !== -1 || name.indexOf('功法') !== -1 ||
        name.indexOf('残卷') !== -1 || name.indexOf('残图') !== -1 ||
        name.indexOf('书') !== -1 || name.indexOf('手札') !== -1) {
        if (type === '地图' || type === 'map' || name.indexOf('地图') !== -1 || name.indexOf('舆图') !== -1) {
            if (typeof openMapItem === 'function') openMapItem(item);
        } else {
            openScrollViewer(name, item.effect || item.desc || item.description || '暂无内容');
        }
        return;
    }
    showGameAlert('【' + name + '】\n' + (item.effect || item.desc || item.description || '暂无描述'), '查看物品');
}

// ══════════════════════════════════════════════
//  卷轴查看器
// ══════════════════════════════════════════════
var _scrollTypewriterTimer = null;
var _legacyAudio = null;
var _legacyFetchController = null;

function openScrollViewer(name, content) {
    var overlay = document.getElementById('scroll-overlay');
    var titleEl = document.getElementById('scroll-title');
    var contentEl = document.getElementById('scroll-content');
    if (!overlay || !titleEl || !contentEl) return;

    if (_scrollTypewriterTimer) {
        clearInterval(_scrollTypewriterTimer);
        _scrollTypewriterTimer = null;
    }
    if (_legacyAudio) {
        _legacyAudio.pause();
        _legacyAudio.currentTime = 0;
        _legacyAudio = null;
    }
    if (_legacyFetchController) {
        _legacyFetchController.abort();
        _legacyFetchController = null;
    }
    if (typeof stopQuoteAudio === 'function') {
        stopQuoteAudio();
    }

    titleEl.textContent = name;
    
    // 如果是墨居仁遗书，触发特殊逻辑：调用 TTS API 生成克隆语音，文字随着返回语音播放进度（轻重缓急）同步打字浮现
    if (name.indexOf('墨居仁遗书') !== -1 || name.indexOf('墨居仁') !== -1) {
        contentEl.innerHTML = '';
        overlay.classList.remove('hidden');
        _playPageFlipSound();

        // 墨居仁的遗言文本
        var letterText = "韩立，墨某一生行事从不向人解释，成王败寇，自有天定，人生苦短，终归尘土，凭什么仙家就可以傲游天地，而我等凡人只能做这井底之蛙，这世间多少好景色，你就代为师去看看吧。";

        var p = document.createElement('p');
        p.style.lineHeight = '1.8';
        p.style.fontSize = '16px';
        p.style.color = '#888888';
        p.textContent = '⏳ [稍等片刻...]';
        contentEl.appendChild(p);

        function startFallbackTypewriter() {
            if (_scrollTypewriterTimer) return;
            p.style.color = '#ffffff';
            p.textContent = '';
            var charIdx = 0;
            _scrollTypewriterTimer = setInterval(function() {
                if (charIdx <= letterText.length) {
                    p.textContent = letterText.substring(0, charIdx);
                    charIdx++;
                } else {
                    clearInterval(_scrollTypewriterTimer);
                    _scrollTypewriterTimer = null;
                }
            }, 120);
        }

        // 调用后端 TTS API 进行克隆语音合成
        if (typeof TTS_API !== 'undefined' && TTS_API) {
            _legacyFetchController = new AbortController();
            fetch(TTS_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: letterText,
                    npcName: 'mojuren',
                    playerAction: '低沉虚弱，带着临死前的悔恨、不甘与一丝恳求，语速缓慢',
                    cloneName: 'mojuren'
                }),
                signal: _legacyFetchController.signal
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data && data.audioBase64) {
                    var audio = new Audio('data:audio/wav;base64,' + data.audioBase64);
                    _legacyAudio = audio;
                    
                    audio.onplay = function() {
                        p.style.color = '#ffffff';
                        p.textContent = '';
                    };

                    audio.ontimeupdate = function() {
                        if (audio.duration && audio.duration > 0) {
                            var progress = audio.currentTime / audio.duration;
                            var targetLen = Math.min(letterText.length, Math.floor(progress * letterText.length) + 1);
                            p.style.color = '#ffffff';
                            p.textContent = letterText.substring(0, targetLen);
                        }
                    };

                    audio.onended = function() {
                        p.style.color = '#ffffff';
                        p.textContent = letterText;
                        _legacyAudio = null;
                    };

                    audio.play().then(function() {
                        p.style.color = '#ffffff';
                        if (typeof _ttsAudio !== 'undefined') {
                            if (_ttsAudio && _ttsAudio !== audio) _ttsAudio.pause();
                            _ttsAudio = audio;
                        }
                    }).catch(function(e) {
                        console.log('[MoJuren API Speech] 播放被拦截:', e.message);
                        startFallbackTypewriter();
                    });
                } else {
                    startFallbackTypewriter();
                }
            })
            .catch(function(e) {
                if (e.name === 'AbortError') return;
                console.log('[MoJuren API Speech] API 调用失败:', e.message);
                startFallbackTypewriter();
            });
        } else {
            startFallbackTypewriter();
        }

        return;
    }

    contentEl.innerHTML = '<p>' + content.replace(/\n/g, '</p><p>') + '</p>';
    overlay.classList.remove('hidden');

    // 播放翻书音效
    _playPageFlipSound();
}

function closeScrollViewer() {
    var overlay = document.getElementById('scroll-overlay');
    if (overlay) overlay.classList.add('hidden');

    if (_scrollTypewriterTimer) {
        clearInterval(_scrollTypewriterTimer);
        _scrollTypewriterTimer = null;
    }
    if (_legacyAudio) {
        _legacyAudio.pause();
        _legacyAudio.currentTime = 0;
        _legacyAudio = null;
    }
    if (_legacyFetchController) {
        _legacyFetchController.abort();
        _legacyFetchController = null;
    }
    if (typeof stopQuoteAudio === 'function') {
        stopQuoteAudio();
    }
}

function _playPageFlipSound() {
    try {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var duration = 0.15;
        var bufferSize = audioCtx.sampleRate * duration;
        var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            var t = i / audioCtx.sampleRate;
            data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 20) * 0.3;
        }
        var source = audioCtx.createBufferSource();
        source.buffer = buffer;
        var filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 0.5;
        source.connect(filter);
        filter.connect(audioCtx.destination);
        source.start();
    } catch(e) {}
}

// ==================== 存档管理系统 ====================
var _currentSaveSlotId = null;

function getSaveKey(bookId) {
    return 'bookemu_saves_v2_' + bookId;
}

function getSaveList(bookId) {
    var raw = localStorage.getItem(getSaveKey(bookId));
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch(e) {
        return [];
    }
}

function saveToSlot(bookId, slotId) {
    var list = getSaveList(bookId);
    var slot = list.find(function(s) { return s.id === slotId; });
    
    // 获取当前游戏引擎状态
    var arcIdx = 0;
    var dpIdx = 0;
    var dpId = null;
    var branchingMode = false;
    var pState = {
        items: [],
        cultivation: '炼气期三层',
        age: 16,
        mana: 25,
        maxMana: 50,
        hp: 50,
        maxHp: 50,
        spiritRoot: '四行伪灵根 (木水火土·缺金)',
        pets: [],
        choiceHistory: []
    };
    
    if (typeof ArcEngine !== 'undefined') {
        var idxData = ArcEngine.getArcIndex();
        arcIdx = idxData.arcIdx;
        dpIdx = idxData.dpIdx;
        var curDp = ArcEngine.getCurrentDecisionPoint();
        dpId = curDp ? curDp.id : null;
        branchingMode = true; // fanren 统一是分支模式
        pState = ArcEngine.getPlayerState();
        var rawState = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : {};
        if (rawState.age) pState.age = rawState.age;
        if (rawState.mana) pState.mana = rawState.mana;
        if (rawState.maxMana) pState.maxMana = rawState.maxMana;
        if (rawState.hp) pState.hp = rawState.hp;
        if (rawState.maxHp) pState.maxHp = rawState.maxHp;
        if (rawState.spiritRoot) pState.spiritRoot = rawState.spiritRoot;
    }
    
    var arcTitle = '';
    if (typeof ArcEngine !== 'undefined' && ArcEngine.getCurrentArc()) {
        arcTitle = tl(ArcEngine.getCurrentArc().title);
    }

    var saveName = slot ? slot.name : '存档 ' + (list.length + 1);

    var saveObj = {
        id: slotId,
        name: saveName,
        timestamp: Date.now(),
        arcIdx: arcIdx,
        dpIdx: dpIdx,
        dpId: dpId,
        branchingMode: branchingMode,
        segIdx: gameState.segIdx,
        deviations: deviationCount,
        currentArcTitle: arcTitle || '七玄门',
        playerName: gameState.playerName,
        hasSeenIntro: true, // 只要存过档，代表至少玩过了
        // 人物属性
        cultivation: pState.cultivation,
        age: pState.age || 16,
        mana: pState.mana || 25,
        maxMana: pState.maxMana || 50,
        hp: pState.hp || 50,
        maxHp: pState.maxHp || 50,
        spiritRoot: pState.spiritRoot || '伪灵根 (五行俱全)',
        items: pState.items,
        pets: pState.pets,
        choiceHistory: pState.recentChoices || [],
        completedDpIds: slot && slot.completedDpIds ? slot.completedDpIds : [],
        completedArcIds: slot && slot.completedArcIds ? slot.completedArcIds : [],
        unlockedAchievements: slot && slot.unlockedAchievements ? slot.unlockedAchievements : []
    };

    if (slot) {
        // 更新原有存档
        Object.assign(slot, saveObj);
    } else {
        // 新增存档
        list.push(saveObj);
    }
    
    localStorage.setItem(getSaveKey(bookId), JSON.stringify(list));
}

function _markCurrentDpCompleted(selectedChoice) {
    if (!_currentSaveSlotId || !gameState.bookId || typeof ArcEngine === 'undefined') return;
    var dp = ArcEngine.getCurrentDecisionPoint ? ArcEngine.getCurrentDecisionPoint() : null;
    var arc = ArcEngine.getCurrentArc ? ArcEngine.getCurrentArc() : null;
    if (!dp || !dp.id) return;
    var list = getSaveList(gameState.bookId);
    var slot = list.find(function(s) { return s.id === _currentSaveSlotId; });
    if (!slot) return;
    if (!Array.isArray(slot.completedDpIds)) slot.completedDpIds = [];
    if (!Array.isArray(slot.completedArcIds)) slot.completedArcIds = [];
    if (slot.completedDpIds.indexOf(dp.id) === -1) slot.completedDpIds.push(dp.id);
    if (selectedChoice && (selectedChoice.next === 'END' || selectedChoice.next === 'NEXT_ARC') && arc && arc.arcId && slot.completedArcIds.indexOf(arc.arcId) === -1) {
        slot.completedArcIds.push(arc.arcId);
    }
    slot.timestamp = Date.now();
    localStorage.setItem(getSaveKey(gameState.bookId), JSON.stringify(list));
}

function _migrateLegacySaveProgress(save, bookData) {
    if (!save) return;
    var changed = false;
    if (!Array.isArray(save.completedDpIds)) { save.completedDpIds = []; changed = true; }
    if (!Array.isArray(save.completedArcIds)) { save.completedArcIds = []; changed = true; }
    if (!Array.isArray(save.unlockedAchievements)) { save.unlockedAchievements = []; changed = true; }
    (save.choiceHistory || []).forEach(function(choice) {
        if (choice.dpId && save.completedDpIds.indexOf(choice.dpId) === -1) {
            save.completedDpIds.push(choice.dpId);
            changed = true;
        }
    });
    if (bookData && bookData.arcs) {
        for (var i = 0; i < Math.min(save.arcIdx || 0, bookData.arcs.length); i++) {
            var arcId = bookData.arcs[i].arcId;
            if (arcId && save.completedArcIds.indexOf(arcId) === -1) {
                save.completedArcIds.push(arcId);
                changed = true;
            }
        }
    }
    if (!changed) return;
    var list = getSaveList(gameState.bookId);
    var target = list.find(function(s) { return s.id === save.id; });
    if (target) Object.assign(target, save);
    localStorage.setItem(getSaveKey(gameState.bookId), JSON.stringify(list));
}

window.openSaveSlotsModal = function(bookId, book) {
    // 设置全局变量以便后续使用
    _landingBookId = bookId;
    _landingBook = book;
    
    var overlay = document.getElementById('save-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');

    var closeBtn = overlay.querySelector('.save-close-btn');
    if (closeBtn) {
        closeBtn.onclick = function() {
            overlay.classList.add('hidden');
        };
    }

    var createBtn = document.getElementById('save-create-btn');
    if (createBtn) {
        createBtn.onclick = function() {
            var list = getSaveList(bookId);
            var slotId = 'save_' + Date.now();
            showGamePrompt('请输入存档名称:', '存档 ' + (list.length + 1), '创建存档').then(function(saveName) {
                if (saveName === null) return; // 取消
                if (!saveName.trim()) saveName = '存档 ' + (list.length + 1);
                
                // 创建空存档数据
                var newSave = {
                    id: slotId,
                    name: saveName,
                    timestamp: Date.now(),
                    arcIdx: 0,
                    dpIdx: 0,
                    dpId: 'qm_1',
                    branchingMode: true,
                    segIdx: 0,
                    deviations: 0,
                    currentArcTitle: '第一卷 · 七玄门',
                    playerName: gameState.playerName,
                    hasSeenIntro: false, // 第一次玩，需要序章
                    // 属性初始值
                    cultivation: '炼气期三层',
                    age: 16,
                    hp: 50,
                    maxHp: 50,
                    mana: 25,
                    maxMana: 50,
                    items: [],
                    pets: [],
                    completedDpIds: [],
                    completedArcIds: [],
                    unlockedAchievements: []
                };
                // 保存到 localStorage
                var currentList = getSaveList(bookId);
                currentList.push(newSave);
                localStorage.setItem(getSaveKey(bookId), JSON.stringify(currentList));
                renderSaveList(bookId, _landingBook);
            });
        };
    }

    renderSaveList(bookId, book);
}

function renderSaveList(bookId, book) {
    var listEl = document.getElementById('save-list');
    if (!listEl) return;
    var saves = getSaveList(bookId);
    if (saves.length === 0) {
        listEl.innerHTML = '<div class="save-empty">暂无存档</div>';
        return;
    }
    var html = '';
    saves.forEach(function(save) {
        var dateStr = new Date(save.timestamp).toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
        var deadClass = save.isDead ? ' save-item-dead' : '';
        html += '<div class="save-item' + deadClass + '" data-id="' + save.id + '" onclick="confirmEnterSave(\'' + bookId + '\',\'' + save.id + '\')">' +
            '<div class="save-item-header">' +
            '<div class="save-item-title">' + save.name + (save.isDead ? ' <span style="color:#ff4444;font-size:10px;">[已死亡]</span>' : '') + '</div>' +
            '</div>' +
            '<div class="save-item-progress">进度：' + save.currentArcTitle + '</div>' +
            '<div class="save-item-detail">境界: ' + save.cultivation + ' | 年龄: ' + save.age + '岁</div>' +
            '<div class="save-item-footer">' +
            '<div class="save-item-date">' + dateStr + '</div>' +
            '<button class="save-item-btn save-btn-del" onclick="event.stopPropagation();deleteSaveSlot(\'' + bookId + '\',\'' + save.id + '\')">删除</button>' +
            '</div>' +
            '</div>';
    });
    listEl.innerHTML = html;
}

window.confirmEnterSave = function(bookId, saveId) {
    var overlay = document.getElementById('save-confirm-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    overlay.dataset.bookId = bookId;
    overlay.dataset.saveId = saveId;
};

window.closeSaveConfirm = function() {
    var overlay = document.getElementById('save-confirm-overlay');
    if (overlay) overlay.classList.add('hidden');
};

window.doEnterSave = function() {
    var overlay = document.getElementById('save-confirm-overlay');
    if (!overlay) return;
    var bookId = overlay.dataset.bookId;
    var saveId = overlay.dataset.saveId;
    overlay.classList.add('hidden');

    if (!bookId || !saveId) return;

    var list = getSaveList(bookId);
    var save = list.find(function(s) { return s.id === saveId; });
    if (!save) return;

    _currentSaveSlotId = saveId;

    // 关闭存档弹窗
    var saveOverlay = document.getElementById('save-overlay');
    if (saveOverlay) saveOverlay.classList.add('hidden');

    // 跳转到书籍封面页
    showBookLanding(bookId, _landingBook);
};

window.deleteSaveSlot = function(bookId, saveId) {
    showGameConfirm('确定要删除此存档吗？该操作不可逆！', '删除存档').then(function(yes) {
        if (!yes) return;
        var list = getSaveList(bookId);
        list = list.filter(function(s) { return s.id !== saveId; });
        localStorage.setItem(getSaveKey(bookId), JSON.stringify(list));
        localStorage.removeItem('arc_engine_' + bookId + '_' + saveId);
        var sysPrefix = 'sys_' + bookId + '_' + saveId + '_';
        ['points', 'achievements', 'msg_history', 'space_items'].forEach(function(suffix) {
            localStorage.removeItem(sysPrefix + suffix);
        });
        if (_currentSaveSlotId === saveId) _currentSaveSlotId = null;
        // 重新渲染
        renderSaveList(bookId, _landingBook);
    });
};

window.loadSaveAndPlay = function(bookId, saveId) {
    var list = getSaveList(bookId);
    var save = list.find(function(s) { return s.id === saveId; });
    if (!save) return;

    if (save.isDead) {
        showGameAlert('此存档已处于死亡状态，元神涣散，无法再次读取！', '无法加载');
        return;
    }

    _currentSaveSlotId = saveId;

    // 关闭存档弹窗
    var overlay = document.getElementById('save-overlay');
    if (overlay) overlay.classList.add('hidden');

    // 载入存档并初始化游戏
    initGameWithSave(bookId, _landingBook, save);
};

function initGameWithSave(bookId, book, save) {
    try {
        gameState.bookId = bookId;
        gameState.bookTitle = book.title;
        gameState.nebulaBookId = book.id || null;
        gameState.playerName = save.playerName || '穿越者';
        gameState.segIdx = save.segIdx || 0;
        gameState.sessionId = null;
        deviationCount = save.deviations || 0;
        _typing = false;
        _typingDone = false;

        // 联动刷新系统面板在当前载入存档槽位下的专属数据（积分、对话历史、随身空间）
        if (typeof _loadSystemSpaceItems === 'function') _loadSystemSpaceItems();
        if (typeof _loadSystemMessagesHistory === 'function') _loadSystemMessagesHistory();
        if (typeof _initSystemPoints === 'function') _initSystemPoints();

        // 初始化 ArcEngine 状态
        var bkData = BOOK_DATA[bookId];
        _migrateLegacySaveProgress(save, bkData);
        gameState.useArcs = !!(bkData && bkData.arcs && bkData.arcs.length > 0);
        if (gameState.useArcs) {
            if (typeof ArcEngine !== 'undefined') {
                if (ArcEngine.setSaveSlotId) ArcEngine.setSaveSlotId(save.id);
                ArcEngine.init(bookId);
                ArcEngine.loadArcs(bkData.arcs);
                
                // 将存档数据灌入 ArcEngine
                var raw = {
                    arcIdx: save.arcIdx,
                    dpIdx: save.dpIdx,
                    dpId: save.dpId,
                    branchingMode: save.branchingMode,
                    items: save.items || [],
                    cultivation: save.cultivation || '炼气期三层',
                    age: save.age || 16,
                    mana: save.mana || 25,
                    maxMana: save.maxMana || 50,
                    hp: save.hp || 50,
                    maxHp: save.maxHp || 50,
                    spiritRoot: save.spiritRoot || '伪灵根 (五行俱全)',
                    pets: save.pets || [],
                    choiceHistory: save.choiceHistory || []
                };
                localStorage.setItem('arc_engine_' + bookId + '_' + save.id, JSON.stringify(raw));
                ArcEngine.load(bookId);
            }
        }

        tryConnectBackend(bookId);
        switchScreen('game');
        startStarCanvas();

        // 仅在第一次玩的时候跳出序章，继续玩不需要
        if (!save.hasSeenIntro && bkData && bkData.intro && bkData.intro.length > 0) {
            startIntro();
        } else {
            // 回归玩家直接进入游戏界面
            document.getElementById('game-bg-layer').style.display = '';
            document.getElementById('game-main-content').style.display = '';
            document.getElementById('gm-btn').style.display = '';
            if (gameState.useArcs) {
                showArcDecisionPoint();
            } else {
                showCurrentSegment();
            }
            if (typeof showSystemWelcome === 'function') {
                setTimeout(function() { showSystemWelcome(); }, 800);
            }
        }
    } catch(e) {
        console.error('initGameWithSave error:', e);
    }
}

// 覆写原 saveProgress
var oldSaveProgress = saveProgress;
saveProgress = function() {
    oldSaveProgress();
    if (_currentSaveSlotId) {
        saveToSlot(gameState.bookId, _currentSaveSlotId);
    }
};


// ══════════════════════════════════════════════
//  人物属性系统
// ══════════════════════════════════════════════
function openCharacterPanel() {
    var overlay = document.getElementById('character-overlay');
    if (overlay) overlay.classList.remove('hidden');
    
    var closeBtn = overlay.querySelector('.character-close-btn');
    if (closeBtn) {
        closeBtn.onclick = function() {
            overlay.classList.add('hidden');
        };
    }

    renderCharacterPanel();
}

function renderCharacterPanel() {
    var pState = {
        cultivation: '炼气期三层',
        age: 16,
        mana: 25,
        maxMana: 50,
        hp: 50,
        maxHp: 50,
        spiritRoot: '伪灵根 (五行俱全)'
    };

    if (typeof ArcEngine !== 'undefined') {
        var s = ArcEngine.getPlayerState();
        var rawState = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : {};
        pState.cultivation = s.cultivation;
        pState.age = rawState.age || 16;
        pState.mana = rawState.mana || 25;
        pState.maxMana = rawState.maxMana || 50;
        pState.hp = rawState.hp || 50;
        pState.maxHp = rawState.maxHp || 50;
        pState.spiritRoot = rawState.spiritRoot || '伪灵根 (五行俱全)';
    }

    var ageEl = document.getElementById('char-age');
    var spiritEl = document.getElementById('char-spirit-root');
    var cultEl = document.getElementById('char-cultivation');
    var hpFill = document.getElementById('char-hp-fill');
    var hpText = document.getElementById('char-hp-text');
    var mpFill = document.getElementById('char-mp-fill');
    var mpText = document.getElementById('char-mp-text');

    if (ageEl) ageEl.textContent = pState.age + ' 岁';
    if (spiritEl) spiritEl.textContent = pState.spiritRoot;
    if (cultEl) cultEl.textContent = pState.cultivation;
    
    if (hpFill && hpText) {
        var hpPct = Math.max(0, Math.min(100, (pState.hp / pState.maxHp) * 100));
        hpFill.style.width = hpPct + '%';
        hpText.textContent = pState.hp + '/' + pState.maxHp;
    }
    if (mpFill && mpText) {
        var mpPct = Math.max(0, Math.min(100, (pState.mana / pState.maxMana) * 100));
        mpFill.style.width = mpPct + '%';
        mpText.textContent = pState.mana + '/' + pState.maxMana;
    }
}

// 覆写菜单的事件响应
// ══════════════════════════════════════════════
//  灵宠系统
// ══════════════════════════════════════════════
function _getPets() {
    if (typeof ArcEngine !== 'undefined' && ArcEngine.getPlayerState) {
        var ps = ArcEngine.getPlayerState();
        return ps.pets || [];
    }
    return [];
}

function openPetPanel() {
    var overlay = document.getElementById('pet-overlay');
    if (overlay) overlay.classList.remove('hidden');
    renderPetList();
}

function closePetPanel() {
    var overlay = document.getElementById('pet-overlay');
    if (overlay) overlay.classList.add('hidden');
}

function renderPetList() {
    var sidebar = document.getElementById('pet-sidebar');
    if (!sidebar) return;
    var pets = _getPets();
    if (pets.length === 0) {
        sidebar.innerHTML = '<div class="pet-empty-hint">暂无灵宠<br><span style="font-size:0.6rem;color:#444">探索世界寻找灵宠</span></div>';
        document.getElementById('pet-display').innerHTML = '<div class="pet-empty-display">暂无灵宠</div>';
        document.getElementById('pet-feed-area').innerHTML = '';
        return;
    }
    sidebar.innerHTML = pets.map(function(p, i) {
        return '<div class="pet-avatar' + (i === 0 ? ' active' : '') + '" data-pet-idx="' + i + '" title="' + (p.name || '灵宠') + '">' +
            (p.icon || '🐱') + '</div>';
    }).join('');

    sidebar.querySelectorAll('.pet-avatar').forEach(function(el) {
        el.addEventListener('click', function() {
            sidebar.querySelectorAll('.pet-avatar').forEach(function(a) { a.classList.remove('active'); });
            el.classList.add('active');
            var idx = parseInt(el.getAttribute('data-pet-idx'));
            showPetDetail(pets[idx]);
        });
    });

    if (pets.length > 0) showPetDetail(pets[0]);
}

function showPetDetail(pet) {
    if (!pet) return;
    var display = document.getElementById('pet-display');
    var feedArea = document.getElementById('pet-feed-area');
    if (display) {
        display.innerHTML = '<div class="pet-display-icon">' + (pet.icon || '🐱') + '</div>' +
            '<div class="pet-display-name">' + (pet.name || '未知灵宠') + '</div>' +
            '<div class="pet-display-info">' +
            '等级: ' + (pet.level || 1) + '<br>' +
            '亲密度: ' + (pet.affection || 0) + '<br>' +
            (pet.desc || '一只神秘的灵宠') +
            '</div>';
    }
    if (feedArea) {
        var items = [];
        if (typeof ArcEngine !== 'undefined') items = ArcEngine.getAllItems() || [];
        var feedable = items.filter(function(it) {
            return it.type === 'pill' || it.type === '丹药' || it.type === '药' || (it.name && (it.name.indexOf('灵草') !== -1 || it.name.indexOf('丹') !== -1 || it.name.indexOf('药') !== -1));
        });
        if (feedable.length === 0) {
            feedArea.innerHTML = '<div class="pet-feed-title">🎒 可喂食的物品</div><div style="color:#555;font-size:0.8rem">暂无可喂食的物品</div>';
        } else {
            feedArea.innerHTML = '<div class="pet-feed-title">🎒 可喂食的物品</div><div class="pet-feed-list">' +
                feedable.map(function(it) {
                    return '<div class="pet-feed-item" onclick="feedPet(\'' + (pet.id || '') + '\',\'' + (it.name || '').replace(/'/g, "\\'") + '\')">' + (it.name || '') + '</div>';
                }).join('') + '</div>';
        }
    }
}

function feedPet(petId, itemName) {
    if (typeof ArcEngine !== 'undefined' && ArcEngine.feedPet) {
        ArcEngine.feedPet(petId, itemName);
    }
    if (typeof sysTriggerPlot === 'function') {
        sysTriggerPlot('你给灵宠喂食了' + itemName + '。');
    }
    renderPetList();
}

// ══════════════════════════════════════════════
//  死亡系统
// ══════════════════════════════════════════════
function showDeathScreen(reason) {
    var overlay = document.getElementById('death-overlay');
    var reasonEl = document.getElementById('death-reason');
    if (overlay) overlay.classList.remove('hidden');
    if (reasonEl) reasonEl.textContent = reason || '你在冒险中倒下了……';

    // 死亡处罚：直接标记当前存档为已死亡，不再有重来机会
    if (_currentSaveSlotId && gameState.bookId) {
        var list = getSaveList(gameState.bookId);
        var slot = list.find(function(s) { return s.id === _currentSaveSlotId; });
        if (slot) {
            slot.isDead = true;
            slot.currentArcTitle = '💀 已死亡 (魂飞魄散)';
            localStorage.setItem(getSaveKey(gameState.bookId), JSON.stringify(list));
        }
    }
}

function retryFromDeath() {
    // 死了没有重来机会，直接返回星辰界面
    var overlay = document.getElementById('death-overlay');
    if (overlay) overlay.classList.add('hidden');
    _twCancel = null;
    _typing = false;
    stopStarCanvas();
    switchScreen('book');
}

function quitFromDeath() {
    var overlay = document.getElementById('death-overlay');
    if (overlay) overlay.classList.add('hidden');
    _twCancel = null;
    _typing = false;
    stopStarCanvas();
    switchScreen('book');
}

// ══════════════════════════════════════════════
//  战斗系统 v2（暴击/灵力回复/回合显示/保底普攻）
// ══════════════════════════════════════════════
var _combatState = null;
var _combatAnimLock = false;

var _COMBAT_MP_REGEN = 3;
var _COMBAT_CRIT_RATE = 0.15;
var _COMBAT_ENEMY_CRIT_RATE = 0.10;
var _COMBAT_CRIT_MULT_PLAYER = 1.5;
var _COMBAT_CRIT_MULT_ENEMY = 1.3;

// ==================== 人生模拟器数值状态与终章结算 ====================
function updateLifeSimBarUI() {
    var ageEl = document.getElementById('sim-age-val');
    var cultEl = document.getElementById('sim-cultivation-val');
    var maxAgeEl = document.getElementById('sim-max-age-val');
    var fateEl = document.getElementById('sim-fate-val');

    // 标签 Elements
    var labelAge = document.getElementById('sim-label-age');
    var labelCult = document.getElementById('sim-label-cult');
    var labelMaxAge = document.getElementById('sim-label-maxage');
    var labelFate = document.getElementById('sim-label-fate');

    var nebType = window.currentNebulaType || 'xianxia';
    if (gameState.bookId) {
        if (gameState.bookId.indexOf('scifi') !== -1 || gameState.bookId.indexOf('sanTi') !== -1) nebType = 'scifi';
        else if (gameState.bookId.indexOf('romance') !== -1 || gameState.bookId.indexOf('hongLou') !== -1) nebType = 'romance';
        else if (gameState.bookId.indexOf('xianxia') !== -1 || gameState.bookId.indexOf('fanRen') !== -1) nebType = 'xianxia';
    }

    // 动态根据宇宙类型适配标签
    if (nebType === 'scifi') {
        if (labelAge) labelAge.textContent = '⏳ 纪年/年龄';
        if (labelCult) labelCult.textContent = '🚀 身份阶层';
        if (labelMaxAge) labelMaxAge.textContent = '🌐 预期寿命';
        if (labelFate) labelFate.textContent = '📍 当前地点';
    } else if (nebType === 'romance') {
        if (labelAge) labelAge.textContent = '⏳ 世家年岁';
        if (labelCult) labelCult.textContent = '📜 家族位阶';
        if (labelMaxAge) labelMaxAge.textContent = '🌸 大限年岁';
        if (labelFate) labelFate.textContent = '📍 当前地点';
    } else {
        if (labelAge) labelAge.textContent = '⏳ 当前年岁';
        if (labelCult) labelCult.textContent = '✨ 当前境界';
        if (labelMaxAge) labelMaxAge.textContent = '🕊 大限寿元';
        if (labelFate) labelFate.textContent = '📍 当前地点';
    }

    var state = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : null;
    var currentAge = state ? (state.age || 16) : 16;
    var cult = state ? (state.cultivation || (nebType==='scifi'?'危机纪年·研究员':nebType==='romance'?'金陵世家子弟':'炼气期一层')) : '炼气期一层';
    
    // 计算寿元上限
    var maxAge = 120;
    if (nebType === 'scifi') {
        maxAge = 85;
        if (cult.indexOf('执剑') !== -1) maxAge = 150;
        else if (cult.indexOf('星际') !== -1) maxAge = 200;
    } else if (nebType === 'romance') {
        maxAge = 80;
        if (cult.indexOf('公') !== -1 || cult.indexOf('主') !== -1) maxAge = 90;
    } else {
        if (cult.indexOf('筑基') !== -1) maxAge = 200;
        else if (cult.indexOf('结丹') !== -1) maxAge = 500;
        else if (cult.indexOf('元婴') !== -1) maxAge = 1200;
    }

    if (ageEl) ageEl.textContent = currentAge + ' 岁';
    if (cultEl) cultEl.textContent = cult;
    if (maxAgeEl) maxAgeEl.textContent = maxAge + ' 岁';

    if (fateEl) {
        var loc = '神手谷';
        if (state && state.location && state.location !== '未知') {
            loc = state.location;
        } else if (gameState.bookId) {
            if (gameState.bookId.indexOf('fanRen') !== -1) loc = '彩霞山·神手谷';
            else if (gameState.bookId.indexOf('douPo') !== -1) loc = '加玛帝国·乌坦城';
            else if (gameState.bookId.indexOf('sanTi') !== -1) loc = '红岸基基地';
            else if (gameState.bookId.indexOf('shaQiu') !== -1) loc = '厄拉科斯·沙漠洞穴';
            else if (gameState.bookId.indexOf('hongLou') !== -1) loc = '贾府·大观园';
            else loc = (BOOK_DATA[gameState.bookId] ? BOOK_DATA[gameState.bookId].title : '未知域');
        }
        fateEl.textContent = loc;
    }
}

// 抉择时推进年龄、境界与天道反噬/天机值
var _ageSubStep = 0; // 内部步数累加器
function _advancePlayerAgeOnChoice(isOriginal) {
    var state = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : null;
    if (!state) return;
    var previousCultivation = state.cultivation;

    // 每进行 3 次决策选择，年龄增长 1 岁（纯整数增长）
    _ageSubStep = (_ageSubStep || 0) + 1;
    if (_ageSubStep >= 3) {
        state.age = Math.floor(state.age || 16) + 1;
        _ageSubStep = 0;
    } else {
        state.age = Math.floor(state.age || 16);
    }

    var nebType = window.currentNebulaType || 'xianxia';
    if (gameState.bookId) {
        if (gameState.bookId.indexOf('scifi') !== -1 || gameState.bookId.indexOf('sanTi') !== -1) nebType = 'scifi';
        else if (gameState.bookId.indexOf('romance') !== -1 || gameState.bookId.indexOf('hongLou') !== -1) nebType = 'romance';
        else if (gameState.bookId.indexOf('xianxia') !== -1 || gameState.bookId.indexOf('fanRen') !== -1) nebType = 'xianxia';
    }

    var dev = window.deviationCount || 0;
    var currentArc = (typeof ArcEngine !== 'undefined' && ArcEngine.getCurrentArc) ? ArcEngine.getCurrentArc() : null;
    var arcId = currentArc ? currentArc.arcId : '';

    if (nebType === 'xianxia') {
        // 严格遵循《凡人修仙传》原著境界规则与弧（Arc）阶段锁：
        // 1. 七玄门篇 (qixuanmen): 练气期一层 -> 练气期四层
        // 2. 黄枫谷入门篇 (huangfenggu): 练气期五层 -> 练气期十层
        // 3. 血色禁地篇 (blood-trial): 练气期十一层 -> 练气期十二层/大圆满 (禁制限定仅练气期可入!)
        // 4. 禁地完结 / AI 续写篇: 闭关突破筑基期 -> 结丹期

        if (arcId === 'qixuanmen') {
            if (gameState.segIdx >= 5) state.cultivation = '炼气期四层';
            else if (gameState.segIdx >= 3) state.cultivation = '炼气期三层';
            else if (gameState.segIdx >= 1) state.cultivation = '炼气期二层';
            else state.cultivation = '炼气期一层';
        } else if (arcId === 'huangfenggu') {
            if (gameState.segIdx >= 15) state.cultivation = '炼气期十层';
            else if (gameState.segIdx >= 12) state.cultivation = '炼气期九层';
            else if (gameState.segIdx >= 9) state.cultivation = '炼气期八层';
            else if (gameState.segIdx >= 6) state.cultivation = '炼气期七层';
            else if (gameState.segIdx >= 3) state.cultivation = '炼气期六层';
            else state.cultivation = '炼气期五层';
        } else if (arcId === 'blood-trial') {
            // 血色禁地期间：严格在练气期十一层 ~ 大圆满之间，防止筑基期溢出
            if (gameState.segIdx >= 10) state.cultivation = '炼气期大圆满';
            else if (gameState.segIdx >= 5) state.cultivation = '炼气期十二层';
            else state.cultivation = '炼气期十一层';
        } else {
            // AI 动态续写篇 / 通用修仙续篇 (按累计选择数逐步突破筑基/结丹)
            var step = gameState.segIdx || 1;
            if (step >= 30) state.cultivation = '结丹期中期';
            else if (step >= 24) state.cultivation = '结丹期初期';
            else if (step >= 18) state.cultivation = '筑基期后期';
            else if (step >= 14) state.cultivation = '筑基期中期';
            else if (step >= 8) state.cultivation = '筑基期初期';
            else if (step >= 4) state.cultivation = '炼气期大圆满';
            else state.cultivation = '炼气期十二层';
        }
    } else if (nebType === 'scifi') {
        var steps = Math.floor((state.age - 25) / 3) + dev;
        if (steps >= 12) state.cultivation = '广播纪年·星际舰队指挥官';
        else if (steps >= 8) state.cultivation = '威慑纪年·执剑人候选';
        else if (steps >= 5) state.cultivation = '威慑纪年·前沿理论学者';
        else if (steps >= 3) state.cultivation = '危机纪年·项目首席专家';
        else if (steps >= 1) state.cultivation = '危机纪年·资深工程师';
        else state.cultivation = '危机纪年·研究员';
    } else if (nebType === 'romance') {
        var stepsR = Math.floor((state.age - 13) / 2) + dev;
        if (stepsR >= 10) state.cultivation = '世家金陵掌舵人';
        else if (stepsR >= 7) state.cultivation = '金陵十二钗·要员';
        else if (stepsR >= 4) state.cultivation = '荣国府·中流砥柱';
        else if (stepsR >= 2) state.cultivation = '荣国府·后起之秀';
        else state.cultivation = '荣国府·少年公子';
    }

    // 给顺应原著加【天机庇佑/积分奖励】，给逆天改命加【逆天积分】
    if (typeof addSystemPoints === 'function') {
        if (isOriginal) {
            addSystemPoints(20); // 顺应原著：获得天机探查积分 20 PT
        } else {
            addSystemPoints(35); // 逆天改命：获得高风险逆天积分 35 PT
        }
    }

    updateLifeSimBarUI();
    if (previousCultivation && previousCultivation !== state.cultivation && typeof triggerFateRiverReward === 'function') {
        triggerFateRiverReward();
    }
}

// 显示人生终章结算弹窗 (双轨评级)
function showLifeSummaryModal() {
    var modal = document.getElementById('life-summary-modal');
    if (!modal) return;

    var state = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : null;
    var finalAge = state ? state.age : 16;
    var finalCult = state ? state.cultivation : '炼气期一层';
    var dev = window.deviationCount || 0;
    var totalChoices = (gameState.segIdx || 1);
    var originalChoices = Math.max(0, totalChoices - dev);

    // 双轨评级：顺天流 vs 逆天流
    var titleBadge = '【原著顺天者】';
    var rankText = 'A 级稳健天机';
    
    if (dev > originalChoices) {
        // 逆天为主
        if (dev >= 10) { titleBadge = '【混沌开辟·逆天至尊】'; rankText = 'SSS 级逆天传奇'; }
        else if (dev >= 5) { titleBadge = '【因果翻转者】'; rankText = 'S 级出类拔萃'; }
        else { titleBadge = '【命运探索者】'; rankText = 'A 级改命初具'; }
    } else {
        // 顺天为主
        if (originalChoices >= 10) { titleBadge = '【天道掌控·先知至尊】'; rankText = 'SSS 级完美先知'; }
        else if (originalChoices >= 5) { titleBadge = '【洞悉天机者】'; rankText = 'S 级无瑕顺天'; }
        else { titleBadge = '【原著顺天者】'; rankText = 'A 级稳健避坑'; }
    }

    var titleEl = document.getElementById('summary-title-badge');
    var ageEl = document.getElementById('summary-final-age');
    var cultEl = document.getElementById('summary-final-cult');
    var fateEl = document.getElementById('summary-final-fate');
    var rankEl = document.getElementById('summary-final-rank');
    var chronicleEl = document.getElementById('summary-chronicle-text');

    if (titleEl) titleEl.textContent = titleBadge;
    if (ageEl) ageEl.textContent = finalAge + ' 岁';
    if (cultEl) cultEl.textContent = finalCult;
    if (fateEl) fateEl.textContent = (dev * 10) + '% (逆天 ' + dev + ' 次 / 顺天 ' + originalChoices + ' 次)';
    if (rankEl) rankEl.textContent = rankText;

    // 调取生平简史
    var bookTitle = (BOOK_DATA[gameState.bookId] && BOOK_DATA[gameState.bookId].title) || '修仙世界';
    var styleDesc = (dev > originalChoices) ? 
        '你选择了【打破宿命】的高危道路，承受着天道反噬与未知的恐惧，杀出了一条独一无二的血路！' : 
        '你凭凭借【先知先觉】的极致洞察，避开了原著所有的杀劫与死坑，以最稳健潇洒姿态掌控了万界因果！';

    var text = '宿主在《' + bookTitle + '》中从 16 岁踏入修行，历经 ' + finalAge + ' 载岁月风霜。\n' +
        '最终达成的终局境界为：【' + finalCult + '】。\n' +
        styleDesc + '\n' +
        '解锁终局称号成就：' + titleBadge + '（' + rankText + '）！';
    if (chronicleEl) chronicleEl.textContent = text;

    modal.classList.add('active');
}

// 重开下一世人生
function restartLifeEmulation() {
    var modal = document.getElementById('life-summary-modal');
    if (modal) modal.classList.remove('active');
    
    // 重置状态
    var state = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : null;
    if (state) {
        state.age = 16;
        state.cultivation = '炼气期一层';
    }
    window.deviationCount = 0;
    gameState.segIdx = 0;
    
    updateLifeSimBarUI();
    showCurrentSegment();
}

// 发布生平至朋友圈/探索社区
function shareLifeToMoments() {
    var state = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : null;
    var finalAge = state ? state.age : 16;
    var finalCult = state ? state.cultivation : '炼气期一层';
    var bookTitle = (BOOK_DATA[gameState.bookId] && BOOK_DATA[gameState.bookId].title) || '修仙世界';
    
    var shareMsg = '在《' + bookTitle + '》经历了 ' + finalAge + ' 岁人生模拟，达成最终境界【' + finalCult + '】，逆天改命值 +' + (window.deviationCount || 0) + '！';
    
    if (typeof window.addCustomMoment === 'function') {
        window.addCustomMoment(shareMsg);
        alert('🎉 成功发布你的生平总结至万界朋友圈！');
    } else {
        alert('🎉 已复制生平档案！');
    }
}

function startCombat(combatData) {
    _combatState = {
        enemyName: combatData.enemy || '敌人',
        enemyHp: combatData.enemyHp || 100,
        enemyMaxHp: combatData.enemyHp || 100,
        playerHp: combatData.playerHp || 80,
        playerMaxHp: combatData.playerHp || 80,
        playerMp: combatData.playerMp || 50,
        playerMaxMp: combatData.playerMp || 50,
        actions: combatData.actions || [],
        outcomes: combatData.outcomes || {},
        log: [],
        dodged: false,
        turn: 0,
        combo: 0
    };
    _combatAnimLock = false;

    var overlay = document.getElementById('combat-overlay');
    if (overlay) overlay.classList.remove('hidden');

    var turnEl = document.getElementById('combat-turn');
    if (turnEl) turnEl.textContent = '第 1 回合';

    _combatLog('⚔ 战斗开始！' + _combatState.enemyName + '拦住了你的去路。');
    _updateCombatUI();
    _renderCombatActions();
}

function _combatLog(text, cssClass) {
    if (!_combatState) return;
    _combatState.log.push(text);
    var logEl = document.getElementById('combat-log');
    if (logEl) {
        var cls = cssClass ? ' class="' + cssClass + '"' : '';
        logEl.innerHTML += '<div' + cls + '>' + text + '</div>';
        logEl.scrollTop = logEl.scrollHeight;
    }
}

function _combatHitFlash(targetId) {
    var el = document.getElementById(targetId);
    if (!el) return;
    el.classList.remove('combat-hit-flash');
    void el.offsetWidth;
    el.classList.add('combat-hit-flash');
}

function _combatShakeScene() {
    var scene = document.querySelector('.combat-scene');
    if (!scene) return;
    scene.classList.remove('combat-shake');
    void scene.offsetWidth;
    scene.classList.add('combat-shake');
}

function _combatCritEffect(targetId) {
    var el = document.getElementById(targetId);
    if (!el) return;
    el.classList.remove('combat-crit-pop');
    void el.offsetWidth;
    el.classList.add('combat-crit-pop');
}

function _updateCombatUI() {
    if (!_combatState) return;
    var s = _combatState;

    var enemyNameEl = document.getElementById('combat-enemy-name');
    if (enemyNameEl) enemyNameEl.textContent = s.enemyName;

    var enemyHpFill = document.getElementById('combat-enemy-hp');
    var enemyHpText = document.getElementById('combat-enemy-hp-text');
    if (enemyHpFill) enemyHpFill.style.width = Math.max(0, (s.enemyHp / s.enemyMaxHp) * 100) + '%';
    if (enemyHpText) enemyHpText.textContent = Math.max(0, s.enemyHp) + ' / ' + s.enemyMaxHp;

    var playerHpFill = document.getElementById('combat-player-hp');
    var playerHpText = document.getElementById('combat-player-hp-text');
    if (playerHpFill) playerHpFill.style.width = Math.max(0, (s.playerHp / s.playerMaxHp) * 100) + '%';
    if (playerHpText) playerHpText.textContent = Math.max(0, s.playerHp) + ' / ' + s.playerMaxHp;

    var playerMpFill = document.getElementById('combat-player-mp');
    var playerMpText = document.getElementById('combat-player-mp-text');
    if (playerMpFill) playerMpFill.style.width = Math.max(0, (s.playerMp / s.playerMaxMp) * 100) + '%';
    if (playerMpText) playerMpText.textContent = Math.max(0, s.playerMp) + ' / ' + s.playerMaxMp;

    var turnEl = document.getElementById('combat-turn');
    if (turnEl) turnEl.textContent = '第 ' + s.turn + ' 回合';
}

function _renderCombatActions() {
    var actionsEl = document.getElementById('combat-actions');
    if (!actionsEl || !_combatState) return;

    var html = '';
    var hasAnyEnabled = false;

    _combatState.actions.forEach(function(action, i) {
        var disabled = '';
        if (action.mpCost && _combatState.playerMp < action.mpCost) disabled = ' disabled';
        else hasAnyEnabled = true;
        if (action.requirement === 'dodged' && !_combatState.dodged) { disabled = ' disabled'; }
        var costText = action.mpCost ? '<span class="combat-action-cost">灵力 -' + action.mpCost + '</span>' : '';
        html += '<div class="combat-action-btn' + disabled + '" onclick="executeCombatAction(' + i + ')">' +
            (action.label || '行动') + costText + '</div>';
    });

    html += '<div class="combat-action-btn combat-basic-attack" onclick="executeCombatAction(-1)">' +
        '👊 基础拳脚<span class="combat-action-cost">无消耗</span></div>';

    actionsEl.innerHTML = html;
}

function executeCombatAction(actionIdx) {
    if (!_combatState || _combatAnimLock) return;
    var s = _combatState;
    s.turn++;

    if (actionIdx === -1) {
        var basicDmg = 5 + Math.floor(Math.random() * 4);
        var isCrit = Math.random() < _COMBAT_CRIT_RATE;
        if (isCrit) {
            basicDmg = Math.floor(basicDmg * _COMBAT_CRIT_MULT_PLAYER);
            _combatLog('💥 暴击！你一拳狠狠击中' + s.enemyName + '！造成 ' + basicDmg + ' 点伤害！', 'combat-log-crit');
            _combatCritEffect('combat-enemy-info');
        } else {
            _combatLog('你挥拳击向' + s.enemyName + '，造成 ' + basicDmg + ' 点伤害。');
        }
        s.enemyHp -= basicDmg;
        _combatHitFlash('combat-enemy-info');
    } else {
        var action = s.actions[actionIdx];
        if (!action) return;

        if (action.mpCost) {
            if (s.playerMp < action.mpCost) {
                _combatLog('❌ 灵力不足！', 'combat-log-error');
                _renderCombatActions();
                return;
            }
            s.playerMp -= action.mpCost;
        }

        if (action.log) _combatLog(action.log);

        if (action.dodge) {
            s.dodged = true;
            s.combo++;
            _combatLog('你闪开了攻击，寻找破绽……连续闪避 ' + s.combo + ' 次！');
            if (s.combo >= 2) {
                _combatLog('⚡ 连续闪避触发反击准备！下一击伤害翻倍！', 'combat-log-crit');
                s.playerMp = Math.min(s.playerMaxMp, s.playerMp + 5);
            }
        } else if (action.damage) {
            var isCrit2 = Math.random() < _COMBAT_CRIT_RATE;
            var dmg = action.damage + Math.floor(Math.random() * 5);
            if (s.combo >= 2) {
                dmg *= 2;
                _combatLog('⚡ 连续闪避反击！伤害翻倍！', 'combat-log-crit');
                s.combo = 0;
            }
            if (isCrit2) {
                dmg = Math.floor(dmg * _COMBAT_CRIT_MULT_PLAYER);
                _combatLog('💥 暴击！造成 ' + dmg + ' 点伤害！', 'combat-log-crit');
                _combatCritEffect('combat-enemy-info');
            } else {
                _combatLog('造成 ' + dmg + ' 点伤害！');
            }
            s.enemyHp -= dmg;
            _combatHitFlash('combat-enemy-info');
        } else if (action.flee) {
            var fleeChance = 0.5;
            if (s.combo >= 2) fleeChance = 0.85;
            if (Math.random() < fleeChance) {
                _combatLog('你成功脱离了战斗！');
                _endCombat('flee');
                return;
            } else {
                _combatLog('逃跑失败！' + s.enemyName + '挡住了你的退路。');
                var counterDmg = 10 + Math.floor(Math.random() * 10);
                s.playerHp -= counterDmg;
                _combatLog(s.enemyName + '趁机攻击，你受到 ' + counterDmg + ' 点伤害！');
                _combatHitFlash('combat-player-status');
            }
        }
    }

    s.dodged = false;
    if (actionIdx !== -1 || true) {
        if (actionIdx !== -1) s.combo = 0;
    }

    if (s.enemyHp <= 0) {
        s.enemyHp = 0;
        _updateCombatUI();
        _combatLog('🎉 ' + s.enemyName + '被击败了！', 'combat-log-victory');
        // 如果击败了墨居仁，设置任务标志
        if (s.enemyName.indexOf('墨') !== -1 || s.enemyName.indexOf('墨居仁') !== -1 || s.enemyName.indexOf('墨大夫') !== -1) {
            var pState = ArcEngine.getPlayerStateRef ? ArcEngine.getPlayerStateRef() : null;
            if (pState) {
                pState.moKilled = true;
                saveProgress();
            }
        }
        _combatShakeScene();
        setTimeout(function() { _endCombat('victory'); }, 1000);
        return;
    }
    if (s.playerHp <= 0) {
        s.playerHp = 0;
        _updateCombatUI();
        _combatLog('💀 你倒下了……', 'combat-log-death');
        _combatShakeScene();
        setTimeout(function() { _endCombat('death'); }, 1000);
        return;
    }

    _combatAnimLock = true;
    setTimeout(function() {
        _enemyTurn();
    }, 500);
}

function _enemyTurn() {
    if (!_combatState) return;
    var s = _combatState;

    var baseDmg = 8 + Math.floor(Math.random() * 12);
    var isCrit = Math.random() < _COMBAT_ENEMY_CRIT_RATE;
    var enemyDmg = baseDmg;
    var critLabel = '';

    if (s.dodged) {
        var dodgeChance = 0.6 + s.combo * 0.1;
        if (Math.random() < dodgeChance) {
            _combatLog('🌀 你成功闪避了' + s.enemyName + '的攻击！');
            s.playerMp = Math.min(s.playerMaxMp, s.playerMp + 2);
            _combatAnimLock = false;
            _updateCombatUI();
            _renderCombatActions();
            return;
        }
    }

    if (isCrit) {
        enemyDmg = Math.floor(baseDmg * _COMBAT_CRIT_MULT_ENEMY);
        critLabel = ' 暴击！';
    }

    s.playerHp -= enemyDmg;
    _combatLog(s.enemyName + '反击' + critLabel + '，你受到 ' + enemyDmg + ' 点伤害！', isCrit ? 'combat-log-crit' : '');
    _combatHitFlash('combat-player-status');
    if (isCrit) _combatCritEffect('combat-player-status');

    if (s.playerHp <= 0) {
        s.playerHp = 0;
        _updateCombatUI();
        _combatLog('💀 你倒下了……', 'combat-log-death');
        _combatShakeScene();
        setTimeout(function() { _endCombat('death'); }, 1000);
        return;
    }

    s.playerMp = Math.min(s.playerMaxMp, s.playerMp + _COMBAT_MP_REGEN);
    if (_COMBAT_MP_REGEN > 0) {
        _combatLog('🔮 灵力回复 +' + _COMBAT_MP_REGEN, 'combat-log-mp');
    }

    _combatAnimLock = false;
    _updateCombatUI();
    _renderCombatActions();
}

function _endCombat(result) {
    var overlay = document.getElementById('combat-overlay');
    if (overlay) overlay.classList.add('hidden');

    if (result === 'death') {
        showDeathScreen('你在战斗中被' + (_combatState ? _combatState.enemyName : '敌人') + '击杀了……');
    } else if (result === 'victory') {
        var dp = ArcEngine.getCurrentDecisionPoint();
        if (dp && dp.lootOnKill) {
            var loot = ArcEngine.checkLootOnKill(dp);
            if (loot) {
                showLootPopup(loot).then(function() {
                    _combatVictoryContinue();
                });
                return;
            }
        }
        _combatVictoryContinue();
    } else if (result === 'flee') {
        var nextDp = ArcEngine.advanceDp();
        if (!nextDp) {
            handleArcEnd();
        } else {
            showArcDecisionPoint();
        }
    }
    _combatState = null;
}

async function _combatVictoryContinue() {
    var dp = ArcEngine.getCurrentDecisionPoint();
    if (dp && dp.grantItem) {
        var targetItemName3 = dp.grantItem;
        var currentArc3 = ArcEngine.getCurrentArc();
        var ki3 = currentArc3 && currentArc3.keyItems ? currentArc3.keyItems.find(function(item) { return item.name === targetItemName3; }) : null;
        var newItems3 = [];
        if (ki3) {
            var added3 = ArcEngine.addItem(ki3.name, ki3.effect || ki3.from, ki3.type || '', ki3.icon || '');
            if (added3) newItems3.push(added3);
        }
        if (newItems3.length > 0) {
            await showItemGetNotices(newItems3);
        }
    }
    var nextDp = ArcEngine.advanceDp();
    if (!nextDp) {
        handleArcEnd();
    } else {
        showArcDecisionPoint();
    }
}
