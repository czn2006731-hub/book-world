package com.bookemulator.config;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ExploreWebSocketHandler extends TextWebSocketHandler {

    // 保存 SessionId -> WebSocketSession
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    // 保存 UserId -> WebSocketSession (支持根据用户ID点对点双向精准推送)
    private static final Map<Long, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    private final Gson gson = new Gson();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session);
        System.out.println("WebSocket 玩家建立连接: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            JsonObject json = JsonParser.parseString(message.getPayload()).getAsJsonObject();
            String type = json.has("type") ? json.get("type").getAsString() : "";
            
            if ("REGISTER_USER".equals(type)) {
                Long userId = json.get("userId").getAsLong();
                userSessions.put(userId, session);
                System.out.println("WebSocket 绑定用户ID: " + userId);
            } else if ("PRIVATE_CHAT".equals(type)) {
                // 点对点私信传输
                JsonObject data = json.getAsJsonObject("data");
                Long receiverId = data.get("receiverId").getAsLong();
                sendToUser(receiverId, message.getPayload());
            } else {
                broadcastMessage(message.getPayload());
            }
        } catch (Exception e) {
            broadcastMessage(message.getPayload());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
        userSessions.values().removeIf(s -> s.getId().equals(session.getId()));
        System.out.println("WebSocket 玩家断开连接: " + session.getId());
    }

    // 全服广播
    public void broadcastMessage(String jsonPayload) {
        sessions.values().forEach(session -> {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(jsonPayload));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    // 点对点私信精准推送
    public boolean sendToUser(Long userId, String jsonPayload) {
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(jsonPayload));
                return true;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return false;
    }
}
