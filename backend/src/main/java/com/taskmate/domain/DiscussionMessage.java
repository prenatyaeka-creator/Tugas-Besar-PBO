package com.taskmate.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "discussion_messages", indexes = {
    @Index(name = "idx_discussion_team", columnList = "team_id")
})
public class DiscussionMessage extends BaseEntity {

  @ManyToOne(optional = false)
  @JoinColumn(name = "team_id", nullable = false)
  private Team team;

  @ManyToOne(optional = false)
  @JoinColumn(name = "author_user_id", nullable = false)
  private User author;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;
}
