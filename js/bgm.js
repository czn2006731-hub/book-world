// ==================== 全局背景音乐 ====================
var _bgmAudio = null;
var _bgmStorageKey = 'bookemu_bgm_on';
var _bgmVolume = 0.4;

function _bgmInit() {
    if (_bgmAudio) return;
    _bgmAudio = new Audio('audio/bgm/bgm.mp3');
    _bgmAudio.loop = true;
    _bgmAudio.volume = _bgmVolume;
    _bgmAudio.preload = 'auto';
}

function bgmIsOn() {
    return localStorage.getItem(_bgmStorageKey) !== 'off';
}

function bgmPlay() {
    _bgmInit();
    if (!bgmIsOn()) return;
    _bgmAudio.play().catch(function() {});
}

function bgmPause() {
    if (_bgmAudio) {
        _bgmAudio.pause();
    }
}

function bgmToggle() {
    if (bgmIsOn()) {
        localStorage.setItem(_bgmStorageKey, 'off');
        bgmPause();
    } else {
        localStorage.setItem(_bgmStorageKey, 'on');
        bgmPlay();
    }
    _bgmSyncAllToggles();
}

function bgmSetVolume(v) {
    _bgmVolume = v;
    if (_bgmAudio) _bgmAudio.volume = v;
}

function _bgmSyncAllToggles() {
    var on = bgmIsOn();
    document.querySelectorAll('.bgm-toggle-cb').forEach(function(cb) {
        cb.checked = on;
    });
}

// 页面加载时同步所有开关状态并绑定首次点击自动播放（绕过浏览器 Autoplay 限制）
document.addEventListener('DOMContentLoaded', function() {
    _bgmSyncAllToggles();

    var enableAutoplayOnUserInteraction = function() {
        if (typeof currentScreen !== 'undefined' && currentScreen !== 'login') {
            bgmPlay();
        }
        document.removeEventListener('click', enableAutoplayOnUserInteraction);
        document.removeEventListener('keydown', enableAutoplayOnUserInteraction);
    };

    document.addEventListener('click', enableAutoplayOnUserInteraction);
    document.addEventListener('keydown', enableAutoplayOnUserInteraction);
});
