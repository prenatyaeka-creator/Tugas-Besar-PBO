package com.taskmate.service;

import com.taskmate.api.dto.project.ProjectCreateRequest;
import com.taskmate.api.dto.project.ProjectUpdateRequest;
import com.taskmate.api.error.BadRequestException;
import com.taskmate.domain.Project;
import com.taskmate.domain.Team;
import com.taskmate.domain.User;
import com.taskmate.repo.ProjectRepository;
import com.taskmate.repo.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl extends AbstractCrudService<Project, Long> implements ProjectService {

  private final ProjectRepository projectRepository;
  private final TeamRepository teamRepository;
  private final CurrentUserProvider currentUserProvider;
  private final PermissionService permissionService;

  @Override
  protected JpaRepository<Project, Long> repo() {
    return projectRepository;
  }

  @Override
  protected String notFoundMessage(Long id) {
    return "Project not found: " + id;
  }

  @Override
  @Transactional
  public Project create(ProjectCreateRequest req) {
    User me = currentUserProvider.requireCurrentUser();
    permissionService.assertTeamMember(req.getTeamId(), me.getId());

    Team team = teamRepository.findById(req.getTeamId())
        .orElseThrow(() -> new BadRequestException("Team not found: " + req.getTeamId()));

    Project p = new Project();
    p.setTeam(team);
    p.setCreatedBy(me);
    p.setName(req.getName());
    p.setDescription(req.getDescription());
    p.setStatus(req.getStatus());
    p.setStartDate(req.getStartDate());
    p.setDueDate(req.getDueDate());
    return projectRepository.save(p);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Project> listByTeam(Long teamId) {
    User me = currentUserProvider.requireCurrentUser();
    permissionService.assertTeamMember(teamId, me.getId());
    return projectRepository.findByTeamId(teamId);
  }

  @Override
  @Transactional(readOnly = true)
  public Project getForTeam(Long projectId, Long teamId) {
    User me = currentUserProvider.requireCurrentUser();
    permissionService.assertTeamMember(teamId, me.getId());
    Project p = getOrThrow(projectId);
    if (!p.getTeam().getId().equals(teamId)) {
      throw new BadRequestException("Project does not belong to the team");
    }
    return p;
  }

  @Override
  @Transactional
  public Project update(Long projectId, ProjectUpdateRequest req) {
    Project p = getOrThrow(projectId);
    if (req.getName() != null) p.setName(req.getName());
    if (req.getDescription() != null) p.setDescription(req.getDescription());
    if (req.getStatus() != null) p.setStatus(req.getStatus());
    if (req.getStartDate() != null) p.setStartDate(req.getStartDate());
    if (req.getDueDate() != null) p.setDueDate(req.getDueDate());
    return projectRepository.save(p);
  }

  @Override
  @Transactional
  public void delete(Long projectId) {
    super.delete(projectId);
  }
}
