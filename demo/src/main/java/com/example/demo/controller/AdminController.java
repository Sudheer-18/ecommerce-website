package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminController(ProductRepository productRepository, CategoryRepository categoryRepository,
                          UserRepository userRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalProducts", productRepository.count());
        data.put("totalOrders", orderRepository.count());
        data.put("totalCustomers", userRepository.count());
        data.put("pendingOrders", orderRepository.findAllByOrderByCreatedAtDesc().stream().filter(o -> o.getStatus() == OrderStatus.PENDING).count());
        data.put("lowStockProducts", productRepository.findAll().stream().filter(p -> p.getStockQuantity() < 10).count());
        data.put("recentOrders", orderRepository.findAllByOrderByCreatedAtDesc().stream().limit(5).toList());
        return ResponseEntity.ok(data);
    }

    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        if (productRepository.existsBySku(product.getSku())) {
            throw new IllegalArgumentException("SKU already exists");
        }
        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product existing = productRepository.findById(id).orElseThrow();
        product.setId(existing.getId());
        return ResponseEntity.ok(productRepository.save(product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new IllegalArgumentException("Category already exists");
        }
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        Category existing = categoryRepository.findById(id).orElseThrow();
        category.setId(existing.getId());
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
