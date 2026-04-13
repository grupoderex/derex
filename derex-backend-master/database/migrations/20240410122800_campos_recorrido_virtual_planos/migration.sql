-- AlterTable
alter table property
add column virtual_tour_iframe text null,
add column contact_form text null;

-- AlterTable
alter table project_property_blueprints
add column characteristics_architectural_plans text null;