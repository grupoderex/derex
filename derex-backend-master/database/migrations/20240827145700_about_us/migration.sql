create table about_us
(
    id            int auto_increment
        primary key,
    index_order   int       not null unique,
    image_url     text      not null,
    is_image_left boolean   not null default 1,
    content_es    text      not null,
    content_en    text      not null,
    created_at    timestamp null     default CURRENT_TIMESTAMP,
    updated_at    timestamp null     default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);