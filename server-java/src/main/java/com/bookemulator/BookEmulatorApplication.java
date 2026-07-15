package com.bookemulator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BookEmulatorApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookEmulatorApplication.class, args);
        System.out.println("=========================================");
        System.out.println("  书籍人生模拟器后端服务已启动");
        System.out.println("  地址: http://localhost:8080");
        System.out.println("=========================================");
    }
}
