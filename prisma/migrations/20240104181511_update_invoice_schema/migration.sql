/*
  Warnings:

  - Added the required column `containerNumber` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `containerNumber` VARCHAR(191) NOT NULL;
