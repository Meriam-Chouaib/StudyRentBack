-- CreateTable
CREATE TABLE `Files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `typeFile` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `postId` INTEGER NOT NULL,
    `appartementId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appartement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nbRooms` INTEGER NOT NULL,
    `surface` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `nbRoommate` INTEGER NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `isLocated` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datePost` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `posterId` INTEGER NOT NULL,
    `likes` INTEGER NOT NULL,
    `appartementId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_appartementId_fkey` FOREIGN KEY (`appartementId`) REFERENCES `Appartement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_appartementId_fkey` FOREIGN KEY (`appartementId`) REFERENCES `Appartement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
