START TRANSACTION;
CREATE TABLE property_price_schedule
(
    id                     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    prices_list_property_id INT          NOT NULL UNIQUE,
    new_price_base         FLOAT          NULL,
    new_price_m2_ext       FLOAT          NULL,
    effective_datetime     DATETIME       NULL COMMENT 'Fecha y hora en la que el nuevo precio se aplicará',
    applied_at             TIMESTAMP      NULL,
    created_at             TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prices_list_property_id) REFERENCES prices_list_property (id)
);
COMMIT;