package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderController(OrderRepository orderRepository, CartItemRepository cartItemRepository,
                          UserRepository userRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName()).orElseThrow();
    }

    @GetMapping("/customer/orders")
    public ResponseEntity<List<Order>> getOrders(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(orderRepository.findByUserOrderByCreatedAtDesc(user));
    }

    @PostMapping("/customer/orders")
    public ResponseEntity<?> createOrder(Authentication authentication, @RequestBody Map<String, Object> payload) {
        User user = getCurrentUser(authentication);
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cart is empty"));
        }

        Order order = new Order();
        order.setUser(user);
        order.setCustomerName(user.getFullName());
        order.setShippingAddress(payload.getOrDefault("shippingAddress", "").toString());
        order.setContactNumber(payload.getOrDefault("contactNumber", "").toString());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Insufficient stock for " + product.getName()));
            }
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(cartItem.getQuantity());
            item.setUnitPrice(product.getDiscountedPrice());
            subtotal = subtotal.add(product.getDiscountedPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            items.add(item);
        }

        BigDecimal deliveryFee = subtotal.compareTo(new BigDecimal("999")) >= 0 ? BigDecimal.ZERO : new BigDecimal("49");
        BigDecimal discount = subtotal.compareTo(new BigDecimal("5000")) >= 0 ? new BigDecimal("399") : BigDecimal.ZERO;
        BigDecimal total = subtotal.add(deliveryFee).subtract(discount);

        order.setSubtotal(subtotal);
        order.setDeliveryFee(deliveryFee);
        order.setDiscount(discount);
        order.setTotal(total);
        order.setItems(items);

        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteByUser(user);
        return ResponseEntity.ok(savedOrder);
    }
}
