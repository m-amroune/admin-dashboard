-- Link existing orders to users using the current email values
UPDATE "Order" AS o
SET "userId" = u."id"
FROM "User" AS u
WHERE o."email" = u."email";

-- Make the relation required
ALTER TABLE "Order"
ALTER COLUMN "userId" SET NOT NULL;

-- Remove the duplicated email field
ALTER TABLE "Order"
DROP COLUMN "email";
