/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `partners` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "number" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "partners_number_key" ON "partners"("number");
