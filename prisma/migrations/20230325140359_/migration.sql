-- DropIndex
DROP INDEX `Files_appartementId_fkey` ON `files`;

-- DropIndex
DROP INDEX `Post_appartementId_fkey` ON `post`;

-- DropIndex
DROP INDEX `Post_posterId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isLogged` BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_appartementId_fkey` FOREIGN KEY (`appartementId`) REFERENCES `Appartement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_appartementId_fkey` FOREIGN KEY (`appartementId`) REFERENCES `Appartement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
