package com.taskmate.service;

import com.taskmate.domain.User;

public interface CurrentUserProvider {
  User requireCurrentUser();
}
