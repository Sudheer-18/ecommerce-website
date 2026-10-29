package com.example.demo.repository;

import com.example.demo.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    boolean existsBySku(String sku);

    @Query("SELECT p FROM Product p WHERE p.active = true AND (:category IS NULL OR p.category.name = :category) AND (:brand IS NULL OR p.brand = :brand) AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND (:minPrice IS NULL OR p.discountedPrice >= :minPrice) AND (:maxPrice IS NULL OR p.discountedPrice <= :maxPrice)")
    Page<Product> searchProducts(@Param("category") String category,
                                @Param("brand") String brand,
                                @Param("keyword") String keyword,
                                @Param("minPrice") java.math.BigDecimal minPrice,
                                @Param("maxPrice") java.math.BigDecimal maxPrice,
                                Pageable pageable);

    List<Product> findTop8ByActiveTrueOrderByCreatedAtDesc();
    List<Product> findTop8ByActiveTrueOrderByRatingDesc();
    List<Product> findTop6ByActiveTrueOrderByCreatedAtDesc();
    List<Product> findByCategory_NameIgnoreCaseAndActiveTrue(String categoryName);
}
