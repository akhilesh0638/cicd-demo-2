package com.example.ecommerce.service;

import com.example.ecommerce.dto.CategoryDTO;
import com.example.ecommerce.dto.request.CategoryRequest;

import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();
    CategoryDTO getCategoryById(Long id);
    CategoryDTO createCategory(CategoryRequest request);
}
