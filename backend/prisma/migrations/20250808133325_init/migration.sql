-- CreateTable
CREATE TABLE "public"."Application" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "urlLinks" TEXT[],
    "resumeBytes" BYTEA,
    "resumeFilename" TEXT,
    "resumeMimetype" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Application_email_idx" ON "public"."Application"("email");
