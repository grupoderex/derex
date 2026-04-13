# para ambiente QA/ pendiente de revisión si en PROD se necesita
alter table project
    modify live_the_experience_description varchar(250) null;

alter table project
    modify live_the_experience_description_en varchar(250) null;
