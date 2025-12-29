package com.taskmate.service;

import com.taskmate.api.dto.auth.AuthResponse;
import com.taskmate.api.dto.auth.LoginRequest;
import com.taskmate.api.dto.auth.RegisterRequest;

public interface AuthService {
  AuthResponse register(RegisterRequest req);
  AuthResponse login(LoginRequest req);
}
