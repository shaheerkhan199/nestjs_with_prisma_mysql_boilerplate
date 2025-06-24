-- AlterTable
ALTER TABLE `Profile` MODIFY `profileUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `fcmToken` VARCHAR(191) NULL,
    MODIFY `resetToken` VARCHAR(191) NULL,
    MODIFY `resetTokenExpiry` DATETIME(3) NULL,
    MODIFY `lastLogin` DATETIME(3) NULL;
