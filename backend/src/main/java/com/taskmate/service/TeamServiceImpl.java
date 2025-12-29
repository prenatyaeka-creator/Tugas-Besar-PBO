package com.taskmate.service;

import com.taskmate.api.dto.team.TeamCreateRequest;
import com.taskmate.api.dto.team.TeamMemberAddRequest;
import com.taskmate.api.error.BadRequestException;
import com.taskmate.api.error.NotFoundException;
import com.taskmate.domain.Team;
import com.taskmate.domain.TeamMember;
import com.taskmate.domain.User;
import com.taskmate.domain.enums.TeamRole;
import com.taskmate.repo.TeamMemberRepository;
import com.taskmate.repo.TeamRepository;
import com.taskmate.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl extends AbstractCrudService<Team, Long> implements TeamService {

  private final TeamRepository teamRepository;
  private final TeamMemberRepository teamMemberRepository;
  private final UserRepository userRepository;
  private final CurrentUserProvider currentUserProvider;
  private final PermissionService permissionService;

  @Override
  protected JpaRepository<Team, Long> repo() {
    return teamRepository;
  }

  @Override
  protected String notFoundMessage(Long id) {
    return "Team not found: " + id;
  }

  @Override
  @Transactional
  public Team createTeam(TeamCreateRequest req) {
    User me = currentUserProvider.requireCurrentUser();
    Team team = new Team();
    team.setName(req.getName());
    team.setDescription(req.getDescription());
    team.setCreatedBy(me);
    team = teamRepository.save(team);

    TeamMember tm = new TeamMember();
    tm.setTeam(team);
    tm.setUser(me);
    tm.setTeamRole(TeamRole.OWNER);
    teamMemberRepository.save(tm);

    return team;
  }

  @Override
  @Transactional(readOnly = true)
  public List<Team> listTeamsForCurrentUser() {
    User me = currentUserProvider.requireCurrentUser();
    return teamMemberRepository.findByUserId(me.getId()).stream()
        .map(TeamMember::getTeam)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public Team getTeamForCurrentUser(Long teamId) {
    User me = currentUserProvider.requireCurrentUser();
    permissionService.assertTeamMember(teamId, me.getId());
    return getOrThrow(teamId);
  }

  @Override
  @Transactional
  public Team updateTeam(Long teamId, TeamCreateRequest req) {
    Team t = getOrThrow(teamId);
    t.setName(req.getName());
    t.setDescription(req.getDescription());
    return teamRepository.save(t);
  }

  @Override
  @Transactional
  public void deleteTeam(Long teamId) {
    // deleting the team will cascade by FK constraints if configured; we keep it simple: delete members then team
    if (!teamRepository.existsById(teamId)) throw new NotFoundException("Team not found: " + teamId);
    teamMemberRepository.findByTeamId(teamId).forEach(m -> teamMemberRepository.deleteById(m.getId()));
    teamRepository.deleteById(teamId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<TeamMember> listMembers(Long teamId) {
    User me = currentUserProvider.requireCurrentUser();
    permissionService.assertTeamMember(teamId, me.getId());
    return teamMemberRepository.findByTeamId(teamId);
  }

  @Override
  @Transactional
  public TeamMember addMember(Long teamId, TeamMemberAddRequest req) {
    Team team = getOrThrow(teamId);

    if (teamMemberRepository.findByTeamIdAndUserId(teamId, req.getUserId()).isPresent()) {
      throw new BadRequestException("User already in team");
    }

    User user = userRepository.findById(req.getUserId())
        .orElseThrow(() -> new NotFoundException("User not found: " + req.getUserId()));

    TeamMember tm = new TeamMember();
    tm.setTeam(team);
    tm.setUser(user);
    tm.setTeamRole(req.getTeamRole());
    return teamMemberRepository.save(tm);
  }

  @Override
  @Transactional
  public void removeMember(Long teamId, Long memberId) {
    // Ensure team exists; also ensure member belongs to that team
    getOrThrow(teamId);
    TeamMember tm = teamMemberRepository.findById(memberId)
        .orElseThrow(() -> new NotFoundException("Team member not found: " + memberId));
    if (!tm.getTeam().getId().equals(teamId)) {
      throw new BadRequestException("Member does not belong to the team");
    }
    teamMemberRepository.delete(tm);
  }
}
