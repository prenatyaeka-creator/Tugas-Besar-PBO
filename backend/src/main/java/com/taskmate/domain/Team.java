package com.taskmate.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "teams")
public class Team extends BaseEntity {

  @Column(nullable = false, length = 120)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @ManyToOne(optional = false)
  @JoinColumn(name = "created_by_user_id", nullable = false)
  private User createdBy;
}
