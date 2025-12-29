package com.taskmate.domain;

import com.taskmate.domain.enums.GlobalRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email", columnList = "email", unique = true)
})
public class User extends BaseEntity {

  @Column(nullable = false, length = 120)
  private String name;

  @Column(nullable = false, length = 180, unique = true)
  private String email;

  @Column(nullable = false, length = 255)
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private GlobalRole role = GlobalRole.MEMBER;

  @Column(nullable = false, length = 5)
  private String initials;
}
