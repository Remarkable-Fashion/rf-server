/*
  Warnings:

  - A unique constraint covering the columns `[user_id,clothes_id]` on the table `scraps` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `scraps` DROP FOREIGN KEY `scraps_post_id_fkey`;

-- AlterTable
ALTER TABLE `scraps` ADD COLUMN `clothes_id` INTEGER UNSIGNED NULL,
    MODIFY `post_id` INTEGER UNSIGNED NULL;

-- CreateIndex
CREATE UNIQUE INDEX `scraps_user_id_clothes_id_key` ON `scraps`(`user_id`, `clothes_id`);

-- AddForeignKey
ALTER TABLE `scraps` ADD CONSTRAINT `scraps_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scraps` ADD CONSTRAINT `scraps_clothes_id_fkey` FOREIGN KEY (`clothes_id`) REFERENCES `clothes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
