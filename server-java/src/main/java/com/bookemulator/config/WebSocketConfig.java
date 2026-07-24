package com.bookemulator.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ExploreWebSocketHandler exploreWebSocketHandler;

    public WebSocketConfig(ExploreWebSocketHandler exploreWebSocketHandler) {
        this.exploreWebSocketHandler = exploreWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(exploreWebSocketHandler, "/ws/explore")
                .setAllowedOrigins("*");
    }
}
