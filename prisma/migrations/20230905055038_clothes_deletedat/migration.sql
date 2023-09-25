-- AlterTable
ALTER TABLE `clothes` ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL;
