/*
  Warnings:

  - Added the required column `user_id` to the `recommend_clothes` table without a default value. This is not possible if the table is not empty.
  - Made the column `clothes_id` on table `recommend_clothes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `recommend_clothes` DROP FOREIGN KEY `recommend_clothes_clothes_id_fkey`;

-- AlterTable
ALTER TABLE `recommend_clothes` ADD COLUMN `user_id` INTEGER UNSIGNED NOT NULL,
    MODIFY `clothes_id` INTEGER UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `recommend_clothes` ADD CONSTRAINT `recommend_clothes_clothes_id_fkey` FOREIGN KEY (`clothes_id`) REFERENCES `clothes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recommend_clothes` ADD CONSTRAINT `recommend_clothes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
