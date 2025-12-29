package com.taskmate.service;

import com.taskmate.api.dto.task.TaskCreateRequest;
import com.taskmate.api.dto.task.TaskUpdateRequest;
import com.taskmate.api.error.ForbiddenException;
import com.taskmate.api.error.NotFoundException;
import com.taskmate.domain.Project;
import com.taskmate.domain.Task;
import com.taskmate.domain.User;
import com.taskmate.domain.enums.GlobalRole;
import com.taskmate.repo.ProjectRepository;
import com.taskmate.repo.TaskRepository;
import com.taskmate.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl extends AbstractCrudService<Task, Long> implements TaskService {

  private final TaskRepository taskRepository;
  private final ProjectRepository projectRepository;
  private final UserRepository userRepository;
  private final CurrentUserProvider currentUserProvider;
  private final PermissionService permissionService;

  @Override
  protected JpaRepository<Task, Long> repo() {
    return taskRepository;
  }

  @Override
  protected String notFoundMessage(Long id) {
    return "Task not found: " + id;
  }

  @Override
  @Transactional
  public Task create(TaskCreateRequest req) {
    User me = currentUserProvider.requireCurrentUser();
    Project project = projectRepository.findById(req.getProjectId())
        .orElseThrow(() -> new NotFoundException("Project not found: " + req.getProjectId()));

    Long teamId = project.getTeam().getId();
    permissionService.assertTeamMember(teamId, me.getId());

    Task t = new Task();
    t.setProject(project);
    t.setCreatedBy(me);
    t.setTitle(req.getTitle());
    t.setDescription(req.getDescription());
    t.setStatus(req.getStatus());
    t.setPriority(req.getPriority());
    t.setDueDate(req.getDueDate());

    if (req.getAssignedToUserId() != null) {
      User assignee = userRepository.findById(req.getAssignedToUserId())
          .orElseThrow(() -> new NotFoundException("User not found: " + req.getAssignedToUserId()));
      // optional: require assignee also in team
      permissionService.assertTeamMember(teamId, assignee.getId());
      t.setAssignedTo(assignee);
    }

    return taskRepository.save(t);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Task> listByProject(Long projectId) {
    User me = currentUserProvider.requireCurrentUser();
    Project project = projectRepository.findById(projectId)
        .orElseThrow(() -> new NotFoundException("Project not found: " + projectId));
    permissionService.assertTeamMember(project.getTeam().getId(), me.getId());
    return taskRepository.findByProjectId(projectId);
  }

  @Override
  @Transactional
  public Task update(Long taskId, TaskUpdateRequest req) {
    User me = currentUserProvider.requireCurrentUser();
    Task t = getOrThrow(taskId);

    Long teamId = t.getProject().getTeam().getId();
    permissionService.assertTeamMember(teamId, me.getId());

    boolean isAdmin = me.getRole() == GlobalRole.ADMIN;
    boolean isCreator = t.getCreatedBy().getId().equals(me.getId());
    boolean isAssignee = t.getAssignedTo() != null && t.getAssignedTo().getId().equals(me.getId());
    if (!isAdmin && !isCreator && !isAssignee) {
      throw new ForbiddenException("Only ADMIN, creator, or assignee can update this task");
    }

    if (req.getTitle() != null) t.setTitle(req.getTitle());
    if (req.getDescription() != null) t.setDescription(req.getDescription());
    if (req.getStatus() != null) t.setStatus(req.getStatus());
    if (req.getPriority() != null) t.setPriority(req.getPriority());
    if (req.getDueDate() != null) t.setDueDate(req.getDueDate());

    if (req.getAssignedToUserId() != null) {
      User assignee = userRepository.findById(req.getAssignedToUserId())
          .orElseThrow(() -> new NotFoundException("User not found: " + req.getAssignedToUserId()));
      permissionService.assertTeamMember(teamId, assignee.getId());
      t.setAssignedTo(assignee);
    }

    return taskRepository.save(t);
  }

  @Override
  @Transactional
  public void delete(Long taskId) {
    User me = currentUserProvider.requireCurrentUser();
    Task t = getOrThrow(taskId);
    Long teamId = t.getProject().getTeam().getId();
    permissionService.assertTeamMember(teamId, me.getId());

    boolean isAdmin = me.getRole() == GlobalRole.ADMIN;
    boolean isCreator = t.getCreatedBy().getId().equals(me.getId());
    if (!isAdmin && !isCreator) {
      throw new ForbiddenException("Only ADMIN or creator can delete this task");
    }
    super.delete(taskId);
  }
}
