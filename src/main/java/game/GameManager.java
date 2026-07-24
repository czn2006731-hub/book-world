package game;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class GameManager {

    private static final GameManager INSTANCE = new GameManager();
    private final ConcurrentHashMap<String, PlayerState> sessions = new ConcurrentHashMap<>();

    private GameManager() {}

    public static GameManager getInstance() {
        return INSTANCE;
    }

    public String createSession(String bookId, String playerName) {
        String sessionId = "session_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
        PlayerState state = new PlayerState(playerName, bookId);
        sessions.put(sessionId, state);
        return sessionId;
    }

    public PlayerState getSession(String sessionId) {
        return sessions.get(sessionId);
    }

    public SceneResult initGame(String bookId, String playerName) {
        String sessionId = createSession(bookId, playerName);
        PlayerState state = getSession(sessionId);

        SceneResult result = new SceneResult();
        result.setPlayerState(state);

        result.setNarrative("欢迎来到《" + StoryData.getBookTitle(bookId) + "》的世界。");
        result.setSystemMsg("【系统启动】" + playerName + "，你已成功穿越。");

        result.setMoodId("calm");
        result.setMoodName("平静");
        result.setMoodIcon("😌");

        Map<String, Object> extra = new HashMap<>();
        extra.put("sessionId", sessionId);
        result.setExtra(extra);

        return result;
    }

    public SceneResult processChoice(String sessionId, String bookId, int chapterIdx, int segmentIdx, int choiceIdx, boolean isOriginal) {
        PlayerState state = getSession(sessionId);
        if (state == null) {
            SceneResult error = new SceneResult();
            error.setSystemMsg("会话已过期，请重新开始游戏。");
            return error;
        }

        SceneResult result = new SceneResult();
        result.setPlayerState(state);

        if (!isOriginal) {
            int deviation = state.getDeviationCount() + 1;
            state.setDeviationCount(deviation);
        }

        result.setMoodId("calm");
        result.setMoodName("平静");
        result.setMoodIcon("😌");

        return result;
    }
}
