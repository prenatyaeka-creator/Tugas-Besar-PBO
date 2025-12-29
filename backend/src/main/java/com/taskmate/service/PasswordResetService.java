package com.taskmate.service;

import com.taskmate.domain.PasswordResetOtp;
import com.taskmate.domain.User;
import com.taskmate.repo.PasswordResetOtpRepository;
import com.taskmate.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

  private static final Duration OTP_TTL = Duration.ofMinutes(10);
  private final UserRepository userRepository;
  private final PasswordResetOtpRepository otpRepository;
  private final PasswordEncoder passwordEncoder;
  private final EmailService emailService;
  private final SecureRandom random = new SecureRandom();

  /**
   * Mengirim OTP ke email user (jika email terdaftar).
   * Untuk keamanan, method ini sengaja tidak membocorkan apakah email ada atau tidak.
   */
  @Transactional
  public void requestOtp(String email) {
    User user = userRepository.findByEmail(email).orElse(null);
    if (user == null) {
      return; // no-op
    }

    // invalidate previous OTP (optional, but makes behaviour clearer)
    otpRepository.findTopByUserAndUsedFalseOrderByCreatedAtDesc(user)
        .ifPresent(prev -> {
          prev.setUsed(true);
          otpRepository.save(prev);
        });

    String otp = generateOtp6();
    PasswordResetOtp token = PasswordResetOtp.builder()
        .user(user)
        .otpHash(passwordEncoder.encode(otp))
        .expiresAt(Instant.now().plus(OTP_TTL))
        .used(false)
        .createdAt(Instant.now())
        .build();
    otpRepository.save(token);

    String subject = "TaskMate - Kode OTP Reset Password";
    String body = "Halo " + user.getName() + ",\n\n" +
        "Berikut kode OTP untuk mereset password akun TaskMate Anda:\n\n" +
        "OTP: " + otp + "\n\n" +
        "Kode ini berlaku selama " + OTP_TTL.toMinutes() + " menit. " +
        "Jika Anda tidak meminta reset password, abaikan email ini.\n\n" +
        "- TaskMate";
    emailService.send(user.getEmail(), subject, body);
  }

  @Transactional
  public void resetPassword(String email, String otp, String newPassword) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("Email tidak terdaftar"));

    PasswordResetOtp token = otpRepository.findTopByUserAndUsedFalseOrderByCreatedAtDesc(user)
        .orElseThrow(() -> new IllegalArgumentException("OTP tidak ditemukan / sudah digunakan"));

    if (token.isUsed()) {
      throw new IllegalArgumentException("OTP sudah digunakan");
    }
    if (token.getExpiresAt().isBefore(Instant.now())) {
      token.setUsed(true);
      otpRepository.save(token);
      throw new IllegalArgumentException("OTP sudah kadaluarsa");
    }
    if (!passwordEncoder.matches(otp, token.getOtpHash())) {
      throw new IllegalArgumentException("OTP salah");
    }

    user.setPasswordHash(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    token.setUsed(true);
    otpRepository.save(token);
  }

  private String generateOtp6() {
    int n = random.nextInt(1_000_000);
    return String.format("%06d", n);
  }
}
