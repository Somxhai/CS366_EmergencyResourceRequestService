/*
  Warnings:

  - The `priority` column on the `ResourceRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ResourcePriority" AS ENUM ('LOW', 'NORMAL', 'CRITICAL');

-- AlterTable
ALTER TABLE "ResourceRequest" DROP COLUMN "priority",
ADD COLUMN     "priority" "ResourcePriority" NOT NULL DEFAULT 'NORMAL';
