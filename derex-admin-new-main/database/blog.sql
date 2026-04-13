/* create the blog table in MariaDB */
SELECT DATABASE();
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE blog_posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    blog_id BIGINT UNSIGNED NOT NULL,
    language VARCHAR(10) COLLATE utf8mb4_general_ci DEFAULT 'es', /* Assuming Spanish as default */
    region VARCHAR(20) COLLATE utf8mb4_general_ci, /* Default might not be necessary or might be specific to your application */
    post_author VARCHAR(255) NOT NULL COLLATE utf8mb4_spanish_ci DEFAULT 'por Javer',
    post_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    post_date_gmt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    post_title TEXT NOT NULL COLLATE utf8mb4_spanish_ci,
    breadcrumb_title VARCHAR(255) COLLATE utf8mb4_spanish_ci,
    post_name VARCHAR(200) COLLATE utf8mb4_spanish_ci,
    post_excerpt TEXT COLLATE utf8mb4_spanish_ci,
    description TEXT COLLATE utf8mb4_spanish_ci,
    post_content LONGTEXT NOT NULL COLLATE utf8mb4_spanish_ci,
    post_image1 VARCHAR(255) NOT NULL COLLATE utf8mb4_spanish_ci DEFAULT '/images/blog/default1.jpg',
    post_image2 VARCHAR(255) NOT NULL COLLATE utf8mb4_spanish_ci DEFAULT  '/images/blog/default2.jpg',
    post_status VARCHAR(20) NOT NULL COLLATE utf8mb4_general_ci DEFAULT 'draft',
    post_modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    post_modified_gmt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version INT UNSIGNED NOT NULL DEFAULT 1,
    post_content_filtered LONGTEXT COLLATE utf8mb4_spanish_ci,
    post_type VARCHAR(20) NOT NULL COLLATE utf8mb4_general_ci DEFAULT 'post',
    post_mime_type VARCHAR(100) COLLATE utf8mb4_general_ci DEFAULT 'text/html',
    permalink VARCHAR(255) NOT NULL COLLATE utf8mb4_spanish_ci,
    permalink_hash VARCHAR(32) NOT NULL COLLATE utf8mb4_general_ci,
    INDEX post_title_idx (post_title(255)),
    INDEX permalink_idx (permalink(255)),
    INDEX post_date_idx (post_date),
    INDEX post_status_idx (post_status),
    INDEX post_type_idx (post_type)
);
