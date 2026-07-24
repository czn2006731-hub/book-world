package model;

public class ChatRequest {
    private String sessionId;
    private String bookId;
    private String message;
    private String playerName;
    private String npcName;
    private String playerAction;

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
}
