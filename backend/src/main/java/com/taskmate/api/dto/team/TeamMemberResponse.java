package com.taskmate.api.dto.team;

import com.taskmate.domain.enums.TeamRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamMemberResponse {
  private Long id;
  private Long teamId;
  private Long userId;
  private String userName;
  private String userEmail;
  private TeamRole teamRole;
}
