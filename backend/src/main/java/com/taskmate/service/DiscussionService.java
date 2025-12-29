package com.taskmate.service;

import com.taskmate.api.dto.discussion.MessageCreateRequest;
import com.taskmate.domain.DiscussionMessage;

import java.util.List;

public interface DiscussionService {
  DiscussionMessage post(MessageCreateRequest req);
  List<DiscussionMessage> listByTeam(Long teamId);
}
