package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.service.ProductImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductImportService productImportService;

    public AdminController(ProductRepository productRepository, CategoryRepository categoryRepository,
                          UserRepository userRepository, OrderRepository orderRepository,
                          ProductImportService productImportService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productImportService = productImportService;
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

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/products/import")
    public ResponseEntity<Map<String, Object>> importProducts() {
        ProductImportService.ImportSummary summary = productImportService.importAll();
        Map<String, Object> response = new HashMap<>();
        response.put("importedCount", summary.getImportedCount());
        response.put("duplicateCount", summary.getDuplicateCount());
        response.put("errors", summary.getErrors());
        response.put("duplicates", summary.getDuplicates());
        response.put("skipped", summary.getSkipped());
        response.put("sources", summary.getImportedSources());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> request) {
        Product product = fromRequest(request);
        if (productRepository.existsBySku(product.getSku())) {
            throw new IllegalArgumentException("SKU already exists");
        }
        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Product existing = productRepository.findById(id).orElseThrow();
        Product updated = fromRequest(request, existing);
        updated.setId(existing.getId());
        updated.setCreatedAt(existing.getCreatedAt());
        return ResponseEntity.ok(productRepository.save(updated));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
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

    private Product fromRequest(Map<String, Object> request) {
        return fromRequest(request, null);
    }

    private Product fromRequest(Map<String, Object> request, Product existing) {
        String name = asText(request.get("name"));
        String brand = asText(request.get("brand"));
        String rawCategoryName = asText(request.get("category"));
        if (rawCategoryName == null || rawCategoryName.isBlank()) {
            rawCategoryName = asText(request.get("categoryName"));
        }
        if (rawCategoryName == null || rawCategoryName.isBlank()) {
            rawCategoryName = "Smartphones";
        }
        final String categoryName = rawCategoryName;

        Category category = categoryRepository.findAll().stream()
            .filter(item -> item.getName().equalsIgnoreCase(categoryName))
            .findFirst()
            .orElseGet(() -> categoryRepository.save(new Category(categoryName, categoryName, "")));

        Product product = existing != null ? existing : new Product();
        product.setName(name);
        product.setBrand(brand == null || brand.isBlank() ? "Unknown" : brand);
        product.setShortDescription(asText(request.get("shortDescription")) == null || asText(request.get("shortDescription")).isBlank()
            ? (asText(request.get("description")) == null ? name : asText(request.get("description")))
            : asText(request.get("shortDescription")));
        product.setDescription(asText(request.get("description")));
        product.setCategory(category);
        product.setPrice(asDecimal(request.get("price")));
        product.setDiscountedPrice(asDecimal(request.get("discountedPrice")));
        product.setDiscountPercentage(product.getPrice().signum() == 0 ? BigDecimal.ZERO : BigDecimal.valueOf(100)
            .multiply(product.getPrice().subtract(product.getDiscountedPrice()).divide(product.getPrice(), 4, java.math.RoundingMode.HALF_UP)));
        product.setRating(asDouble(request.get("rating")));
        product.setReviewCount(asInteger(request.get("reviewCount"), 0));
        product.setStockQuantity(asInteger(request.get("stockQuantity"), asInteger(request.get("stock"), 0)));
        product.setActive(Boolean.TRUE.equals(request.get("active")) || product.isActive());
        product.setFeatured(Boolean.TRUE.equals(request.get("featured")) || product.isFeatured());
        product.setThumbnail(asText(request.get("thumbnail")));

        List<String> images = new ArrayList<>();
        Object imageValues = request.get("imageUrls");
        if (imageValues instanceof List<?> list) {
            for (Object image : list) {
                String imageUrl = asText(image);
                if (imageUrl != null && !imageUrl.isBlank()) {
                    images.add(imageUrl);
                }
            }
        }
        if (images.isEmpty() && request.get("image") != null) {
            images.add(asText(request.get("image")));
        }
        if (images.isEmpty() && product.getImageUrls() != null) {
            images.addAll(product.getImageUrls());
        }
        product.setImageUrls(images);

        List<String> specs = new ArrayList<>();
        Object specifications = request.get("specifications");
        if (specifications instanceof List<?> list) {
            for (Object spec : list) {
                String specification = asText(spec);
                if (specification != null && !specification.isBlank()) {
                    specs.add(specification);
                }
            }
        }
        product.setSpecifications(specs);

        String sku = asText(request.get("sku"));
        if (sku == null || sku.isBlank()) {
            sku = "EM-" + categoryName.replaceAll("[^A-Za-z0-9]", "-").toUpperCase() + "-" + System.currentTimeMillis();
        }
        product.setSku(sku);

        if (product.getCreatedAt() == null) {
            product.setCreatedAt(LocalDateTime.now());
        }
        product.setUpdatedAt(LocalDateTime.now());
        return product;
    }

    private String asText(Object value) {
        return value == null ? null : String.valueOf(value).trim();
    }

    private BigDecimal asDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        try {
            return new BigDecimal(String.valueOf(value));
        } catch (Exception ex) {
            return BigDecimal.ZERO;
        }
    }

    private double asDouble(Object value) {
        if (value == null) return 0;
        try {
            return Double.parseDouble(String.valueOf(value));
        } catch (Exception ex) {
            return 0;
        }
    }

    private int asInteger(Object value, int fallback) {
        if (value == null) return fallback;
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (Exception ex) {
            return fallback;
        }
    }
}

