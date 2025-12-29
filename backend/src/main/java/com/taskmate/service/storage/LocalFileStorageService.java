package com.taskmate.service.storage;

import com.taskmate.api.error.BadRequestException;
import com.taskmate.api.error.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

  private final Path baseDir;

  public LocalFileStorageService(@Value("${taskmate.storage.local-dir}") String dir) {
    this.baseDir = Path.of(dir).toAbsolutePath().normalize();
    try {
      Files.createDirectories(this.baseDir);
    } catch (IOException e) {
      throw new IllegalStateException("Cannot create storage dir: " + baseDir, e);
    }
  }

  @Override
  public String store(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new BadRequestException("File is empty");
    }
    String cleanName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
    String key = UUID.randomUUID() + "_" + cleanName.replaceAll("[^a-zA-Z0-9._-]", "_");
    Path target = baseDir.resolve(key);
    try {
      Files.copy(file.getInputStream(), target);
      return key;
    } catch (IOException e) {
      throw new BadRequestException("Failed to store file");
    }
  }

  @Override
  public Resource loadAsResource(String storageKey) {
    Path p = baseDir.resolve(storageKey).normalize();
    if (!Files.exists(p)) throw new NotFoundException("File not found");
    return new FileSystemResource(p);
  }
}
