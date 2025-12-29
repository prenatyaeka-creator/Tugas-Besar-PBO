package com.taskmate;

import com.taskmate.domain.User;
import com.taskmate.domain.enums.GlobalRole;
import com.taskmate.repo.UserRepository;
import com.taskmate.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

public class TestSupport {

  public static User createUser(UserRepository repo, PasswordEncoder encoder, String name, String email, String password, GlobalRole role) {
    User u = new User();
    u.setName(name);
    u.setEmail(email.toLowerCase());
    u.setPasswordHash(encoder.encode(password));
    u.setRole(role);
    u.setInitials("TS");
    return repo.save(u);
  }

  public static String tokenFor(JwtService jwtService, User user) {
    return jwtService.generateToken(user.getEmail(), Map.of("uid", user.getId(), "role", user.getRole().name()));
  }
}
