package com.bookemulator.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AIService {

    @Value("${qwen.api-key}")
    private String apiKey;

    @Value("${qwen.base-url}")
    private String baseUrl;

    @Value("${qwen.model}")
    private String model;

    private final Gson gson = new Gson();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    // 存储会话历史
    private final Map<String, List<Map<String, String>>> sessions = new ConcurrentHashMap<>();
    // 存储玩家状态
    private final Map<String, Map<String, Object>> playerStates = new ConcurrentHashMap<>();

    /**
     * 初始化游戏
     */
    public Map<String, Object> initGame(String bookId, String playerName) {
        String sessionId = "session_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);

        // 初始化玩家状态
        Map<String, Object> playerState = new HashMap<>();
        playerState.put("name", playerName != null ? playerName : "穿越者");
        playerState.put("identity", "外门弟子");
        playerState.put("location", "黄枫谷");
        playerState.put("currentTask", "了解当前处境");
        playerState.put("affinity", 50);
        playerState.put("cultivation", "炼气期一层");

        playerStates.put(sessionId, playerState);
        sessions.put(sessionId, new ArrayList<>());

        // 生成开场叙述
        String openingPrompt = buildOpeningPrompt(bookId);
        String opening = callQwenAPI(openingPrompt, "你是一个游戏开场叙述者，用生动的语言描述玩家穿越后的第一印象，大约200字左右。");

        // 构建结果
        Map<String, Object> result = new HashMap<>();
        result.put("sessionId", sessionId);
        result.put("opening", opening);
        result.put("playerState", playerState);

        // NPC列表
        List<Map<String, String>> npcs = getNPCsForBook(bookId);
        result.put("npcs", npcs);

        return result;
    }

    /**
     * 系统AI对话
     */
    public Map<String, Object> systemChat(String sessionId, String bookId, String message) {
        List<Map<String, String>> history = sessions.computeIfAbsent(sessionId, k -> new ArrayList<>());
        Map<String, Object> playerState = playerStates.getOrDefault(sessionId, new HashMap<>());

        // 构建系统提示
        String systemPrompt = buildSystemPrompt(bookId, playerState);

        // 添加用户消息
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", message);
        history.add(userMsg);

        // 保持对话历史在合理范围
        List<Map<String, String>> recentHistory = history.size() > 10
                ? history.subList(history.size() - 10, history.size())
                : history;

        // 调用API
        String reply = callQwenAPIWithHistory(systemPrompt, recentHistory);

        // 保存助手回复
        Map<String, String> assistantMsg = new HashMap<>();
        assistantMsg.put("role", "assistant");
        assistantMsg.put("content", reply);
        history.add(assistantMsg);

        // 构建结果
        Map<String, Object> result = new HashMap<>();
        result.put("reply", reply);
        result.put("playerState", playerState);

        return result;
    }

    /**
     * NPC对话
     */
    public Map<String, Object> npcChat(String sessionId, String bookId, String npcName, String message) {
        Map<String, Object> playerState = playerStates.getOrDefault(sessionId, new HashMap<>());
        int affinity = (int) playerState.getOrDefault("affinity", 50);

        // 构建NPC人设提示
        String npcPrompt = buildNPCPrompt(npcName, bookId, affinity);

        // 调用API
        String reply = callQwenAPI(message, npcPrompt);

        Map<String, Object> result = new HashMap<>();
        result.put("reply", reply);
        result.put("npc", npcName);

        return result;
    }

    /**
     * 叙事推进
     */
    public Map<String, Object> narrativeChat(String sessionId, String bookId, String playerAction) {
        Map<String, Object> playerState = playerStates.getOrDefault(sessionId, new HashMap<>());

        // 构建叙事提示
        String narrativePrompt = buildNarrativePrompt(bookId, playerState);

        // 调用API
        String reply = callQwenAPI(playerAction, narrativePrompt);

        Map<String, Object> result = new HashMap<>();
        result.put("narrative", reply);

        return result;
    }

    // ==================== Prompt构建 ====================

    private String buildOpeningPrompt(String bookId) {
        String bookTitle = getBookTitle(bookId);
        String worldView = getBookWorldView(bookId);
        return "你正在穿越到《" + bookTitle + "》的世界。世界观：" + worldView + "。请用生动的第二人称描述穿越后的开场场景。";
    }

    private String buildSystemPrompt(String bookId, Map<String, Object> playerState) {
        String bookTitle = getBookTitle(bookId);
        String worldView = getBookWorldView(bookId);

        return "你是穿越到《" + bookTitle + "》世界中的【随身系统】。\n\n" +
                "## 你的角色\n" +
                "- 你是玩家穿越后获得的神秘系统\n" +
                "- 你负责：提醒玩家当前处境、提供任务指引、在紧急时刻发出警告\n" +
                "- 你的语气神秘但友善，偶尔带点吐槽\n\n" +
                "## 当前书籍信息\n" +
                "- 书名：《" + bookTitle + "》\n" +
                "- 世界观：" + worldView + "\n\n" +
                "## 玩家当前状态\n" +
                "- 角色名：" + playerState.getOrDefault("name", "穿越者") + "\n" +
                "- 当前身份：" + playerState.getOrDefault("identity", "外门弟子") + "\n" +
                "- 所在地点：" + playerState.getOrDefault("location", "黄枫谷") + "\n" +
                "- 当前任务：" + playerState.getOrDefault("currentTask", "了解当前处境") + "\n" +
                "- 修炼境界：" + playerState.getOrDefault("cultivation", "炼气期一层") + "\n" +
                "- 好感度：" + playerState.getOrDefault("affinity", 50) + "\n\n" +
                "## 回复格式要求\n" +
                "1. 每次回复开头用 [系统提示] 标记\n" +
                "2. 提供当前状态概览\n" +
                "3. 给出2-3个可选行动建议\n" +
                "4. 如果有危险，用 ⚠️ 标记紧急提醒\n" +
                "5. 回复控制在300字以内";
    }

    private String buildNPCPrompt(String npcName, String bookId, int affinity) {
        String bookTitle = getBookTitle(bookId);
        String personality = getNPCPersonality(npcName);
        String speechStyle = getNPCSpeechStyle(npcName);

        String attitude;
        if (affinity < 30) attitude = "冷淡、警惕";
        else if (affinity < 70) attitude = "正常、礼貌";
        else attitude = "友好、亲近";

        return "你是《" + bookTitle + "》中的角色【" + npcName + "】。\n\n" +
                "## 角色设定\n" +
                "- 性格：" + personality + "\n" +
                "- 说话风格：" + speechStyle + "\n" +
                "- 当前好感度：" + affinity + "（0-100，影响态度）\n\n" +
                "## 对话规则\n" +
                "1. 严格用角色的口吻说话，不要跳出角色\n" +
                "2. 不要说"作为NPC"或"我是AI"之类的话\n" +
                "3. 根据好感度调整态度：" + attitude + "\n" +
                "4. 不要主动透露关键剧情信息\n" +
                "5. 回复控制在100字以内\n" +
                "6. 可以适当加入动作描写，如"（微微皱眉）"';
    }

    private String buildNarrativePrompt(String bookId, Map<String, Object> playerState) {
        String bookTitle = getBookTitle(bookId);
        String worldView = getBookWorldView(bookId);

        return "你是一个互动小说叙述者，正在讲述《" + bookTitle + "》的故事。\n\n" +
                "## 世界观\n" + worldView + "\n\n" +
                "## 玩家状态\n" +
                "- 角色：" + playerState.getOrDefault("name", "穿越者") + "\n" +
                "- 身份：" + playerState.getOrDefault("identity", "外门弟子") + "\n" +
                "- 地点：" + playerState.getOrDefault("location", "黄枫谷") + "\n" +
                "- 任务：" + playerState.getOrDefault("currentTask", "探索中") + "\n\n" +
                "## 叙事规则\n" +
                "1. 用生动的第二人称描写场景和行动\n" +
                "2. 根据玩家的选择推进剧情\n" +
                "3. 适当加入环境描写和氛围渲染\n" +
                "4. 可以引入NPC互动\n" +
                "5. 每次叙述后提供2-3个行动选项\n" +
                "6. 叙述控制在400字以内";
    }

    // ==================== 书籍数据 ====================

    private String getBookTitle(String bookId) {
        Map<String, String> titles = Map.of(
                "xianxia.fanRenXiuXianZhuan", "凡人修仙传",
                "xianxia.douPoCangQiong", "斗破苍穹",
                "xianxia.zheTian", "遮天",
                "xianxia.wanMeiShiJie", "完美世界",
                "xianxia.xianNi", "仙逆",
                "scifi.sanTi", "三体",
                "scifi.liuLangDiQiu", "流浪地球",
                "scifi.jiDi", "基地",
                "romance.weiWeiYiXiaoHenQingCheng", "微微一笑很倾城",
                "romance.heYiShengXiaoMo", "何以笙箫默"
        );
        return titles.getOrDefault(bookId, "未知书籍");
    }

    private String getBookWorldView(String bookId) {
        if (bookId.contains("fanRenXiuXianZhuan") || bookId.contains("douPoCangQiong") || bookId.contains("zheTian")) {
            return "修仙世界，分为炼气、筑基、结丹、元婴、化神等境界。宗门林立，弱肉强食。";
        } else if (bookId.contains("sanTi") || bookId.contains("liuLangDiQiu")) {
            return "科幻世界，人类文明面临宇宙级别的生存挑战。";
        } else if (bookId.contains("weiWei") || bookId.contains("heYi")) {
            return "现代都市，校园与职场交织的爱情故事。";
        }
        return "一个充满奇幻色彩的世界。";
    }

    private List<Map<String, String>> getNPCsForBook(String bookId) {
        List<Map<String, String>> npcs = new ArrayList<>();
        if (bookId.contains("fanRenXiuXianZhuan")) {
            npcs.add(Map.of("name", "韩立", "personality", "沉稳内敛、谨慎小心"));
            npcs.add(Map.of("name", "南宫婉", "personality", "高贵冷艳、外冷内热"));
        } else if (bookId.contains("douPoCangQiong")) {
            npcs.add(Map.of("name", "萧炎", "personality", "坚韧、有仇必报"));
        } else if (bookId.contains("sanTi")) {
            npcs.add(Map.of("name", "罗辑", "personality", "看似玩世不恭实则深藏智慧"));
        } else if (bookId.contains("weiWei")) {
            npcs.add(Map.of("name", "肖奈", "personality", "高冷、聪明"));
        }
        return npcs;
    }

    private String getNPCPersonality(String name) {
        Map<String, String> personalities = Map.of(
                "韩立", "沉稳内敛、谨慎小心、重情义",
                "南宫婉", "高贵冷艳、外冷内热",
                "萧炎", "坚韧不拔、有仇必报、重情义",
                "罗辑", "看似玩世不恭实则深藏智慧",
                "肖奈", "高冷、聪明、对游戏有天赋"
        );
        return personalities.getOrDefault(name, "性格未知");
    }

    private String getNPCSpeechStyle(String name) {
        Map<String, String> styles = Map.of(
                "韩立", "简洁、偶尔带点怀疑、不说废话",
                "南宫婉", "优雅、简洁、偶尔带傲气",
                "萧炎", "直接、热血、偶尔霸气",
                "罗辑", "幽默、偶尔严肃",
                "肖奈", "简洁、偶尔带幽默"
        );
        return styles.getOrDefault(name, "说话风格未知");
    }

    // ==================== API调用 ====================

    private String callQwenAPI(String userMessage, String systemPrompt) {
        try {
            JsonObject requestBody = new JsonObject();
            requestBody.addProperty("model", model);

            JsonArray messages = new JsonArray();

            JsonObject sysMsg = new JsonObject();
            sysMsg.addProperty("role", "system");
            sysMsg.addProperty("content", systemPrompt);
            messages.add(sysMsg);

            JsonObject userMsg = new JsonObject();
            userMsg.addProperty("role", "user");
            userMsg.addProperty("content", userMessage);
            messages.add(userMsg);

            requestBody.add("messages", messages);
            requestBody.addProperty("temperature", 0.8);
            requestBody.addProperty("max_tokens", 1000);

            return sendRequest(requestBody.toString());

        } catch (Exception e) {
            System.err.println("API调用失败: " + e.getMessage());
            return "【系统错误】AI服务暂时不可用，请稍后重试。";
        }
    }

    private String callQwenAPIWithHistory(String systemPrompt, List<Map<String, String>> history) {
        try {
            JsonObject requestBody = new JsonObject();
            requestBody.addProperty("model", model);

            JsonArray messages = new JsonArray();

            JsonObject sysMsg = new JsonObject();
            sysMsg.addProperty("role", "system");
            sysMsg.addProperty("content", systemPrompt);
            messages.add(sysMsg);

            for (Map<String, String> msg : history) {
                JsonObject m = new JsonObject();
                m.addProperty("role", msg.get("role"));
                m.addProperty("content", msg.get("content"));
                messages.add(m);
            }

            requestBody.add("messages", messages);
            requestBody.addProperty("temperature", 0.8);
            requestBody.addProperty("max_tokens", 1000);

            return sendRequest(requestBody.toString());

        } catch (Exception e) {
            System.err.println("API调用失败: " + e.getMessage());
            return "【系统错误】AI服务暂时不可用，请稍后重试。";
        }
    }

    private String sendRequest(String jsonBody) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .timeout(Duration.ofSeconds(60))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            System.err.println("API返回错误: " + response.statusCode() + " - " + response.body());
            return "【系统错误】API调用失败，状态码：" + response.statusCode();
        }

        JsonObject jsonResponse = gson.fromJson(response.body(), JsonObject.class);
        JsonArray choices = jsonResponse.getAsJsonArray("choices");
        if (choices != null && choices.size() > 0) {
            JsonObject message = choices.get(0).getAsJsonObject().getAsJsonObject("message");
            if (message != null) {
                return message.get("content").getAsString();
            }
        }

        return "【系统错误】无法解析AI回复";
    }
}
