package service;

import game.PlayerState;
import game.StoryData;

import java.util.Base64;

public class SystemService {

    private final AIService aiService;

    public SystemService(AIService aiService) {
        this.aiService = aiService;
    }

    /**
     * 系统解释道具
     */
    public String explainItem(String bookId, String itemName, String itemType,
 String itemDescription, PlayerState state) {
        String worldView = StoryData.getWorldView(bookId);
        String systemPrompt = "你是一个穿越系统小说里的【神级鉴定功能】。请以系统鉴定面板的形式解释物品。\n"
                + "【格式要求】：\n"
                + "1. 使用系统面板格式输出：\n"
                + "   【物品名称】：[物品名]\n"
                + "   【天道品阶】：[结合该书世界观的等级/类型]\n"
                + "   【因果来历】：[结合世界观的来历叙述]\n"
                + "   【系统鉴定】：[用“本系统”的口吻说明对“宿主”的作用，并给宿主一条生动、趣味的建议]\n"
                + "2. 自称“本系统”，称呼玩家为“宿主”，语气要灵活生动，拒绝死板，多用修仙/小说特有梗。\n"
                + "3. 控制在180字以内。";

        String userMsg = "当前世界：《" + StoryData.getBookTitle(bookId) + "》\n"
                + "世界观：" + worldView + "\n"
                + "物品名称：" + itemName + "\n"
                + "物品类型：" + itemType + "\n"
                + "物品描述：" + itemDescription + "\n"
                + "请解释这个物品的来历和作用。";

        return aiService.chat(userMsg, systemPrompt);
    }

    /**
     * 系统回答玩家提问
     */
    public String answerQuestion(String bookId, String question, PlayerState state) {
        String worldView = StoryData.getWorldView(bookId);
        String systemPrompt = "你是一个经典系统小说中的【智能系统助手】，自称“本系统”或“小书”，称呼玩家为“宿主”。\n"
                + "【核心守则】：\n"
                + "1. 语气不要死板！要有灵魂，融合系统文特有的冷幽默、傲娇或吐槽（例如：[系统提示]、[因果监测]、[友情警告]）。\n"
                + "2. 绝对沉浸！结合当前世界观和玩家境界（如炼气、筑基），使用对应世界的本土修仙术语（如天道、因果律、气运），绝不使用任何现代大模型技术黑话（如“作为一个AI语言模型”）。\n"
                + "3. 回答要通俗生动，直指修仙核心，讲宿主听得懂的本地世界话，不能说玩家听不懂的现代废废话。\n"
                + "4. 控制在220字以内。";

        String ctx = "";
        if (state != null) {
            ctx = "当前状态：位置-" + state.getLocation() + "，境界-" + state.getCultivation()
                    + "，任务-" + state.getCurrentTask() + "\n";
        }

        String userMsg = "当前世界：《" + StoryData.getBookTitle(bookId) + "》\n"
                + "世界观：" + worldView + "\n"
                + ctx + "玩家提问：" + question;

        return aiService.chat(userMsg, systemPrompt);
    }

    /**
     * AI 生成偏离原著的新剧情
     */
    public String generateStory(String bookId, String currentScene, String choiceLabel,
                                boolean isOriginal, PlayerState state, String context) {
        String worldView = StoryData.getWorldView(bookId);
        String systemPrompt = "你是一个穿越小说的叙事引擎。"
                + "玩家做出了不同于原著的选择，请生成新的剧情发展。"
                + "要求：1.符合世界观 2.有悬念和张力 3.控制在300字以内 4.用第二人称叙事";

        String ctx = "";
        if (state != null) {
            ctx = "玩家：位置-" + state.getLocation() + "，境界-" + state.getCultivation() + "\n";
        }

        String userMsg = "当前世界：《" + StoryData.getBookTitle(bookId) + "》\n"
                + "世界观：" + worldView + "\n"
                + ctx + "当前场景：" + (context != null ? context : currentScene) + "\n"
                + "玩家选择：" + choiceLabel + "（" + (isOriginal ? "原著路线" : "偏离原著") + "）\n"
                + "请生成选择之后的剧情发展。";

        return aiService.chat(userMsg, systemPrompt);
    }

    /**
     * AI 动态续写后续长篇剧情与4个选项 (JSON格式)
     */
    public String continueBookStory(String bookId, String bookTitle, String currentScene, String choiceLabel, PlayerState state) {
        String worldView = StoryData.getWorldView(bookId);
        String systemPrompt = "你是一个【无限小说穿书叙事引擎】。玩家正在体验书籍《" + bookTitle + "》后续的无限篇章。\n"
                + "请严格以 JSON 格式输出后续剧情和 4 个决策选项。格式要求如下：\n"
                + "{\n"
                + "  \"narrative\": \"[第二人称(你)叙述后续剧情，字数220字左右，符合《" + bookTitle + "》的世界观]\",\n"
                + "  \"choices\": [\n"
                + "    { \"label\": \"[顺应原著先知路线(稳定无风险)]\", \"original\": true },\n"
                + "    { \"label\": \"[逆天改命高风险路线1(引发蝴蝶效应/未知天道反噬)]\", \"original\": false },\n"
                + "    { \"label\": \"[逆天改命高风险路线2(打破既定命运/寻找奇遇)]\", \"original\": false },\n"
                + "    { \"label\": \"[逆天改命高风险路线3(铤而走险/逆转因果)]\", \"original\": false }\n"
                + "  ]\n"
                + "}\n"
                + "【特别机制说明】：\n"
                + "1. 顺应原著路线(original=true)是【先知安全线】：宿主凭借原著剧情记忆稳扎稳打，绝对安全且能避开危险。\n"
                + "2. 逆天改命路线(original=false)是【高风险高回报线】：宿主打破宿命，可能获得惊天奇遇，但也容易引发天道反噬与连锁反应！\n"
                + "【注意】：务必只返回标准的纯 JSON 字符串，不要包含任何 markdown 标记。";

        String ctx = "";
        if (state != null) {
            ctx = "宿主当前状态：境界-" + state.getCultivation() + "，位置-" + state.getLocation() + "\n";
        }

        String userMsg = "当前书籍：《" + bookTitle + "》\n"
                + "世界观：" + worldView + "\n"
                + ctx + "上一幕剧情：" + (currentScene != null ? currentScene : "在修仙界/原著世界中探索") + "\n"
                + "宿主做出选择：" + (choiceLabel != null ? choiceLabel : "继续向前迈进") + "\n"
                + "请生成接下来的剧情与4个命运分支选项。";

        return aiService.chat(userMsg, systemPrompt);
    }

    /**
     * AI 生成万界通用星空书籍的动态穿书人生模拟剧本
     */
    public String generateUniversalLifeStory(String bookId, String bookTitle, String author, String currentScene, String choiceLabel, PlayerState state) {
        String worldView = StoryData.getWorldView(bookId);
        String systemPrompt = "你是一个【万界书籍人生模拟器】的无限 AI 叙事引擎。\n"
                + "【核心职责】：\n"
                + "玩家穿越到了书籍《" + bookTitle + "》（作者：" + author + "）的世界中。\n"
                + "请根据世界观设定（" + worldView + "），为玩家生成沉浸感极强的第二人称（“你”）穿书人生发展。\n"
                + "【生成要求】：\n"
                + "1. 必须完全符合《" + bookTitle + "》的核心世界观、时代背景与特色（如修仙、科幻、文学）。\n"
                + "2. 结合宿主做出的人生大抉择（“" + (choiceLabel != null ? choiceLabel : "踏入世界") + "”），推演接下来的命运走向。\n"
                + "3. 语言生动有悬念，字数控制在 250 字以内，结尾引导宿主进行下一次命运选择。";

        String ctx = "";
        if (state != null) {
            ctx = "宿主当前状态：境界-" + state.getCultivation() + "，位置-" + state.getLocation() + "\n";
        }

        String userMsg = "当前书籍：《" + bookTitle + "》\n"
                + "作者：" + author + "\n"
                + "世界观：" + worldView + "\n"
                + ctx + "上一幕情景：" + (currentScene != null ? currentScene : "刚穿越降临至该世界") + "\n"
                + "宿主本次抉择：" + (choiceLabel != null ? choiceLabel : "开启第一年人生体验") + "\n"
                + "请推演接下来的穿书人生历程。";

        return aiService.chat(userMsg, systemPrompt);
    }

    /**
     * AI 生成带道具的剧情片段
     */
    public String generateItemNarrative(String bookId, String itemName, String itemType,
                                        String itemDescription, PlayerState state) {
        String worldView = StoryData.getWorldView(bookId);
        String systemPrompt = "你是一个穿越小说的叙述者。玩家获得了新的物品，请生成一段精彩的发现物品的叙述。"
                + "控制在150字以内，用第二人称。";

        String userMsg = "当前世界：《" + StoryData.getBookTitle(bookId) + "》\n"
                + "世界观：" + worldView + "\n"
                + "物品：" + itemName + "（" + itemType + "）\n"
                + "描述：" + itemDescription + "\n"
                + "请叙述玩家发现这个物品的场景。";

        return aiService.chat(userMsg, systemPrompt);
    }

    /**
     * 生成系统欢迎语（根据是否回归玩家有所不同）
     */
    public String getSystemIntro(String bookId, String playerName, long lastPlayTime,
                                 int totalPlays, int deviationTotal, PlayerState state) {
        String bookTitle = StoryData.getBookTitle(bookId);
        String worldView = StoryData.getWorldView(bookId);

        String systemPrompt = "你是【万界书灵·小书】，一名来自万界穿越管理局的高智能系统助手。自称“本系统”或“小书”，称呼玩家为“宿主”。\n"
                + "你的语气是：冷静专业但有血有肉，略带一丝系统特有的优越感与看透一切宿命的冷幽默，绝不死板。\n"
                + "字数控制在200字以内，必须以「系统启动中……绑定成功。」开头。根据该书世界观，给宿主下达一句逼格拉满的系统寄语。";

        String userMsg;
        if (lastPlayTime <= 0 || totalPlays <= 1) {
            userMsg = "首次绑定。宿主名称：" + playerName + "。"
                    + "当前世界：《" + bookTitle + "》。世界观：" + worldView + "。"
                    + "请用小书系统的口吻欢迎宿主，"
                    + "说明自己能做什么（规则解析、局势分析、物品鉴定、地图导航、命运记录），并告知本世界的基础修仙/科技阶层信息。";
        } else {
            String timeAgo = formatTimeAgo(lastPlayTime);
            userMsg = "老玩家回归。宿主名称：" + playerName + "。"
                    + "距离上次离线：" + timeAgo + "。累计启动次数：" + totalPlays + "。"
                    + "累计命运脱轨度：" + deviationTotal + "次。"
                    + "当前世界：《" + bookTitle + "》。世界观：" + worldView + "。"
                    + "请用小书系统的口吻欢迎宿主回归，提起上次离线的时间，以及宿主曾经让本世界天道脱轨的次数，语气中可以带点调侃。";
        }

        return aiService.chat(userMsg, systemPrompt);
    }

    private String formatTimeAgo(long timestamp) {
        long diff = System.currentTimeMillis() - timestamp;
        if (diff < 60000) return "刚刚";
        long minutes = diff / 60000;
        if (minutes < 60) return minutes + "分钟";
        long hours = minutes / 60;
        if (hours < 24) return hours + "小时" + (minutes % 60) + "分钟";
        long days = hours / 24;
        return days + "天" + (hours % 24) + "小时";
    }
}
