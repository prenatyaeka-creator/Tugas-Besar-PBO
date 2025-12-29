package com.taskmate.api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
  @NotBlank
  @Email
  private String email;

  @NotBlank
  private String otp;

  @NotBlank
  @Size(min = 6, max = 72)
  private String newPassword;
}
