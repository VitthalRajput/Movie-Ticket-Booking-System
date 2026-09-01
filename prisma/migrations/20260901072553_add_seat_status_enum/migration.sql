/*
  Warnings:

  - The `status` column on the `seats` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('available', 'held', 'booked');

-- AlterTable
ALTER TABLE "seats" DROP COLUMN "status",
ADD COLUMN     "status" "SeatStatus" NOT NULL DEFAULT 'available';
