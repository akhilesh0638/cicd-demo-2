package com.example.ecommerce.service;

import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.dto.request.ProductRequest;
import com.example.ecommerce.dto.request.StockUpdateRequest;
import com.example.ecommerce.entity.Category;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Category category;
    private Product product;

    @BeforeEach
    void setUp() {
        category = Category.builder().id(1L).name("Electronics").build();
        product = Product.builder()
                .id(1L)
                .name("Wireless Earbuds")
                .description("Bluetooth earbuds")
                .price(new BigDecimal("1999.00"))
                .stock(100)
                .imageUrl("http://example.com/image.jpg")
                .category(category)
                .build();
    }

    @Test
    void createProduct_shouldReturnSavedProductDTO() {
        ProductRequest request = new ProductRequest(
                "Wireless Earbuds", "Bluetooth earbuds", new BigDecimal("1999.00"), 100,
                "http://example.com/image.jpg", 1L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductDTO result = productService.createProduct(request);

        assertNotNull(result);
        assertEquals("Wireless Earbuds", result.getName());
        assertEquals(100, result.getStock());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void getProductById_shouldReturnProduct_whenExists() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductDTO result = productService.getProductById(1L);

        assertEquals(1L, result.getId());
        assertEquals("Wireless Earbuds", result.getName());
    }

    @Test
    void getProductById_shouldThrow_whenNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(99L));
    }

    @Test
    void getAllProducts_shouldReturnList() {
        when(productRepository.findAll()).thenReturn(List.of(product));

        List<ProductDTO> results = productService.getAllProducts();

        assertEquals(1, results.size());
        assertEquals("Wireless Earbuds", results.get(0).getName());
    }

    @Test
    void updateStock_shouldUpdateAndReturnProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        StockUpdateRequest request = new StockUpdateRequest(50);
        ProductDTO result = productService.updateStock(1L, request);

        assertNotNull(result);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void deleteProduct_shouldThrow_whenProductNotFound() {
        when(productRepository.findById(5L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.deleteProduct(5L));
        verify(productRepository, never()).delete(any(Product.class));
    }
}
