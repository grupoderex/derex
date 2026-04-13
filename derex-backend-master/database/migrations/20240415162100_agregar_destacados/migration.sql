ALTER TABLE project ADD COLUMN outstanding boolean null default false;
ALTER TABLE property ADD COLUMN outstanding boolean null default false;
ALTER TABLE project ADD COLUMN banner_url text null;