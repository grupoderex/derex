START TRANSACTION;
alter table project
    add url_salesforce text null;
COMMIT;
