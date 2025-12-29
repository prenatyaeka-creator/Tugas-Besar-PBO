package com.taskmate.api.dto.discussion;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class MessageResponse {
  private Long id;
  private Long teamId;
  private Long authorUserId;
  private String authorName;
  private String content;
  private Instant createdAt;
}
