package com.taskmate.api.controller;

import com.taskmate.api.dto.discussion.MessageCreateRequest;
import com.taskmate.api.dto.discussion.MessageResponse;
import com.taskmate.service.DiscussionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams/{teamId}/messages")
@RequiredArgsConstructor
public class DiscussionController {

  private final DiscussionService discussionService;

  @GetMapping
  public List<MessageResponse> list(@PathVariable Long teamId) {
    return discussionService.listByTeam(teamId).stream().map(m -> MessageResponse.builder()
        .id(m.getId())
        .teamId(m.getTeam().getId())
        .authorUserId(m.getAuthor().getId())
        .authorName(m.getAuthor().getName())
        .content(m.getContent())
        .createdAt(m.getCreatedAt())
        .build()).toList();
  }

  @PostMapping
  public MessageResponse post(@PathVariable Long teamId, @Valid @RequestBody MessageCreateRequest req) {
    req.setTeamId(teamId);
    var m = discussionService.post(req);
    return MessageResponse.builder()
        .id(m.getId())
        .teamId(m.getTeam().getId())
        .authorUserId(m.getAuthor().getId())
        .authorName(m.getAuthor().getName())
        .content(m.getContent())
        .createdAt(m.getCreatedAt())
        .build();
  }
}
