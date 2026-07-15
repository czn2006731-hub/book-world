require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务（前端） - 使用绝对路径确保可靠性
const staticRoot = path.resolve(__dirname, '..');
app.use(express.static(staticRoot));

console.log('静态文件根目录:', staticRoot);

// API路由
app.use('/api/chat', chatRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`书籍人生模拟器后端运行在 http://localhost:${PORT}`);
  console.log('API接口:');
  console.log('  POST /api/chat/system    - 系统AI对话');
  console.log('  POST /api/chat/npc       - NPC对话');
  console.log('  POST /api/chat/narrative - 叙事推进');
});
