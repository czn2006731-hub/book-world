-- --------------------------------------------------
-- 《书籍人生模拟器》 MySQL 8.0 数据库初始化脚本
-- 运行方法：在 MySQL 中选择 bookemulator 数据库后运行
-- --------------------------------------------------

CREATE DATABASE IF NOT EXISTS `bookemulator` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bookemulator`;

-- 1. 玩家用户表
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '玩家主键ID',
    `username` VARCHAR(64) NOT NULL UNIQUE COMMENT '账号/设备唯一标识',
    `nickname` VARCHAR(64) NOT NULL COMMENT '玩家游戏昵称',
    `avatar` VARCHAR(255) COMMENT '玩家头像URL或Emoji',
    `cultivation` VARCHAR(64) COMMENT '当前修仙境界（如：炼气期一层）',
    `last_active_time` DATETIME COMMENT '最后在线/活动时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='玩家账号信息表';

-- 2. 好友关系表
CREATE TABLE IF NOT EXISTS `friendships` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '关系记录ID',
    `user_id` BIGINT NOT NULL COMMENT '申请发起人ID',
    `friend_id` BIGINT NOT NULL COMMENT '接收申请人ID',
    `status` VARCHAR(32) NOT NULL DEFAULT 'PENDING' COMMENT '状态: PENDING(申请中), ACCEPTED(已是好友), REJECTED(已拒绝)',
    `created_at` DATETIME COMMENT '申请/建立时间',
    KEY `idx_user` (`user_id`),
    KEY `idx_friend` (`friend_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='玩家好友关系表';

-- 3. 探索人生全服动态信息表
CREATE TABLE IF NOT EXISTS `explore_posts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '动态ID',
    `user_id` BIGINT NOT NULL COMMENT '发布人ID',
    `author_name` VARCHAR(64) COMMENT '发布人昵称',
    `avatar` VARCHAR(255) COMMENT '发布人头像',
    `content` TEXT NOT NULL COMMENT '动态感悟内容/消息',
    `book_title` VARCHAR(64) COMMENT '关联书籍名称',
    `likes_count` INT DEFAULT 0 COMMENT '点赞数',
    `created_at` DATETIME COMMENT '发布时间',
    KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='探索人生全服动态表';

-- 4. 好友即时私信消息表
CREATE TABLE IF NOT EXISTS `chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '消息记录ID',
    `sender_id` BIGINT NOT NULL COMMENT '发送人ID',
    `receiver_id` BIGINT NOT NULL COMMENT '接收人ID',
    `content` TEXT NOT NULL COMMENT '消息文本内容',
    `is_read` TINYINT(1) DEFAULT 0 COMMENT '是否已读',
    `created_at` DATETIME COMMENT '发送时间',
    KEY `idx_sender` (`sender_id`),
    KEY `idx_receiver` (`receiver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='好友私聊消息表';
