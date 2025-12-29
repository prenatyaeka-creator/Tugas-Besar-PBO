package com.taskmate.api.controller;

import com.taskmate.api.dto.project.*;
import com.taskmate.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams/{teamId}/projects")
@RequiredArgsConstructor
public class ProjectController {

  private final ProjectService projectService;

  @GetMapping
  public List<ProjectResponse> list(@PathVariable Long teamId) {
    return projectService.listByTeam(teamId).stream().map(p -> ProjectResponse.builder()
        .id(p.getId())
        .teamId(p.getTeam().getId())
        .name(p.getName())
        .description(p.getDescription())
        .status(p.getStatus())
        .startDate(p.getStartDate())
        .dueDate(p.getDueDate())
        .build()).toList();
  }

  @GetMapping("/{projectId}")
  public ProjectResponse get(@PathVariable Long teamId, @PathVariable Long projectId) {
    var p = projectService.getForTeam(projectId, teamId);
    return ProjectResponse.builder()
        .id(p.getId())
        .teamId(p.getTeam().getId())
        .name(p.getName())
        .description(p.getDescription())
        .status(p.getStatus())
        .startDate(p.getStartDate())
        .dueDate(p.getDueDate())
        .build();
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ProjectResponse create(@PathVariable Long teamId, @Valid @RequestBody ProjectCreateRequest req) {
    // enforce teamId from path (avoid mismatch)
    req.setTeamId(teamId);
    var p = projectService.create(req);
    return ProjectResponse.builder()
        .id(p.getId())
        .teamId(p.getTeam().getId())
        .name(p.getName())
        .description(p.getDescription())
        .status(p.getStatus())
        .startDate(p.getStartDate())
        .dueDate(p.getDueDate())
        .build();
  }

  @PutMapping("/{projectId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ProjectResponse update(@PathVariable Long teamId, @PathVariable Long projectId, @Valid @RequestBody ProjectUpdateRequest req) {
    var p = projectService.update(projectId, req);
    return ProjectResponse.builder()
        .id(p.getId())
        .teamId(p.getTeam().getId())
        .name(p.getName())
        .description(p.getDescription())
        .status(p.getStatus())
        .startDate(p.getStartDate())
        .dueDate(p.getDueDate())
        .build();
  }

  @DeleteMapping("/{projectId}")
  @PreAuthorize("hasRole('ADMIN')")
  public void delete(@PathVariable Long teamId, @PathVariable Long projectId) {
    projectService.delete(projectId);
  }
}
