package com.bookemu;

import server.ChatHandler;
import server.SimpleHttpServer;
import service.AIService;
import service.TtsService;
import service.SystemService;

import java.io.*;
import java.net.*;
import java.util.Properties;

public class Main {

    private static volatile int port = 8080;

    public static void main(String[] args) {
        start();
    }

    public static int getPort() {
        return port;
    }

    public static void start() {
        try {
            Properties props = new Properties();
            InputStream is = Main.class.getClassLoader().getResourceAsStream("config.properties");
            if (is == null) {
                // fallback: 从文件系统加载
                File f = new File(System.getProperty("user.dir"), "config.properties");
                if (f.exists()) {
                    is = new FileInputStream(f);
                }
            }
            if (is == null) {
                System.err.println("config.properties not found!");
                return;
            }
            props.load(is);
            is.close();

            String apiKey = props.getProperty("qwen.api-key", "");
            String baseUrl = props.getProperty("qwen.base-url", "https://dashscope.aliyuncs.com/compatible-mode/v1");
            String model = props.getProperty("qwen.model", "qwen-plus");
            port = Integer.parseInt(props.getProperty("server.port", "8080"));

            String ttsApiKey = props.getProperty("dashscope.api-key", "");
            String ttsUrl = props.getProperty("dashscope.tts-url", "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation");
            String ttsModel = props.getProperty("dashscope.tts-model", "qwen3-tts-flash");
            String ttsVcModel = props.getProperty("dashscope.tts-vc-model", "qwen3-tts-vc-2026-01-22");
            String ttsVoice = props.getProperty("dashscope.tts-voice", "Cherry");

            AIService aiService = new AIService(apiKey, baseUrl, model);
            TtsService ttsService = new TtsService(ttsApiKey, ttsUrl, ttsModel, ttsVcModel, ttsVoice, props);
            SystemService systemService = new SystemService(aiService);
            ChatHandler chatHandler = new ChatHandler(aiService, ttsService, systemService);

            ServerSocket serverSocket = new ServerSocket(port);

            System.out.println("=========================================");
            System.out.println("  书籍人生模拟器后端服务已启动");
            System.out.println("  地址: http://localhost:" + port);
            System.out.println("  API Key: " + (apiKey.isEmpty() ? "未配置" : apiKey.substring(0, Math.min(8, apiKey.length())) + "..."));
            System.out.println("  模型: " + model);
            System.out.println("  TTS: " + ttsModel + " / " + ttsVoice + " (VC: " + ttsVcModel + ")");
            System.out.println("=========================================");

            while (true) {
                Socket socket = serverSocket.accept();
                new Thread(new SimpleHttpServer(socket, chatHandler)).start();
            }

        } catch (Exception e) {
            System.err.println("后端启动失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
