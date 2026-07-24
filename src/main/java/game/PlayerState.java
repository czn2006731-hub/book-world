package game;

import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

public class PlayerState {
    private String name;
    private String identity;
    private String location;
    private String currentTask;
    private int affinity;
    private String cultivation;
    private String bookId;
    private String currentScene;
    private int deviationCount;
    private int totalFate;
    private List<String> inventory = new ArrayList<>();

    public PlayerState() {}

    public PlayerState(String name, String bookId) {
        this.name = name;
        this.bookId = bookId;
        this.identity = "穿越者";
        this.location = "未知";
        this.currentTask = "了解当前处境";
        this.affinity = 50;
        this.cultivation = StoryData.getInitialCultivation(bookId);
        this.currentScene = "start";
        this.deviationCount = 0;
        this.totalFate = 0;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIdentity() { return identity; }
    public void setIdentity(String identity) { this.identity = identity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCurrentTask() { return currentTask; }
    public void setCurrentTask(String currentTask) { this.currentTask = currentTask; }

    public int getAffinity() { return affinity; }
    public void setAffinity(int affinity) { this.affinity = affinity; }

    public String getCultivation() { return cultivation; }
    public void setCultivation(String cultivation) { this.cultivation = cultivation; }

    public String getBookId() { return bookId; }
    public void setBookId(String bookId) { this.bookId = bookId; }

    public String getCurrentScene() { return currentScene; }
    public void setCurrentScene(String currentScene) { this.currentScene = currentScene; }

    public int getDeviationCount() { return deviationCount; }
    public void setDeviationCount(int deviationCount) { this.deviationCount = deviationCount; }

    public int getTotalFate() { return totalFate; }
    public void setTotalFate(int totalFate) { this.totalFate = totalFate; }

    public List<String> getInventory() { return inventory; }
    public void addItem(String item) { this.inventory.add(item); }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("identity", identity);
        map.put("location", location);
        map.put("currentTask", currentTask);
        map.put("affinity", affinity);
        map.put("cultivation", cultivation);
        map.put("deviationCount", deviationCount);
        map.put("totalFate", totalFate);
        map.put("inventory", String.join(",", inventory));
        return map;
    }
}
