package com.taskmate.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskmate.TestSupport;
import com.taskmate.api.dto.team.TeamCreateRequest;
import com.taskmate.domain.User;
import com.taskmate.domain.enums.GlobalRole;
import com.taskmate.repo.UserRepository;
import com.taskmate.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TeamRoleAccessTest {

  @Autowired MockMvc mvc;
  @Autowired ObjectMapper om;
  @Autowired UserRepository userRepo;
  @Autowired PasswordEncoder encoder;
  @Autowired JwtService jwtService;

  private String memberToken;
  private String adminToken;

  @BeforeEach
  void setup() {
    userRepo.deleteAll();

    User admin = TestSupport.createUser(userRepo, encoder, "Admin", "admin@test.com", "admin123", GlobalRole.ADMIN);
    User member = TestSupport.createUser(userRepo, encoder, "Member", "member@test.com", "member123", GlobalRole.MEMBER);

    adminToken = TestSupport.tokenFor(jwtService, admin);
    memberToken = TestSupport.tokenFor(jwtService, member);
  }

  @Test
  void member_cannot_create_team() throws Exception {
    TeamCreateRequest req = new TeamCreateRequest();
    req.setName("New Team");
    req.setDescription("desc");

    mvc.perform(post("/api/teams")
            .header("Authorization", "Bearer " + memberToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(om.writeValueAsString(req)))
        .andExpect(status().isForbidden());
  }

  @Test
  void admin_can_create_team() throws Exception {
    TeamCreateRequest req = new TeamCreateRequest();
    req.setName("New Team");
    req.setDescription("desc");

    mvc.perform(post("/api/teams")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(om.writeValueAsString(req)))
        .andExpect(status().isOk());
  }
}
