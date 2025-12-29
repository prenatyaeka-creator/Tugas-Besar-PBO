package com.taskmate.api.controller;

import com.taskmate.api.dto.team.*;
import com.taskmate.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

  private final TeamService teamService;

  @GetMapping
  public List<TeamResponse> myTeams() {
    return teamService.listTeamsForCurrentUser().stream().map(t -> TeamResponse.builder()
        .id(t.getId())
        .name(t.getName())
        .description(t.getDescription())
        .createdByUserId(t.getCreatedBy().getId())
        .build()).toList();
  }

  @GetMapping("/{teamId}")
  public TeamResponse get(@PathVariable Long teamId) {
    var t = teamService.getTeamForCurrentUser(teamId);
    return TeamResponse.builder()
        .id(t.getId())
        .name(t.getName())
        .description(t.getDescription())
        .createdByUserId(t.getCreatedBy().getId())
        .build();
  }

  // Role Access component: Only ADMIN can create/update/delete teams
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public TeamResponse create(@Valid @RequestBody TeamCreateRequest req) {
    var t = teamService.createTeam(req);
    return TeamResponse.builder()
        .id(t.getId())
        .name(t.getName())
        .description(t.getDescription())
        .createdByUserId(t.getCreatedBy().getId())
        .build();
  }

  @PutMapping("/{teamId}")
  @PreAuthorize("hasRole('ADMIN')")
  public TeamResponse update(@PathVariable Long teamId, @Valid @RequestBody TeamCreateRequest req) {
    var t = teamService.updateTeam(teamId, req);
    return TeamResponse.builder()
        .id(t.getId())
        .name(t.getName())
        .description(t.getDescription())
        .createdByUserId(t.getCreatedBy().getId())
        .build();
  }

  @DeleteMapping("/{teamId}")
  @PreAuthorize("hasRole('ADMIN')")
  public void delete(@PathVariable Long teamId) {
    teamService.deleteTeam(teamId);
  }

  @GetMapping("/{teamId}/members")
  public List<TeamMemberResponse> members(@PathVariable Long teamId) {
    return teamService.listMembers(teamId).stream().map(tm -> TeamMemberResponse.builder()
        .id(tm.getId())
        .teamId(tm.getTeam().getId())
        .userId(tm.getUser().getId())
        .userName(tm.getUser().getName())
        .userEmail(tm.getUser().getEmail())
        .teamRole(tm.getTeamRole())
        .build()).toList();
  }

  @PostMapping("/{teamId}/members")
  @PreAuthorize("hasRole('ADMIN')")
  public TeamMemberResponse addMember(@PathVariable Long teamId, @Valid @RequestBody TeamMemberAddRequest req) {
    var tm = teamService.addMember(teamId, req);
    return TeamMemberResponse.builder()
        .id(tm.getId())
        .teamId(tm.getTeam().getId())
        .userId(tm.getUser().getId())
        .userName(tm.getUser().getName())
        .userEmail(tm.getUser().getEmail())
        .teamRole(tm.getTeamRole())
        .build();
  }

  @DeleteMapping("/{teamId}/members/{memberId}")
  @PreAuthorize("hasRole('ADMIN')")
  public void removeMember(@PathVariable Long teamId, @PathVariable Long memberId) {
    teamService.removeMember(teamId, memberId);
  }
}
