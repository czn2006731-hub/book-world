// 游戏界面逻辑

// 游戏状态
let gameState = {
    sessionId: null,
    bookId: null,
    bookTitle: '',
    playerState: {},
    npcs: [],
    isLoading: false,
    currentNpc: null,
    narrativeHistory: [],
    currentScene: 'start'
};

// API基础地址（后端服务地址）
const API_BASE = 'http://localhost:3000/api';

// ==================== 预设剧情数据 ====================

const STORY_DATA = {
    'xianxia.fanRenXiuXianZhuan': {
        title: '凡人修仙传',
        npcs: [
            { name: '韩立', personality: '沉稳内敛、谨慎小心' },
            { name: '南宫婉', personality: '高贵冷艳、外冷内热' }
        ],
        scenes: {
            start: {
                narrative: '你在一阵刺耳的钟声中醒来。周围是简陋的木床和粗糙的墙壁，空气中弥漫着淡淡的草药味。\n\n窗外，几道剑光划过天际，有人御剑飞行。你穿越到了《凡人修仙传》的世界，而你现在是七玄门的一名外门弟子。\n\n一个清冷的声音在你脑海中响起——',
                system: '【系统启动】欢迎穿越者，我是你的随身修仙系统。\n\n📋 当前状态：\n• 身份：七玄门·外门弟子\n• 修为：炼气期一层（入门）\n• 地点：外门弟子居所\n• 任务：参加今日的灵根测试',
                actions: ['前往灵根测试广场', '先去找韩立了解情况', '在房间里修炼一会儿']
            },
            test_square: {
                narrative: '你来到广场，发现已经聚集了上百名外门弟子。广场中央摆着一块巨大的灵根测试石，旁边站着几位神色严肃的长老。\n\n人群中，你注意到一个神情沉稳的少年，正冷静地观察着周围的一切——那正是少年时期的韩立。',
                system: '【系统提示】灵根测试即将开始。根据原著剧情，韩立在此测试中被鉴定为"伪灵根"，但实际上他拥有罕见的"混元灵根"。\n\n⚠️ 注意：测试结果会影响你今后的修炼路线。',
                actions: ['主动接近韩立', '安静排队等待测试', '仔细观察测试石']
            },
            meet_hanli: {
                narrative: '你走到韩立身边，他警惕地看了你一眼，但见你没有敌意，微微点了点头。\n\n"你也来参加测试？"韩立的声音平静，但眼神中带着一丝不安。\n\n你注意到他的衣着朴素，显然也是出身普通。',
                system: '【好感度变化】韩立对你的初始好感度为 50（中立）。\n\n💡 建议：韩立生性谨慎，不要表现得过于热情或打探太多。',
                actions: ['询问他对灵根测试的看法', '聊聊修炼的话题', '安静等待，不打扰他'],
                npcDialogue: {
                    '韩立': {
                        low: '(警惕地后退一步) 你是谁？找我有什么事？',
                        mid: '(微微点头) 测试快开始了，专心准备吧。',
                        high: '(放松神色) 你也是外门弟子？以后可以一起修炼。'
                    }
                }
            },
            observe_stone: {
                narrative: '你仔细观察那块灵根测试石。它约有两人高，表面光滑如镜，隐隐散发着五彩光芒。\n\n一位长老注意到你的目光，淡淡说道："灵根测试石能感应修仙者的灵根属性。把手放上去，它会显示你的灵根资质。"\n\n你心中暗想：原著中韩立是"伪灵根"，但真实实力远超表面...',
                system: '【系统分析】灵根测试石的工作原理：\n• 金灵根 → 金色光芒\n• 木灵根 → 绿色光芒\n• 水灵根 → 蓝色光芒\n• 火灵根 → 红色光芒\n• 土灵根 → 黄色光芒\n\n混元灵根（五行俱全）会被误判为"伪灵根"。',
                actions: ['继续排队等待测试', '去和韩立打个招呼', '偷偷研究测试石的原理']
            },
            wait_test: {
                narrative: '你安静地排在队伍中。时间一分一秒过去，终于轮到了你。\n\n长老示意你将手放在测试石上。你深吸一口气，将手掌贴上冰凉的石面。\n\n测试石微微颤动，然后——亮起了淡淡的五彩光芒。',
                system: '【测试结果】检测到混元灵根（五行俱全）！\n\n在世人眼中，这是最差的"伪灵根"，修炼速度极慢。但系统提示你：混元灵根实际上是上古大能的标配，只是需要特殊的修炼功法才能发挥真正实力。\n\n⚠️ 当前任务：隐藏真实实力，寻找混元功法。',
                actions: ['假装失望，低调离开', '向长老询问混元灵根的修炼方法', '去找韩立，看看他的测试结果']
            },
            hanli_result: {
                narrative: '你找到韩立时，他刚完成测试。他的表情平静，但你注意到他微微握紧了拳头。\n\n"伪灵根..."旁边有人小声议论，"这种资质，修炼到炼气期就到头了吧。"\n\n韩立没有理会那些议论，转身准备离开。',
                system: '【系统提示】韩立被鉴定为伪灵根，但根据原著，他后来获得了神秘小瓶，可以催熟灵药，从此走上逆袭之路。\n\n💡 你可以选择是否透露你知道的信息。',
                actions: ['叫住韩立，暗示他不要放弃', '默默观察，不介入剧情', '告诉他自己也是伪灵根']
            },
            secret_talk: {
                narrative: '你追上韩立，压低声音说道："韩师兄，别在意那些人的看法。伪灵根未必就是终点。"\n\n韩立停下脚步，转头看着你，眼神中带着一丝疑惑："你什么意思？"\n\n你意识到不能透露太多，便说道："我只是觉得，修炼之路，资质并非唯一。"',
                system: '【好感度变化】韩立对你的好感度 +10！\n\n他虽然没有完全相信你的话，但似乎对你产生了一些兴趣。\n\n当前好感度：60',
                actions: ['继续鼓励他', '转移话题，聊聊修炼', '告辞离开'],
                npcDialogue: {
                    '韩立': {
                        low: '(皱眉) 你到底想说什么？',
                        mid: '(若有所思) 你说得对...资质不是一切。我师父也这么说过。',
                        high: '(微笑) 多谢。你是个好人。以后有什么事可以来找我。'
                    }
                }
            },
            first_night: {
                narrative: '夜幕降临，你回到外门弟子的居所。躺在床上，你开始整理今天的收获。\n\n灵根测试的结果虽然不理想，但你知道混元灵根的真正价值。现在最重要的是找到适合的修炼功法。\n\n窗外，月光如水，远处传来阵阵剑鸣声。',
                system: '【系统总结】第一天结束\n\n📋 当前状态：\n• 身份：七玄门·外门弟子\n• 修为：炼气期一层\n• 灵根：混元灵根（对外宣称伪灵根）\n• 好感度：韩立 60\n\n🎯 下一步目标：\n1. 寻找混元功法\n2. 了解七玄门的修炼资源\n3. 继续与韩立建立关系',
                actions: ['休息，明天继续探索', '趁夜色去藏经阁看看', '在房间里尝试修炼']
            },
            explore_night: {
                narrative: '你趁着夜色悄悄离开居所，向七玄门的藏经阁方向摸去。\n\n月光下，你看到几个巡逻的弟子从远处经过。你躲在暗处，等他们走远后继续前进。\n\n终于，你来到了藏经阁门前。大门紧锁，但你注意到旁边有一扇小窗似乎没有关严。',
                system: '【系统警告】⚠️ 深入藏经阁有被发现的风险！\n\n如果你被巡逻弟子抓住，可能会被逐出师门。但藏经阁中可能藏有你需要的混元功法。\n\n请谨慎选择！',
                actions: ['冒险进入藏经阁', '放弃，回去休息', '先观察一下周围环境']
            },
            library: {
                narrative: '你小心翼翼地从窗户翻入藏经阁。里面光线昏暗，只有几盏油灯在角落里摇曳。\n\n一排排书架整齐排列，上面摆满了各种功法典籍。你快速浏览着书架上的标签，寻找与"混元"相关的内容。\n\n终于，在一个不起眼的角落，你发现了一本落满灰尘的古籍——《混元五行诀》！',
                system: '【发现】获得古籍《混元五行诀》！\n\n这本功法正是为混元灵根修炼者设计的。虽然修炼速度不如单属性功法快，但胜在均衡发展，后期潜力巨大。\n\n💡 系统建议：先记下功法内容，天亮前离开。被人发现就麻烦了。',
                actions: ['记下功法内容后离开', '继续探索其他功法', '把书带走']
            },
            escape_library: {
                narrative: '你快速翻阅着《混元五行诀》，将关键的修炼口诀记在心中。\n\n正当你准备离开时，外面传来了脚步声——是巡逻的弟子回来了！\n\n你急忙从窗户翻出，躲在藏经阁后面的灌木丛中。两个巡逻弟子走过，没有发现你。\n\n你长长地舒了口气，趁着夜色悄悄回到了自己的居所。',
                system: '【系统提示】成功获得《混元五行诀》！\n\n📋 当前状态更新：\n• 掌握功法：混元五行诀（初级）\n• 可以开始正式修炼了\n\n⚠️ 注意：不要让别人知道你获得了这本功法，否则可能引来麻烦。',
                actions: ['开始修炼混元五行诀', '先休息，明天再说', '去找韩立分享这个发现']
            }
        }
    }
};

// ==================== 游戏核心逻辑 ====================

// 初始化游戏
async function initGame(bookId, book) {
    gameState.bookId = bookId;
    gameState.bookTitle = book.title;
    
    // 切换到游戏界面
    switchScreen('game');
    
    // 更新UI
    document.getElementById('game-book-title').textContent = book.title;
    
    // 清空内容
    clearGameContent();
    
    // 尝试连接后端
    try {
        const response = await fetch(`${API_BASE}/chat/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookId,
                playerName: '穿越者'
            })
        });
        
        if (!response.ok) throw new Error('服务连接失败');
        
        const data = await response.json();
        
        gameState.sessionId = data.sessionId;
        gameState.playerState = data.playerState;
        gameState.npcs = data.npcs;
        
        updatePlayerStats(data.playerState);
        generateNpcButtons(data.npcs);
        addNarrativeMessage('narrative', data.opening);
        addSystemMessage('【系统初始化完成】你已成功穿越到《' + book.title + '》的世界。');
        
    } catch (error) {
        // 后端不可用，使用离线模式
        initOfflineMode(bookId, book);
    }
}

// 离线模式
function initOfflineMode(bookId, book) {
    gameState.sessionId = `offline_${Date.now()}`;
    
    // 检查是否有预设剧情
    const storyData = STORY_DATA[bookId];
    
    if (storyData) {
        // 有预设剧情，使用剧情系统
        gameState.npcs = storyData.npcs;
        gameState.currentScene = 'start';
        
        generateNpcButtons(storyData.npcs);
        loadScene('start', storyData);
    } else {
        // 没有预设剧情，使用通用离线模式
        gameState.npcs = book.npcs || [];
        gameState.playerState = {
            name: '穿越者', identity: '外门弟子', location: '未知',
            currentTask: '了解当前处境', affinity: 50, cultivation: '炼气期一层'
        };
        
        updatePlayerStats(gameState.playerState);
        generateNpcButtons(gameState.npcs);
        addNarrativeMessage('narrative', book.startScene || '你醒来发现自己在一个陌生的地方...');
        addSystemMessage('【离线模式】后端服务未连接，使用本地模拟模式。');
    }
}

// 加载场景
function loadScene(sceneId, storyData) {
    const scene = storyData.scenes[sceneId];
    if (!scene) {
        addSystemMessage('【错误】场景数据加载失败');
        return;
    }
    
    gameState.currentScene = sceneId;
    
    // 更新玩家状态
    gameState.playerState = {
        name: '穿越者', identity: '外门弟子', location: '黄枫谷',
        currentTask: scene.system?.match(/任务[：:](.+?)[\n]/)?.[1] || '探索中',
        affinity: 60, cultivation: '炼气期一层'
    };
    updatePlayerStats(gameState.playerState);
    
    // 显示叙事
    if (scene.narrative) {
        addNarrativeMessage('narrative', scene.narrative);
    }
    
    // 显示系统提示
    if (scene.system) {
        addSystemMessage(scene.system);
    }
    
    // 生成行动按钮
    if (scene.actions) {
        generateActionButtons(scene.actions);
    }
}

// 处理玩家行动（离线模式）
function handleOfflineAction(action) {
    const storyData = STORY_DATA[gameState.bookId];
    if (!storyData) return;
    
    // 根据行动和当前场景决定下一个场景
    const nextScene = getNextScene(gameState.currentScene, action, storyData);
    
    if (nextScene) {
        loadScene(nextScene, storyData);
    } else {
        addSystemMessage('【系统】你做了「' + action + '」，但系统暂时无法处理这个行动。请尝试其他选项。');
    }
}

// 根据当前场景和行动获取下一个场景
function getNextScene(currentScene, action, storyData) {
    const sceneMap = {
        'start': {
            '前往灵根测试广场': 'test_square',
            '先去找韩立了解情况': 'meet_hanli',
            '在房间里修炼一会儿': 'first_night'
        },
        'test_square': {
            '主动接近韩立': 'meet_hanli',
            '安静排队等待测试': 'wait_test',
            '仔细观察测试石': 'observe_stone'
        },
        'meet_hanli': {
            '询问他对灵根测试的看法': 'observe_stone',
            '聊聊修炼的话题': 'secret_talk',
            '安静等待，不打扰他': 'wait_test'
        },
        'observe_stone': {
            '继续排队等待测试': 'wait_test',
            '去和韩立打个招呼': 'meet_hanli',
            '偷偷研究测试石的原理': 'observe_stone'
        },
        'wait_test': {
            '假装失望，低调离开': 'first_night',
            '向长老询问混元灵根的修炼方法': 'secret_talk',
            '去找韩立，看看他的测试结果': 'hanli_result'
        },
        'hanli_result': {
            '叫住韩立，暗示他不要放弃': 'secret_talk',
            '默默观察，不介入剧情': 'first_night',
            '告诉他自己也是伪灵根': 'secret_talk'
        },
        'secret_talk': {
            '继续鼓励他': 'first_night',
            '转移话题，聊聊修炼': 'first_night',
            '告辞离开': 'first_night'
        },
        'first_night': {
            '休息，明天继续探索': 'first_night',
            '趁夜色去藏经阁看看': 'explore_night',
            '在房间里尝试修炼': 'first_night'
        },
        'explore_night': {
            '冒险进入藏经阁': 'library',
            '放弃，回去休息': 'first_night',
            '先观察一下周围环境': 'explore_night'
        },
        'library': {
            '记下功法内容后离开': 'escape_library',
            '继续探索其他功法': 'library',
            '把书带走': 'escape_library'
        },
        'escape_library': {
            '开始修炼混元五行诀': 'first_night',
            '先休息，明天再说': 'first_night',
            '去找韩立分享这个发现': 'secret_talk'
        }
    };
    
    const transitions = sceneMap[currentScene];
    if (transitions && transitions[action]) {
        return transitions[action];
    }
    
    // 默认回到当前场景
    return currentScene;
}

// ==================== UI交互函数 ====================

// 清空游戏内容
function clearGameContent() {
    const narrativeArea = document.getElementById('narrative-area');
    const systemMessages = document.getElementById('system-messages');
    const npcMessages = document.getElementById('npc-messages');
    const actionButtons = document.getElementById('action-buttons');
    
    if (narrativeArea) narrativeArea.innerHTML = '';
    if (systemMessages) systemMessages.innerHTML = '';
    if (npcMessages) npcMessages.innerHTML = '';
    if (actionButtons) actionButtons.innerHTML = '';
    
    gameState.narrativeHistory = [];
}

// 更新玩家状态显示
function updatePlayerStats(state) {
    const nameEl = document.getElementById('player-name');
    const cultivationEl = document.getElementById('player-cultivation');
    const locationEl = document.getElementById('player-location');
    const taskEl = document.getElementById('player-task');
    
    if (nameEl) nameEl.textContent = state.name || '穿越者';
    if (cultivationEl) cultivationEl.textContent = state.cultivation || '无';
    if (locationEl) locationEl.textContent = state.location || '未知';
    if (taskEl) taskEl.textContent = state.currentTask || '无';
    
    gameState.playerState = state;
}

// 生成NPC按钮
function generateNpcButtons(npcs) {
    const container = document.getElementById('npc-buttons');
    if (!container) return;
    container.innerHTML = '';
    
    npcs.forEach(npc => {
        const btn = document.createElement('button');
        btn.className = 'npc-btn';
        btn.textContent = npc.name;
        btn.onclick = () => selectNpc(npc.name);
        container.appendChild(btn);
    });
}

// 选择NPC对话
function selectNpc(npcName) {
    gameState.currentNpc = npcName;
    addSystemMessage('已选择与【' + npcName + '】对话。请在输入框中输入你想说的话。');
    
    // 显示NPC对话提示
    const storyData = STORY_DATA[gameState.bookId];
    if (storyData && storyData.scenes[gameState.currentScene]?.npcDialogue?.[npcName]) {
        const dialogues = storyData.scenes[gameState.currentScene].npcDialogue[npcName];
        // 根据好感度选择对话
        const affinity = gameState.playerState.affinity || 50;
        let dialogue;
        if (affinity < 40) dialogue = dialogues.low;
        else if (affinity < 70) dialogue = dialogues.mid;
        else dialogue = dialogues.high;
        
        addNpcMessage(npcName, dialogue);
    }
}

// 发送NPC消息
function sendNpcMessage(message) {
    if (!message.trim()) return;
    
    addNpcMessage('你', message, true);
    
    // 简单的NPC回复逻辑
    const storyData = STORY_DATA[gameState.bookId];
    if (storyData && gameState.currentNpc) {
        const npcData = storyData.npcs.find(n => n.name === gameState.currentNpc);
        if (npcData) {
            setTimeout(() => {
                addNpcMessage(gameState.currentNpc, generateNpcReply(gameState.currentNpc, message));
            }, 500);
        }
    } else {
        setTimeout(() => {
            addSystemMessage('【' + gameState.currentNpc + '】（离线模式：NPC回复功能需要后端支持）');
        }, 500);
    }
}

// 生成NPC回复（简单版）
function generateNpcReply(npcName, playerMessage) {
    const replies = {
        '韩立': [
            '(沉思片刻) 你说得有道理...我会记住的。',
            '(点头) 多谢提醒。我会小心的。',
            '(平静地) 嗯，我知道了。',
            '(微微皱眉) 这件事...我需要想想。',
            '(放松) 你是个好人，以后多交流。'
        ],
        '南宫婉': [
            '(淡淡地) 嗯。',
            '(看了你一眼) 你倒是有趣。',
            '(轻哼) 不要多管闲事。',
            '(若有所思) 你...认识我？',
            '(微笑) 你很特别。'
        ]
    };
    
    const npcReplies = replies[npcName] || ['（沉默不语）'];
    return npcReplies[Math.floor(Math.random() * npcReplies.length)];
}

// 发送系统消息（离线模式下处理行动）
function sendSystemMessage(text) {
    if (!text.trim()) return;
    
    // 检查是否是玩家输入的自由文本
    if (gameState.currentNpc) {
        sendNpcMessage(text);
    } else {
        addNarrativeMessage('player', text);
        addSystemMessage('【系统】收到你的指令：「' + text + '」');
    }
}

// 发送叙事行动（离线模式下处理按钮选择）
function sendNarrativeAction(action) {
    if (!action.trim()) return;
    
    addNarrativeMessage('player', action);
    
    // 在离线模式下，直接处理行动
    const storyData = STORY_DATA[gameState.bookId];
    if (storyData) {
        handleOfflineAction(action);
    } else {
        addSystemMessage('【系统】你选择了：「' + action + '」');
    }
}

// 生成行动按钮
function generateActionButtons(actions) {
    const container = document.getElementById('action-buttons');
    if (!container) return;
    container.innerHTML = '';
    
    actions.forEach((action, index) => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.innerHTML = '<span class="action-num">' + (index + 1) + '</span>' + action;
        btn.onclick = () => sendNarrativeMessage(action);
        container.appendChild(btn);
    });
}

// 添加叙事消息
function addNarrativeMessage(type, content) {
    const area = document.getElementById('narrative-area');
    if (!area) return;
    
    const msg = document.createElement('div');
    msg.className = 'narrative-message ' + type;
    
    let header = '';
    switch (type) {
        case 'system': header = '📋 系统提示'; break;
        case 'npc': header = '💬 NPC'; break;
        case 'player': header = '🎯 你的行动'; break;
        case 'narrative': header = ''; break;
    }
    
    msg.innerHTML = (header ? '<div class="msg-header">' + header + '</div>' : '') +
        '<div class="msg-content">' + formatContent(content) + '</div>';
    
    area.appendChild(msg);
    area.scrollTop = area.scrollHeight;
    
    gameState.narrativeHistory.push({ type, content });
}

// 添加系统消息（右侧面板）
function addSystemMessage(content) {
    const container = document.getElementById('system-messages');
    if (!container) return;
    
    const msg = document.createElement('div');
    msg.className = 'system-message';
    msg.textContent = content;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

// 添加NPC消息（右侧面板）
function addNpcMessage(name, content, isPlayer) {
    const container = document.getElementById('npc-messages');
    if (!container) return;
    
    const msg = document.createElement('div');
    msg.className = 'npc-message';
    
    if (isPlayer) {
        msg.innerHTML = '<div class="npc-name" style="color: var(--romance-primary);">你</div>' +
            '<div class="npc-text">' + formatContent(content) + '</div>';
    } else {
        msg.innerHTML = '<div class="npc-name">' + name + '</div>' +
            '<div class="npc-text">' + formatContent(content) + '</div>';
    }
    
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

// 格式化内容
function formatContent(content) {
    return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/⚠️/g, '<span style="color: var(--romance-primary); font-weight: bold;">⚠️</span>');
}

// 显示加载状态
function showLoading(text) {
    const area = document.getElementById('narrative-area');
    if (!area) return;
    
    const loading = document.createElement('div');
    loading.className = 'typing-indicator';
    loading.id = 'loading-indicator';
    loading.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div><span>' + (text || '加载中...') + '</span>';
    area.appendChild(loading);
    area.scrollTop = area.scrollHeight;
}

// 隐藏加载状态
function hideLoading() {
    const loading = document.getElementById('loading-indicator');
    if (loading) loading.remove();
}

// ==================== 初始化 ====================

function initGameEvents() {
    // 返回按钮
    const backBtn = document.getElementById('game-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (confirm('确定要离开当前游戏吗？进度将不会保存。')) {
                switchScreen('book');
            }
        });
    }
    
    // 自由输入框
    const freeInput = document.getElementById('free-input');
    const freeInputBtn = document.getElementById('free-input-btn');
    
    if (freeInput) {
        freeInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });
        
        freeInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (freeInputBtn) freeInputBtn.click();
            }
        });
    }
    
    if (freeInputBtn) {
        freeInputBtn.addEventListener('click', function() {
            const message = freeInput.value.trim();
            if (!message) return;
            
            if (gameState.currentNpc) {
                sendNpcMessage(message);
            } else {
                sendSystemMessage(message);
            }
            
            freeInput.value = '';
            freeInput.style.height = 'auto';
        });
    }
}

// 统一的发送叙事消息函数
function sendNarrativeMessage(action) {
    addNarrativeMessage('player', action);
    
    const storyData = STORY_DATA[gameState.bookId];
    if (storyData) {
        handleOfflineAction(action);
    } else {
        addSystemMessage('【系统】你选择了：「' + action + '」');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initGameEvents();
});
