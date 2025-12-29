package com.taskmate.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskmate.api.dto.auth.LoginRequest;
import com.taskmate.api.dto.auth.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerTest {

  @Autowired MockMvc mvc;
  @Autowired ObjectMapper om;

  @Test
  void register_then_login_returns_token() throws Exception {
    RegisterRequest reg = new RegisterRequest();
    reg.setName("Test User");
    reg.setEmail("test@taskmate.com");
    reg.setPassword("secret123");

    mvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(om.writeValueAsString(reg)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").exists())
        .andExpect(jsonPath("$.user.email").value("test@taskmate.com"));

    LoginRequest login = new LoginRequest();
    login.setEmail("test@taskmate.com");
    login.setPassword("secret123");

    mvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(om.writeValueAsString(login)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").exists())
        .andExpect(jsonPath("$.user.email").value("test@taskmate.com"));
  }
}
