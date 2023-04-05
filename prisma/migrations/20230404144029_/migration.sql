-- DropIndex
DROP INDEX `Files_postId_fkey` ON `files`;

-- DropIndex
DROP INDEX `Post_posterId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `postal_code` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
