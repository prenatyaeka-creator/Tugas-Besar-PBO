package com.taskmate.api.dto.task;

import com.taskmate.domain.enums.TaskPriority;
import com.taskmate.domain.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskCreateRequest {
  // di-set dari path /api/projects/{projectId}/tasks
  private Long projectId;

  @NotBlank
  @Size(max = 200)
  private String title;

  @Size(max = 6000)
  private String description;

  private TaskStatus status = TaskStatus.TODO;
  private TaskPriority priority = TaskPriority.MEDIUM;

  private Long assignedToUserId;
  private LocalDate dueDate;
}
