// ==================== 弧管理引擎 ====================
// 管理故事弧（Arc）的切换、过渡旁白、击杀搜刮、关键道具
var ArcEngine = (function() {
    // ── 玩家状态 ──
    var _playerState = {
        items: [],           // {name, description}
        cultivation: '炼气期三层',
        age: 16,             // 年龄
        mana: 25,            // 法力值
        maxMana: 50,         // 最大法力值
        hp: 50,              // 生命值
        maxHp: 50,           // 最大生命值
        spiritRoot: '四行伪灵根 (木水火土·缺金)', // 灵根
        choiceHistory: [],   // [{arcId, dpId, label, isOriginal, result}]
        killedEnemies: [],   // [{name, lootTaken}]
        pets: []             // [{id, name, icon, level, affection}]
    };

    // ── 当前状态 ──
    var _currentArc = null;
    var _currentArcIdx = 0;
    var _currentDpIdx = 0;
    var _currentDpId = null;   // 分支模式：当前DP的ID
    var _arcs = [];
    var _dpMap = {};           // 分支模式：ID → DP 的快速查找表
    var _branchingMode = false; // 是否启用分支模式
    var _saveSlotId = 'slot_default';

    // ── 过渡旁白 DOM 缓存 ──
    var _transEl = null;
    var _transTxtEl = null;
    var _transHintEl = null;
    var _transitionCallback = null;

    function init(bookId) {
        var defaultCult = '炼气期一层';
        var defaultAge = 16;
        var defaultRoot = '伪灵根';
        
        if (bookId) {
            if (bookId.indexOf('sanTi') !== -1 || bookId.indexOf('scifi') !== -1) {
                defaultCult = '危机纪年·研究员';
                defaultAge = 28;
                defaultRoot = '基因强化';
            } else if (bookId.indexOf('shaQiu') !== -1 || bookId.indexOf('dune') !== -1) {
                defaultCult = '厄崔迪家族继承人';
                defaultAge = 15;
                defaultRoot = '预知基因';
            } else if (bookId.indexOf('hongLou') !== -1 || bookId.indexOf('romance') !== -1) {
                defaultCult = '荣国府公子';
                defaultAge = 14;
                defaultRoot = '通灵宝玉';
            }
        }

        _playerState = {
            items: [],
            cultivation: defaultCult,
            age: defaultAge,
            mana: 25,
            maxMana: 50,
            hp: 50,
            maxHp: 50,
            spiritRoot: defaultRoot,
            choiceHistory: [],
            killedEnemies: [],
            pets: []
        };
        _currentArcIdx = 0;
        _currentDpIdx = 0;
        _currentDpId = null;
        _dpMap = {};
        _branchingMode = false;
    }

    function setSaveSlotId(slotId) {
        _saveSlotId = slotId || 'slot_default';
    }

    function getStorageKey(bookId) {
        return 'arc_engine_' + bookId + '_' + _saveSlotId;
    }

    // ══════════════════════════════════════════════
    //  数据加载
    // ══════════════════════════════════════════════
    function loadArcs(arcs) {
        _arcs = arcs || [];
        _currentArcIdx = 0;
        _currentDpIdx = 0;
        _currentDpId = null;
        _dpMap = {};
        if (_arcs.length > 0) {
            _currentArc = _arcs[0];
            _buildDpMap();
        }
    }

    // 构建 DP ID → DP 的映射表
    function _buildDpMap() {
        _dpMap = {};
        _branchingMode = false;
        if (!_currentArc || !_currentArc.decisionPoints) return;

        var dps = _currentArc.decisionPoints;
        for (var i = 0; i < dps.length; i++) {
            var dp = dps[i];
            if (dp.id) {
                _dpMap[dp.id] = dp;
                _branchingMode = true;
            }
        }

        // 如果有分支模式，设置起始DP
        if (_branchingMode && _currentArc.startDpId) {
            _currentDpId = _currentArc.startDpId;
        } else if (_branchingMode && dps.length > 0 && dps[0].id) {
            _currentDpId = dps[0].id;
        }
    }

    function getCurrentDecisionPoint() {
        if (!_currentArc || !_currentArc.decisionPoints) return null;

        // 分支模式：通过ID查找
        if (_branchingMode && _currentDpId) {
            return _dpMap[_currentDpId] || null;
        }

        // 线性模式：通过索引
        if (_currentDpIdx >= _currentArc.decisionPoints.length) return null;
        return _currentArc.decisionPoints[_currentDpIdx];
    }

    function advanceDp() {
        if (!_currentArc || !_currentArc.decisionPoints) return null;
        var dps = _currentArc.decisionPoints;
        if (_branchingMode && _currentDpId) {
            for (var i = 0; i < dps.length; i++) {
                if (dps[i].id === _currentDpId) {
                    if (i + 1 < dps.length) {
                        _currentDpId = dps[i + 1].id || null;
                        _currentDpIdx = i + 1;
                        return dps[i + 1];
                    }
                    break;
                }
            }
            // 如果找不到或者到了最后，重置ID并按线性处理
            _currentDpId = null;
            return null;
        } else {
            _currentDpIdx++;
            if (_currentArc && _currentArc.decisionPoints && _currentDpIdx < _currentArc.decisionPoints.length) {
                if (_currentArc.decisionPoints[_currentDpIdx].id) {
                    _currentDpId = _currentArc.decisionPoints[_currentDpIdx].id;
                }
            }
        }
        return getCurrentDecisionPoint();
    }

    // 分支模式：跳转到指定DP
    function jumpToDp(dpId) {
        if (!dpId) return null;
        _currentDpId = dpId;
        // 同步更新 _currentDpIdx
        if (_currentArc && _currentArc.decisionPoints) {
            for (var i = 0; i < _currentArc.decisionPoints.length; i++) {
                if (_currentArc.decisionPoints[i].id === dpId) {
                    _currentDpIdx = i;
                    break;
                }
            }
        }
        return _dpMap[dpId] || null;
    }

    // ══════════════════════════════════════════════
    //  检查当前弧是否结束
    // ══════════════════════════════════════════════
    function isArcFinished() {
        if (!_currentArc || !_currentArc.decisionPoints) return false;
        if (_branchingMode && _currentDpId) {
            // 如果当前节点为最后节点并且没有后续（比如ID中带有END或者选择指向END），则判定弧结束
            if (_currentDpId === 'qm_6' || _currentDpId === 'hg_6' || _currentDpId === 'bt_6') {
                return true;
            }
            return false;
        }
        return _currentDpIdx >= _currentArc.decisionPoints.length;
    }

    // ══════════════════════════════════════════════
    //  获取下一弧
    // ══════════════════════════════════════════════
    function advanceToNextArc() {
        _currentArcIdx++;
        _currentDpIdx = 0;
        _currentDpId = null;
        _branchingMode = false;
        if (_currentArcIdx < _arcs.length) {
            _currentArc = _arcs[_currentArcIdx];
            _buildDpMap();
            return _currentArc;
        }
        _currentArc = null;
        return null;
    }

    // ══════════════════════════════════════════════
    //  记录选择
    // ══════════════════════════════════════════════
    function recordChoice(dp, choiceLabel, isOriginal, result) {
        _playerState.choiceHistory.push({
            arcId: _currentArc ? _currentArc.arcId : '',
            arcTitle: _currentArc ? _currentArc.title : '',
            dpId: dp ? dp.id : '',
            label: choiceLabel,
            isOriginal: isOriginal,
            result: result
        });
    }

    // ══════════════════════════════════════════════
    //  添加道具
    // ══════════════════════════════════════════════
    function addItem(name, description, type, icon, metadata) {
        var exists = _playerState.items.some(function(item) { return item.name === name; });
        if (!exists) {
            var item = {name: name, description: description || '', type: type || inferItemType(name), icon: icon || ''};
            if (metadata) Object.assign(item, metadata);
            _playerState.items.push(item);
            return item;
        }
        return null;
    }

    function inferItemType(name) {
        if (!name) return '';
        if (name.indexOf('丹') !== -1 || name.indexOf('药') !== -1 || name.indexOf('灵液') !== -1) return 'pill';
        if (name.indexOf('符') !== -1) return 'talisman';
        if (name.indexOf('法器') !== -1 || name.indexOf('剑') !== -1 || name.indexOf('飞剑') !== -1 || name.indexOf('瓶') !== -1) return 'weapon';
        if (name.indexOf('书') !== -1 || name.indexOf('卷') !== -1 || name.indexOf('功法') !== -1 || name.indexOf('图鉴') !== -1 || name.indexOf('手札') !== -1 || name.indexOf('地图') !== -1 || name.indexOf('残卷') !== -1 || name.indexOf('金色书页') !== -1) return 'scroll';
        if (name.indexOf('令') !== -1 || name.indexOf('令牌') !== -1) return 'scroll';
        if (name.indexOf('灵石') !== -1) return 'pill';
        if (name.indexOf('灵芝') !== -1 || name.indexOf('灵药') !== -1 || name.indexOf('草') !== -1 || name.indexOf('材料') !== -1) return 'pill';
        return '';
    }

    function getAllItems() {
        return _playerState.items.slice();
    }

    // ══════════════════════════════════════════════
    //  获取关键道具（从未获得的弧关键道具中检查）
    // ══════════════════════════════════════════════
    function getUncollectedKeyItems() {
        if (!_currentArc || !_currentArc.keyItems) return [];
        return _currentArc.keyItems.filter(function(ki) {
            return !_playerState.items.some(function(pi) { return pi.name === ki.name; });
        });
    }

    // ══════════════════════════════════════════════
    //  击杀搜刮检查
    // ══════════════════════════════════════════════
    function checkLootOnKill(dp) {
        if (!dp || !dp.combatRelated || !dp.lootOnKill) return null;
        return {
            prompt: dp.lootOnKill.prompt || '敌人倒下了。你注意到他身上似乎有东西。',
            items: dp.lootOnKill.items || []
        };
    }

    function processLoot(lootItems) {
        if (!lootItems || !lootItems.length) return [];
        var added = [];
        lootItems.forEach(function(itemName) {
            var exists = _playerState.items.some(function(i) { return i.name === itemName; });
            if (!exists) {
                var item = {name: itemName, description: '', type: inferItemType(itemName)};
                _playerState.items.push(item);
                added.push(item);
            }
        });
        return added;
    }

    // ══════════════════════════════════════════════
    //  获取状态（给AI发送用）
    // ══════════════════════════════════════════════
    function getPlayerState() {
        return {
            items: _playerState.items.slice(),
            cultivation: _playerState.cultivation,
            age: _playerState.age,
            mana: _playerState.mana,
            maxMana: _playerState.maxMana,
            hp: _playerState.hp,
            maxHp: _playerState.maxHp,
            spiritRoot: _playerState.spiritRoot,
            pets: (_playerState.pets || []).slice(),
            recentChoices: _playerState.choiceHistory.slice(-5)
        };
    }

    function getPlayerStateRef() {
        return _playerState;
    }

    function updatePlayerState(key, val) {
        if (_playerState.hasOwnProperty(key) || key === 'age' || key === 'mana' || key === 'maxMana' || key === 'hp' || key === 'maxHp' || key === 'spiritRoot') {
            _playerState[key] = val;
        }
    }

    function getChoiceHistory() {
        return _playerState.choiceHistory.slice();
    }

    function getCurrentArc() {
        return _currentArc;
    }

    function getArcIndex() {
        return { arcIdx: _currentArcIdx, dpIdx: _currentDpIdx };
    }

    // ══════════════════════════════════════════════
    //  弧过渡旁白（星空背景 + 打字机）
    // ══════════════════════════════════════════════
    function playArcTransition(callback) {
        if (!_currentArc || !_currentArc.arcConclusion) {
            // 没有过渡信息，直接进入下一弧
            enterNextArc(callback);
            return;
        }

        var gameIntro = document.getElementById('game-intro');
        var gameMainContent = document.getElementById('game-main-content');
        var gameBgLayer = document.getElementById('game-bg-layer');

        // 隐藏游戏内容，显示intro overlay
        if (gameMainContent) gameMainContent.style.display = 'none';
        if (gameBgLayer) gameBgLayer.style.display = 'none';
        if (gameIntro) gameIntro.classList.add('active');

        var titleEl = document.getElementById('game-intro-title');
        var textEl = document.getElementById('game-intro-text');
        var hintEl = document.getElementById('game-intro-hint');

        if (titleEl) titleEl.textContent = _currentArc.title + ' — 结束';

        _transTxtEl = textEl;
        _transHintEl = hintEl;
        _transitionCallback = callback;
        _transReady = false;
        if (hintEl) hintEl.style.display = 'none';

        // 初始加载文字
        if (textEl) {
            var arcTitle = (typeof tl === 'function') ? tl(_currentArc.title) : _currentArc.title;
            textEl.innerHTML = '—— ' + arcTitle + ' 结束 ——\n';
        }

        // 调用AI生成过渡旁白
        if (typeof AI !== 'undefined') {
            AI.generateArcTransition(_currentArc, getPlayerState(), function(chunk) {
                if (_transTxtEl) _transTxtEl.innerHTML += chunk;
            }).then(function() {
                if (_transHintEl) {
                    _transHintEl.textContent = typeof t === 'function' ? t('intro_hint') : '点击继续';
                    _transHintEl.style.display = '';
                }
                _transReady = true;
            }).catch(function() {
                _transReady = true;
                if (_transHintEl) {
                    _transHintEl.textContent = '点击继续';
                    _transHintEl.style.display = '';
                }
            });
        } else {
            // 降级：简单过渡文字
            var fallback = _currentArc.title + '结束了。韩立整理行囊，踏上了新的旅程。';
            if (_transTxtEl) _transTxtEl.innerHTML = fallback;
            if (_transHintEl) {
                _transHintEl.textContent = '点击继续';
                _transHintEl.style.display = '';
            }
        }

        // 点击继续
        if (gameIntro) {
            gameIntro.onclick = function() {
                if (!_transReady) {
                    // 跳过打字 → 全文显示
                    if (_transTxtEl) {
                        _transTxtEl.innerHTML = _transTxtEl.textContent || fallback;
                    }
                    if (_transHintEl) _transHintEl.style.display = '';
                    _transReady = true;
                } else {
                    // 进入下一弧
                    gameIntro.classList.remove('active');
                    gameIntro.onclick = null;
                    enterNextArc(callback);
                }
            };
        }
    }

    var _transReady = false;

    function enterNextArc(callback) {
        var nextArc = advanceToNextArc();
        if (!nextArc) {
            // 全部弧结束
            if (callback) callback('end');
            return;
        }
        if (callback) callback('arc', nextArc);
    }

    // ══════════════════════════════════════════════
    //  道具获得提示
    // ══════════════════════════════════════════════
    // ══════════════════════════════════════════════
    //  保存 / 加载
    // ══════════════════════════════════════════════
    function save(bookId) {
        var data = {
            arcIdx: _currentArcIdx,
            dpIdx: _currentDpIdx,
            dpId: _currentDpId,
            branchingMode: _branchingMode,
            items: _playerState.items,
            cultivation: _playerState.cultivation,
            age: _playerState.age,
            mana: _playerState.mana,
            maxMana: _playerState.maxMana,
            hp: _playerState.hp,
            maxHp: _playerState.maxHp,
            spiritRoot: _playerState.spiritRoot,
            pets: _playerState.pets || [],
            choiceHistory: _playerState.choiceHistory.slice(-20)
        };
        localStorage.setItem(getStorageKey(bookId), JSON.stringify(data));
    }

    function load(bookId) {
        var raw = localStorage.getItem(getStorageKey(bookId));
        if (!raw) return false;
        try {
            var data = JSON.parse(raw);
            _currentArcIdx = data.arcIdx || 0;
            _currentDpIdx = data.dpIdx || 0;
            _currentDpId = data.dpId || null;
            _branchingMode = data.branchingMode || false;
            _playerState.items = data.items || [];
            _playerState.cultivation = data.cultivation || '炼气期三层';
            _playerState.age = data.age || 16;
            _playerState.mana = data.mana || 25;
            _playerState.maxMana = data.maxMana || 50;
            _playerState.hp = data.hp || 50;
            _playerState.maxHp = data.maxHp || 50;
            _playerState.spiritRoot = data.spiritRoot || '四行伪灵根 (木水火土·缺金)';
            _playerState.pets = data.pets || [];
            _playerState.choiceHistory = data.choiceHistory || [];
            if (_arcs.length > 0 && _currentArcIdx < _arcs.length) {
                _currentArc = _arcs[_currentArcIdx];
                _buildDpMap();
                // 恢复分支模式下的DP ID
                if (_branchingMode && data.dpId) {
                    _currentDpId = data.dpId;
                }
            }
            return true;
        } catch(e) {
            return false;
        }
    }

    function reset() {
        init();
    }

    // 重置当前弧（死亡重玩）
    function resetArc() {
        _currentDpIdx = 0;
    }

    // 灵宠系统
    if (!_playerState.pets) _playerState.pets = [];

    function addPet(pet) {
        if (!pet || !pet.id) return;
        var exists = _playerState.pets.some(function(p) { return p.id === pet.id; });
        if (!exists) {
            _playerState.pets.push({
                id: pet.id,
                name: pet.name || '灵宠',
                icon: pet.icon || '🐱',
                level: pet.level || 1,
                affection: pet.affection || 0,
                desc: pet.desc || ''
            });
        }
    }

    function feedPet(petId, itemName) {
        var pet = _playerState.pets.find(function(p) { return p.id === petId; });
        if (!pet) return false;
        // 移除物品
        var itemIdx = -1;
        for (var i = 0; i < _playerState.items.length; i++) {
            if (_playerState.items[i].name === itemName) { itemIdx = i; break; }
        }
        if (itemIdx === -1) return false;
        _playerState.items.splice(itemIdx, 1);
        pet.affection = (pet.affection || 0) + 10;
        return true;
    }

    function getPets() {
        return _playerState.pets || [];
    }

    return {
        init: init,
        setSaveSlotId: setSaveSlotId,
        loadArcs: loadArcs,
        getCurrentDecisionPoint: getCurrentDecisionPoint,
        advanceDp: advanceDp,
        jumpToDp: jumpToDp,
        isArcFinished: isArcFinished,
        advanceToNextArc: advanceToNextArc,
        recordChoice: recordChoice,
        addItem: addItem,
        getAllItems: getAllItems,
        getUncollectedKeyItems: getUncollectedKeyItems,
        checkLootOnKill: checkLootOnKill,
        processLoot: processLoot,
        getPlayerState: getPlayerState,
        getPlayerStateRef: getPlayerStateRef,
        updatePlayerState: updatePlayerState,
        getChoiceHistory: getChoiceHistory,
        getCurrentArc: getCurrentArc,
        getArcIndex: getArcIndex,
        playArcTransition: playArcTransition,
        save: save,
        load: load,
        reset: reset,
        resetArc: resetArc,
        addPet: addPet,
        feedPet: feedPet,
        getPets: getPets
    };
})();
