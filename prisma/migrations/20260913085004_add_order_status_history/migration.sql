CREATE TABLE "OrderStatusHistory" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

INSERT INTO "OrderStatusHistory" ("status", "createdAt", "orderId")
SELECT "status", "updatedAt", "id"
FROM "Order";

CREATE INDEX "OrderStatusHistory_orderId_idx"
ON "OrderStatusHistory"("orderId");

ALTER TABLE "OrderStatusHistory"
ADD CONSTRAINT "OrderStatusHistory_orderId_fkey"
FOREIGN KEY ("orderId")
REFERENCES "Order"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;