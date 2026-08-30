package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.dto.request.CreateOrderRequest;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(CreateOrderRequest request);
    List<OrderDTO> getOrdersByUserId(Long userId);
    OrderDTO getOrderById(Long orderId);
}
