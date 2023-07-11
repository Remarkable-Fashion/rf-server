/*
  Warnings:

  - A unique constraint covering the columns `[user_id,recommend_clothes_id]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `favorites` DROP FOREIGN KEY `favorites_post_id_fkey`;

-- AlterTable
ALTER TABLE `favorites` ADD COLUMN `recommend_clothes_id` INTEGER UNSIGNED NULL,
    MODIFY `post_id` INTEGER UNSIGNED NULL;

-- CreateTable
CREATE TABLE `recommend_clothes` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `category` ENUM('Outer', 'Top', 'Bottom', 'Acc', 'Shoe') NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `image_url` VARCHAR(200) NOT NULL,
    `price` INTEGER UNSIGNED NULL,
    `color` VARCHAR(50) NULL,
    `size` VARCHAR(10) NULL,
    `brand` VARCHAR(20) NULL,
    `reason` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clothes_id` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `favorites_user_id_recommend_clothes_id_key` ON `favorites`(`user_id`, `recommend_clothes_id`);

-- AddForeignKey
ALTER TABLE `recommend_clothes` ADD CONSTRAINT `recommend_clothes_clothes_id_fkey` FOREIGN KEY (`clothes_id`) REFERENCES `clothes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_recommend_clothes_id_fkey` FOREIGN KEY (`recommend_clothes_id`) REFERENCES `recommend_clothes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
