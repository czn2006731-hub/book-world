package com.bookemulator.controller;

import com.bookemulator.model.ChatRequest;
import com.bookemulator.service.AIService;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SystemController {

    private final AIService aiService;
    private final Gson gson = new Gson();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    @Value("${qwen.api-key}")
    private String apiKey;

    @Value("${qwen.base-url}")
    private String baseUrl;

    @Value("${qwen.mojuren-voice-id:mojuren}")
    private String mojurenVoiceId;

    private static String cachedMojurenBase64 = null;

    public SystemController(AIService aiService) {
        this.aiService = aiService;
    }

    /**
     * TTS 语音合成
     * 前端调用: POST /api/tts
     * 请求体: { message, npcName, playerAction, cloneName }
     * 返回: { audioBase64 }
     */
    @PostMapping("/tts")
    public Map<String, Object> tts(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        String message = body.getOrDefault("message", "");
        String npcName = body.getOrDefault("npcName", "Cherry");
        String cloneName = body.getOrDefault("cloneName", "");

        if (message.isEmpty()) {
            result.put("audioBase64", "");
            return result;
        }

        try {
            String voice = !cloneName.isEmpty() ? cloneName : npcName;
            String audioBase64 = callDashScopeTts(message, voice);
            result.put("audioBase64", audioBase64);
        } catch (Exception e) {
            System.err.println("[TTS] 语音合成失败: " + e.getMessage());
            result.put("audioBase64", "");
        }

        return result;
    }

    /**
     * 系统AI对话（与 /api/chat/system 功能一致，路径不同以适配前端）
     * 前端调用: POST /api/system/help
     */
    @PostMapping("/system/help")
    public Map<String, Object> systemHelp(@RequestBody ChatRequest request) {
        return aiService.systemChat(
                request.getSessionId(),
                request.getBookId(),
                request.getMessage()
        );
    }

    /**
     * 道具解释 AI
     * 前端调用: POST /api/system/item
     * 请求体: { sessionId, bookId, message(道具名), npcName, playerAction }
     * 返回: { explanation }
     */
    @PostMapping("/system/item")
    public Map<String, Object> systemItem(@RequestBody ChatRequest request) {
        Map<String, Object> result = new HashMap<>();
        String itemName = request.getMessage();

        if (itemName == null || itemName.isEmpty()) {
            result.put("explanation", "未检测到道具信息。");
            return result;
        }

        String prompt = "你是一个修仙世界的系统助手。请为玩家详细解释以下修仙道具的来历、用途与功效：\n\n" +
                "道具名称：" + itemName + "\n\n" +
                "要求：\n" +
                "1. 用修仙小说风格描述（仿《凡人修仙传》忘语笔风）\n" +
                "2. 包含道具来历、品阶、功效、使用建议\n" +
                "3. 控制在 80-150 字以内\n" +
                "4. 开头用「【系统鉴定】」标记";

        String systemRole = "你是一个冰冷的修仙系统AI，负责鉴定和解释法宝灵丹。语气机械精准，带有科技感。";

        String reply = callQwenApi(prompt, systemRole);
        result.put("explanation", reply);
        return result;
    }

    // ==================== DashScope TTS API 调用 ====================

    private String callDashScopeTts(String text, String voice) throws IOException, InterruptedException {
        // DashScope CosyVoice TTS API
        // 文档: https://help.aliyun.com/zh/model-studio/developer-reference/tts-api
        String ttsUrl = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2audio/generation";

        JsonObject inputObj = new JsonObject();
        inputObj.addProperty("text", text);

        JsonObject paramsObj = new JsonObject();
        String mappedVoice = mapVoiceName(voice);
        paramsObj.addProperty("voice", mappedVoice);
        paramsObj.addProperty("volume", 50);
        paramsObj.addProperty("pitch", 0);

        // 如果是墨居仁语音克隆请求，自动读取本地 mojuren.mp3 提取音色特征 (Zero-Shot 零样本实时音色克隆)
        if ("mojuren".equalsIgnoreCase(voice) || mappedVoice.equalsIgnoreCase(mojurenVoiceId)) {
            String sampleAudioBase64 = loadMojurenSampleAudioBase64();
            if (sampleAudioBase64 != null && !sampleAudioBase64.isEmpty()) {
                inputObj.addProperty("prompt_audio", "data:audio/mp3;base64," + sampleAudioBase64);
                // 开启 DashScope CosyVoice 声音克隆
                System.out.println("[TTS] 已载入 mojuren.mp3 样本进行 DashScope 实时声音克隆！");
            }
        }

        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", "cosyvoice-v1");
        requestBody.add("input", inputObj);
        requestBody.add("parameters", paramsObj);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ttsUrl))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .timeout(Duration.ofSeconds(30))
                .build();

        HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

        if (response.statusCode() == 200) {
            // DashScope TTS 直接返回音频二进制流
            return Base64.getEncoder().encodeToString(response.body());
        } else {
            String errorBody = new String(response.body(), StandardCharsets.UTF_8);
            System.err.println("[TTS] DashScope返回错误 " + response.statusCode() + ": " + errorBody);
            return "";
        }
    }

    /**
     * 自动读取本地 mojuren.mp3 音频样本，供 DashScope CosyVoice API 进行声音克隆
     */
    private String loadMojurenSampleAudioBase64() {
        if (cachedMojurenBase64 != null) {
            return cachedMojurenBase64;
        }
        String[] candidatePaths = {
            "audio/quotes/mojuren.mp3",
            "../audio/quotes/mojuren.mp3",
            "../../audio/quotes/mojuren.mp3",
            "../BookEmulator/audio/quotes/mojuren.mp3",
            "D:/code/personal/BookEmulator/audio/quotes/mojuren.mp3"
        };
        for (String pathStr : candidatePaths) {
            java.io.File file = new java.io.File(pathStr);
            if (file.exists() && file.isFile()) {
                try {
                    byte[] bytes = java.nio.file.Files.readAllBytes(file.toPath());
                    cachedMojurenBase64 = Base64.getEncoder().encodeToString(bytes);
                    return cachedMojurenBase64;
                } catch (Exception e) {
                    System.err.println("[TTS] 读取墨居仁音频样本失败 (" + pathStr + "): " + e.getMessage());
                }
            }
        }
        System.err.println("[TTS] 未能找到 mojuren.mp3 音频样本文件。");
        return null;
    }

    /**
     * 将前端传来的语音名称映射为 DashScope CosyVoice 支持的音色 ID 或自定义克隆 Voice ID
     */
    private String mapVoiceName(String name) {
        if (name == null || name.isEmpty()) return "Cherry";
        String lower = name.toLowerCase();
        return switch (lower) {
            case "system", "cherry" -> "Cherry";
            case "male" -> "Ethan";
            case "female" -> "Cherry";
            case "mojuren" -> mojurenVoiceId;
            default -> name; // 允许直接传入阿里云 DashScope / 百炼平台生成的任意声音克隆 Voice ID
        };
    }

    // ==================== 通义千问 API 通用调用 ====================

    private String callQwenApi(String userMessage, String systemPrompt) {
        try {
            JsonObject requestBody = new JsonObject();
            requestBody.addProperty("model", "qwen-plus");

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
            requestBody.addProperty("max_tokens", 500);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                    .timeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
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
        } catch (Exception e) {
            System.err.println("[SystemItem] API调用失败: " + e.getMessage());
            return "【系统错误】AI服务暂时不可用，请稍后重试。";
        }
    }
}
