package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.dto.request.CreateOrderRequest;
import com.example.ecommerce.entity.*;
import com.example.ecommerce.exception.BadRequestException;
import com.example.ecommerce.repository.*;
import com.example.ecommerce.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock private OrderRepository orderRepository;
    @Mock private CartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private ProductRepository productRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User user;
    private Cart cart;
    private Product product;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).name("Demo Customer").email("customer@example.com").build();
        Category category = Category.builder().id(1L).name("Electronics").build();
        product = Product.builder()
                .id(1L).name("Wireless Earbuds")
                .price(new BigDecimal("1999.00"))
                .stock(10)
                .category(category)
                .build();

        CartItem item = CartItem.builder().id(1L).product(product).quantity(2).build();
        cart = Cart.builder().id(1L).user(user).items(new ArrayList<>(java.util.List.of(item))).build();
    }

    @Test
    void createOrder_shouldThrow_whenCartIsEmpty() {
        Cart emptyCart = Cart.builder().id(1L).user(user).items(new ArrayList<>()).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(emptyCart));

        CreateOrderRequest request = new CreateOrderRequest(1L, "123 Main St");

        assertThrows(BadRequestException.class, () -> orderService.createOrder(request));
    }

    @Test
    void createOrder_shouldSucceed_andDecrementStock() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(100L);
            order.setCreatedAt(java.time.LocalDateTime.now());
            return order;
        });

        CreateOrderRequest request = new CreateOrderRequest(1L, "123 Main St");
        OrderDTO result = orderService.createOrder(request);

        assertNotNull(result);
        assertEquals(new BigDecimal("3998.00"), result.getTotalAmount());
        assertEquals(8, product.getStock()); // 10 - 2 purchased
    }
}
