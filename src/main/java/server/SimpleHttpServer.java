package server;

import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class SimpleHttpServer implements Runnable {

    private final Socket socket;
    private final ChatHandler chatHandler;

    public SimpleHttpServer(Socket socket, ChatHandler chatHandler) {
        this.socket = socket;
        this.chatHandler = chatHandler;
    }

    @Override
    public void run() {
        try {
            chatHandler.handle(socket);
        } catch (Exception e) {
            System.err.println("处理请求失败: " + e.getMessage());
            e.printStackTrace();
        } finally {
            try { socket.close(); } catch (Exception e) { /* ignore */ }
        }
    }
}
