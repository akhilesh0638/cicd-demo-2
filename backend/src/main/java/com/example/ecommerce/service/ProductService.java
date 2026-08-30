package com.example.ecommerce.service;

import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.dto.request.ProductRequest;
import com.example.ecommerce.dto.request.StockUpdateRequest;

import java.util.List;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    ProductDTO getProductById(Long id);
    List<ProductDTO> getProductsByCategory(Long categoryId);
    List<ProductDTO> searchProducts(String keyword);
    ProductDTO createProduct(ProductRequest request);
    ProductDTO updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    ProductDTO updateStock(Long id, StockUpdateRequest request);
}
