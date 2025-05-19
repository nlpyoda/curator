-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "whyBuy" TEXT NOT NULL,
    "amazonReviewSummary" TEXT,
    "instagramReviewSummary" TEXT,
    "fbMarketplaceSummary" TEXT,
    "prosAndCons" JSONB,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productEmbedding" DOUBLE PRECISION[],
    "category" TEXT,
    "subCategory" TEXT,
    "tags" TEXT[],
    "attributes" JSONB,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaEmbedding" (
    "id" TEXT NOT NULL,
    "personaName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "relevanceScore" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "PersonaEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_category_subCategory_idx" ON "Product"("category", "subCategory");

-- CreateIndex
CREATE INDEX "PersonaEmbedding_personaName_idx" ON "PersonaEmbedding"("personaName");

-- CreateIndex
CREATE INDEX "PersonaEmbedding_productId_idx" ON "PersonaEmbedding"("productId");

-- AddForeignKey
ALTER TABLE "PersonaEmbedding" ADD CONSTRAINT "PersonaEmbedding_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
