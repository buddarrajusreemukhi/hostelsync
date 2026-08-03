package com.hostelsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class HostelSyncApplication {

    public static void main(String[] args) {
        SpringApplication.run(HostelSyncApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 HOSTELSYNC Enterprise ERP Backend Started!");
        System.out.println("Swagger Docs: http://localhost:8080/swagger-ui.html");
        System.out.println("=================================================");
    }
}
