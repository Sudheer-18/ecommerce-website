package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {
    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/products")
    public ResponseEntity<?> getProducts(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String brand,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<Product> products = productRepository.searchProducts(category, brand, keyword, minPrice, maxPrice, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/featured")
    public ResponseEntity<?> getFeatured() {
        return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
            put("trending", productRepository.findTop8ByActiveTrueOrderByCreatedAtDesc());
            put("bestsellers", productRepository.findTop8ByActiveTrueOrderByRatingDesc());
            put("latest", productRepository.findTop6ByActiveTrueOrderByCreatedAtDesc());
        }});
    }
}
