package com.hostelsync.config;

import com.hostelsync.entity.Role;
import com.hostelsync.entity.User;
import com.hostelsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Default Admin Account if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@hostelsync.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .fullName("Super Administrator")
                    .role(Role.ADMIN)
                    .verified(true)
                    .approved(true)
                    .pending(false)
                    .active(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Seeded Default Admin Account: admin / Admin@123");
        }

        // Initialize Default Warden Account if not exists
        if (!userRepository.existsByUsername("warden")) {
            User warden = User.builder()
                    .username("warden")
                    .email("warden@hostelsync.com")
                    .password(passwordEncoder.encode("Warden@123"))
                    .fullName("Chief Warden")
                    .role(Role.WARDEN)
                    .verified(true)
                    .approved(true)
                    .pending(false)
                    .active(true)
                    .build();
            userRepository.save(warden);
            System.out.println("✅ Seeded Default Warden Account: warden / Warden@123");
        }
    }
}
