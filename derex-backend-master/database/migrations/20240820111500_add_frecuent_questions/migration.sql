create table frequent_questions
(
    id              serial primary key,
    question_es     text not null,
    answer_es       text not null,
    question_en     text not null,
    answer_en       text not null,
    url_link        text,
    open_in_new_tab boolean   default false,
    created_at      timestamp default current_timestamp,
    updated_at      timestamp default current_timestamp
);