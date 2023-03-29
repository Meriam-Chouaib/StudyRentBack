/*
  Warnings:

  - Added the required column `fileName` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Files_appartementId_fkey` ON `files`;

-- DropIndex
DROP INDEX `Post_appartementId_fkey` ON `post`;

-- DropIndex
DROP INDEX `Post_posterId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `files` ADD COLUMN `fileName` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_appartementId_fkey` FOREIGN KEY (`appartementId`) REFERENCES `Appartement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_appartementId_fkey` FOREIGN KEY (`appartementId`) REFERENCES `Appartement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
