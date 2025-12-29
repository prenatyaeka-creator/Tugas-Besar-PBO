-- MySQL schema for TaskMate
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP(6) NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  initials VARCHAR(5) NOT NULL,
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE teams (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP(6) NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  created_by_user_id BIGINT NOT NULL,
  CONSTRAINT fk_team_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE team_members (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP(6) NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL,
  team_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  team_role VARCHAR(20) NOT NULL,
  UNIQUE KEY uk_team_user (team_id, user_id),
  KEY idx_tm_user (user_id),
  KEY idx_tm_team (team_id),
  CONSTRAINT fk_tm_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_tm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE projects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP(6) NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL,
  team_id BIGINT NOT NULL,
  created_by_user_id BIGINT NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT NULL,
  status VARCHAR(20) NOT NULL,
  start_date DATE NULL,
  due_date DATE NULL,
  UNIQUE KEY uk_team_project_name (team_id, name),
  KEY idx_projects_team (team_id),
  CONSTRAINT fk_project_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_project_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP(6) NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL,
  project_id BIGINT NOT NULL,
  created_by_user_id BIGINT NOT NULL,
  assigned_to_user_id BIGINT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  status VARCHAR(20) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  due_date DATE NULL,
  KEY idx_tasks_project (project_id),
  KEY idx_tasks_assignee (assigned_to_user_id),
  CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_created_by FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  CONSTRAINT fk_task_assigned_to FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE discussion_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP(6) NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL,
  team_id BIGINT NOT NULL,
  author_user_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  KEY idx_discussion_team (team_id),
  CONSTRAINT fk_discussion_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_discussion_author FOREIGN KEY (author_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE files (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP(6) NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL,
  team_id BIGINT NOT NULL,
  uploaded_by_user_id BIGINT NOT NULL,
  storage_key VARCHAR(180) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  content_type VARCHAR(120) NOT NULL,
  size_bytes BIGINT NOT NULL,
  KEY idx_files_team (team_id),
  CONSTRAINT fk_files_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_files_uploader FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE password_reset_otps (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP(6) NOT NULL,
  user_id BIGINT NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP(6) NOT NULL,
  used BIT(1) NOT NULL,
  KEY idx_reset_user (user_id),
  CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
