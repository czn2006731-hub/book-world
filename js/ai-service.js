// ==================== AI 服务层 ====================
// 封装后端 Chat API，提供选项生成、结果叙述、弧间旁白等功能
var AI = (function() {
    // 自动适配 Spring Boot (8080) 或 Node.js (3000) 后端
    var API_BASE = window.location.port === '3000' ? 'http://localhost:3000/api/chat' : 'http://localhost:8080/api/chat';

    // ── 调用 API（非流式） ──
    async function _post(endpoint, data) {
        try {
            var resp = await fetch(API_BASE + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            return await resp.json();
        } catch(e) {
            console.warn('[AI] API ' + endpoint + ' 失败:', e.message);
            return null;
        }
    }

    // ── 流式读取 / 模拟流式读取 ──
    async function _streamPost(endpoint, data, onChunk) {
        try {
            var resp = await fetch(API_BASE + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            
            var text = await resp.text();
            try {
                var json = JSON.parse(text);
                if (json.reply) text = json.reply;
                if (json.narrative) text = json.narrative;
            } catch(e) {}
            
            return await _simulateStream(text, onChunk, 20);
        } catch(e) {
            console.warn('[AI] Stream ' + endpoint + ' 失败:', e.message);
            return null;
        }
    }

    // ── 模拟流式输出（将一段文本逐字输出） ──
    function _simulateStream(text, onChunk, speed) {
        speed = speed || 25;
        var i = 0;
        return new Promise(function(resolve) {
            function tick() {
                if (i >= text.length) { resolve(text); return; }
                var len = Math.min(3, text.length - i);
                onChunk(text.substring(i, i + len));
                i += len;
                setTimeout(tick, speed);
            }
            tick();
        });
    }

    // ══════════════════════════════════════════════
    //  1. 生成 4 个选项（1原著 + 3AI，随机排列，无标签）
    // ══════════════════════════════════════════════
    async function generateChoices(context, originalChoice, history) {
        var promptHistory = (history || []).slice(-8).map(function(h) {
            return '玩家选择了: ' + h.label + ', 结果: ' + h.result;
        }).join('\n');

        var result = await _post('/chat/generate-choices', {
            context: context,
            originalChoice: originalChoice,
            history: promptHistory
        });

        if (result && result.choices && result.choices.length >= 4) {
            // AI 返回了4个选项
            return result.choices;
        }

        // ── 降级：用模板生成4个选项 ──
        console.log('[AI] 使用本地降级选项');
        var fallbacks = _generateFallbackChoices(context, originalChoice);
        // 随机排列
        for (var i = fallbacks.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = fallbacks[i]; fallbacks[i] = fallbacks[j]; fallbacks[j] = t;
        }
        return fallbacks;
    }

    function _generateFallbackChoices(context, originalChoice) {
        var opts = [
            { label: originalChoice.choice }
        ];

        var ctx = (context || '') + (originalChoice.choice || '');
        if (ctx.indexOf('打') !== -1 || ctx.indexOf('杀') !== -1 || ctx.indexOf('战') !== -1 || ctx.indexOf('敌') !== -1) {
            opts.push({ label: '全力出手，不留余地' });
            opts.push({ label: '先防守试探对方实力' });
            opts.push({ label: '趁对方不备突然偷袭' });
        } else if (ctx.indexOf('修炼') !== -1 || ctx.indexOf('功法') !== -1 || ctx.indexOf('修为') !== -1) {
            opts.push({ label: '先巩固当前境界再突破' });
            opts.push({ label: '直接冲击更高一层瓶颈' });
            opts.push({ label: '改修其他功法寻求突破' });
        } else if (ctx.indexOf('门') !== -1 || ctx.indexOf('弟子') !== -1 || ctx.indexOf('宗') !== -1) {
            opts.push({ label: '遵守门规，按规矩办事' });
            opts.push({ label: '暗中打探消息再做决定' });
            opts.push({ label: '直接找管事长老说明情况' });
        } else {
            opts.push({ label: '先观察周围情况再行动' });
            opts.push({ label: '向身边的人打听消息' });
            opts.push({ label: '独自前往人少的地方调查' });
        }
        return opts;
    }

    // ══════════════════════════════════════════════
    //  2. 叙述选择结果（流式）
    // ══════════════════════════════════════════════
    async function narrateResult(choice, isOriginal, originalResult, context, onChunk) {
        // 原著路径 → 直接使用预写结果
        if (isOriginal && originalResult) {
            return await _simulateStream(originalResult, onChunk, 30);
        }

        // 偏差路径 → 尝试调用AI
        var streamText = await _streamPost('/chat/narrate', {
            choiceLabel: choice.label,
            context: context,
            isOriginal: false
        }, onChunk);

        if (streamText) return streamText;

        // AI不可用，偏差路径无降级内容
        return null;
    }

    function _generateFallbackNarration(choice, context) {
        var templates = [
            '周围的气氛微妙地变化了。一些本该发生的事没有发生，取而代之的是意料之外的走向。',
            '你的行动引起了旁人的注意。有人暗暗记下了你的举动，不知道是福是祸。',
            '事情的发展超出了所有人的预料。空气中弥漫着一种说不清的变数。'
        ];
        var picked = templates[Math.floor(Math.random() * templates.length)];
        return picked;
    }

    // ══════════════════════════════════════════════
    //  3. 弧结束过渡旁白（流式，星空背景）
    // ══════════════════════════════════════════════
    async function generateArcTransition(arcData, playerState, onChunk) {
        var promptData = {
            arcName: arcData.title,
            arcSummary: arcData.arcConclusion ? arcData.arcConclusion.originalPath : '',
            keyItems: playerState.items || [],
            playerLevel: playerState.cultivation || '炼气期',
            nextArc: arcData.nextArc ? arcData.nextArc.title : '',
            nextArcHint: arcData.nextArc ? arcData.nextArc.bgHint : ''
        };

        var streamText = await _streamPost('/chat/transition', promptData, onChunk);
        if (streamText) return streamText;

        // 降级
        var fallback = _generateFallbackTransition(arcData, playerState);
        return await _simulateStream(fallback, onChunk, 30);
    }

    function _generateFallbackTransition(arcData, playerState) {
        var lines = [];
        var arcTitle = arcData.title || '当前篇章';
        lines.push(arcTitle + '就这样结束了。韩立回顾这些经历，心中感慨万千。');

        if (playerState.items && playerState.items.length > 0) {
            lines.push('他将获得的' + playerState.items.map(function(x){return x.name;}).join('、') + '小心收好。这些东西将在未来的修行路上发挥重要作用。');
        }

        if (arcData.nextArc) {
            var nextBg = arcData.nextArc.bgHint || '';
            lines.push('整理好行囊，韩立踏上了新的旅途。' + (nextBg ? '他得知' + nextBg + '。' : '') + '前方的路还很长，但修仙之人，本就以天地为家。');
        } else {
            lines.push('前方的路还很长，但修仙之人，本就以天地为家。每一次经历都是修行的磨刀石。');
        }

        lines.push('');
        return lines.join('\n');
    }

    // ══════════════════════════════════════════════
    //  4. 初始化会话
    // ══════════════════════════════════════════════
    async function initSession(bookId, playerName) {
        var result = await _post('/chat/init', {
            bookId: bookId,
            playerName: playerName,
            mode: 'arc-based'
        });
        return result ? result.sessionId : null;
    }

    // ══════════════════════════════════════════════
    //  5. 报告选择（给后端记录用）
    // ══════════════════════════════════════════════
    async function reportChoice(sessionId, bookId, choiceIndex, choiceLabel, isOriginal) {
        await _post('/chat/choice', {
            sessionId: sessionId,
            bookId: bookId,
            choiceIndex: choiceIndex,
            choiceLabel: choiceLabel,
            isOriginal: isOriginal
        });
    }

    return {
        generateChoices: generateChoices,
        narrateResult: narrateResult,
        generateArcTransition: generateArcTransition,
        initSession: initSession,
        reportChoice: reportChoice,
        _simulateStream: _simulateStream
    };
})();
