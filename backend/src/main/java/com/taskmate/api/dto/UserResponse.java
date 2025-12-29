package com.taskmate.api.dto;

import com.taskmate.domain.enums.GlobalRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
  private Long id;
  private String name;
  private String email;
  private GlobalRole role;
  private String initials;
}
