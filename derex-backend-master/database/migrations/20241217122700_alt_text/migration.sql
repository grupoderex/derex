alter table project
    add logo_color_alt_text text null after logo_color;

alter table project
    add thumbnail_alt_text text null after thumbnail;

alter table property
    add main_image_alt_text text null after main_image;

alter table property
    add thumbnail_alt_text text null after thumbnail;

alter table amenity_property
    add img_alt_text text null after img_url;

alter table project_property_blueprints
    add image_alt_text text null after image_url;

alter table project_property_images
    add image_alt_text text null after image_url;

alter table about_us
    add image_alt_text text null after image_url;

alter table certifications
    add image_alt_text text null after image_url;

alter table stylings
    add alt_text text null;
