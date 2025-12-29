package com.taskmate.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "files", indexes = {
    @Index(name = "idx_files_team", columnList = "team_id")
})
public class FileResource extends BaseEntity {

  @ManyToOne(optional = false)
  @JoinColumn(name = "team_id", nullable = false)
  private Team team;

  @ManyToOne(optional = false)
  @JoinColumn(name = "uploaded_by_user_id", nullable = false)
  private User uploadedBy;

  @Column(nullable = false, length = 180)
  private String storageKey;

  @Column(nullable = false, length = 255)
  private String originalName;

  @Column(nullable = false, length = 120)
  private String contentType;

  @Column(nullable = false)
  private long sizeBytes;
}
