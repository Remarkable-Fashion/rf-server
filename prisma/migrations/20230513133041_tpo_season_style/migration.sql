-- CreateTable
CREATE TABLE `Tpos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tpo` ENUM('Occean', 'Travel', 'Date', 'Wedding', 'Campus', 'Work', 'Daily', 'Etc') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seasons` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `season` ENUM('Spring', 'Summer', 'Fall', 'Winter', 'Etc') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Styles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `style` ENUM('Classic', 'Dandy', 'Street', 'Retro', 'Etc') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
