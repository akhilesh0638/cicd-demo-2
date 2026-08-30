package com.example.ecommerce.service;

import com.example.ecommerce.dto.UserDTO;
import com.example.ecommerce.dto.request.RegisterRequest;

public interface UserService {
    UserDTO register(RegisterRequest request);
    UserDTO getUserById(Long id);
    UserDTO getUserByEmail(String email);
}
