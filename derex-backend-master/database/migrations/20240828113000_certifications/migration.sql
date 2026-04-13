create table certifications
(
    id             serial primary key,
    title_es       varchar(50)  not null,
    title_en       varchar(50)  not null,
    description_es varchar(250) not null,
    description_en varchar(250) not null,
    date           date         not null,
    button_url     text,
    new_tab        boolean   default false,
    created_at     timestamp default now(),
    updated_at     timestamp default now()
);