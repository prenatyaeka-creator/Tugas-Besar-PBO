package com.taskmate.domain;

import com.taskmate.domain.enums.TeamRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "team_members",
    uniqueConstraints = @UniqueConstraint(name = "uk_team_user", columnNames = {"team_id", "user_id"}))
public class TeamMember extends BaseEntity {

  @ManyToOne(optional = false)
  @JoinColumn(name = "team_id", nullable = false)
  private Team team;

  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private TeamRole teamRole = TeamRole.MEMBER;
}
