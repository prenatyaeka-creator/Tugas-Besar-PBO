package com.taskmate.domain;

import com.taskmate.domain.enums.TaskPriority;
import com.taskmate.domain.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "tasks", indexes = {
    @Index(name = "idx_tasks_project", columnList = "project_id"),
    @Index(name = "idx_tasks_assignee", columnList = "assigned_to_user_id")
})
public class Task extends BaseEntity {

  @ManyToOne(optional = false)
  @JoinColumn(name = "project_id", nullable = false)
  private Project project;

  @ManyToOne(optional = false)
  @JoinColumn(name = "created_by_user_id", nullable = false)
  private User createdBy;

  @ManyToOne
  @JoinColumn(name = "assigned_to_user_id")
  private User assignedTo;

  @Column(nullable = false, length = 200)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private TaskStatus status = TaskStatus.TODO;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private TaskPriority priority = TaskPriority.MEDIUM;

  private LocalDate dueDate;
}
