package com.taskmate.service;

import com.taskmate.api.error.ForbiddenException;
import com.taskmate.domain.User;
import com.taskmate.repo.UserRepository;
import com.taskmate.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService implements CurrentUserProvider {

  private final UserRepository userRepository;

  @Override
  public User requireCurrentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails cud)) {
      throw new ForbiddenException("Unauthenticated");
    }
    // Refresh from DB (so we always have latest role/name)
    return userRepository.findByEmail(cud.getUsername())
        .orElseThrow(() -> new ForbiddenException("User no longer exists"));
  }
}
