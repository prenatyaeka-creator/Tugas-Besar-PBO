package com.taskmate.service.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
  String store(MultipartFile file);
  Resource loadAsResource(String storageKey);
}
