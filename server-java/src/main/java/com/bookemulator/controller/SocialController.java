package com.bookemulator.controller;

import com.bookemulator.config.ExploreWebSocketHandler;
import com.bookemulator.entity.ChatMessage;
import com.bookemulator.entity.ExplorePost;
import com.bookemulator.entity.Friendship;
import com.bookemulator.entity.User;
import com.bookemulator.repository.ChatMessageRepository;
import com.bookemulator.repository.ExplorePostRepository;
import com.bookemulator.repository.FriendshipRepository;
import com.bookemulator.repository.UserRepository;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/social")
public class SocialController {

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final ExplorePostRepository explorePostRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ExploreWebSocketHandler webSocketHandler;
    private final Gson gson = new Gson();

    public SocialController(UserRepository userRepository,
                            FriendshipRepository friendshipRepository,
                            ExplorePostRepository explorePostRepository,
                            ChatMessageRepository chatMessageRepository,
                            ExploreWebSocketHandler webSocketHandler) {
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
        this.explorePostRepository = explorePostRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.webSocketHandler = webSocketHandler;
    }

    // 1. 玩家注册/登录初始化
    @PostMapping("/login")
    public User loginOrRegister(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "guest_" + System.currentTimeMillis());
        String nickname = body.getOrDefault("nickname", "修仙道友");
        String avatar = body.getOrDefault("avatar", "🧑‍🌾");
        String cultivation = body.getOrDefault("cultivation", "炼气期一层");

        return userRepository.findByUsername(username).map(user -> {
            user.setNickname(nickname);
            user.setCultivation(cultivation);
            user.setLastActiveTime(LocalDateTime.now());
            return userRepository.save(user);
        }).orElseGet(() -> {
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setNickname(nickname);
            newUser.setAvatar(avatar);
            newUser.setCultivation(cultivation);
            newUser.setLastActiveTime(LocalDateTime.now());
            return userRepository.save(newUser);
        });
    }

    // 2. 发送全服探索动态/信息
    @PostMapping("/post")
    public ExplorePost createPost(@RequestBody Map<String, Object> body) {
        Long userId = Long.parseLong(body.get("userId").toString());
        String content = body.get("content").toString();
        String bookTitle = body.getOrDefault("bookTitle", "凡人修仙传").toString();

        User user = userRepository.findById(userId).orElseThrow();

        ExplorePost post = new ExplorePost();
        post.setUserId(user.getId());
        post.setAuthorName(user.getNickname());
        post.setAvatar(user.getAvatar());
        post.setContent(content);
        post.setBookTitle(bookTitle);
        post.setCreatedAt(LocalDateTime.now());

        ExplorePost saved = explorePostRepository.save(post);

        // 全服 WebSocket 广播
        Map<String, Object> wsMsg = new HashMap<>();
        wsMsg.put("type", "NEW_POST");
        wsMsg.put("data", saved);
        webSocketHandler.broadcastMessage(gson.toJson(wsMsg));

        return saved;
    }

    // 3. 获取探索人生广场全服动态
    @GetMapping("/posts")
    public List<ExplorePost> getPosts() {
        return explorePostRepository.findAllByOrderByCreatedAtDesc();
    }

    // 4. 申请添加好友
    @PostMapping("/friend/apply")
    public Map<String, Object> applyFriend(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        Long friendId = body.get("friendId");

        Map<String, Object> res = new HashMap<>();
        if (userId.equals(friendId)) {
            res.put("status", "error");
            res.put("message", "不能添加自己为好友");
            return res;
        }

        Optional<Friendship> existing = friendshipRepository.findByUserIdAndFriendId(userId, friendId);
        if (existing.isPresent()) {
            res.put("status", "exists");
            res.put("message", "已提交申请或已是好友");
            return res;
        }

        Friendship friendship = new Friendship();
        friendship.setUserId(userId);
        friendship.setFriendId(friendId);
        friendship.setStatus("PENDING");
        friendship.setCreatedAt(LocalDateTime.now());
        friendshipRepository.save(friendship);

        res.put("status", "ok");
        res.put("message", "好友申请已发送");
        return res;
    }

    // 5. 查看好友列表
    @GetMapping("/friends/{userId}")
    public List<User> getFriends(@PathVariable Long userId) {
        List<Friendship> friendships = friendshipRepository.findByUserIdOrFriendId(userId, userId);
        List<Long> friendIds = new ArrayList<>();
        for (Friendship f : friendships) {
            if ("ACCEPTED".equals(f.getStatus())) {
                friendIds.add(f.getUserId().equals(userId) ? f.getFriendId() : f.getUserId());
            }
        }
        return userRepository.findAllById(friendIds);
    }

    // 6. 同意好友申请
    @PostMapping("/friend/accept")
    public Map<String, Object> acceptFriend(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        Long friendId = body.get("friendId");

        Map<String, Object> res = new HashMap<>();
        Optional<Friendship> existing = friendshipRepository.findByUserIdAndFriendId(friendId, userId);
        if (existing.isPresent()) {
            Friendship f = existing.get();
            f.setStatus("ACCEPTED");
            friendshipRepository.save(f);
            res.put("status", "ok");
            res.put("message", "已成为好友");
        } else {
            res.put("status", "error");
            res.put("message", "未找到好友申请");
        }
        return res;
    }

    // 7. 获取待处理好友申请列表
    @GetMapping("/friend/requests/{userId}")
    public List<User> getFriendRequests(@PathVariable Long userId) {
        List<Friendship> pending = friendshipRepository.findByFriendIdAndStatus(userId, "PENDING");
        List<Long> userIds = new ArrayList<>();
        for (Friendship f : pending) {
            userIds.add(f.getUserId());
        }
        return userRepository.findAllById(userIds);
    }

    // 8. 获取所有可结识的玩家列表（除自己和好友之外的玩家）
    @GetMapping("/users/list/{userId}")
    public List<User> getDiscoverableUsers(@PathVariable Long userId) {
        List<User> all = userRepository.findAll();
        List<Friendship> friendships = friendshipRepository.findByUserIdOrFriendId(userId, userId);
        Set<Long> relatedIds = new HashSet<>();
        relatedIds.add(userId);
        for (Friendship f : friendships) {
            relatedIds.add(f.getUserId());
            relatedIds.add(f.getFriendId());
        }
        List<User> discoverable = new ArrayList<>();
        for (User u : all) {
            if (!relatedIds.contains(u.getId())) {
                discoverable.add(u);
            }
        }
        return discoverable;
    }

    // 9. 搜索玩家（支持按玩家ID精确搜索或昵称模糊搜索）
    @GetMapping("/user/search")
    public List<User> searchUsers(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }
        String q = query.trim();
        List<User> result = new ArrayList<>();
        // 尝试按ID查找
        try {
            Long id = Long.parseLong(q);
            userRepository.findById(id).ifPresent(result::add);
        } catch (Exception ignored) {}
        
        // 按昵称模糊查找
        List<User> nicknameMatches = userRepository.findByNicknameContainingIgnoreCase(q);
        for (User u : nicknameMatches) {
            if (result.stream().noneMatch(r -> r.getId().equals(u.getId()))) {
                result.add(u);
            }
        }
        return result;
    }

    // 10. 获取个人主页详情
    @GetMapping("/user/profile/{userId}")
    public Map<String, Object> getUserProfile(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("nickname", user.getNickname());
        profile.put("avatar", user.getAvatar());
        profile.put("cultivation", user.getCultivation() != null ? user.getCultivation() : "炼气期一层");
        profile.put("lastActiveTime", user.getLastActiveTime());
        
        // 统计发布的感悟数
        long postCount = explorePostRepository.findAll().stream().filter(p -> p.getUserId().equals(userId)).count();
        profile.put("postCount", postCount);
        
        return profile;
    }

    // 11. 发送 1v1 好友私聊消息
    @PostMapping("/chat/send")
    public ChatMessage sendChatMessage(@RequestBody Map<String, Object> body) {
        Long senderId = Long.parseLong(body.get("senderId").toString());
        Long receiverId = Long.parseLong(body.get("receiverId").toString());
        String content = body.get("content").toString();

        ChatMessage msg = new ChatMessage();
        msg.setSenderId(senderId);
        msg.setReceiverId(receiverId);
        msg.setContent(content);
        msg.setIsRead(false);
        msg.setCreatedAt(LocalDateTime.now());

        ChatMessage saved = chatMessageRepository.save(msg);

        // 通过 WebSocket 点对点精准推送给在线接收方
        Map<String, Object> wsData = new HashMap<>();
        wsData.put("type", "PRIVATE_CHAT");
        wsData.put("data", saved);
        webSocketHandler.sendToUser(receiverId, gson.toJson(wsData));

        return saved;
    }

    // 12. 获取两个玩家之间的私聊历史记录
    @GetMapping("/chat/history")
    public List<ChatMessage> getChatHistory(@RequestParam Long userId, @RequestParam Long friendId) {
        return chatMessageRepository.findChatHistory(userId, friendId);
    }
}
