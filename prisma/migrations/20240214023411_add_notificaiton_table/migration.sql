-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_userId_key" ON "Notifications"("userId");
