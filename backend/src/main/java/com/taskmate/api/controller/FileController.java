package com.taskmate.api.controller;

import com.taskmate.api.dto.file.FileResponse;
import com.taskmate.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/teams/{teamId}/files")
@RequiredArgsConstructor
public class FileController {

  private final FileService fileService;

  @GetMapping
  public List<FileResponse> list(@PathVariable Long teamId) {
    return fileService.list(teamId).stream().map(f -> FileResponse.builder()
        .id(f.getId())
        .teamId(f.getTeam().getId())
        .uploadedByUserId(f.getUploadedBy().getId())
        .originalName(f.getOriginalName())
        .contentType(f.getContentType())
        .sizeBytes(f.getSizeBytes())
        .createdAt(f.getCreatedAt())
        .build()).toList();
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public FileResponse upload(@PathVariable Long teamId, @RequestPart("file") MultipartFile file) {
    var f = fileService.upload(teamId, file);
    return FileResponse.builder()
        .id(f.getId())
        .teamId(f.getTeam().getId())
        .uploadedByUserId(f.getUploadedBy().getId())
        .originalName(f.getOriginalName())
        .contentType(f.getContentType())
        .sizeBytes(f.getSizeBytes())
        .createdAt(f.getCreatedAt())
        .build();
  }

  @GetMapping("/{fileId}/download")
  public ResponseEntity<Resource> download(@PathVariable Long teamId, @PathVariable Long fileId) {
    var meta = fileService.getMeta(fileId);
    Resource res = fileService.download(fileId);

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(meta.getContentType()))
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + meta.getOriginalName().replace("\"", "") + "\"")
        .body(res);
  }
}
