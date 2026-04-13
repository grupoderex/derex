create table customer_experience
(
    id             serial primary key,
    project_id     integer,
    description_es text,
    description_en text,
    url            text,
    created_at     timestamp default now(),
    updated_at     timestamp default now()
);