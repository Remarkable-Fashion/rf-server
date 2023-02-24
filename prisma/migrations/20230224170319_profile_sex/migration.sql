/*
  Warnings:

  - You are about to alter the column `sex` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `profiles` MODIFY `sex` ENUM('Male', 'Female') NULL;
