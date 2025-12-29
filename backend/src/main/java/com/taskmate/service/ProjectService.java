package com.taskmate.service;

import com.taskmate.api.dto.project.ProjectCreateRequest;
import com.taskmate.api.dto.project.ProjectUpdateRequest;
import com.taskmate.domain.Project;

import java.util.List;

public interface ProjectService {
  Project create(ProjectCreateRequest req);
  List<Project> listByTeam(Long teamId);
  Project getForTeam(Long projectId, Long teamId);
  Project update(Long projectId, ProjectUpdateRequest req);
  void delete(Long projectId);
}
