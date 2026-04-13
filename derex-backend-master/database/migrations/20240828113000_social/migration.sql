create table social
(
    id             serial primary key,
    name           varchar(50)  not null,
    icon           text  not null,
    link           text  not null,
    created_at     timestamp default now(),
    updated_at     timestamp default now()
);