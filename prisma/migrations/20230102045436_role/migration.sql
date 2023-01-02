-- CreateTable
CREATE TABLE `user_metas` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `role` ENUM('SuperAdmin', 'Admin', 'User', 'Etc') NOT NULL DEFAULT 'User',
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `user_metas_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_metas` ADD CONSTRAINT `user_metas_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
