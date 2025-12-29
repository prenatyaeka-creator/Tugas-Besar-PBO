package com.taskmate.service;

import com.taskmate.api.error.ForbiddenException;
import com.taskmate.repo.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

  private final TeamMemberRepository teamMemberRepository;

  @Override
  public void assertTeamMember(Long teamId, Long userId) {
    if (!isTeamMember(teamId, userId)) {
      throw new ForbiddenException("You are not a member of this team");
    }
  }

  @Override
  public boolean isTeamMember(Long teamId, Long userId) {
    return teamMemberRepository.findByTeamIdAndUserId(teamId, userId).isPresent();
  }
}
