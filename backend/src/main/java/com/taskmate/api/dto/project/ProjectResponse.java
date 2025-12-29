package com.taskmate.api.dto.project;

import com.taskmate.domain.enums.ProjectStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ProjectResponse {
  private Long id;
  private Long teamId;
  private String name;
  private String description;
  private ProjectStatus status;
  private LocalDate startDate;
  private LocalDate dueDate;
}
