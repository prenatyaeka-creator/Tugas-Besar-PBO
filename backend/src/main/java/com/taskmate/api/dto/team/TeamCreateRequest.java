package com.taskmate.api.dto.team;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TeamCreateRequest {
  @NotBlank
  @Size(max = 120)
  private String name;

  @Size(max = 2000)
  private String description;
}
