CREATE TABLE meta
(
    id       SERIAL PRIMARY KEY,
    section  VARCHAR(191)    NOT NULL,
    name     VARCHAR(191)    NOT NULL,
    value    TEXT    NOT NULL,
    value_en TEXT    NULL,
    bold     BOOLEAN NOT NULL DEFAULT FALSE,
    outline  BOOLEAN NOT NULL DEFAULT FALSE,
    color    BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT unique_name_section UNIQUE (name, section)
);