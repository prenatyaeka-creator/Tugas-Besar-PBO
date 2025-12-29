package com.taskmate.service;

public interface PermissionService {
  void assertTeamMember(Long teamId, Long userId);
  boolean isTeamMember(Long teamId, Long userId);
}
