package game;

import java.util.Map;

public class SceneResult {
    private String narrative;
    private String systemMsg;
    private String[] actions;
    private String npcReply;
    private String npcName;
    private PlayerState playerState;
    private String moodId;
    private String moodName;
    private String moodIcon;
    private Map<String, Object> extra;

    public SceneResult() {}

    public String getNarrative() { return narrative; }
    public void setNarrative(String narrative) { this.narrative = narrative; }

    public String getSystemMsg() { return systemMsg; }
    public void setSystemMsg(String systemMsg) { this.systemMsg = systemMsg; }

    public String[] getActions() { return actions; }
    public void setActions(String[] actions) { this.actions = actions; }

    public String getNpcReply() { return npcReply; }
    public void setNpcReply(String npcReply) { this.npcReply = npcReply; }

    public String getNpcName() { return npcName; }
    public void setNpcName(String npcName) { this.npcName = npcName; }

    public PlayerState getPlayerState() { return playerState; }
    public void setPlayerState(PlayerState playerState) { this.playerState = playerState; }

    public String getMoodId() { return moodId; }
    public void setMoodId(String moodId) { this.moodId = moodId; }

    public String getMoodName() { return moodName; }
    public void setMoodName(String moodName) { this.moodName = moodName; }

    public String getMoodIcon() { return moodIcon; }
    public void setMoodIcon(String moodIcon) { this.moodIcon = moodIcon; }

    public Map<String, Object> getExtra() { return extra; }
    public void setExtra(Map<String, Object> extra) { this.extra = extra; }
}
