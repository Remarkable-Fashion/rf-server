/*
  Warnings:

  - You are about to drop the column `recommend_clothes_id` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the `recommend_clothes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `clothes` DROP FOREIGN KEY `clothes_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `favorites` DROP FOREIGN KEY `favorites_recommend_clothes_id_fkey`;

-- DropForeignKey
ALTER TABLE `recommend_clothes` DROP FOREIGN KEY `recommend_clothes_clothes_id_fkey`;

-- DropForeignKey
ALTER TABLE `recommend_clothes` DROP FOREIGN KEY `recommend_clothes_user_id_fkey`;

-- DropIndex
DROP INDEX `favorites_user_id_recommend_clothes_id_key` ON `favorites`;

-- AlterTable
ALTER TABLE `clothes` ADD COLUMN `reason` VARCHAR(50) NULL,
    ADD COLUMN `recommended_clothes_id` INTEGER UNSIGNED NULL,
    ADD COLUMN `user_id` INTEGER UNSIGNED NULL,
    MODIFY `post_id` INTEGER UNSIGNED NULL;

-- AlterTable
ALTER TABLE `favorites` DROP COLUMN `recommend_clothes_id`;

-- DropTable
DROP TABLE `recommend_clothes`;

-- AddForeignKey
ALTER TABLE `clothes` ADD CONSTRAINT `clothes_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clothes` ADD CONSTRAINT `clothes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clothes` ADD CONSTRAINT `clothes_recommended_clothes_id_fkey` FOREIGN KEY (`recommended_clothes_id`) REFERENCES `clothes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
