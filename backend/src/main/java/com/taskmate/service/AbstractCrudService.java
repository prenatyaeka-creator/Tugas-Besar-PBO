package com.taskmate.service;

import com.taskmate.api.error.NotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Inheritance example: shared CRUD behavior via a generic base class.
 */
public abstract class AbstractCrudService<T, ID> implements CrudService<T, ID> {

  protected abstract JpaRepository<T, ID> repo();

  protected abstract String notFoundMessage(ID id);

  @Override
  public T getOrThrow(ID id) {
    return repo().findById(id).orElseThrow(() -> new NotFoundException(notFoundMessage(id)));
  }

  @Override
  public List<T> list() {
    return repo().findAll();
  }

  @Override
  public T save(T entity) {
    return repo().save(entity);
  }

  @Override
  public void delete(ID id) {
    repo().delete(getOrThrow(id));
  }
}
