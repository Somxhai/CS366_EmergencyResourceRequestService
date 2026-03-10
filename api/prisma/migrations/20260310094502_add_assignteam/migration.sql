-- CreateTable
CREATE TABLE "AssignTeam" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssignTeam_requestId_idx" ON "AssignTeam"("requestId");

-- AddForeignKey
ALTER TABLE "AssignTeam" ADD CONSTRAINT "AssignTeam_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ResourceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
