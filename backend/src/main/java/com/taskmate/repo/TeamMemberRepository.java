package com.taskmate.repo;

import com.taskmate.domain.TeamMember;
import com.taskmate.domain.enums.TeamRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
  Optional<TeamMember> findByTeamIdAndUserId(Long teamId, Long userId);
  List<TeamMember> findByUserId(Long userId);
  List<TeamMember> findByTeamId(Long teamId);

  @Query("select (count(tm) > 0) from TeamMember tm where tm.team.id = ?1 and tm.user.id = ?2 and tm.teamRole = ?3")
  boolean existsRole(Long teamId, Long userId, TeamRole role);
}
