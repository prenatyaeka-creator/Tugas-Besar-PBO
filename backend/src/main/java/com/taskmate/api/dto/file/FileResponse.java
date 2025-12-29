package com.taskmate.api.dto.file;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class FileResponse {
  private Long id;
  private Long teamId;
  private Long uploadedByUserId;
  private String originalName;
  private String contentType;
  private long sizeBytes;
  private Instant createdAt;
}
