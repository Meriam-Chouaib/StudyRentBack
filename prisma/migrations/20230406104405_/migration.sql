/*
  Warnings:

  - You are about to drop the column `country` on the `post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Files_postId_fkey` ON `files`;

-- DropIndex
DROP INDEX `Post_posterId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `country`;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
