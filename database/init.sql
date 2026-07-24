-- ═══════════════════════════════════════════════════════════════
-- 探索人生交友世界 - 数据库设计
-- 包含：用户系统、三大行星世界数据表
-- ═══════════════════════════════════════════════════════════════

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── 基础支撑表 ──────────────────────────────────────────────

-- 用户核心表
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `avatar_url` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `nickname` VARCHAR(64) DEFAULT NULL COMMENT '昵称',
  `bio` VARCHAR(255) DEFAULT NULL COMMENT '个人简介',
  `online_status` TINYINT DEFAULT 1 COMMENT '在线状态: 0离线, 1在线',
  `last_active_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '最后活跃时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_last_active` (`last_active_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户核心表';

-- 书籍基础表
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(128) NOT NULL,
  `author` VARCHAR(128) DEFAULT NULL COMMENT '作者',
  `cover_url` VARCHAR(255) DEFAULT NULL COMMENT '封面图片URL',
  `description` TEXT COMMENT '书籍简介',
  `category` VARCHAR(32) DEFAULT NULL COMMENT '分类: scifi/xianxia/romance',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_title` (`title`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='书籍基础表';

-- 用户书籍阅读记录表
DROP TABLE IF EXISTS `user_books`;
CREATE TABLE `user_books` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `book_id` BIGINT NOT NULL,
  `progress` INT DEFAULT 0 COMMENT '阅读进度(百分比)',
  `is_currently_reading` TINYINT(1) DEFAULT 0 COMMENT '是否正在阅读',
  `started_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_book` (`user_id`, `book_id`),
  KEY `idx_user_current` (`user_id`, `is_currently_reading`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户书籍阅读记录';

-- 好友关系表
DROP TABLE IF EXISTS `friendships`;
CREATE TABLE `friendships` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `friend_id` BIGINT NOT NULL,
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0待确认, 1已接受, 2已拒绝',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_friendship` (`user_id`, `friend_id`),
  KEY `idx_user_friends` (`user_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='好友关系表';

-- ═══════════════════════════════════════════════════════════════
-- 🌍 第一颗星：人生分享世界 (Life Share)
-- ═══════════════════════════════════════════════════════════════

-- 动态主表
DROP TABLE IF EXISTS `moments_posts`;
CREATE TABLE `moments_posts` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `content` TEXT COMMENT '动态文字内容',
  `media_urls` JSON COMMENT '图片/视频链接列表',
  `location` VARCHAR(255) DEFAULT NULL COMMENT '位置信息',
  `like_count` INT DEFAULT 0 COMMENT '点赞总数(用于快速读取)',
  `comment_count` INT DEFAULT 0 COMMENT '评论总数',
  `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '软删除标记',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_user_time` (`user_id`, `created_at`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='朋友圈动态表';

-- 动态点赞记录表 (确保唯一性)
DROP TABLE IF EXISTS `moments_likes`;
CREATE TABLE `moments_likes` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_post_user` (`post_id`, `user_id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动态点赞表';

-- 动态评论表 (支持楼中楼回复)
DROP TABLE IF EXISTS `moments_comments`;
CREATE TABLE `moments_comments` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `reply_to_user_id` BIGINT DEFAULT NULL COMMENT '回复的指定用户(若为空则是直接评论动态)',
  `content` VARCHAR(500) NOT NULL,
  `is_deleted` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_post_time` (`post_id`, `created_at`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动态评论表';

-- ═══════════════════════════════════════════════════════════════
-- 🪐 第二颗星：书籍交流世界 (Book Forum)
-- ═══════════════════════════════════════════════════════════════

-- 书籍主题帖
DROP TABLE IF EXISTS `forum_threads`;
CREATE TABLE `forum_threads` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `book_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` LONGTEXT NOT NULL COMMENT '支持富文本或Markdown',
  `hot_score` INT DEFAULT 0 COMMENT '热度分(定时任务根据点赞/评论计算)',
  `like_count` INT DEFAULT 0,
  `reply_count` INT DEFAULT 0,
  `is_pinned` TINYINT(1) DEFAULT 0 COMMENT '是否置顶',
  `is_deleted` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_book_hot` (`book_id`, `hot_score`),
  KEY `idx_book_time` (`book_id`, `created_at`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='书籍讨论帖';

-- 帖子回复表
DROP TABLE IF EXISTS `forum_replies`;
CREATE TABLE `forum_replies` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `thread_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `content` TEXT NOT NULL,
  `like_count` INT DEFAULT 0 COMMENT '高赞评论置顶依据',
  `is_deleted` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_thread_time` (`thread_id`, `created_at`),
  KEY `idx_thread_like` (`thread_id`, `like_count` DESC),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子回复表';

-- 帖子点赞表
DROP TABLE IF EXISTS `forum_likes`;
CREATE TABLE `forum_likes` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `target_type` TINYINT NOT NULL COMMENT '目标类型: 1帖子, 2回复',
  `target_id` BIGINT NOT NULL COMMENT '帖子ID或回复ID',
  `user_id` BIGINT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_target_user` (`target_type`, `target_id`, `user_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='论坛点赞表';

-- ═══════════════════════════════════════════════════════════════
-- 🌑 第三颗星：书籍记录世界 (情绪日志)
-- ═══════════════════════════════════════════════════════════════

-- 情绪日志表 - 驱动3D星球渲染的核心数据
DROP TABLE IF EXISTS `emotional_logs`;
CREATE TABLE `emotional_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `book_id` BIGINT DEFAULT NULL COMMENT '记录时关联的书籍(可为空)',
  `content` TEXT NOT NULL COMMENT '私密想法内容',
  
  -- 情绪核心维度设计 --
  `emotion_code` VARCHAR(32) NOT NULL COMMENT '情绪光谱主色调 (如: RED_EXCITED, BLUE_SAD, GREEN_CALM)',
  `emotion_intensity` TINYINT DEFAULT 3 COMMENT '情绪强度 1-5 (影响该颜色在星球上的发光亮度或粒子活跃度)',
  
  `is_deleted` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- 索引设计：优化情绪聚合查询
  KEY `idx_user_emotion_time` (`user_id`, `emotion_code`, `created_at`),
  KEY `idx_user_time` (`user_id`, `created_at`),
  KEY `idx_book` (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='私密情绪日志';

-- 情绪聚合缓存表 (用于快速获取星球渲染数据)
DROP TABLE IF EXISTS `emotion_spectrum_cache`;
CREATE TABLE `emotion_spectrum_cache` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `emotion_code` VARCHAR(32) NOT NULL,
  `emotion_count` INT DEFAULT 0 COMMENT '该情绪总数',
  `avg_intensity` DECIMAL(3,2) DEFAULT 3.00 COMMENT '平均强度',
  `last_updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_emotion` (`user_id`, `emotion_code`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='情绪聚合缓存表';

-- ═══════════════════════════════════════════════════════════════
-- 消息通知表 (WebSocket实时推送)
-- ═══════════════════════════════════════════════════════════════

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL COMMENT '接收者',
  `sender_id` BIGINT DEFAULT NULL COMMENT '发送者',
  `type` VARCHAR(32) NOT NULL COMMENT '通知类型: like/comment/friend/message',
  `target_type` VARCHAR(32) DEFAULT NULL COMMENT '目标类型: post/thread/reply',
  `target_id` BIGINT DEFAULT NULL COMMENT '目标ID',
  `content` VARCHAR(500) DEFAULT NULL COMMENT '通知内容',
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_user_read` (`user_id`, `is_read`),
  KEY `idx_user_time` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息通知表';

-- ═══════════════════════════════════════════════════════════════
-- 初始化数据
-- ═══════════════════════════════════════════════════════════════

-- 插入示例书籍
INSERT INTO `books` (`title`, `author`, `category`, `description`) VALUES
('三体', '刘慈欣', 'scifi', '地球文明向宇宙发出的第一声啼鸣，引来三体文明的入侵。'),
('流浪地球', '刘慈欣', 'scifi', '太阳即将毁灭，人类带着地球逃亡，在宇宙中寻找新的家园。'),
('沙丘', '弗兰克·赫伯特', 'scifi', '在沙漠星球阿拉基斯上，控制着宇宙珍贵香料的家族展开了一场史诗般的权力斗争。'),
('红楼梦', '曹雪芹', 'romance', '以贾宝玉与林黛玉、薛宝钗的爱情悲剧为主线，揭示了四大家族的兴衰。'),
('凡人修仙传', '忘语', 'xianxia', '一个普通山村少年韩立，偶入修仙门派，凭借坚韧不拔的意志，一步步踏上修仙巅峰。'),
('斗破苍穹', '天蚕土豆', 'xianxia', '萧炎从天才沦为废物，又从废物逆袭成强者，在斗气大陆书写属于自己的传奇。');

SET FOREIGN_KEY_CHECKS = 1;
