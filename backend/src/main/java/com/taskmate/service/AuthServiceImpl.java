package com.taskmate.service;

import com.taskmate.api.dto.UserResponse;
import com.taskmate.api.dto.auth.AuthResponse;
import com.taskmate.api.dto.auth.LoginRequest;
import com.taskmate.api.dto.auth.RegisterRequest;
import com.taskmate.api.error.BadRequestException;
import com.taskmate.domain.User;
import com.taskmate.domain.enums.GlobalRole;
import com.taskmate.repo.UserRepository;
import com.taskmate.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  @Override
  public AuthResponse register(RegisterRequest req) {
    if (userRepository.existsByEmail(req.getEmail())) {
      throw new BadRequestException("Email already registered");
    }
    User u = new User();
    u.setName(req.getName());
    u.setEmail(req.getEmail().toLowerCase());
    u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
    u.setRole(userRepository.count() == 0 ? GlobalRole.ADMIN : GlobalRole.MEMBER);
    u.setInitials(makeInitials(req.getName()));
    u = userRepository.save(u);

    String token = jwtService.generateToken(u.getEmail(), Map.of(
        "uid", u.getId(),
        "role", u.getRole().name()
    ));

    return AuthResponse.builder()
        .token(token)
        .user(toUserResponse(u))
        .build();
  }

  @Override
  public AuthResponse login(LoginRequest req) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase(), req.getPassword())
    );

    User u = userRepository.findByEmail(req.getEmail().toLowerCase())
        .orElseThrow(() -> new BadRequestException("Invalid credentials"));

    String token = jwtService.generateToken(u.getEmail(), Map.of(
        "uid", u.getId(),
        "role", u.getRole().name()
    ));

    return AuthResponse.builder()
        .token(token)
        .user(toUserResponse(u))
        .build();
  }

  private UserResponse toUserResponse(User u) {
    return UserResponse.builder()
        .id(u.getId())
        .name(u.getName())
        .email(u.getEmail())
        .role(u.getRole())
        .initials(u.getInitials())
        .build();
  }

  private String makeInitials(String name) {
    String[] parts = name.trim().split("\\s+");
    if (parts.length == 0) return "U";
    String first = parts[0].substring(0, 1).toUpperCase();
    String second = parts.length > 1 ? parts[parts.length - 1].substring(0, 1).toUpperCase() : "";
    return (first + second).substring(0, Math.min(2, (first + second).length()));
  }
}
