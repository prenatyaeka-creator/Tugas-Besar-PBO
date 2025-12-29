package com.taskmate.api.dto.project;

import com.taskmate.domain.enums.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProjectCreateRequest {
  // di-set dari path /api/teams/{teamId}/projects
  private Long teamId;

  @NotBlank
  @Size(max = 160)
  private String name;

  @Size(max = 4000)
  private String description;

  private ProjectStatus status = ProjectStatus.PLANNING;
  private LocalDate startDate;
  private LocalDate dueDate;
}
