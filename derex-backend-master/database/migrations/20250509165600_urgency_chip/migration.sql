START TRANSACTION;

CREATE TABLE javer_db.property_urgency_chip
(
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    property_id          INT UNSIGNED NOT NULL UNIQUE,
    description_es       TEXT         NOT NULL,
    description_en       TEXT         NOT NULL,
    notification_text_es TEXT         NOT NULL,
    notification_text_en TEXT         NOT NULL,
    is_active            BOOL      DEFAULT false,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_property_urgency_chip FOREIGN KEY (property_id) REFERENCES javer_db.property (id) ON DELETE CASCADE
);

COMMIT;