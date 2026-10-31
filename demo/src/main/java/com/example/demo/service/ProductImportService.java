package com.example.demo.service;

import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Service
public class ProductImportService {
    private static final String DUMMY_JSON_BASE = "https://dummyjson.com";
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public ProductImportService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public ImportSummary importAll() {
        ImportSummary summary = new ImportSummary();
        List<ImportSource> sources = List.of(
            new ImportSource("smartphones", "https://dummyjson.com/products/category/smartphones"),
            new ImportSource("laptops", "https://dummyjson.com/products/category/laptops"),
            new ImportSource("mobile-accessories", "https://dummyjson.com/products/category/mobile-accessories"),
            new ImportSource("tablets", "https://dummyjson.com/products/search?q=tablet")
        );

        for (ImportSource source : sources) {
            summary.addSource(source.name());
            try {
                Map<String, Object> response = fetch(source.url());
                Object products = response.get("products");
                if (!(products instanceof List<?> rawProducts)) {
                    summary.addError(source.name(), "No products array returned");
                    continue;
                }

                for (Object item : rawProducts) {
                    if (!(item instanceof Map<?, ?> productMap)) {
                        continue;
                    }
                    try {
                        Product product = mapProduct(productMap, source.name());
                        if (product == null) {
                            summary.addSkipped(source.name(), "invalid product payload");
                            continue;
                        }

                        Product existing = productRepository.findByExternalSourceAndExternalProductId(product.getExternalSource(), product.getExternalProductId()).orElse(null);
                        if (existing != null) {
                            summary.addDuplicate(source.name(), existing.getName());
                            continue;
                        }

                        if (productRepository.existsBySku(product.getSku())) {
                            summary.addDuplicate(source.name(), product.getName());
                            continue;
                        }

                        productRepository.save(product);
                        summary.addImported(source.name(), product.getName());
                    } catch (Exception ex) {
                        summary.addError(source.name(), "Failed product mapping: " + ex.getMessage());
                    }
                }
            } catch (Exception ex) {
                summary.addError(source.name(), ex.getMessage());
            }
        }

        return summary;
    }

    private Map<String, Object> fetch(String url) {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                throw new IllegalStateException("Request failed: " + url);
            }
            return response.getBody();
        } catch (RestClientException ex) {
            throw new IllegalStateException("External API request failed for " + url + ": " + ex.getMessage(), ex);
        }
    }

    private Product mapProduct(Map<?, ?> productMap, String source) {
        Object id = productMap.get("id");
        String externalProductId = id == null ? null : String.valueOf(id);
        if (externalProductId == null || externalProductId.isBlank()) {
            return null;
        }

        String name = asString(productMap.get("title"));
        String description = asString(productMap.get("description"));
        String brand = asString(productMap.get("brand"));
        String categoryNameValue = asString(productMap.get("category"));
        final String categoryName = (categoryNameValue == null || categoryNameValue.isBlank())
            ? (source.equals("tablets") ? "Tablets" : titleToCategory(source))
            : categoryNameValue;

        Category category = categoryRepository.findAll().stream()
            .filter(item -> item.getName().equalsIgnoreCase(categoryName))
            .findFirst()
            .orElseGet(() -> categoryRepository.save(new Category(categoryName, categoryName, "")));

        BigDecimal price = toDecimal(productMap.get("price"));
        BigDecimal discountPercentage = toDecimal(productMap.get("discountPercentage"));
        BigDecimal discountedPrice = price.subtract(price.multiply(discountPercentage).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        double rating = toDouble(productMap.get("rating"));
        int stock = toInt(productMap.get("stock"));
        String thumbnail = asString(productMap.get("thumbnail"));
        List<String> images = new ArrayList<>();
        Object imageList = productMap.get("images");
        if (imageList instanceof List<?> items) {
            for (Object image : items) {
                String imageUrl = asString(image);
                if (imageUrl != null && !imageUrl.isBlank()) {
                    images.add(imageUrl);
                }
            }
        }
        if (images.isEmpty() && thumbnail != null) {
            images.add(thumbnail);
        }

        List<String> specs = new ArrayList<>();
        Object specsObj = productMap.get("specifications");
        if (specsObj instanceof Map<?, ?> map) {
            for (Object value : map.values()) {
                String spec = asString(value);
                if (spec != null && !spec.isBlank()) {
                    specs.add(spec);
                }
            }
        }

        String shortDescription = description != null && !description.isBlank() ? description : name;
        String sku = "DUMMY-" + source + "-" + externalProductId;
        Product product = new Product();
        product.setExternalSource("dummyjson");
        product.setExternalProductId(externalProductId);
        product.setSku(sku);
        product.setName(name);
        product.setBrand(brand == null || brand.isBlank() ? "Unknown" : brand);
        product.setShortDescription(shortDescription);
        product.setDescription(description);
        product.setCategory(category);
        product.setPrice(price);
        product.setDiscountedPrice(discountedPrice);
        product.setDiscountPercentage(discountPercentage);
        product.setRating(rating);
        product.setReviewCount(0);
        product.setStockQuantity(stock);
        product.setActive(true);
        product.setFeatured(false);
        product.setThumbnail(thumbnail);
        product.setImageUrls(images);
        product.setSpecifications(specs);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return product;
    }

    private String titleToCategory(String source) {
        return switch (source) {
            case "smartphones" -> "Smartphones";
            case "laptops" -> "Laptops";
            case "mobile-accessories" -> "Mobile Accessories";
            case "tablets" -> "Tablets";
            default -> "Accessories";
        };
    }

    private String asString(Object value) {
        if (value == null) return null;
        return String.valueOf(value).trim();
    }

    private BigDecimal toDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        try {
            return new BigDecimal(String.valueOf(value)).setScale(2, RoundingMode.HALF_UP);
        } catch (Exception ex) {
            return BigDecimal.ZERO;
        }
    }

    private double toDouble(Object value) {
        if (value == null) return 0;
        try {
            return Double.parseDouble(String.valueOf(value));
        } catch (Exception ex) {
            return 0;
        }
    }

    private int toInt(Object value) {
        if (value == null) return 0;
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (Exception ex) {
            return 0;
        }
    }

    public record ImportSource(String name, String url) {}

    public static class ImportSummary {
        private final Set<String> importedSources = new LinkedHashSet<>();
        private final Set<String> duplicates = new LinkedHashSet<>();
        private final Set<String> errors = new LinkedHashSet<>();
        private final Set<String> skipped = new LinkedHashSet<>();
        private int importedCount;
        private int duplicateCount;

        public void addSource(String source) {
            importedSources.add(source);
        }

        public void addImported(String source, String name) {
            importedCount++;
            importedSources.add(source);
        }

        public void addDuplicate(String source, String name) {
            duplicateCount++;
            duplicates.add(source + ": " + name);
        }

        public void addSkipped(String source, String reason) {
            skipped.add(source + ": " + reason);
        }

        public void addError(String source, String reason) {
            errors.add(source + ": " + reason);
        }

        public int getImportedCount() { return importedCount; }
        public int getDuplicateCount() { return duplicateCount; }
        public Set<String> getImportedSources() { return importedSources; }
        public Set<String> getDuplicates() { return duplicates; }
        public Set<String> getErrors() { return errors; }
        public Set<String> getSkipped() { return skipped; }
    }
}
