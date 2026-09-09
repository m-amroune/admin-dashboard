/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reference` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "reference" TEXT,
ADD COLUMN "amountCents" INTEGER,
ADD COLUMN "updatedAt" TIMESTAMP(3);

UPDATE "Order"
SET
  "reference" = 'ORD-' || LPAD("id"::text, 6, '0'),
  "updatedAt" = "createdAt";

ALTER TABLE "Order"
ALTER COLUMN "reference" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

CREATE UNIQUE INDEX "Order_reference_key"
ON "Order"("reference");
