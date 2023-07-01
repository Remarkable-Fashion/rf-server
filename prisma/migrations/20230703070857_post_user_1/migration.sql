-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_user_id_fkey`;

-- AlterTable
ALTER TABLE `posts` MODIFY `user_id` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
