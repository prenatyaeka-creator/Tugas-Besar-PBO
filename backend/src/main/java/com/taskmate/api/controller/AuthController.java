package com.taskmate.api.controller;

import com.taskmate.api.dto.auth.AuthResponse;
import com.taskmate.api.dto.auth.ForgotPasswordRequest;
import com.taskmate.api.dto.auth.LoginRequest;
import com.taskmate.api.dto.auth.RegisterRequest;
import com.taskmate.api.dto.auth.ResetPasswordRequest;
import com.taskmate.api.dto.common.MessageResponse;
import com.taskmate.service.AuthService;
import com.taskmate.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final PasswordResetService passwordResetService;

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
    return ResponseEntity.ok(authService.register(req));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
    return ResponseEntity.ok(authService.login(req));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
    // For security: always respond 200 even if email isn't registered
    passwordResetService.requestOtp(req.getEmail());
    return ResponseEntity.ok(new MessageResponse("Jika email terdaftar, OTP telah dikirim."));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
    try {
      passwordResetService.resetPassword(req.getEmail(), req.getOtp(), req.getNewPassword());
      return ResponseEntity.ok(new MessageResponse("Password berhasil direset."));
    } catch (IllegalArgumentException ex) {
      return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
    }
  }
}
