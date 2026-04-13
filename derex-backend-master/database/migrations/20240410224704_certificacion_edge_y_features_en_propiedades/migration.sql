-- AlterTable
ALTER TABLE `property` ADD COLUMN `features` JSON NULL,
    ADD COLUMN `isEdgeCertified` BOOLEAN NOT NULL DEFAULT false;