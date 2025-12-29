package com.taskmate.api.dto.auth;

import com.taskmate.api.dto.UserResponse;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
  private String token;
  private UserResponse user;
}
