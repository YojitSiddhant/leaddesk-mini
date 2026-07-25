CREATE TABLE IF NOT EXISTS admin_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_token VARCHAR(255) NOT NULL,
  admin_user_id BIGINT UNSIGNED NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_admin_sessions_session_token (session_token),
  KEY idx_admin_sessions_admin_user_id (admin_user_id),
  KEY idx_admin_sessions_expires_at (expires_at),
  CONSTRAINT fk_admin_sessions_admin_user_id
    FOREIGN KEY (admin_user_id)
    REFERENCES admin_users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
