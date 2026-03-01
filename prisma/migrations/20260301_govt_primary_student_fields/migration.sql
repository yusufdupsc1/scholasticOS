-- Add Govt Primary student profile fields
ALTER TABLE "students"
ADD COLUMN IF NOT EXISTS "fatherName" TEXT,
ADD COLUMN IF NOT EXISTS "motherName" TEXT,
ADD COLUMN IF NOT EXISTS "guardianPhone" TEXT,
ADD COLUMN IF NOT EXISTS "birthRegNo" TEXT,
ADD COLUMN IF NOT EXISTS "nidNo" TEXT;
