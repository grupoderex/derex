START TRANSACTION;

alter table javer_db.project
    add document_url text null;

COMMIT;