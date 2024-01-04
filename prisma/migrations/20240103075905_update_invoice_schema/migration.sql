/*
  Warnings:

  - Added the required column `companyName` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `companyName` VARCHAR(191) NOT NULL;
