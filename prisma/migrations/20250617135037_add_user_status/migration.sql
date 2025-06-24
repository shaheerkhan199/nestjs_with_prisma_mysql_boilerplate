/*
  Warnings:

  - You are about to alter the column `status` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `status` ENUM('ACTIVE', 'BANNED', 'UNVERIFIED') NOT NULL DEFAULT 'UNVERIFIED';
