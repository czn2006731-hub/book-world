const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const books = require('../data/books.json');

// 初始化OpenAI客户端（通义千问兼容接口）
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

// 存储会话历史（生产环境应该用Redis等）
const sessions = new Map();

// 系统AI对话
router.post('/system', async (req, res) => {
  try {
    const { sessionId, bookId, message, playerState } = req.body;

    // 获取书籍数据
    const book = findBook(bookId);
    if (!book) {
      return res.status(400).json({ error: '未找到书籍数据' });
    }

    // 获取或创建会话
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        messages: [],
        playerState: {
          name: playerState?.name || '穿越者',
          identity: '外门弟子',
          location: '黄枫谷',
          currentTask: '熟悉环境',
          affinity: 50,
          ...playerState
        }
      });
    }

    const session = sessions.get(sessionId);

    // 构建系统提示
    const systemPrompt = buildSystemPrompt(book, session.playerState);

    // 添加用户消息
    session.messages.push({ role: 'user', content: message });

    // 保持对话历史在合理范围内（避免token超限）
    const recentMessages = session.messages.slice(-10);

    const completion = await client.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentMessages
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const reply = completion.choices[0].message.content;

    // 保存助手回复
    session.messages.push({ role: 'assistant', content: reply });

    // 解析并更新玩家状态（从AI回复中提取）
    updatePlayerState(session, reply);

    res.json({
      reply,
      playerState: session.playerState,
      usage: completion.usage
    });

  } catch (error) {
    console.error('系统AI对话错误:', error);
    res.status(500).json({ error: 'AI服务暂时不可用，请稍后重试' });
  }
});

// NPC对话
router.post('/npc', async (req, res) => {
  try {
    const { sessionId, bookId, npcName, message, playerState } = req.body;

    const book = findBook(bookId);
    if (!book) {
      return res.status(400).json({ error: '未找到书籍数据' });
    }

    const npc = book.npcs.find(n => n.name === npcName);
    if (!npc) {
      return res.status(400).json({ error: '未找到该NPC' });
    }

    // 构建NPC人设提示
    const npcPrompt = buildNpcPrompt(npc, book, playerState);

    const completion = await client.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        { role: 'system', content: npcPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content;

    res.json({
      reply,
      npc: npc.name,
      usage: completion.usage
    });

  } catch (error) {
    console.error('NPC对话错误:', error);
    res.status(500).json({ error: 'AI服务暂时不可用，请稍后重试' });
  }
});

// 叙事推进（AI生成故事发展）
router.post('/narrative', async (req, res) => {
  try {
    const { sessionId, bookId, playerAction, playerState } = req.body;

    const book = findBook(bookId);
    if (!book) {
      return res.status(400).json({ error: '未找到书籍数据' });
    }

    const session = sessions.get(sessionId) || { messages: [], playerState };

    const narrativePrompt = buildNarrativePrompt(book, session.playerState, playerAction);

    const completion = await client.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        { role: 'system', content: narrativePrompt },
        { role: 'user', content: playerAction }
      ],
      temperature: 0.9,
      max_tokens: 1500,
    });

    const reply = completion.choices[0].message.content;

    // 更新会话
    session.messages.push(
      { role: 'user', content: playerAction },
      { role: 'assistant', content: reply }
    );

    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, session);
    }

    res.json({
      narrative: reply,
      usage: completion.usage
    });

  } catch (error) {
    console.error('叙事推进错误:', error);
    res.status(500).json({ error: 'AI服务暂时不可用，请稍后重试' });
  }
});

// 初始化游戏（开始新游戏）
router.post('/init', async (req, res) => {
  try {
    const { bookId, playerName } = req.body;

    const book = findBook(bookId);
    if (!book) {
      return res.status(400).json({ error: '未找到书籍数据' });
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const playerState = {
      name: playerName || '穿越者',
      identity: '外门弟子',
      location: '黄枫谷',
      currentTask: '了解当前处境',
      affinity: 50,
      inventory: [],
      health: 100,
      cultivation: '炼气期一层'
    };

    sessions.set(sessionId, {
      messages: [],
      playerState,
      bookId
    });

    // 生成开场叙述
    const completion = await client.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: `你是一个游戏开场叙述者。请根据以下开场场景，用生动的语言描述玩家穿越后的第一印象，大约200字左右。\n\n${book.startScene}`
        },
        {
          role: 'user',
          content: '开始游戏，描述开场场景'
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const openingNarrative = completion.choices[0].message.content;

    res.json({
      sessionId,
      book: {
        title: book.title,
        author: book.author
      },
      opening: openingNarrative,
      playerState,
      npcs: book.npcs.map(n => ({ name: n.name, personality: n.personality }))
    });

  } catch (error) {
    console.error('游戏初始化错误:', error);
    res.status(500).json({ error: 'AI服务暂时不可用，请稍后重试' });
  }
});

// ============ 辅助函数 ============

// 查找书籍数据
function findBook(bookId) {
  const [genre, bookKey] = bookId.split('.');
  return books[genre]?.[bookKey] || null;
}

// 构建系统AI提示
function buildSystemPrompt(book, playerState) {
  return `你是穿越到《${book.title}》世界中的【随身系统】。

## 你的角色
- 你是玩家穿越后获得的神秘系统
- 你负责：提醒玩家当前处境、提供任务指引、在紧急时刻发出警告
- 你的语气神秘但友善，偶尔带点吐槽

## 当前书籍信息
- 书名：《${book.title}》
- 世界观：${book.worldView}

## 玩家当前状态
- 角色名：${playerState.name}
- 当前身份：${playerState.identity}
- 所在地点：${playerState.location}
- 当前任务：${playerState.currentTask}
- 修炼境界：${playerState.cultivation || '无'}
- 好感度：${playerState.affinity}

## 回复格式要求
1. 每次回复开头用 [系统提示] 标记
2. 提供当前状态概览
3. 给出2-3个可选行动建议
4. 如果有危险，用 ⚠️ 标记紧急提醒
5. 回复控制在300字以内

## 可用NPC
${book.npcs.map(n => `- ${n.name}：${n.personality}`).join('\n')}`;
}

// 构建NPC对话提示
function buildNpcPrompt(npc, book, playerState) {
  return `你是《${book.title}》中的角色【${npc.name}】。

## 角色设定
- 性格：${npc.personality}
- 说话风格：${npc.speechStyle}
- 背景：${npc.background}
- 当前好感度：${playerState?.affinity || 50}（0-100，影响态度）

## 对话规则
1. 严格用角色的口吻说话，不要跳出角色
2. 不要说"作为NPC"或"我是AI"之类的话
3. 根据好感度调整态度：
   - 0-30：冷淡、警惕
   - 30-70：正常、礼貌
   - 70-100：友好、亲近
4. 不要主动透露关键剧情信息
5. 回复控制在100字以内
6. 可以适当加入动作描写，如"（微微皱眉）"`;
}

// 构建叙事提示
function buildNarrativePrompt(book, playerState, playerAction) {
  return `你是一个互动小说叙述者，正在讲述《${book.title}》的故事。

## 世界观
${book.worldView}

## 玩家状态
- 角色：${playerState.name}
- 身份：${playerState.identity}
- 地点：${playerState.location}
- 任务：${playerState.currentTask}

## 叙事规则
1. 用生动的第二人称描写场景和行动
2. 根据玩家的选择推进剧情
3. 适当加入环境描写和氛围渲染
4. 可以引入NPC互动
5. 每次叙述后提供2-3个行动选项
6. 叙述控制在400字以内

## 玩家刚刚的行动
${playerAction}`;
}

// 更新玩家状态（从AI回复中解析）
function updatePlayerState(session, reply) {
  // 简单的状态更新逻辑（可以根据需要扩展）
  if (reply.includes('好感度提升') || reply.includes('友好')) {
    session.playerState.affinity = Math.min(100, session.playerState.affinity + 5);
  }
  if (reply.includes('警惕') || reply.includes('敌意')) {
    session.playerState.affinity = Math.max(0, session.playerState.affinity - 5);
  }
}

module.exports = router;
