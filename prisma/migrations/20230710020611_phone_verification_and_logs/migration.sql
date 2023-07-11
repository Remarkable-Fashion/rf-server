-- AlterTable
ALTER TABLE `users` ADD COLUMN `phone_number` VARCHAR(20) NULL,
    ADD COLUMN `phone_verified` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `logs` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(100) NOT NULL,
    `usersId` INTEGER UNSIGNED NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
