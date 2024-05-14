/*
  Warnings:

  - You are about to drop the column `id_global_model` on the `vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `id_user_model` on the `vehicle` table. All the data in the column will be lost.
  - You are about to drop the `global_brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `global_model` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_model` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "global_model" DROP CONSTRAINT "global_model_id_global_brand_fkey";

-- DropForeignKey
ALTER TABLE "user_brand" DROP CONSTRAINT "user_brand_id_user_fkey";

-- DropForeignKey
ALTER TABLE "user_model" DROP CONSTRAINT "user_model_id_user_brand_fkey";

-- DropForeignKey
ALTER TABLE "vehicle" DROP CONSTRAINT "vehicle_id_global_model_fkey";

-- DropForeignKey
ALTER TABLE "vehicle" DROP CONSTRAINT "vehicle_id_user_model_fkey";

-- AlterTable
ALTER TABLE "vehicle" DROP COLUMN "id_global_model",
DROP COLUMN "id_user_model",
ADD COLUMN     "modelIdModel" INTEGER;

-- DropTable
DROP TABLE "global_brand";

-- DropTable
DROP TABLE "global_model";

-- DropTable
DROP TABLE "user_brand";

-- DropTable
DROP TABLE "user_model";

-- CreateTable
CREATE TABLE "brand" (
    "id_brand" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id_brand")
);

-- CreateTable
CREATE TABLE "model" (
    "id_model" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_brand" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "model_pkey" PRIMARY KEY ("id_model")
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_name_id_brand_id_user_key" ON "brand"("name", "id_brand", "id_user");

-- CreateIndex
CREATE UNIQUE INDEX "model_name_id_model_id_brand_id_user_key" ON "model"("name", "id_model", "id_brand", "id_user");

-- AddForeignKey
ALTER TABLE "brand" ADD CONSTRAINT "brand_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model" ADD CONSTRAINT "model_id_brand_fkey" FOREIGN KEY ("id_brand") REFERENCES "brand"("id_brand") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model" ADD CONSTRAINT "model_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_modelIdModel_fkey" FOREIGN KEY ("modelIdModel") REFERENCES "model"("id_model") ON DELETE SET NULL ON UPDATE CASCADE;
