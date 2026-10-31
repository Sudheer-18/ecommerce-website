package com.example.demo.config;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.initial-admin-email:admin@electromart.com}")
    private String initialAdminEmail;

    @Value("${app.initial-admin-password:Admin@123}")
    private String initialAdminPassword;

    public DataInitializer(UserRepository userRepository, CategoryRepository categoryRepository,
                          ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(initialAdminEmail).isEmpty()) {
            User admin = new User("ElectroMart Admin", initialAdminEmail, passwordEncoder.encode(initialAdminPassword), Role.ADMIN);
            userRepository.save(admin);
        }

        if (categoryRepository.count() == 0) {
            Category smartphones = categoryRepository.save(new Category("Smartphones", "Smartphones", "https://images.unsplash.com/..."));
            Category laptops = categoryRepository.save(new Category("Laptops", "Laptops", "https://images.unsplash.com/..."));
            Category accessories = categoryRepository.save(new Category("Accessories", "Accessories", "https://images.unsplash.com/..."));

            productRepository.saveAll(List.of(
                new Product("EM-SM-001", "iPhone 15 Pro", "Apple", "A17 Pro flagship smartphone", "A premium flagship phone with titanium frame and Pro camera system.", smartphones, new BigDecimal("134999"), new BigDecimal("119999"), 24, List.of("https://images.unsplash.com/...")),
                new Product("EM-LP-001", "Dell XPS 13", "Dell", "Ultra-light laptop", "A premium ultrabook with AI-ready performance for work and creativity.", laptops, new BigDecimal("119999"), new BigDecimal("98999"), 12, List.of("https://images.unsplash.com/...")),
                new Product("EM-AC-001", "Noise Cancelling Headphones", "Bose", "Immersive audio", "Wireless noise cancelling headphones for travel and work.", accessories, new BigDecimal("24999"), new BigDecimal("19999"), 18, List.of("https://images.unsplash.com/..."))
            ));
        }
    }
}
