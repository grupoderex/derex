START TRANSACTION;

CREATE TABLE javer_db.future_projects
(
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    main_image           TEXT                                     NOT NULL,
    main_image_alt       TEXT                                     NOT NULL,
    secondary_image      TEXT,
    secondary_image_alt  TEXT,
    name                 TEXT                                     NOT NULL,
    state_id             INT UNSIGNED                             NOT NULL,
    city_id              INT UNSIGNED                             NULL,
    launch_date          DATE,
    contact_phone        CHAR(20),
    contact_email        TEXT                                     NOT NULL,
    type                 ENUM ('vertical', 'horizontal', 'mixed') NOT NULL,
    unique_url           VARCHAR(255)                             NOT NULL UNIQUE,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Foreign key constraints
    CONSTRAINT fk_state FOREIGN KEY (state_id) REFERENCES javer_db.state (id),
    CONSTRAINT fk_city FOREIGN KEY (city_id) REFERENCES javer_db.city (id)
);

CREATE TABLE javer_db.future_amenity_property
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    id_future_project INT  NULL,
    name_es           TEXT NULL,
    name_en           TEXT NULL,
    CONSTRAINT fk_property FOREIGN KEY (id_future_project) REFERENCES future_projects (id) ON DELETE CASCADE
);

COMMIT;