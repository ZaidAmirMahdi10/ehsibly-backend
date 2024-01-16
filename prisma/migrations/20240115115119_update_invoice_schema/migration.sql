/*
  Warnings:

  - Added the required column `companyName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `containerNumber` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `companyName` VARCHAR(191) NOT NULL,
    ADD COLUMN `containerNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `phoneNumber` VARCHAR(191) NULL;
