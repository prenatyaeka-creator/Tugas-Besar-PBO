package com.taskmate.domain;

import com.taskmate.domain.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "projects", uniqueConstraints = @UniqueConstraint(name = "uk_team_project_name", columnNames = {"team_id", "name"}))
public class Project extends BaseEntity {

  @ManyToOne(optional = false)
  @JoinColumn(name = "team_id", nullable = false)
  private Team team;

  @ManyToOne(optional = false)
  @JoinColumn(name = "created_by_user_id", nullable = false)
  private User createdBy;

  @Column(nullable = false, length = 160)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ProjectStatus status = ProjectStatus.PLANNING;

  private LocalDate startDate;
  private LocalDate dueDate;
}
