/*
  Warnings:

  - You are about to drop the column `place` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `place`,
    DROP COLUMN `title`,
    ADD COLUMN `height` INTEGER UNSIGNED NULL,
    ADD COLUMN `weight` INTEGER UNSIGNED NULL;
