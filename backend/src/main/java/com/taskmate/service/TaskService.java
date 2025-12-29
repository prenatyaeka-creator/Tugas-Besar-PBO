package com.taskmate.service;

import com.taskmate.api.dto.task.TaskCreateRequest;
import com.taskmate.api.dto.task.TaskUpdateRequest;
import com.taskmate.domain.Task;

import java.util.List;

public interface TaskService {
  Task create(TaskCreateRequest req);
  List<Task> listByProject(Long projectId);
  Task update(Long taskId, TaskUpdateRequest req);
  void delete(Long taskId);
}
