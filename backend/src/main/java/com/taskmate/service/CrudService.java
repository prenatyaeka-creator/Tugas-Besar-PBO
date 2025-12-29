package com.taskmate.service;

import java.util.List;

public interface CrudService<T, ID> {
  T getOrThrow(ID id);
  List<T> list();
  T save(T entity);
  void delete(ID id);
}
