package com.bookemu;

import me.friwi.jcefmaven.CefAppBuilder;
import me.friwi.jcefmaven.MavenCefAppHandlerAdapter;
import org.cef.CefApp;
import org.cef.CefClient;
import org.cef.CefSettings;
import org.cef.browser.CefBrowser;

import javax.swing.*;
import java.awt.*;
import java.io.File;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;

public class App {
    public static void main(String[] args) throws Exception {
        // 1. 启动后端主服务线程
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Main.start();
                } catch (Exception e) {
                    System.err.println("启动后端服务失败: " + e.getMessage());
                }
            }
        }).start();

        // 2. 等待后端端口启动 (最多等待5秒)
        boolean serverReady = false;
        for (int i = 0; i < 50; i++) {
            try {
                HttpURLConnection conn = (HttpURLConnection) new URL("http://localhost:8080/api/chat/health").openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(200);
                conn.setReadTimeout(200);
                if (conn.getResponseCode() == 200) {
                    serverReady = true;
                    break;
                }
            } catch (Exception e) {
                // ignore
            }
            Thread.sleep(100);
        }

        if (!serverReady) {
            System.err.println("[警告] 后端服务未在端口 8080 正常响应，正在强行启动浏览器面板...");
        } else {
            System.out.println("[系统] 后端服务已成功连接，正在加载浏览器窗口...");
        }

        // 3. 启动 JCEF 桌面窗口
        Path jcefDir = Path.of(System.getProperty("user.home"), ".bookemu-jcef");
        Files.createDirectories(jcefDir);

        CefAppBuilder builder = new CefAppBuilder();
        builder.getCefSettings().windowless_rendering_enabled = false;
        builder.getCefSettings().log_severity = CefSettings.LogSeverity.LOGSEVERITY_WARNING;
        builder.getCefSettings().cache_path = jcefDir.resolve("cache").toString();

        builder.setAppHandler(new MavenCefAppHandlerAdapter() {
            @Override
            public void stateHasChanged(CefApp.CefAppState state) {
                if (state == CefApp.CefAppState.TERMINATED) {
                    System.exit(0);
                }
            }
        });

        builder.build();
        CefApp cefApp = CefApp.getInstance();
        CefClient client = cefApp.createClient();

        File htmlFile = new File(System.getProperty("user.dir"), "../../BookEmulator/index.html");
        if (!htmlFile.exists()) {
            htmlFile = new File(System.getProperty("user.dir"), "../BookEmulator/index.html");
        }
        if (!htmlFile.exists()) {
            htmlFile = new File(System.getProperty("user.dir"), "../index.html");
        }
        String url = htmlFile.toURI().toString();
        System.out.println("Loading: " + url);

        CefBrowser browser = client.createBrowser(url, false, false);

        JFrame frame = new JFrame("书籍人生模拟器");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(1400, 900);
        frame.setLocationRelativeTo(null);
        frame.setContentPane((Container) browser.getUIComponent());
        frame.setVisible(true);
        System.out.println("Window shown successfully");
    }
}
