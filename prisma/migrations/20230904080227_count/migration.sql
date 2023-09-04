/*
  Warnings:

  - The values [Shoe] on the enum `clothes_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `clothes` ADD COLUMN `like_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `category` ENUM('Outer', 'Top', 'Bottom', 'Acc', 'Shoes') NOT NULL;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `like_count` INTEGER UNSIGNED NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `follower_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `following_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `post_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `scrap_count` INTEGER UNSIGNED NOT NULL DEFAULT 0;
