package com.taskmate.api.dto.team;

import com.taskmate.domain.enums.TeamRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TeamMemberAddRequest {
  @NotNull
  private Long userId;

  @NotNull
  private TeamRole teamRole;
}
