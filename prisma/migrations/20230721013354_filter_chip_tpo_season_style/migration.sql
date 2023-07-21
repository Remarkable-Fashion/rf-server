/*
  Warnings:

  - You are about to drop the column `season` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `style` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `tpo` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `seasons` table. All the data in the column will be lost.
  - You are about to drop the column `style` on the `styles` table. All the data in the column will be lost.
  - You are about to drop the column `tpo` on the `tpos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[text]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[text]` on the table `styles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[text]` on the table `tpos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `seasons_season_key` ON `seasons`;

-- DropIndex
DROP INDEX `styles_style_key` ON `styles`;

-- DropIndex
DROP INDEX `tpos_tpo_key` ON `tpos`;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `season`,
    DROP COLUMN `style`,
    DROP COLUMN `tpo`;

-- AlterTable
ALTER TABLE `seasons` DROP COLUMN `season`,
    ADD COLUMN `emoji` VARCHAR(191) NULL,
    ADD COLUMN `text` ENUM('Spring', 'Summer', 'Fall', 'Winter', 'Etc') NOT NULL DEFAULT 'Etc';

-- AlterTable
ALTER TABLE `styles` DROP COLUMN `style`,
    ADD COLUMN `emoji` VARCHAR(191) NULL,
    ADD COLUMN `text` ENUM('Classic', 'Dandy', 'Street', 'Retro', 'Etc') NOT NULL DEFAULT 'Etc';

-- AlterTable
ALTER TABLE `tpos` DROP COLUMN `tpo`,
    ADD COLUMN `emoji` VARCHAR(191) NULL,
    ADD COLUMN `text` ENUM('Occean', 'Travel', 'Date', 'Wedding', 'Campus', 'Work', 'Daily', 'Etc') NOT NULL DEFAULT 'Etc';

-- CreateTable
CREATE TABLE `post_tpos` (
    `post_id` INTEGER UNSIGNED NOT NULL,
    `tpo_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`post_id`, `tpo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_seasons` (
    `post_id` INTEGER UNSIGNED NOT NULL,
    `season_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`post_id`, `season_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_styles` (
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `postsId` INTEGER UNSIGNED NOT NULL,
    `styles_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`postsId`, `styles_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `seasons_text_key` ON `seasons`(`text`);

-- CreateIndex
CREATE UNIQUE INDEX `styles_text_key` ON `styles`(`text`);

-- CreateIndex
CREATE UNIQUE INDEX `tpos_text_key` ON `tpos`(`text`);

-- AddForeignKey
ALTER TABLE `post_tpos` ADD CONSTRAINT `post_tpos_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_tpos` ADD CONSTRAINT `post_tpos_tpo_id_fkey` FOREIGN KEY (`tpo_id`) REFERENCES `tpos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_seasons` ADD CONSTRAINT `post_seasons_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_seasons` ADD CONSTRAINT `post_seasons_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `seasons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_styles` ADD CONSTRAINT `post_styles_postsId_fkey` FOREIGN KEY (`postsId`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_styles` ADD CONSTRAINT `post_styles_styles_id_fkey` FOREIGN KEY (`styles_id`) REFERENCES `styles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
