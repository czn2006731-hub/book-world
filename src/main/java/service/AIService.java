package service;

import game.PlayerState;
import game.StoryData;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AIService {

    private String apiKey;
    private String baseUrl;
    private String model;

    public AIService(String apiKey, String baseUrl, String model) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.model = model;
    }

    public String callInitAPI(String bookId, PlayerState state) {
        String bookTitle = StoryData.getBookTitle(bookId);
        String worldView = StoryData.getWorldView(bookId);
        String prompt = "你正在穿越到《" + bookTitle + "》的世界。世界观：" + worldView + "。请用生动的第二人称描述穿越后的开场场景。";
        String systemPrompt = "你是一个游戏开场叙述者，用生动的语言描述玩家穿越后的第一印象，大约200字左右。";
        return callQwenAPI(prompt, systemPrompt);
    }

    public String callSystemChat(String bookId, PlayerState state, String message) {
        String bookTitle = StoryData.getBookTitle(bookId);
        String worldView = StoryData.getWorldView(bookId);

        String systemPrompt = "你是穿越到《" + bookTitle + "》世界中的随身系统。\n\n" +
                "你的角色：你是玩家穿越后获得的神秘系统，负责提醒玩家当前处境、提供任务指引。\n\n" +
                "当前书籍信息：\n- 书名：《" + bookTitle + "》\n- 世界观：" + worldView + "\n\n" +
                "玩家当前状态：\n- 角色名：" + state.getName() + "\n- 当前身份：" + state.getIdentity() + "\n" +
                "- 所在地点：" + state.getLocation() + "\n- 当前任务：" + state.getCurrentTask() + "\n" +
                "- 修炼境界：" + state.getCultivation() + "\n\n" +
                "回复格式要求：\n1. 每次回复开头用 [系统提示] 标记\n2. 提供当前状态概览\n" +
                "3. 给出2-3个可选行动建议\n4. 如果有危险，用 ⚠️ 标记紧急提醒\n5. 回复控制在300字以内";

        return callQwenAPI(message, systemPrompt);
    }

    public String callNpcChat(String bookId, String npcName, String message, PlayerState state) {
        String bookTitle = StoryData.getBookTitle(bookId);
        int affinity = state != null ? state.getAffinity() : 50;
        String personality = StoryData.getNPCPersonality(npcName);
        String speechStyle = StoryData.getNPCPersonality(npcName);

        String attitude;
        if (affinity < 30) attitude = "冷淡、警惕";
        else if (affinity < 70) attitude = "正常、礼貌";
        else attitude = "友好、亲近";

        String systemPrompt = "你是《" + bookTitle + "》中的角色【" + npcName + "】。\n\n" +
                "角色设定：\n- 性格：" + personality + "\n- 说话风格：" + speechStyle + "\n" +
                "- 当前好感度：" + affinity + "（0-100，影响态度）\n\n" +
                "对话规则：\n1. 严格用角色的口吻说话，不要跳出角色\n" +
                "2. 不要说\"作为NPC\"或\"我是AI\"之类的话\n" +
                "3. 根据好感度调整态度：" + attitude + "\n" +
                "4. 不要主动透露关键剧情信息\n" +
                "5. 回复控制在100字以内\n" +
                "6. 可以适当加入动作描写";

        return callQwenAPI(message, systemPrompt);
    }

    public String callNarrativeChat(String bookId, PlayerState state, String playerAction) {
        String bookTitle = StoryData.getBookTitle(bookId);
        String worldView = StoryData.getWorldView(bookId);

        String systemPrompt = "你是一个互动小说叙述者，正在讲述《" + bookTitle + "》的故事。\n\n" +
                "世界观：" + worldView + "\n\n" +
                "玩家状态：\n- 角色：" + state.getName() + "\n- 身份：" + state.getIdentity() + "\n" +
                "- 地点：" + state.getLocation() + "\n- 任务：" + state.getCurrentTask() + "\n\n" +
                "叙事规则：\n1. 用生动的第二人称描写场景和行动\n2. 根据玩家的选择推进剧情\n" +
                "3. 适当加入环境描写和氛围渲染\n4. 可以引入NPC互动\n" +
                "5. 每次叙述后提供2-3个行动选项\n6. 叙述控制在400字以内";

        return callQwenAPI(playerAction, systemPrompt);
    }

    private String callQwenAPI(String userMessage, String systemPrompt) {
        return chat(userMessage, systemPrompt);
    }

    public String chat(String userMessage, String systemPrompt) {
        try {
            StringBuilder json = new StringBuilder();
            json.append("{\"model\":\"").append(escapeJson(model)).append("\",");
            json.append("\"messages\":[");
            json.append("{\"role\":\"system\",\"content\":\"").append(escapeJson(systemPrompt)).append("\"},");
            json.append("{\"role\":\"user\",\"content\":\"").append(escapeJson(userMessage)).append("\"}");
            json.append("],\"temperature\":0.8,\"max_tokens\":1000}");

            return sendRequest(json.toString());
        } catch (Exception e) {
            System.err.println("API调用失败: " + e.getMessage());
            return "【系统错误】AI服务暂时不可用，请稍后重试。";
        }
    }

    private String sendRequest(String jsonBody) throws IOException {
        URL url = new URL(baseUrl + "/chat/completions");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setDoOutput(true);
        conn.setConnectTimeout(60000);
        conn.setReadTimeout(60000);

        OutputStream os = conn.getOutputStream();
        os.write(jsonBody.getBytes(StandardCharsets.UTF_8));
        os.close();

        int code = conn.getResponseCode();
        InputStream is = (code >= 200 && code < 300) ? conn.getInputStream() : conn.getErrorStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        reader.close();

        if (code != 200) {
            System.err.println("API返回错误: " + code + " - " + sb);
            return "【系统错误】API调用失败，状态码：" + code;
        }

        return extractContentFromResponse(sb.toString());
    }

    private String extractContentFromResponse(String jsonResponse) {
        int idx = jsonResponse.indexOf("\"content\"");
        if (idx == -1) return "【系统错误】无法解析AI回复";

        int colonIdx = jsonResponse.indexOf(':', idx);
        if (colonIdx == -1) return "【系统错误】无法解析AI回复";

        int startQuote = jsonResponse.indexOf('"', colonIdx + 1);
        if (startQuote == -1) return "【系统错误】无法解析AI回复";

        int endQuote = findClosingQuote(jsonResponse, startQuote + 1);
        if (endQuote == -1) return jsonResponse.substring(startQuote + 1);

        String content = jsonResponse.substring(startQuote + 1, endQuote);
        return unescapeJson(content);
    }

    private int findClosingQuote(String s, int from) {
        for (int i = from; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\') {
                i++;
                continue;
            }
            if (c == '"') return i;
        }
        return -1;
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    private String unescapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\t", "\t")
                .replace("\\\"", "\"")
                .replace("\\\\", "\\");
    }
}
