/*
  Warnings:

  - You are about to drop the column `fileName` on the `files` table. All the data in the column will be lost.
  - Added the required column `filename` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Files_appartementId_fkey` ON `files`;

-- DropIndex
DROP INDEX `Post_appartementId_fkey` ON `post`;

-- DropIndex
DROP INDEX `Post_posterId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `files` DROP COLUMN `fileName`,
    ADD COLUMN `filename` VARCHAR(191) NOT NULL,
    MODIFY `typeFile` VARCHAR(191) NULL,
    MODIFY `path` VARCHAR(191) NULL,
    MODIFY `postId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_appartementId_fkey` FOREIGN KEY (`appartementId`) REFERENCES `Appartement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_appartementId_fkey` FOREIGN KEY (`appartementId`) REFERENCES `Appartement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
