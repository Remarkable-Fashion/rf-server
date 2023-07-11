-- AlterTable
ALTER TABLE `favorites` ADD COLUMN `clothes_id` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_clothes_id_fkey` FOREIGN KEY (`clothes_id`) REFERENCES `clothes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
