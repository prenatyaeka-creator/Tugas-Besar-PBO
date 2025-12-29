package com.taskmate.service;

import com.taskmate.api.dto.discussion.MessageCreateRequest;
import com.taskmate.api.error.NotFoundException;
import com.taskmate.domain.DiscussionMessage;
import com.taskmate.domain.Team;
import com.taskmate.domain.User;
import com.taskmate.repo.DiscussionMessageRepository;
import com.taskmate.repo.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscussionServiceImpl extends AbstractCrudService<DiscussionMessage, Long> implements DiscussionService {

  private final DiscussionMessageRepository messageRepository;
  private final TeamRepository teamRepository;
  private final CurrentUserProvider currentUserProvider;
  private final PermissionService permissionService;

  @Override
  protected JpaRepository<DiscussionMessage, Long> repo() {
    return messageRepository;
  }

  @Override
  protected String notFoundMessage(Long id) {
    return "Message not found: " + id;
  }

  @Override
  @Transactional
  public DiscussionMessage post(MessageCreateRequest req) {
    User me = currentUserProvider.requireCurrentUser();
    permissionService.assertTeamMember(req.getTeamId(), me.getId());

    Team team = teamRepository.findById(req.getTeamId())
        .orElseThrow(() -> new NotFoundException("Team not found: " + req.getTeamId()));

    DiscussionMessage m = new DiscussionMessage();
    m.setTeam(team);
    m.setAuthor(me);
    m.setContent(req.getContent());
    return messageRepository.save(m);
  }

  @Override
  @Transactional(readOnly = true)
  public List<DiscussionMessage> listByTeam(Long teamId) {
    User me = currentUserProvider.requireCurrentUser();
    permissionService.assertTeamMember(teamId, me.getId());
    return messageRepository.findByTeamIdOrderByCreatedAtAsc(teamId);
  }
}
