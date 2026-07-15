package com.bookemulator.controller;

import com.bookemulator.model.ChatRequest;
import com.bookemulator.service.AIService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final AIService aiService;

    public ChatController(AIService aiService) {
        this.aiService = aiService;
    }

    /**
     * 初始化游戏
     */
    @PostMapping("/init")
    public Map<String, Object> initGame(@RequestBody ChatRequest request) {
        return aiService.initGame(request.getBookId(), request.getPlayerName());
    }

    /**
     * 系统AI对话
     */
    @PostMapping("/system")
    public Map<String, Object> systemChat(@RequestBody ChatRequest request) {
        return aiService.systemChat(request.getSessionId(), request.getBookId(), request.getMessage());
    }

    /**
     * NPC对话
     */
    @PostMapping("/npc")
    public Map<String, Object> npcChat(@RequestBody ChatRequest request) {
        return aiService.npcChat(request.getSessionId(), request.getBookId(), request.getNpcName(), request.getMessage());
    }

    /**
     * 叙事推进
     */
    @PostMapping("/narrative")
    public Map<String, Object> narrativeChat(@RequestBody ChatRequest request) {
        return aiService.narrativeChat(request.getSessionId(), request.getBookId(), request.getPlayerAction());
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "timestamp", String.valueOf(System.currentTimeMillis()));
    }
}
