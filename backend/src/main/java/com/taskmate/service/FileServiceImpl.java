package com.taskmate.service;

import com.taskmate.api.error.NotFoundException;
import com.taskmate.domain.FileResource;
import com.taskmate.domain.Team;
import com.taskmate.domain.User;
import com.taskmate.repo.FileResourceRepository;
import com.taskmate.repo.TeamRepository;
import com.taskmate.service.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FileServiceImpl extends AbstractCrudService<FileResource, Long> implements FileService {

  private final FileResourceRepository fileRepo;
  private final TeamRepository teamRepo;
  private final CurrentUserProvider currentUserProvider;
  private final PermissionService permissionService;
  private final FileStorageService storageService;

  @Override
  protected JpaRepository<FileResource, Long> repo() {
    return fileRepo;
  }

  @Override
  protected String notFoundMessage(Long id) {
    return "File not found: " + id;
  }

  @Override
  @Transactional
  public FileResource upload(Long teamId, MultipartFile file) {
    User me = currentUserProvider.requireCurrentUser();
    permissionService.assertTeamMember(teamId, me.getId());

    Team team = teamRepo.findById(teamId).orElseThrow(() -> new NotFoundException("Team not found: " + teamId));
    String key = storageService.store(file);

    FileResource fr = new FileResource();
    fr.setTeam(team);
    fr.setUploadedBy(me);
    fr.setStorageKey(key);
    fr.setOriginalName(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
    fr.setContentType(file.getContentType() == null ? "application/octet-stream" : file.getContentType());
    fr.setSizeBytes(file.getSize());
    return fileRepo.save(fr);
  }

  @Override
  @Transactional(readOnly = true)
  public List<FileResource> list(Long teamId) {
    User me = currentUserProvider.requireCurrentUser();
    permissionService.assertTeamMember(teamId, me.getId());
    return fileRepo.findByTeamIdOrderByCreatedAtDesc(teamId);
  }

  @Override
  @Transactional(readOnly = true)
  public Resource download(Long fileId) {
    FileResource fr = fileRepo.findById(fileId).orElseThrow(() -> new NotFoundException("File not found: " + fileId));
    User me = currentUserProvider.requireCurrentUser();
    permissionService.assertTeamMember(fr.getTeam().getId(), me.getId());
    return storageService.loadAsResource(fr.getStorageKey());
  }

  @Override
  @Transactional(readOnly = true)
  public FileResource getMeta(Long fileId) {
    return fileRepo.findById(fileId).orElseThrow(() -> new NotFoundException("File not found: " + fileId));
  }
}
