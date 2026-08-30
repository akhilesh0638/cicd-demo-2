package com.example.ecommerce.service;

import com.example.ecommerce.dto.CartDTO;
import com.example.ecommerce.dto.request.AddToCartRequest;
import com.example.ecommerce.dto.request.UpdateCartItemRequest;

public interface CartService {
    CartDTO getCartByUserId(Long userId);
    CartDTO addItemToCart(Long userId, AddToCartRequest request);
    CartDTO updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request);
    CartDTO removeCartItem(Long userId, Long itemId);
    void clearCart(Long userId);
}
