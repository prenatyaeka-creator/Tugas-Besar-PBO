package com.taskmate.api.dto.task;

import com.taskmate.domain.enums.TaskPriority;
import com.taskmate.domain.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TaskResponse {
  private Long id;
  private Long projectId;
  private String title;
  private String description;
  private TaskStatus status;
  private TaskPriority priority;
  private Long createdByUserId;
  private Long assignedToUserId;
  private LocalDate dueDate;
}
