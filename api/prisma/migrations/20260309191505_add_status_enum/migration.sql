/*
  Warnings:

  - The `status` column on the `ResourceRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ResourceRequestStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CLOSED');

-- AlterTable
ALTER TABLE "ResourceRequest" DROP COLUMN "status",
ADD COLUMN     "status" "ResourceRequestStatus" NOT NULL DEFAULT 'NEW';
