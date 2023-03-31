/*
  Warnings:

  - You are about to drop the column `appartementId` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `appartementId` on the `post` table. All the data in the column will be lost.
  - Made the column `postId` on table `files` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Files_appartementId_fkey` ON `files`;

-- DropIndex
DROP INDEX `Post_appartementId_fkey` ON `post`;

-- DropIndex
DROP INDEX `Post_posterId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `files` DROP COLUMN `appartementId`,
    MODIFY `postId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `appartementId`,
    ADD COLUMN `city` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `country` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `isLocated` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `nbRoommate` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `nbRooms` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `price` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    ADD COLUMN `region` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `state` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `surface` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
