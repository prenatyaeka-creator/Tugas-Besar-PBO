package com.taskmate.service;

import com.taskmate.domain.FileResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileService {
  FileResource upload(Long teamId, MultipartFile file);
  List<FileResource> list(Long teamId);
  Resource download(Long fileId);
  FileResource getMeta(Long fileId);
}
