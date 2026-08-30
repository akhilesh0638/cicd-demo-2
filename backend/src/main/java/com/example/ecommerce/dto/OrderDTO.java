package com.example.ecommerce.dto;

import com.example.ecommerce.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private String shippingAddress;
    private List<OrderItemDTO> items;
    private LocalDateTime createdAt;
}
