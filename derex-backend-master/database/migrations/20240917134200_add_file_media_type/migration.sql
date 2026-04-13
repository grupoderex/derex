alter table media
    modify media_type enum ('image', 'video', 'file') not null;
