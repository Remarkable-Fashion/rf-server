-- AlterTable
ALTER TABLE `posts` ADD COLUMN `season` ENUM('Spring', 'Summer', 'Fall', 'Winter', 'Etc') NOT NULL DEFAULT 'Etc',
    ADD COLUMN `style` ENUM('Classic', 'Dandy', 'Street', 'Retro', 'Etc') NOT NULL DEFAULT 'Etc',
    ADD COLUMN `tpo` ENUM('Occean', 'Travel', 'Date', 'Wedding', 'Campus', 'Work', 'Daily', 'Etc') NOT NULL DEFAULT 'Etc';

-- CreateTable
CREATE TABLE `profiles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `sex` VARCHAR(191) NULL,
    `height` INTEGER NULL,
    `weight` INTEGER NULL,
    `introduction` VARCHAR(191) NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `socials` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` ENUM('Google', 'Kakao', 'Etc') NOT NULL,
    `social_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `socials_user_id_key`(`user_id`),
    UNIQUE INDEX `socials_type_social_id_key`(`type`, `social_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `socials` ADD CONSTRAINT `socials_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
