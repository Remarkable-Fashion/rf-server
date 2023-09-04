/*
  Warnings:

  - You are about to alter the column `text` on the `seasons` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(5))`.
  - The values [Etc] on the enum `socials_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `text` on the `styles` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `Enum(EnumId(6))`.
  - You are about to alter the column `text` on the `tpos` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(6))` to `Enum(EnumId(4))`.
  - The values [Etc] on the enum `user_metas_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `seasons` MODIFY `text` ENUM('Spring', 'Summer', 'Fall', 'Winter') NOT NULL DEFAULT 'Spring';

-- AlterTable
ALTER TABLE `socials` MODIFY `type` ENUM('Google', 'Kakao') NOT NULL;

-- AlterTable
ALTER TABLE `styles` MODIFY `text` ENUM('Classic', 'Dandy', 'Street', 'Retro') NOT NULL DEFAULT 'Dandy';

-- AlterTable
ALTER TABLE `tpos` MODIFY `text` ENUM('Occean', 'Travel', 'Date', 'Wedding', 'Campus', 'Work', 'Daily') NOT NULL DEFAULT 'Daily';

-- AlterTable
ALTER TABLE `user_metas` MODIFY `role` ENUM('SuperAdmin', 'Admin', 'User') NOT NULL DEFAULT 'User';
