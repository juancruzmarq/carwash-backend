/*
  Warnings:

  - A unique constraint covering the columns `[name,id_global_brand]` on the table `global_model` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `user_brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,id_user_brand]` on the table `user_model` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "global_model_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "global_model_name_id_global_brand_key" ON "global_model"("name", "id_global_brand");

-- CreateIndex
CREATE UNIQUE INDEX "user_brand_name_key" ON "user_brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_model_name_id_user_brand_key" ON "user_model"("name", "id_user_brand");
