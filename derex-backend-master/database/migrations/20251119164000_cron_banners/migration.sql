START TRANSACTION;
CREATE TABLE project_banner_schedule
(
    id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id         INT UNSIGNED NOT NULL UNIQUE,
    new_banner_url     TEXT         NULL,
    effective_datetime DATETIME     NULL COMMENT 'Fecha y hora en la que el nuevo banner se aplicará',
    applied_at         TIMESTAMP    NULL,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES project (id)
);
COMMIT;