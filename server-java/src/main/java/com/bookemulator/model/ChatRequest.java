package com.bookemulator.model;

import java.util.Map;

public class ChatRequest {
    private String sessionId;
    private String bookId;
    private String message;
    private String playerName;
    private String npcName;
    private String playerAction;
    private String context;
    private String originalChoice;
    private String choiceLabel;
    private String history;
    private Map<String, Object> playerState;

    public ChatRequest() {}

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getBookId() { return bookId; }
    public void setBookId(String bookId) { this.bookId = bookId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getNpcName() { return npcName; }
    public void setNpcName(String npcName) { this.npcName = npcName; }

    public String getPlayerAction() { return playerAction; }
    public void setPlayerAction(String playerAction) { this.playerAction = playerAction; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }

    public String getOriginalChoice() { return originalChoice; }
    public void setOriginalChoice(String originalChoice) { this.originalChoice = originalChoice; }

    public String getChoiceLabel() { return choiceLabel; }
    public void setChoiceLabel(String choiceLabel) { this.choiceLabel = choiceLabel; }

    public String getHistory() { return history; }
    public void setHistory(String history) { this.history = history; }

    public Map<String, Object> getPlayerState() { return playerState; }
    public void setPlayerState(Map<String, Object> playerState) { this.playerState = playerState; }
}
