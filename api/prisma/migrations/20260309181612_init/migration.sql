-- CreateTable
CREATE TABLE "ResourceRequest" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "requestFor" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requesterName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ResourceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestedItem" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "RequestedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestedExtraItem" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "RequestedExtraItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequestedItem_requestId_idx" ON "RequestedItem"("requestId");

-- CreateIndex
CREATE INDEX "RequestedExtraItem_requestId_idx" ON "RequestedExtraItem"("requestId");

-- AddForeignKey
ALTER TABLE "RequestedItem" ADD CONSTRAINT "RequestedItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ResourceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestedExtraItem" ADD CONSTRAINT "RequestedExtraItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ResourceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
