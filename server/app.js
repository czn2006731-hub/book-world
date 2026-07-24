/**
 * 探索人生交友世界 - 后端API服务
 * Express + MySQL + WebSocket
 */

const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ─── 配置 ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'book-realm-secret-key-2026';
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'book_realm',
    waitForConnections: true,
    connectionLimit: 10
};

// ─── 中间件 ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 数据库连接池
const pool = mysql.createPool(DB_CONFIG);

// ─── 认证中间件 ──────────────────────────────────────────
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: '未授权访问' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
        if (users.length === 0) {
            return res.status(401).json({ error: '用户不存在' });
        }
        req.user = users[0];
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token无效' });
    }
};

// ═══════════════════════════════════════════════════════════════
// 用户认证 API
// ═══════════════════════════════════════════════════════════════

// 注册
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, nickname } = req.body;
        
        // 检查用户名是否已存在
        const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ error: '用户名已存在' });
        }
        
        // 密码加密
        const passwordHash = await bcrypt.hash(password, 10);
        
        // 创建用户
        const [result] = await pool.query(
            'INSERT INTO users (username, password_hash, nickname) VALUES (?, ?, ?)',
            [username, passwordHash, nickname || username]
        );
        
        // 生成Token
        const token = jwt.sign({ userId: result.insertId }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            token,
            user: {
                id: result.insertId,
                username,
                nickname: nickname || username
            }
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 登录
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 更新在线状态
        await pool.query('UPDATE users SET online_status = 1 WHERE id = ?', [user.id]);
        
        // 生成Token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                nickname: user.nickname,
                avatar_url: user.avatar_url
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 获取当前用户信息
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username,
        nickname: req.user.nickname,
        avatar_url: req.user.avatar_url,
        bio: req.user.bio
    });
});

// ═══════════════════════════════════════════════════════════════
// 好友 API
// ═══════════════════════════════════════════════════════════════

// 获取好友列表
app.get('/api/friends', authenticateToken, async (req, res) => {
    try {
        const [friends] = await pool.query(`
            SELECT 
                u.id, u.username, u.nickname, u.avatar_url, u.online_status, u.last_active_at,
                ub.book_id, b.title as current_book, ub.progress
            FROM friendships f
            JOIN users u ON (f.friend_id = u.id OR f.user_id = u.id) AND u.id != ?
            LEFT JOIN user_books ub ON u.id = ub.user_id AND ub.is_currently_reading = 1
            LEFT JOIN books b ON ub.book_id = b.id
            WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 1
            ORDER BY u.online_status DESC, u.last_active_at DESC
        `, [req.user.id, req.user.id, req.user.id]);
        
        res.json(friends);
    } catch (error) {
        console.error('获取好友列表错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 搜索用户
app.get('/api/users/search', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;
        const [users] = await pool.query(`
            SELECT id, username, nickname, avatar_url, online_status
            FROM users
            WHERE (username LIKE ? OR nickname LIKE ?) AND id != ?
            LIMIT 20
        `, [`%${q}%`, `%${q}%`, req.user.id]);
        
        res.json(users);
    } catch (error) {
        console.error('搜索用户错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// ═══════════════════════════════════════════════════════════════
// 🌍 人生分享世界 API
// ═══════════════════════════════════════════════════════════════

// 获取动态列表 (信息流)
app.get('/api/moments', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        
        const [posts] = await pool.query(`
            SELECT 
                mp.*,
                u.username, u.nickname, u.avatar_url,
                (SELECT COUNT(*) FROM moments_likes ml WHERE ml.post_id = mp.id) as like_count,
                (SELECT COUNT(*) FROM moments_comments mc WHERE mc.post_id = mp.id) as comment_count,
                (SELECT COUNT(*) FROM moments_likes ml WHERE ml.post_id = mp.id AND ml.user_id = ?) as is_liked
            FROM moments_posts mp
            JOIN users u ON mp.user_id = u.id
            WHERE mp.is_deleted = 0
            ORDER BY mp.created_at DESC
            LIMIT ? OFFSET ?
        `, [req.user.id, parseInt(limit), parseInt(offset)]);
        
        res.json(posts);
    } catch (error) {
        console.error('获取动态列表错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 发布动态
app.post('/api/moments', authenticateToken, async (req, res) => {
    try {
        const { content, media_urls, location } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO moments_posts (user_id, content, media_urls, location) VALUES (?, ?, ?, ?)',
            [req.user.id, content, JSON.stringify(media_urls || []), location]
        );
        
        // 获取完整动态数据
        const [posts] = await pool.query(`
            SELECT mp.*, u.username, u.nickname, u.avatar_url
            FROM moments_posts mp
            JOIN users u ON mp.user_id = u.id
            WHERE mp.id = ?
        `, [result.insertId]);
        
        // 广播给所有在线用户
        broadcastMessage({
            type: 'new_post',
            data: { ...posts[0], like_count: 0, comment_count: 0, is_liked: 0 }
        });
        
        res.json(posts[0]);
    } catch (error) {
        console.error('发布动态错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 点赞/取消点赞动态
app.post('/api/moments/:postId/like', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        
        // 检查是否已点赞
        const [existing] = await pool.query(
            'SELECT id FROM moments_likes WHERE post_id = ? AND user_id = ?',
            [postId, req.user.id]
        );
        
        if (existing.length > 0) {
            // 取消点赞
            await pool.query('DELETE FROM moments_likes WHERE post_id = ? AND user_id = ?', [postId, req.user.id]);
            await pool.query('UPDATE moments_posts SET like_count = like_count - 1 WHERE id = ?', [postId]);
            res.json({ liked: false });
        } else {
            // 点赞
            await pool.query('INSERT INTO moments_likes (post_id, user_id) VALUES (?, ?)', [postId, req.user.id]);
            await pool.query('UPDATE moments_posts SET like_count = like_count + 1 WHERE id = ?', [postId]);
            
            // 获取动态信息并通知作者
            const [posts] = await pool.query('SELECT user_id FROM moments_posts WHERE id = ?', [postId]);
            if (posts.length > 0 && posts[0].user_id !== req.user.id) {
                await createNotification(
                    posts[0].user_id,
                    req.user.id,
                    'like',
                    'post',
                    postId,
                    `${req.user.nickname} 赞了你的动态`
                );
            }
            
            res.json({ liked: true });
        }
    } catch (error) {
        console.error('点赞错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 获取动态评论
app.get('/api/moments/:postId/comments', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        
        const [comments] = await pool.query(`
            SELECT 
                mc.*,
                u.username, u.nickname, u.avatar_url,
                ru.username as reply_to_username
            FROM moments_comments mc
            JOIN users u ON mc.user_id = u.id
            LEFT JOIN users ru ON mc.reply_to_user_id = ru.id
            WHERE mc.post_id = ? AND mc.is_deleted = 0
            ORDER BY mc.created_at ASC
        `, [postId]);
        
        res.json(comments);
    } catch (error) {
        console.error('获取评论错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 发表评论
app.post('/api/moments/:postId/comments', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, reply_to_user_id } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO moments_comments (post_id, user_id, reply_to_user_id, content) VALUES (?, ?, ?, ?)',
            [postId, req.user.id, reply_to_user_id || null, content]
        );
        
        // 更新评论数
        await pool.query('UPDATE moments_posts SET comment_count = comment_count + 1 WHERE id = ?', [postId]);
        
        // 获取完整评论数据
        const [comments] = await pool.query(`
            SELECT mc.*, u.username, u.nickname, u.avatar_url
            FROM moments_comments mc
            JOIN users u ON mc.user_id = u.id
            WHERE mc.id = ?
        `, [result.insertId]);
        
        // 广播新评论
        broadcastMessage({
            type: 'new_comment',
            data: { post_id: postId, ...comments[0] }
        });
        
        res.json(comments[0]);
    } catch (error) {
        console.error('发表评论错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// ═══════════════════════════════════════════════════════════════
// 🪐 书籍交流世界 API
// ═══════════════════════════════════════════════════════════════

// 获取书籍列表
app.get('/api/books', authenticateToken, async (req, res) => {
    try {
        const [books] = await pool.query('SELECT * FROM books ORDER BY title');
        res.json(books);
    } catch (error) {
        console.error('获取书籍列表错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 获取书籍讨论帖
app.get('/api/books/:bookId/threads', authenticateToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        const { sort = 'hot', page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        
        let orderBy = 'ft.hot_score DESC';
        if (sort === 'new') orderBy = 'ft.created_at DESC';
        
        const [threads] = await pool.query(`
            SELECT 
                ft.*,
                u.username, u.nickname, u.avatar_url,
                (SELECT COUNT(*) FROM forum_likes fl WHERE fl.target_type = 1 AND fl.target_id = ft.id) as like_count,
                (SELECT COUNT(*) FROM forum_replies fr WHERE fr.thread_id = ft.id) as reply_count,
                (SELECT COUNT(*) FROM forum_likes fl WHERE fl.target_type = 1 AND fl.target_id = ft.id AND fl.user_id = ?) as is_liked
            FROM forum_threads ft
            JOIN users u ON ft.user_id = u.id
            WHERE ft.book_id = ? AND ft.is_deleted = 0
            ORDER BY ft.is_pinned DESC, ${orderBy}
            LIMIT ? OFFSET ?
        `, [req.user.id, bookId, parseInt(limit), parseInt(offset)]);
        
        res.json(threads);
    } catch (error) {
        console.error('获取讨论帖错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 创建讨论帖
app.post('/api/books/:bookId/threads', authenticateToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        const { title, content } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO forum_threads (book_id, user_id, title, content) VALUES (?, ?, ?, ?)',
            [bookId, req.user.id, title, content]
        );
        
        const [threads] = await pool.query(`
            SELECT ft.*, u.username, u.nickname, u.avatar_url
            FROM forum_threads ft
            JOIN users u ON ft.user_id = u.id
            WHERE ft.id = ?
        `, [result.insertId]);
        
        res.json(threads[0]);
    } catch (error) {
        console.error('创建讨论帖错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 获取帖子回复
app.get('/api/threads/:threadId/replies', authenticateToken, async (req, res) => {
    try {
        const { threadId } = req.params;
        
        const [replies] = await pool.query(`
            SELECT 
                fr.*,
                u.username, u.nickname, u.avatar_url,
                (SELECT COUNT(*) FROM forum_likes fl WHERE fl.target_type = 2 AND fl.target_id = fr.id) as like_count
            FROM forum_replies fr
            JOIN users u ON fr.user_id = u.id
            WHERE fr.thread_id = ? AND fr.is_deleted = 0
            ORDER BY fr.created_at ASC
        `, [threadId]);
        
        res.json(replies);
    } catch (error) {
        console.error('获取回复错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 发表回复
app.post('/api/threads/:threadId/replies', authenticateToken, async (req, res) => {
    try {
        const { threadId } = req.params;
        const { content } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO forum_replies (thread_id, user_id, content) VALUES (?, ?, ?)',
            [threadId, req.user.id, content]
        );
        
        // 更新回复数
        await pool.query('UPDATE forum_threads SET reply_count = reply_count + 1 WHERE id = ?', [threadId]);
        
        const [replies] = await pool.query(`
            SELECT fr.*, u.username, u.nickname, u.avatar_url
            FROM forum_replies fr
            JOIN users u ON fr.user_id = u.id
            WHERE fr.id = ?
        `, [result.insertId]);
        
        // 广播新回复
        broadcastMessage({
            type: 'new_reply',
            data: { thread_id: threadId, ...replies[0] }
        });
        
        res.json(replies[0]);
    } catch (error) {
        console.error('发表回复错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// ═══════════════════════════════════════════════════════════════
// 🌑 书籍记录世界 API (情绪日志)
// ═══════════════════════════════════════════════════════════════

// 获取情绪日志列表
app.get('/api/emotional-logs', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;
        
        const [logs] = await pool.query(`
            SELECT 
                el.*,
                b.title as book_title
            FROM emotional_logs el
            LEFT JOIN books b ON el.book_id = b.id
            WHERE el.user_id = ? AND el.is_deleted = 0
            ORDER BY el.created_at DESC
            LIMIT ? OFFSET ?
        `, [req.user.id, parseInt(limit), parseInt(offset)]);
        
        res.json(logs);
    } catch (error) {
        console.error('获取情绪日志错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 创建情绪日志
app.post('/api/emotional-logs', authenticateToken, async (req, res) => {
    try {
        const { content, book_id, emotion_code, emotion_intensity } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO emotional_logs (user_id, book_id, content, emotion_code, emotion_intensity) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, book_id || null, content, emotion_code, emotion_intensity || 3]
        );
        
        // 更新情绪聚合缓存
        await updateEmotionCache(req.user.id, emotion_code, emotion_intensity || 3);
        
        const [logs] = await pool.query('SELECT * FROM emotional_logs WHERE id = ?', [result.insertId]);
        
        res.json(logs[0]);
    } catch (error) {
        console.error('创建情绪日志错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 获取情绪光谱数据 (驱动3D星球渲染)
app.get('/api/emotional-logs/spectrum', authenticateToken, async (req, res) => {
    try {
        const [spectrum] = await pool.query(`
            SELECT 
                emotion_code,
                COUNT(*) as emotion_count,
                AVG(emotion_intensity) as avg_intensity
            FROM emotional_logs
            WHERE user_id = ? AND is_deleted = 0
            GROUP BY emotion_code
        `, [req.user.id]);
        
        // 计算百分比
        const total = spectrum.reduce((sum, s) => sum + s.emotion_count, 0);
        const result = {};
        
        spectrum.forEach(s => {
            result[s.emotion_code] = {
                percentage: Math.round((s.emotion_count / total) * 100),
                intensity: parseFloat(s.avg_intensity).toFixed(1),
                count: s.emotion_count
            };
        });
        
        res.json(result);
    } catch (error) {
        console.error('获取情绪光谱错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 更新情绪聚合缓存
async function updateEmotionCache(userId, emotionCode, intensity) {
    try {
        const [existing] = await pool.query(
            'SELECT id, emotion_count, avg_intensity FROM emotion_spectrum_cache WHERE user_id = ? AND emotion_code = ?',
            [userId, emotionCode]
        );
        
        if (existing.length > 0) {
            const newCount = existing[0].emotion_count + 1;
            const newIntensity = ((existing[0].avg_intensity * existing[0].emotion_count) + intensity) / newCount;
            await pool.query(
                'UPDATE emotion_spectrum_cache SET emotion_count = ?, avg_intensity = ? WHERE id = ?',
                [newCount, newIntensity, existing[0].id]
            );
        } else {
            await pool.query(
                'INSERT INTO emotion_spectrum_cache (user_id, emotion_code, emotion_count, avg_intensity) VALUES (?, ?, 1, ?)',
                [userId, emotionCode, intensity]
            );
        }
    } catch (error) {
        console.error('更新情绪缓存错误:', error);
    }
}

// ═══════════════════════════════════════════════════════════════
// 通知 API
// ═══════════════════════════════════════════════════════════════

async function createNotification(userId, senderId, type, targetType, targetId, content) {
    try {
        await pool.query(
            'INSERT INTO notifications (user_id, sender_id, type, target_type, target_id, content) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, senderId, type, targetType, targetId, content]
        );
        
        // WebSocket推送通知
        sendToUser(userId, {
            type: 'notification',
            data: { sender_id: senderId, type, content }
        });
    } catch (error) {
        console.error('创建通知错误:', error);
    }
}

// 获取通知列表
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const [notifications] = await pool.query(`
            SELECT 
                n.*,
                u.username as sender_username,
                u.nickname as sender_nickname,
                u.avatar_url as sender_avatar
            FROM notifications n
            LEFT JOIN users u ON n.sender_id = u.id
            WHERE n.user_id = ?
            ORDER BY n.created_at DESC
            LIMIT 50
        `, [req.user.id]);
        
        res.json(notifications);
    } catch (error) {
        console.error('获取通知错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// 标记通知已读
app.put('/api/notifications/read', authenticateToken, async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('标记通知已读错误:', error);
        res.status(500).json({ error: '服务器错误' });
    }
});

// ═══════════════════════════════════════════════════════════════
// WebSocket 实时同步
// ═══════════════════════════════════════════════════════════════

const wsClients = new Map(); // userId -> Set<ws>

wss.on('connection', (ws, req) => {
    console.log('WebSocket连接建立');
    
    // 认证
    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data);
            
            if (message.type === 'auth') {
                const decoded = jwt.verify(message.token, JWT_SECRET);
                ws.userId = decoded.userId;
                
                if (!wsClients.has(decoded.userId)) {
                    wsClients.set(decoded.userId, new Set());
                }
                wsClients.get(decoded.userId).add(ws);
                
                // 更新在线状态
                await pool.query('UPDATE users SET online_status = 1 WHERE id = ?', [decoded.userId]);
                
                // 广播上线状态
                broadcastMessage({
                    type: 'user_online',
                    data: { user_id: decoded.userId }
                });
                
                ws.send(JSON.stringify({ type: 'auth_success' }));
                console.log(`用户 ${decoded.userId} WebSocket认证成功`);
            }
        } catch (error) {
            console.error('WebSocket消息处理错误:', error);
        }
    });
    
    ws.on('close', async () => {
        if (ws.userId) {
            const clients = wsClients.get(ws.userId);
            if (clients) {
                clients.delete(ws);
                if (clients.size === 0) {
                    wsClients.delete(ws.userId);
                    // 更新离线状态
                    await pool.query('UPDATE users SET online_status = 0, last_active_at = NOW() WHERE id = ?', [ws.userId]);
                    // 广播离线状态
                    broadcastMessage({
                        type: 'user_offline',
                        data: { user_id: ws.userId }
                    });
                }
            }
        }
        console.log('WebSocket连接关闭');
    });
});

// 发送消息给指定用户
function sendToUser(userId, message) {
    const clients = wsClients.get(userId);
    if (clients) {
        clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(message));
            }
        });
    }
}

// 广播消息给所有在线用户
function broadcastMessage(message, excludeUserId = null) {
    const data = JSON.stringify(message);
    wsClients.forEach((clients, userId) => {
        if (userId !== excludeUserId) {
            clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(data);
                }
            });
        }
    });
}

// ═══════════════════════════════════════════════════════════════
// 启动服务器
// ═══════════════════════════════════════════════════════════════

server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    探索人生交友世界                          ║
║                    后端服务已启动                            ║
╠══════════════════════════════════════════════════════════════╣
║  HTTP:  http://localhost:${PORT}                             ║
║  WebSocket: ws://localhost:${PORT}                           ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

module.exports = { app, server, wss };
