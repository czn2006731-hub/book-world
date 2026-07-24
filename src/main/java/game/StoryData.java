package game;

import java.util.*;

public class StoryData {

    private static final Map<String, Map<String, String>> BOOKS = new HashMap<>();
    private static final Map<String, String> INITIAL_CULTIVATION = new HashMap<>();

    static {
        BOOKS.put("xianxia.fanRenXiuXianZhuan", Map.of("title", "凡人修仙传", "author", "忘语"));
        BOOKS.put("xianxia.douPoCangQiong", Map.of("title", "斗破苍穹", "author", "天蚕土豆"));
        BOOKS.put("xianxia.zheTian", Map.of("title", "遮天", "author", "辰东"));
        BOOKS.put("xianxia.wanMeiShiJie", Map.of("title", "完美世界", "author", "辰东"));
        BOOKS.put("xianxia.xianNi", Map.of("title", "仙逆", "author", "耳根"));
        BOOKS.put("scifi.sanTi", Map.of("title", "三体", "author", "刘慈欣"));
        BOOKS.put("scifi.liuLangDiQiu", Map.of("title", "流浪地球", "author", "刘慈欣"));
        BOOKS.put("scifi.jiDi", Map.of("title", "基地", "author", "阿西莫夫"));
        BOOKS.put("romance.weiWeiYiXiaoHenQingCheng", Map.of("title", "微微一笑很倾城", "author", "顾漫"));
        BOOKS.put("romance.heYiShengXiaoMo", Map.of("title", "何以笙箫默", "author", "顾漫"));

        INITIAL_CULTIVATION.put("xianxia.fanRenXiuXianZhuan", "炼气期一层");
        INITIAL_CULTIVATION.put("xianxia.douPoCangQiong", "斗之气三段");
        INITIAL_CULTIVATION.put("scifi.sanTi", "危机纪年·研究员");
        INITIAL_CULTIVATION.put("scifi.shaQiu", "厄崔迪家族继承人");
        INITIAL_CULTIVATION.put("romance.hongLouMeng", "荣国府公子");
    }

    public static String getBookTitle(String bookId) {
        Map<String, String> book = BOOKS.get(bookId);
        return book != null ? book.get("title") : "未知书籍";
    }

    public static String getBookAuthor(String bookId) {
        Map<String, String> book = BOOKS.get(bookId);
        return book != null ? book.get("author") : "未知";
    }

    public static String getInitialCultivation(String bookId) {
        String c = INITIAL_CULTIVATION.get(bookId);
        return c != null ? c : "普通人";
    }

    public static String getWorldView(String bookId) {
        if (bookId.contains("fanRenXiuXianZhuan") || bookId.contains("douPoCangQiong") || bookId.contains("zheTian")) {
            return "修仙世界，分为炼气、筑基、结丹、元婴、化神等境界。宗门林立，弱肉强食。";
        } else if (bookId.contains("sanTi") || bookId.contains("liuLangDiQiu")) {
            return "科幻世界，人类文明面临宇宙级别的生存挑战。";
        } else if (bookId.contains("weiWei") || bookId.contains("heYi")) {
            return "现代都市，校园与职场交织的爱情故事。";
        }
        return "一个充满奇幻色彩的世界。";
    }

    public static String getNPCPersonality(String name) {
        Map<String, String> personalities = new HashMap<>();
        personalities.put("韩立", "沉稳内敛、谨慎小心、重情义");
        personalities.put("南宫婉", "高贵冷艳、外冷内热");
        return personalities.getOrDefault(name, "性格未知");
    }

    public static List<Map<String, Object>> getAllBooks() {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map.Entry<String, Map<String, String>> entry : BOOKS.entrySet()) {
            Map<String, Object> book = new HashMap<>();
            book.put("id", entry.getKey());
            book.put("title", entry.getValue().get("title"));
            book.put("author", entry.getValue().get("author"));
            list.add(book);
        }
        return list;
    }

    public static Map<String, String> getItemInfo(String itemName) {
        return ITEMS.getOrDefault(itemName, null);
    }

    public static List<Map<String, String>> getAllItems(String bookId) {
        List<Map<String, String>> result = new ArrayList<>();
        for (Map.Entry<String, Map<String, String>> entry : ITEMS.entrySet()) {
            String itemBookId = entry.getValue().getOrDefault("bookId", "");
            if (itemBookId.isEmpty() || itemBookId.equals(bookId) || bookId.contains(itemBookId)) {
                result.add(entry.getValue());
            }
        }
        return result;
    }

    private static final Map<String, Map<String, String>> ITEMS = new HashMap<>();
    static {
        ITEMS.put("天南地图", Map.of(
                "name", "天南地图",
                "type", "地图",
                "rarity", "关键物品",
                "bookId", "fanRen",
                "desc", "一张泛黄的古旧地图，标注了天南大陆九国十二派的势力分布",
                "lore", "据传是千年前天南第一制图师「云游子」所绘。"
                      + "图中标注了天南最危险的上古遗迹和隐秘洞府的位置。"
                      + "持有此图者，可洞悉天南全局，趋利避害。"
        ));
        ITEMS.put("黄枫谷地形图", Map.of(
                "name", "黄枫谷地形图",
                "type", "地图",
                "rarity", "关键物品",
                "bookId", "fanRen",
                "desc", "黄枫谷内门弟子人手一份的详细地形图",
                "lore", "黄枫谷是越国七大宗门之一，以炼丹术闻名。"
                      + "此图标注了黄枫谷内各处重要地点：宗门大殿、丹药阁、藏经阁、演武场、外门弟子居住区等。"
                      + "新入门的弟子凭此图可快速熟悉环境，避免误闯禁地。"
        ));
        ITEMS.put("聚气丹", Map.of(
                "name", "聚气丹",
                "type", "丹药",
                "rarity", "凡品",
                "bookId", "fanRen",
                "desc", "一枚灰褐色的丹药，表面有淡淡的光泽，散发着微弱的药香",
                "lore", "修仙界最基础的丹药，黄枫谷入门弟子每月可领取一枚。"
                      + "主材料为百年灵芝和聚气草，由炼丹阁弟子炼制。"
                      + "服用后可帮助炼气期修士凝聚天地灵气，加快修炼速度。"
        ));
        ITEMS.put("青锋剑", Map.of(
                "name", "青锋剑",
                "type", "法器",
                "rarity", "下品",
                "bookId", "fanRen",
                "desc", "一柄通体青色的长剑，剑身泛着寒光，入手微凉",
                "lore", "黄枫谷外门弟子的制式法器，由炼器堂统一打造。"
                      + "剑身刻有基础聚灵阵法，可在出剑时附带微弱灵气。"
                      + "虽是下品法器，但做工精良，足以应对炼气期的日常战斗。"
        ));
        ITEMS.put("功法残卷", Map.of(
                "name", "功法残卷",
                "type", "秘籍",
                "rarity", "稀有",
                "bookId", "fanRen",
                "desc", "一卷残破的古老兽皮卷轴，上面记载着残缺不全的修炼法门",
                "lore", "从上古遗迹中发掘的残缺功法，年代已不可考。"
                      + "虽然残缺，但其中记载的法门远超黄枫谷外门功法。"
                      + "若能补全，或许能修炼出远超同辈的实力。"
                      + "据说此卷与一位上古大能的传承有关。"
        ));
        ITEMS.put("筑基丹", Map.of(
                "name", "筑基丹",
                "type", "丹药",
                "rarity", "极品",
                "bookId", "fanRen",
                "desc", "一枚散发着金色光泽的丹药，丹纹清晰，药香浓郁",
                "lore", "修仙界最珍贵的丹药之一，是炼气期修士冲击筑基境的必需品。"
                      + "黄枫谷每年仅能炼制十余枚，非天资卓越或立大功者不可得。"
                      + "筑基丹的炼制需要数十种珍稀灵药，成功率极低。"
                      + "服用后可大幅提升筑基成功的概率，是无数散修梦寐以求的至宝。"
        ));
        ITEMS.put("传音简(墨居仁遗书)", Map.of(
                "name", "传音简(墨居仁遗书)",
                "type", "秘籍",
                "rarity", "特殊",
                "bookId", "fanRen",
                "desc", "一卷白骨雕琢的古朴传音玉简，上面刻着隐秘的禁制，里面封存了墨大夫的临终遗言",
                "lore", "这是墨大夫临终前留下的重要遗言，里面记载了他对爱女墨彩环的牵挂以及未竟的遗愿。"
                      + "韩立在击败墨大夫后，在木屋中搜寻到此物。"
                      + "点击“查看”按钮可解开禁制，聆听墨大夫那满怀不甘与恳求的最后传音。"
        ));
    }
}
