create table section_decalogue
(
    id      integer primary key auto_increment,
    name_es varchar(100) not null,
    name_en varchar(100) not null
);

create table decalogue
(
    id           serial primary key,
    title_es     varchar(100) not null,
    title_en     varchar(100) not null,
    content      text,
    content_date date,
    file         text,
    section_id   integer      not null,
    foreign key (section_id) references section_decalogue (id)
);
