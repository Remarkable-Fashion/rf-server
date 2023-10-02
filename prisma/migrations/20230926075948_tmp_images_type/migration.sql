-- AlterTable
ALTER TABLE `tmp_images` ADD COLUMN `type` ENUM('Post', 'Clothes') NOT NULL DEFAULT 'Post';
