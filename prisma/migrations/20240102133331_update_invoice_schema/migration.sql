/*
  Warnings:

  - You are about to drop the column `amountRNB` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `amountUS` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `customerNumber` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `amountOtherCurrency` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `left` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otherCurrency` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `received` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `amountRNB`,
    DROP COLUMN `amountUS`,
    DROP COLUMN `customerNumber`,
    ADD COLUMN `amountOtherCurrency` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerName` VARCHAR(191) NOT NULL,
    ADD COLUMN `left` VARCHAR(191) NOT NULL,
    ADD COLUMN `bankName` VARCHAR(191) NOT NULL,
    ADD COLUMN `otherCurrency` VARCHAR(191) NOT NULL,
    ADD COLUMN `received` VARCHAR(191) NOT NULL;
