package com.taskmate.repo;

import com.taskmate.domain.FileResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileResourceRepository extends JpaRepository<FileResource, Long> {
  List<FileResource> findByTeamIdOrderByCreatedAtDesc(Long teamId);
}
