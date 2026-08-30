package com.example.ecommerce.service;

import com.example.ecommerce.dto.CartDTO;
import com.example.ecommerce.dto.request.AddToCartRequest;
import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.entity.Category;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.exception.InsufficientStockException;
import com.example.ecommerce.repository.CartItemRepository;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.service.impl.CartServiceImpl;
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
class CartServiceImplTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private CartItemRepository cartItemRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    private User user;
    private Cart cart;
    private Product product;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).name("Demo Customer").email("customer@example.com").build();
        cart = Cart.builder().id(1L).user(user).items(new ArrayList<>()).build();
        Category category = Category.builder().id(1L).name("Electronics").build();
        product = Product.builder()
                .id(1L).name("Wireless Earbuds")
                .price(new BigDecimal("1999.00"))
                .stock(5)
                .category(category)
                .build();
    }

    @Test
    void addItemToCart_shouldAddNewItem_whenStockAvailable() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCartIdAndProductId(1L, 1L)).thenReturn(Optional.empty());
        when(cartRepository.findById(1L)).thenReturn(Optional.of(cart));

        AddToCartRequest request = new AddToCartRequest(1L, 2);
        CartDTO result = cartService.addItemToCart(1L, request);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
    }

    @Test
    void addItemToCart_shouldThrow_whenStockInsufficient() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        AddToCartRequest request = new AddToCartRequest(1L, 10); // more than available stock of 5

        assertThrows(InsufficientStockException.class, () -> cartService.addItemToCart(1L, request));
    }

    @Test
    void getCartByUserId_shouldCreateCart_whenNoneExists() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        CartDTO result = cartService.getCartByUserId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getUserId());
        assertTrue(result.getItems().isEmpty());
    }
}
