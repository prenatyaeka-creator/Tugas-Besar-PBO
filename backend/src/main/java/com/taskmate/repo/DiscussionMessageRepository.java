package com.taskmate.repo;

import com.taskmate.domain.DiscussionMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscussionMessageRepository extends JpaRepository<DiscussionMessage, Long> {
  List<DiscussionMessage> findByTeamIdOrderByCreatedAtAsc(Long teamId);
}
