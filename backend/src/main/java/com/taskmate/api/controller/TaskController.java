package com.taskmate.api.controller;

import com.taskmate.api.dto.task.*;
import com.taskmate.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

  private final TaskService taskService;

  @GetMapping
  public List<TaskResponse> list(@PathVariable Long projectId) {
    return taskService.listByProject(projectId).stream().map(t -> TaskResponse.builder()
        .id(t.getId())
        .projectId(t.getProject().getId())
        .title(t.getTitle())
        .description(t.getDescription())
        .status(t.getStatus())
        .priority(t.getPriority())
        .createdByUserId(t.getCreatedBy().getId())
        .assignedToUserId(t.getAssignedTo() == null ? null : t.getAssignedTo().getId())
        .dueDate(t.getDueDate())
        .build()).toList();
  }

  @PostMapping
  public TaskResponse create(@PathVariable Long projectId, @Valid @RequestBody TaskCreateRequest req) {
    req.setProjectId(projectId);
    var t = taskService.create(req);
    return TaskResponse.builder()
        .id(t.getId())
        .projectId(t.getProject().getId())
        .title(t.getTitle())
        .description(t.getDescription())
        .status(t.getStatus())
        .priority(t.getPriority())
        .createdByUserId(t.getCreatedBy().getId())
        .assignedToUserId(t.getAssignedTo() == null ? null : t.getAssignedTo().getId())
        .dueDate(t.getDueDate())
        .build();
  }

  @PutMapping("/{taskId}")
  public TaskResponse update(@PathVariable Long projectId, @PathVariable Long taskId, @Valid @RequestBody TaskUpdateRequest req) {
    var t = taskService.update(taskId, req);
    return TaskResponse.builder()
        .id(t.getId())
        .projectId(t.getProject().getId())
        .title(t.getTitle())
        .description(t.getDescription())
        .status(t.getStatus())
        .priority(t.getPriority())
        .createdByUserId(t.getCreatedBy().getId())
        .assignedToUserId(t.getAssignedTo() == null ? null : t.getAssignedTo().getId())
        .dueDate(t.getDueDate())
        .build();
  }

  @DeleteMapping("/{taskId}")
  public void delete(@PathVariable Long projectId, @PathVariable Long taskId) {
    taskService.delete(taskId);
  }
}
