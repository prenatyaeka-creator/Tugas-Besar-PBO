package com.taskmate.service;

import com.taskmate.api.dto.team.TeamCreateRequest;
import com.taskmate.api.dto.team.TeamMemberAddRequest;
import com.taskmate.domain.Team;
import com.taskmate.domain.TeamMember;

import java.util.List;

public interface TeamService {
  Team createTeam(TeamCreateRequest req);
  List<Team> listTeamsForCurrentUser();
  Team getTeamForCurrentUser(Long teamId);
  Team updateTeam(Long teamId, TeamCreateRequest req);
  void deleteTeam(Long teamId);

  List<TeamMember> listMembers(Long teamId);
  TeamMember addMember(Long teamId, TeamMemberAddRequest req);
  void removeMember(Long teamId, Long memberId);
}
