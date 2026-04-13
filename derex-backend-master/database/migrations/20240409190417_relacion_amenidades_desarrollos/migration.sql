-- AlterTable
ALTER TABLE `amenity_property` ADD COLUMN `id_project` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `amenity_property` ADD CONSTRAINT `amenity_property_id_project_fkey` FOREIGN KEY (`id_project`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
