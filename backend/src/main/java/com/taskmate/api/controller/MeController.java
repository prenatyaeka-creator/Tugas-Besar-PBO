package com.taskmate.api.controller;

import com.taskmate.api.dto.UserResponse;
import com.taskmate.service.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MeController {

  private final CurrentUserProvider currentUserProvider;

  @GetMapping
  public UserResponse me() {
    var u = currentUserProvider.requireCurrentUser();
    return UserResponse.builder()
        .id(u.getId())
        .name(u.getName())
        .email(u.getEmail())
        .role(u.getRole())
        .initials(u.getInitials())
        .build();
  }
}
