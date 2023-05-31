/*
  Warnings:

  - You are about to drop the `Seasons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Styles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tpos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Seasons`;

-- DropTable
DROP TABLE `Styles`;

-- DropTable
DROP TABLE `Tpos`;

-- CreateTable
CREATE TABLE `tpos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tpo` ENUM('Occean', 'Travel', 'Date', 'Wedding', 'Campus', 'Work', 'Daily', 'Etc') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seasons` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `season` ENUM('Spring', 'Summer', 'Fall', 'Winter', 'Etc') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `styles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `style` ENUM('Classic', 'Dandy', 'Street', 'Retro', 'Etc') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
