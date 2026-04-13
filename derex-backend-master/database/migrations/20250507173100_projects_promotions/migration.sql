START TRANSACTION;

CREATE TABLE javer_db.project_promotions
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    project_id        INT UNSIGNED                                                          NOT NULL UNIQUE,
    title_es          TEXT                                                                  NOT NULL,
    title_en          TEXT                                                                  NOT NULL,
    description_es    TEXT                                                                  NOT NULL,
    description_en    TEXT                                                                  NOT NULL,
    promo_image       TEXT                                                                  NOT NULL,
    is_active         BOOL      DEFAULT false,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES javer_db.project (id) ON DELETE CASCADE
);

COMMIT;