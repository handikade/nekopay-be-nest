-- Rename the existing column
ALTER TABLE "partners" RENAME COLUMN "type" TO "types";

-- Change the type to an array of PartnerType, wrapping existing values in an array
ALTER TABLE "partners" ALTER COLUMN "types" TYPE "PartnerType"[] USING ARRAY["types"];
