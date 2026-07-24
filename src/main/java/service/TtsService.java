package service;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;

public class TtsService {

    private final String apiKey;
    private final String ttsUrl;
    private final String enrollmentUrl;
    private final String defaultModel;
    private final String vcModel;
    private final String defaultVoice;

    // 缓存所有克隆声音名字 -> voice_id
    private final Map<String, String> cloneVoiceIds = new HashMap<>();

    public TtsService(String apiKey, String ttsUrl, String defaultModel, String vcModel, String defaultVoice, Properties configProps) {
        this.apiKey = apiKey;
        this.ttsUrl = ttsUrl;
        this.defaultModel = defaultModel;
        this.vcModel = (vcModel != null && !vcModel.isEmpty()) ? vcModel : "qwen3-tts-vc-2026-01-22";
        this.defaultVoice = defaultVoice;
        this.enrollmentUrl = extractBaseUrl(ttsUrl) + "/api/v1/services/audio/tts/customization";
        
        loadClones(configProps);
    }

    private static String extractBaseUrl(String url) {
        int tripleSlash = url.indexOf("://");
        if (tripleSlash < 0) return url;
        int pathStart = url.indexOf('/', tripleSlash + 3);
        if (pathStart < 0) return url;
        return url.substring(0, pathStart);
    }

    private void loadClones(Properties props) {
        // 读取缓存的 voice_ids
        Properties cachedProps = readCachedVoiceIds();

        String clonesStr = props.getProperty("dashscope.clones", "");
        if (clonesStr.isEmpty()) {
            System.out.println("[TTS] 没有配置克隆声音列表");
            return;
        }

        String[] cloneNames = clonesStr.split(",");
        boolean cacheUpdated = false;

        for (String name : cloneNames) {
            name = name.trim();
            if (name.isEmpty()) continue;

            // 1. 尝试从本地缓存读取
            String voiceId = cachedProps.getProperty(name);
            if (voiceId != null && !voiceId.isEmpty()) {
                cloneVoiceIds.put(name, voiceId);
                System.out.println("[TTS] 已加载缓存克隆声音: " + name + " -> " + voiceId);
                continue;
            }

            // 2. 尝试从 classpath 加载音频文件
            byte[] audioBytes = null;
            try {
                InputStream is = TtsService.class.getClassLoader().getResourceAsStream("audio/" + name + ".mp3");
                if (is != null) {
                    audioBytes = is.readAllBytes();
                    is.close();
                }
            } catch (Exception e) {
                System.err.println("[TTS] 读取克隆音频 [" + name + ".mp3] 失败: " + e.getMessage());
            }

            if (audioBytes == null) {
                System.out.println("[TTS] 未找到音频文件: audio/" + name + ".mp3，跳过注册");
                continue;
            }

            // 获取参考文本
            String refText = props.getProperty("dashscope.clone." + name + ".text", "");
            if (refText.isEmpty()) {
                System.err.println("[TTS] 未配置克隆声音 [" + name + "] 的参考文本 (dashscope.clone." + name + ".text)");
                continue;
            }

            // 3. 调用 API 注册
            System.out.println("[TTS] 正在注册声音复刻: " + name + " ...");
            try {
                String base64 = Base64.getEncoder().encodeToString(audioBytes);
                voiceId = enrollVoice(name, base64, refText);
                if (voiceId != null && !voiceId.isEmpty()) {
                    cloneVoiceIds.put(name, voiceId);
                    cachedProps.setProperty(name, voiceId);
                    cacheUpdated = true;
                    System.out.println("[TTS] 声音复刻 [" + name + "] 成功, voice_id: " + voiceId);
                }
            } catch (Exception e) {
                System.err.println("[TTS] 声音复刻 [" + name + "] 失败: " + e.getMessage());
                e.printStackTrace();
            }
        }

        if (cacheUpdated) {
            saveCachedVoiceIds(cachedProps);
        }
    }

    private String enrollVoice(String name, String audioBase64, String refText) throws Exception {
        String dataUri = "data:audio/mpeg;base64," + audioBase64;

        StringBuilder json = new StringBuilder();
        json.append("{\"model\":\"qwen-voice-enrollment\",");
        json.append("\"input\":{");
        json.append("\"action\":\"create\",");
        json.append("\"target_model\":\"").append(escapeJson(vcModel)).append("\",");
        json.append("\"preferred_name\":\"").append(escapeJson(name)).append("\",");
        json.append("\"audio\":{\"data\":\"").append(escapeJson(dataUri)).append("\"}");
        json.append("}}");

        String body = json.toString();
        HttpURLConnection conn = (HttpURLConnection) new URL(enrollmentUrl).openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setDoOutput(true);
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(30000);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.getBytes(StandardCharsets.UTF_8));
        }

        int code = conn.getResponseCode();
        InputStream is = (code >= 200 && code < 300) ? conn.getInputStream() : conn.getErrorStream();
        String response = new String(is.readAllBytes(), "UTF-8");

        if (code != 200) {
            throw new Exception("声音复刻 API error (" + code + "): " + response);
        }

        String voice = extractJsonString(response, "voice");
        if (voice == null || voice.isEmpty()) {
            throw new Exception("声音复刻返回没有 voice 字段: " + response);
        }
        return voice;
    }

    private Properties readCachedVoiceIds() {
        Properties cachedProps = new Properties();
        try {
            Path dir = Paths.get(System.getProperty("user.home"), ".bookemu");
            Path file = dir.resolve("voice_clones.properties");
            if (Files.exists(file)) {
                try (InputStream in = Files.newInputStream(file)) {
                    cachedProps.load(in);
                }
            }
        } catch (Exception e) {
            // ignore
        }
        return cachedProps;
    }

    private void saveCachedVoiceIds(Properties cachedProps) {
        try {
            Path dir = Paths.get(System.getProperty("user.home"), ".bookemu");
            Files.createDirectories(dir);
            Path file = dir.resolve("voice_clones.properties");
            try (OutputStream out = Files.newOutputStream(file)) {
                cachedProps.store(out, "Cached voice IDs for BookEmulator");
            }
        } catch (Exception e) {
            System.err.println("[TTS] 缓存 voice_ids 失败: " + e.getMessage());
        }
    }

    public String synthesize(String text, String voice, String instruction) throws Exception {
        return synthesize(text, voice, instruction, null);
    }

    public String synthesize(String text, String voice, String instruction, String cloneName) throws Exception {
        // 如果指定了克隆名字且我们成功注册并拥有其 voice_id，走 VC 声音克隆流程
        String voiceId = (cloneName != null) ? cloneVoiceIds.get(cloneName) : null;
        if (voiceId != null && !voiceId.isEmpty()) {
            return synthesizeVc(text, voiceId, instruction);
        }
        // 否则，走普通声音流程 (即使指定了 cloneName 也可以退回到普通的 system 声音，更健壮)
        return synthesizeNormal(text, voice, instruction);
    }

    private String synthesizeVc(String text, String voiceId, String instruction) throws Exception {
        Map<String, Object> root = new LinkedHashMap<>();
        root.put("model", vcModel);

        Map<String, Object> input = new LinkedHashMap<>();
        input.put("text", text);
        input.put("voice", voiceId);
        root.put("input", input);

        return callTtsApi(root);
    }

    private String synthesizeNormal(String text, String voice, String instruction) throws Exception {
        String v = (voice != null && !voice.isEmpty()) ? voice : this.defaultVoice;

        Map<String, Object> root = new LinkedHashMap<>();
        root.put("model", defaultModel);

        Map<String, Object> input = new LinkedHashMap<>();
        input.put("text", text);
        input.put("voice", v);
        root.put("input", input);

        // Only instruct models accept the instruction parameter. Flash and VC
        // models reject it instead of silently ignoring it.
        if (defaultModel.contains("instruct") && instruction != null && !instruction.isEmpty()) {
            Map<String, Object> params = new LinkedHashMap<>();
            params.put("instruction", instruction);
            root.put("parameters", params);
        }

        return callTtsApi(root);
    }

    private String callTtsApi(Map<String, Object> root) throws Exception {
        String body = toJson(root);

        HttpURLConnection conn = (HttpURLConnection) new URL(ttsUrl).openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setDoOutput(true);
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(30000);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.getBytes(StandardCharsets.UTF_8));
        }

        int code = conn.getResponseCode();
        InputStream is = (code >= 200 && code < 300) ? conn.getInputStream() : conn.getErrorStream();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buf = new byte[4096];
        int n;
        while ((n = is.read(buf)) != -1) {
            baos.write(buf, 0, n);
        }
        String response = baos.toString("UTF-8");

        if (code != 200) {
            throw new Exception("TTS API error (" + code + "): " + response);
        }

        String audioUrl = extractAudioUrl(response);
        if (audioUrl == null) {
            throw new Exception("TTS API returned no audio URL: " + response);
        }

        byte[] audioBytes = downloadAudio(audioUrl);
        return Base64.getEncoder().encodeToString(audioBytes);
    }

    public boolean hasClone(String name) {
        if (name == null) return false;
        return cloneVoiceIds.containsKey(name);
    }

    private byte[] downloadAudio(String audioUrl) throws Exception {
        HttpURLConnection conn = (HttpURLConnection) new URL(audioUrl).openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(30000);

        int code = conn.getResponseCode();
        if (code != 200) {
            throw new Exception("Audio download failed: " + code);
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buf = new byte[4096];
        int n;
        while ((n = conn.getInputStream().read(buf)) != -1) {
            baos.write(buf, 0, n);
        }
        return baos.toByteArray();
    }

    private String extractAudioUrl(String json) {
        int urlIdx = json.indexOf("\"url\"");
        if (urlIdx == -1) return null;
        int startQuote = json.indexOf('"', urlIdx + 5);
        if (startQuote == -1) return null;
        int endQuote = findClosingQuote(json, startQuote + 1);
        if (endQuote == -1) return null;
        return json.substring(startQuote + 1, endQuote);
    }

    private String extractJsonString(String json, String key) {
        String search = "\"" + key + "\"";
        int idx = json.indexOf(search);
        if (idx == -1) return null;
        int colonIdx = json.indexOf(':', idx + search.length());
        if (colonIdx == -1) return null;
        int startQuote = json.indexOf('"', colonIdx + 1);
        if (startQuote == -1) return null;
        int endQuote = findClosingQuote(json, startQuote + 1);
        if (endQuote == -1) return null;
        return json.substring(startQuote + 1, endQuote);
    }

    private int findClosingQuote(String s, int from) {
        for (int i = from; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\') { i++; continue; }
            if (c == '"') return i;
        }
        return -1;
    }

    @SuppressWarnings("unchecked")
    private String toJson(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder();
        toJsonValue(sb, map);
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private void toJsonValue(StringBuilder sb, Object value) {
        if (value == null) {
            sb.append("null");
        } else if (value instanceof String) {
            sb.append('"').append(escapeJson((String) value)).append('"');
        } else if (value instanceof Number || value instanceof Boolean) {
            sb.append(value);
        } else if (value instanceof Map) {
            sb.append('{');
            Map<String, Object> m = (Map<String, Object>) value;
            boolean first = true;
            for (Map.Entry<String, Object> e : m.entrySet()) {
                if (!first) sb.append(',');
                sb.append('"').append(escapeJson(e.getKey())).append("\":");
                toJsonValue(sb, e.getValue());
                first = false;
            }
            sb.append('}');
        } else if (value instanceof List) {
            sb.append('[');
            List<Object> list = (List<Object>) value;
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(',');
                toJsonValue(sb, list.get(i));
            }
            sb.append(']');
        } else {
            sb.append('"').append(escapeJson(String.valueOf(value))).append('"');
        }
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
