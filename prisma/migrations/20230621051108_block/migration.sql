-- DropForeignKey
ALTER TABLE `follows` DROP FOREIGN KEY `Follows_follower_id_fkey`;

-- DropForeignKey
ALTER TABLE `follows` DROP FOREIGN KEY `Follows_following_id_fkey`;

-- CreateTable
CREATE TABLE `blocks` (
    `blocker_id` INTEGER UNSIGNED NOT NULL,
    `block_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`blocker_id`, `block_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_follower_id_fkey` FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blocks` ADD CONSTRAINT `blocks_blocker_id_fkey` FOREIGN KEY (`blocker_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blocks` ADD CONSTRAINT `blocks_block_id_fkey` FOREIGN KEY (`block_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
