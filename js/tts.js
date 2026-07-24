// ==================== TTS 语音播放 ====================
var TTS_API = 'http://localhost:8080/api/tts';
var _ttsAudio = null;
var _ttsCurrentUrl = null;
var _ttsRequestId = 0;

// 书籍 → 声音 + 语气指令 + 克隆音色名称 (如果没有对应的克隆音频文件，后端会自动退回到系统音色)
var BOOK_VOICE_CONFIG = {
    's1': { voice: 'Cherry', instruction: '冷静理性，深沉稳重，透露出对宇宙的敬畏', cloneName: 's1' },
    's2': { voice: 'Cherry', instruction: '厚重深沉，带着对家园的眷恋和希望', cloneName: 's2' },
    's3': { voice: 'Cherry', instruction: '睿智沉稳，充满哲理，像一位老者在讲述', cloneName: 's3' },
    's4': { voice: 'Cherry', instruction: '神秘低沉，充满智慧，语气中带着警告', cloneName: 's4' },
    's5': { voice: 'Cherry', instruction: '冷峻迷离，带着赛博朋克的疏离感', cloneName: 's5' },
    's6': { voice: 'Cherry', instruction: '温柔而悲伤，充满宿命感和哲学意味', cloneName: 's6' },
    'x1': { voice: 'Cherry', instruction: '热血少年声音，语气坚定有力，充满斗志和少年意气', cloneName: 'xiaoyan' },
    'x2': { voice: 'Cherry', instruction: '沉稳内敛，低调谨慎，修仙者平静而坚定的语气', cloneName: 'x2' },
    'x3': { voice: 'Cherry', instruction: '霸气凌然，睥睨天下，声音洪亮有力', cloneName: 'x3' },
    'x4': { voice: 'Cherry', instruction: '桀骜不驯，狂放张扬，充满逆天改命的豪气', cloneName: 'x4' },
    'x5': { voice: 'Cherry', instruction: '孤独冷峻，执着坚定，声音中带着沧桑', cloneName: 'x5' },
    'x6': { voice: 'Cherry', instruction: '洒脱不羁，快意恩仇，江湖中人的豪迈', cloneName: 'x6' },
    'r1': { voice: 'Cherry', instruction: '温柔婉约，古典韵味，略带惆怅和无奈', cloneName: 'r1' },
    'r2': { voice: 'Cherry', instruction: '豪迈大气，充满冒险精神，声音洪亮', cloneName: 'r2' },
    'r3': { voice: 'Cherry', instruction: '正义凛然，豪爽仗义，路见不平一声吼', cloneName: 'r3' },
    'r4': { voice: 'Cherry', instruction: '沧桑厚重，历史感十足，沉稳而有力量', cloneName: 'r4' },
    'r5': { voice: 'Cherry', instruction: '魔幻现实，低沉叙述，带着时间的厚重感', cloneName: 'r5' },
    'r6': { voice: 'Cherry', instruction: '质朴平实，充满生活的力量，略带悲凉', cloneName: 'r6' },
    'default': { voice: 'Cherry', instruction: '清晰自然，有感情的朗读' }
};

// 播放名言语音：不使用本地预录名言音频，直接使用 API 克隆声音
function playQuoteAudio(text, bookId) {
    playQuoteAudioDirect(text, bookId);
}

function playQuoteAudioDirect(text, bookId) {
    if (!text || !TTS_API) return;

    stopQuoteAudio();

    var myId = ++_ttsRequestId;
    var config = BOOK_VOICE_CONFIG[bookId] || BOOK_VOICE_CONFIG['default'];
    setTtsButtonState('loading', '正在生成语音...');
    var reqBody = {
        message: text,
        npcName: config.voice,
        playerAction: config.instruction
    };
    if (config.cloneName) {
        reqBody.cloneName = config.cloneName;
    }

    fetch(TTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
    })
    .then(function(r) {
        return r.text().then(function(body) {
            var data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                throw new Error('语音服务返回了无效响应');
            }
            if (!r.ok) throw new Error(data.error || ('语音服务错误 ' + r.status));
            return data;
        });
    })
    .then(function(data) {
        if (_ttsRequestId !== myId) return;
        if (data.audioBase64) {
            if (data.cloneUsed) {
                console.log('[TTS] 使用语音克隆 ✓');
            }
            _ttsAudio = new Audio('data:audio/wav;base64,' + data.audioBase64);
            _ttsAudio.play().catch(function(e) {
                console.log('[TTS] 播放失败:', e.message);
                playBrowserSpeech(text, '音频播放失败，已使用系统朗读');
            });
            setTtsButtonState('playing', data.cloneUsed ? '正在播放克隆语音' : '正在播放语音');
            _ttsAudio.onended = function() {
                setTtsButtonState('', '播放语音');
            };
            _ttsCurrentUrl = data.audioBase64;
        } else {
            throw new Error(data.error || '语音服务没有返回音频');
        }
    })
    .catch(function(e) {
        console.log('[TTS] 请求失败:', e.message);
        playBrowserSpeech(text, 'API 连接失败，已使用系统朗读：' + e.message);
    });
}

function setTtsButtonState(className, title) {
    var btn = document.getElementById('tts-replay-btn');
    if (!btn) return;
    btn.classList.toggle('playing', className === 'playing' || className === 'loading');
    btn.title = title;
}

function playBrowserSpeech(text, reason) {
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
        setTtsButtonState('', reason + '；当前浏览器不支持系统朗读');
        return;
    }
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.onstart = function() { setTtsButtonState('playing', reason); };
    utterance.onend = function() { setTtsButtonState('', '播放语音'); };
    utterance.onerror = function() { setTtsButtonState('', reason + '；系统朗读也失败'); };
    window.speechSynthesis.speak(utterance);
}

// 停止播放
function stopQuoteAudio() {
    if (_ttsAudio) {
        _ttsAudio.pause();
        _ttsAudio.currentTime = 0;
        _ttsAudio = null;
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    var btn = document.getElementById('tts-replay-btn');
    if (btn) btn.classList.remove('playing');
}

// 重播
function replayQuoteAudio() {
    // 依然支持重播
    if (_ttsAudio) {
        _ttsAudio.currentTime = 0;
        _ttsAudio.play();
    } else if (_ttsCurrentUrl) {
        _ttsAudio = new Audio('data:audio/wav;base64,' + _ttsCurrentUrl);
        _ttsAudio.play();
    }
}

// ─── 通用游戏语音接口 ───

// 播放故事旁白
function playNarration(text, bookId) {
    var ttsOn = localStorage.getItem('bookemu_tts') === 'true';
    if (!ttsOn || !text || !TTS_API) return;

    stopQuoteAudio(); // 共享停止逻辑

    var myId = ++_ttsRequestId;
    // 旁白配置映射（可以配置使用不同的克隆声音）
    var config = BOOK_VOICE_CONFIG[bookId] || BOOK_VOICE_CONFIG['default'];
    var reqBody = {
        message: text,
        npcName: config.voice,
        playerAction: config.instruction
    };
    if (config.cloneName) {
        reqBody.cloneName = config.cloneName;
    }

    fetch(TTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (_ttsRequestId !== myId) return;
        if (data.audioBase64) {
            _ttsAudio = new Audio('data:audio/wav;base64,' + data.audioBase64);
            _ttsAudio.play().catch(function(e) {
                console.log('[Narration] 播放失败:', e.message);
            });
            _ttsCurrentUrl = data.audioBase64;
        }
    })
    .catch(function(e) {
        console.log('[Narration] 请求失败:', e.message);
    });
}
