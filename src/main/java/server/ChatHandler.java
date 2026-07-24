package server;

import game.GameManager;
import game.SceneResult;
import game.StoryData;
import game.PlayerState;
import model.ChatRequest;
import service.AIService;
import service.TtsService;
import service.SystemService;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.net.SocketException;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class ChatHandler {

    private final AIService aiService;
    private final TtsService ttsService;
    private final SystemService systemService;

    public ChatHandler(AIService aiService, TtsService ttsService, SystemService systemService) {
        this.aiService = aiService;
        this.ttsService = ttsService;
        this.systemService = systemService;
    }

    public void handle(Socket socket) {
        try {
            InputStream rawIs = socket.getInputStream();
            BufferedInputStream bis = new BufferedInputStream(rawIs);

            // 读取请求行
            String requestLine = readLine(bis);
            if (requestLine == null) { socket.close(); return; }

            String[] parts = requestLine.split(" ");
            String method = parts.length > 0 ? parts[0] : "";
            String uri = parts.length > 1 ? parts[1] : "";

            // 读取请求头
            Map<String, String> headers = new HashMap<>();
            int contentLength = 0;
            String line;
            while ((line = readLine(bis)) != null && !line.isEmpty()) {
                int colon = line.indexOf(':');
                if (colon > 0) {
                    String key = line.substring(0, colon).trim().toLowerCase();
                    String value = line.substring(colon + 1).trim();
                    headers.put(key, value);
                    if (key.equals("content-length")) {
                        contentLength = Integer.parseInt(value);
                    }
                }
            }

            // 读取请求体
            String body = "";
            if (contentLength > 0) {
                byte[] buf = new byte[contentLength];
                int totalRead = 0;
                while (totalRead < contentLength) {
                    int read = bis.read(buf, totalRead, contentLength - totalRead);
                    if (read == -1) break;
                    totalRead += read;
                }
                body = new String(buf, 0, totalRead, StandardCharsets.UTF_8);
            }

            if (method.equals("OPTIONS")) {
                sendResponse(socket, 200, "");
                return;
            }

            String responseJson;
            int statusCode = 200;

            if (uri.equals("/api/chat/init") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                SceneResult result = GameManager.getInstance().initGame(req.getBookId(), req.getPlayerName());
                String sid = result.getExtra() != null ? (String) result.getExtra().get("sessionId") : "";
                req.setSessionId(sid);
                responseJson = buildInitResponse(result, req);
            } else if (uri.equals("/api/chat/choice") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                String sessionId = req.getSessionId();
                String bookId = req.getBookId();
                SceneResult result = GameManager.getInstance().processChoice(sessionId, bookId, 0, 0, 0, true);
                responseJson = buildChoiceResponse(result);
            } else if (uri.equals("/api/chat/narrative") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                SceneResult result = GameManager.getInstance().processChoice(req.getSessionId(), req.getBookId(), 0, 0, 0, true);
                responseJson = buildChoiceResponse(result);
            } else if (uri.equals("/api/chat/npc") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                String aiReply = aiService.callNpcChat(req.getBookId(), req.getNpcName(), req.getMessage(), GameManager.getInstance().getSession(req.getSessionId()));
                responseJson = "{\"reply\":\"" + escapeJson(aiReply) + "\",\"npc\":\"" + escapeJson(req.getNpcName()) + "\"}";
            } else if (uri.equals("/api/chat/system") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                String aiReply = aiService.callSystemChat(req.getBookId(), GameManager.getInstance().getSession(req.getSessionId()), req.getMessage());
                responseJson = "{\"reply\":\"" + escapeJson(aiReply) + "\"}";
            } else if (uri.equals("/api/chat/books")) {
                responseJson = buildBooksList();
            } else if (uri.equals("/api/chat/health")) {
                responseJson = "{\"status\":\"ok\",\"timestamp\":" + System.currentTimeMillis() + "}";
            } else if (uri.equals("/api/tts") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                String text = req.getMessage();
                String voice = req.getNpcName();
                String instruction = req.getPlayerAction();
                String cloneName = extractString(body, "cloneName");
                if (text == null || text.isEmpty()) {
                    statusCode = 400;
                    responseJson = "{\"error\":\"text is required\"}";
                } else {
                    try {
                        boolean hasClone = ttsService.hasClone(cloneName);
                        String audioBase64 = ttsService.synthesize(text, voice, instruction, cloneName);
                        responseJson = "{\"audioBase64\":\"" + audioBase64 + "\",\"format\":\"wav\",\"cloneUsed\":" + hasClone + "}";
                    } catch (Exception e) {
                        statusCode = 500;
                        responseJson = "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}";
                    }
                }
            } else if (uri.equals("/api/system/intro") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                String bookId = req.getBookId();
                String playerName = req.getPlayerName();
                long lastPlayTime = Long.parseLong(extractString(body, "lastPlayTime") != null ?
                        extractString(body, "lastPlayTime") : "0");
                int totalPlays = Integer.parseInt(extractString(body, "totalPlays") != null ?
                        extractString(body, "totalPlays") : "1");
                int deviationTotal = Integer.parseInt(extractString(body, "deviationTotal") != null ?
                        extractString(body, "deviationTotal") : "0");
                try {
                    PlayerState state = GameManager.getInstance().getSession(req.getSessionId());
                    String intro = systemService.getSystemIntro(bookId,
                            playerName != null ? playerName : "穿越者",
                            lastPlayTime, totalPlays, deviationTotal, state);
                    responseJson = "{\"intro\":\"" + escapeJson(intro) + "\"}";
                } catch (Exception e) {
                    statusCode = 500;
                    responseJson = "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}";
                }
            } else if (uri.equals("/api/system/help") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                String question = req.getMessage();
                String bookId = req.getBookId();
                if (question == null || question.isEmpty()) {
                    statusCode = 400;
                    responseJson = "{\"error\":\"question is required\"}";
                } else {
                    try {
                        PlayerState state = GameManager.getInstance().getSession(req.getSessionId());
                        String answer = systemService.answerQuestion(bookId, question, state);
                        responseJson = "{\"answer\":\"" + escapeJson(answer) + "\"}";
                    } catch (Exception e) {
                        statusCode = 500;
                        responseJson = "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}";
                    }
                }
            } else if (uri.equals("/api/system/item") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                String itemName = req.getMessage();
                String bookId = req.getBookId();
                String itemType = req.getNpcName();
                String itemDesc = req.getPlayerAction();
                if (itemName == null || itemName.isEmpty()) {
                    statusCode = 400;
                    responseJson = "{\"error\":\"item name is required\"}";
                } else {
                    try {
                        PlayerState state = GameManager.getInstance().getSession(req.getSessionId());
                        String explanation = systemService.explainItem(bookId, itemName,
                                itemType != null ? itemType : "物品",
                                itemDesc != null ? itemDesc : "",
                                state);
                        responseJson = "{\"explanation\":\"" + escapeJson(explanation) + "\"}";
                    } catch (Exception e) {
                        statusCode = 500;
                        responseJson = "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}";
                    }
                }
            } else if (uri.equals("/api/story/continue") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                String choiceLabel = req.getMessage();
                String bookId = req.getBookId();
                String bookTitle = req.getPlayerName();
                String currentScene = req.getPlayerAction();
                try {
                    PlayerState state = GameManager.getInstance().getSession(req.getSessionId());
                    String jsonResult = systemService.continueBookStory(bookId, 
                            bookTitle != null ? bookTitle : "书籍", 
                            currentScene, choiceLabel, state);
                    // 过滤可能包含的 markdown 标签
                    if (jsonResult.startsWith("```json")) {
                        jsonResult = jsonResult.substring(7);
                    }
                    if (jsonResult.startsWith("```")) {
                        jsonResult = jsonResult.substring(3);
                    }
                    if (jsonResult.endsWith("```")) {
                        jsonResult = jsonResult.substring(0, jsonResult.length() - 3);
                    }
                    responseJson = jsonResult.trim();
                } catch (Exception e) {
                    statusCode = 500;
                    responseJson = "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}";
                }
            } else if (uri.equals("/api/story/universal") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                String choiceLabel = req.getMessage();
                String bookId = req.getBookId();
                String bookTitle = req.getPlayerName();
                String author = req.getNpcName();
                String currentScene = req.getPlayerAction();
                try {
                    PlayerState state = GameManager.getInstance().getSession(req.getSessionId());
                    String narrative = systemService.generateUniversalLifeStory(bookId, 
                            bookTitle != null ? bookTitle : "书籍", 
                            author != null ? author : "作者", 
                            currentScene, choiceLabel, state);
                    responseJson = "{\"narrative\":\"" + escapeJson(narrative) + "\"}";
                } catch (Exception e) {
                    statusCode = 500;
                    responseJson = "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}";
                }
            } else if (uri.equals("/api/story/generate") && method.equals("POST")) {
                ChatRequest req = parseRequest(body);
                String choiceLabel = req.getMessage();
                String bookId = req.getBookId();
                String scene = req.getNpcName();
                String context = req.getPlayerAction();
                if (choiceLabel == null || choiceLabel.isEmpty()) {
                    statusCode = 400;
                    responseJson = "{\"error\":\"choice is required\"}";
                } else {
                    try {
                        PlayerState state = GameManager.getInstance().getSession(req.getSessionId());
                        String narrative = systemService.generateStory(bookId,
                                scene != null ? scene : "",
                                choiceLabel, false, state,
                                context != null ? context : "");
                        responseJson = "{\"narrative\":\"" + escapeJson(narrative) + "\"}";
                    } catch (Exception e) {
                        statusCode = 500;
                        responseJson = "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}";
                    }
                }
            } else {
                statusCode = 404;
                responseJson = "{\"error\":\"not found\"}";
            }

            sendResponse(socket, statusCode, responseJson);

        } catch (SocketException e) {
            // The browser may close a request while TTS is still being generated.
            // There is no client left to receive an error response in that case.
            System.out.println("[ChatHandler] 客户端已断开连接");
        } catch (Exception e) {
            System.err.println("请求处理错误: " + e.getMessage());
            e.printStackTrace();
            if (!socket.isClosed() && socket.isConnected()) {
                sendResponse(socket, 500, "{\"error\":\"" + escapeJson(e.getMessage()) + "\"}");
            }
        } finally {
            try { socket.close(); } catch (Exception e) { /* ignore */ }
        }
    }

    private ChatRequest parseRequest(String json) {
        ChatRequest req = new ChatRequest();
        req.setSessionId(extractString(json, "sessionId"));
        req.setBookId(extractString(json, "bookId"));
        req.setMessage(extractString(json, "message"));
        req.setPlayerName(extractString(json, "playerName"));
        req.setNpcName(extractString(json, "npcName"));
        req.setPlayerAction(extractString(json, "playerAction"));
        return req;
    }

    private String extractString(String json, String key) {
        String search = "\"" + key + "\"";
        int idx = json.indexOf(search);
        if (idx == -1) return null;
        int colonIdx = json.indexOf(':', idx + search.length());
        if (colonIdx == -1) return null;
        int startQuote = json.indexOf('"', colonIdx + 1);
        if (startQuote == -1) return null;
        int endQuote = findClosingQuote(json, startQuote + 1);
        if (endQuote == -1) return null;
        return unescapeJson(json.substring(startQuote + 1, endQuote));
    }

    private int extractInt(String json, String key, int defaultVal) {
        String search = "\"" + key + "\"";
        int idx = json.indexOf(search);
        if (idx == -1) return defaultVal;
        int colonIdx = json.indexOf(':', idx + search.length());
        if (colonIdx == -1) return defaultVal;
        int start = colonIdx + 1;
        while (start < json.length() && json.charAt(start) == ' ') start++;
        int end = start;
        while (end < json.length() && Character.isDigit(json.charAt(end))) end++;
        if (end == start) return defaultVal;
        try { return Integer.parseInt(json.substring(start, end)); }
        catch (NumberFormatException e) { return defaultVal; }
    }

    private boolean extractBool(String json, String key, boolean defaultVal) {
        String search = "\"" + key + "\"";
        int idx = json.indexOf(search);
        if (idx == -1) return defaultVal;
        int colonIdx = json.indexOf(':', idx + search.length());
        if (colonIdx == -1) return defaultVal;
        int start = colonIdx + 1;
        while (start < json.length() && json.charAt(start) == ' ') start++;
        if (json.startsWith("true", start)) return true;
        if (json.startsWith("false", start)) return false;
        return defaultVal;
    }

    private int findClosingQuote(String s, int from) {
        for (int i = from; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\') { i++; continue; }
            if (c == '"') return i;
        }
        return -1;
    }

    private String buildInitResponse(SceneResult result, ChatRequest req) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"sessionId\":\"").append(req.getSessionId() != null ? req.getSessionId() : "").append("\",");
        sb.append("\"narrative\":\"").append(escapeJson(result.getNarrative())).append("\",");
        sb.append("\"system\":\"").append(escapeJson(result.getSystemMsg())).append("\",");
        sb.append("\"playerState\":{");
        if (result.getPlayerState() != null) {
            Map<String, Object> map = result.getPlayerState().toMap();
            boolean first = true;
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                if (!first) sb.append(",");
                sb.append("\"").append(entry.getKey()).append("\":");
                if (entry.getValue() instanceof Number) sb.append(entry.getValue());
                else sb.append("\"").append(escapeJson(String.valueOf(entry.getValue()))).append("\"");
                first = false;
            }
        }
        sb.append("},");
        sb.append("\"mood\":{\"id\":\"").append(escapeJson(result.getMoodId())).append("\",");
        sb.append("\"name\":\"").append(escapeJson(result.getMoodName())).append("\",");
        sb.append("\"icon\":\"").append(escapeJson(result.getMoodIcon())).append("\"}");
        sb.append("}");
        return sb.toString();
    }

    private String buildChoiceResponse(SceneResult result) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"success\":true,");
        sb.append("\"playerState\":{");
        if (result.getPlayerState() != null) {
            Map<String, Object> map = result.getPlayerState().toMap();
            boolean first = true;
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                if (!first) sb.append(",");
                sb.append("\"").append(entry.getKey()).append("\":");
                if (entry.getValue() instanceof Number) sb.append(entry.getValue());
                else sb.append("\"").append(escapeJson(String.valueOf(entry.getValue()))).append("\"");
                first = false;
            }
        }
        sb.append("}");
        sb.append("}");
        return sb.toString();
    }

    private String buildBooksList() {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"books\":[");
        List<Map<String, Object>> books = StoryData.getAllBooks();
        for (int i = 0; i < books.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append("{");
            Map<String, Object> book = books.get(i);
            boolean first = true;
            for (Map.Entry<String, Object> entry : book.entrySet()) {
                if (!first) sb.append(",");
                sb.append("\"").append(entry.getKey()).append("\":\"").append(escapeJson(String.valueOf(entry.getValue()))).append("\"");
                first = false;
            }
            sb.append("}");
        }
        sb.append("]}");
        return sb.toString();
    }

    private void sendResponse(Socket socket, int statusCode, String body) {
        try {
            OutputStream os = socket.getOutputStream();
            String statusText = statusCode == 200 ? "OK" : statusCode == 404 ? "Not Found" : "Internal Server Error";
            byte[] bodyBytes = body.getBytes(StandardCharsets.UTF_8);

            String header = "HTTP/1.1 " + statusCode + " " + statusText + "\r\n" +
                    "Content-Type: application/json; charset=UTF-8\r\n" +
                    "Content-Length: " + bodyBytes.length + "\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n" +
                    "Access-Control-Allow-Headers: Content-Type\r\n" +
                    "Connection: close\r\n" +
                    "\r\n";
            os.write(header.getBytes(StandardCharsets.UTF_8));
            os.write(bodyBytes);
            os.flush();
        } catch (SocketException e) {
            System.out.println("[ChatHandler] 客户端已断开连接，忽略响应写入");
        } catch (IOException e) {
            System.err.println("[ChatHandler] 写入响应失败: " + e.getMessage());
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

    private String unescapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\t", "\t")
                .replace("\\\"", "\"")
                .replace("\\\\", "\\");
    }

    private String readLine(BufferedInputStream bis) throws IOException {
        StringBuilder sb = new StringBuilder();
        int c;
        while ((c = bis.read()) != -1) {
            if (c == '\r') {
                bis.read(); // consume \n
                break;
            }
            if (c == '\n') break;
            sb.append((char) c);
        }
        return sb.length() == 0 && c == -1 ? null : sb.toString();
    }
}
