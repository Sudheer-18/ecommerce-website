package com.example.demo.controller;

import com.example.demo.model.CartItem;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CartController {
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartController(CartItemRepository cartItemRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @GetMapping("/customer/cart")
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(cartItemRepository.findByUser(user));
    }

    @PostMapping("/customer/cart")
    public ResponseEntity<?> addToCart(Authentication authentication, @RequestBody Map<String, Object> body) {
        User user = getCurrentUser(authentication);
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = Integer.parseInt(body.getOrDefault("quantity", 1).toString());
        Product product = productRepository.findById(productId).orElseThrow();

        if (quantity > product.getStockQuantity()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Requested quantity exceeds stock"));
        }

        var existing = cartItemRepository.findByUserAndProduct(user, product);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return ResponseEntity.ok(cartItemRepository.save(item));
        }
        CartItem item = new CartItem(user, product, quantity);
        return ResponseEntity.ok(cartItemRepository.save(item));
    }

    @DeleteMapping("/customer/cart/{productId}")
    public ResponseEntity<Void> removeFromCart(Authentication authentication, @PathVariable Long productId) {
        User user = getCurrentUser(authentication);
        Product product = productRepository.findById(productId).orElseThrow();
        cartItemRepository.findByUserAndProduct(user, product).ifPresent(cartItemRepository::delete);
        return ResponseEntity.noContent().build();
    }
}
