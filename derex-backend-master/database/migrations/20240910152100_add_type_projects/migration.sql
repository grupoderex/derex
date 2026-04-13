alter table project
    add vertical_data json null after id_city;

alter table project
    add type_orientation enum ('horizontal', 'vertical') default 'horizontal' null after type_project;

alter table property
    add vertical_floor int null after type;
