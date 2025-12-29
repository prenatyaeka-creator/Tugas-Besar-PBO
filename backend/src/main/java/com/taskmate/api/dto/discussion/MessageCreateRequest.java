package com.taskmate.api.dto.discussion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MessageCreateRequest {
  // di-set dari path /api/teams/{teamId}/messages
  private Long teamId;

  @NotBlank
  @Size(max = 8000)
  private String content;
}
