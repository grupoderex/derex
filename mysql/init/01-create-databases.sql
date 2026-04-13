-- ─────────────────────────────────────────────────────────────────────────────
-- Derex MySQL initialization
-- Runs once when the MySQL container is first created.
--
-- MYSQL_DATABASE (derex) is created automatically by the MySQL Docker image.
-- This script creates the Strapi database and grants the app user access.
--
-- NOTE: 'derex_user' must match MYSQL_USER in your .env file.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS `derex_strapi`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Grant the application user full access to the Strapi database.
-- Update 'derex_user' if you changed MYSQL_USER in your .env file.
GRANT ALL PRIVILEGES ON `derex_strapi`.* TO 'derex_user'@'%';

FLUSH PRIVILEGES;
