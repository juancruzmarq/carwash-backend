-- CreateTable
CREATE TABLE "role" (
    "id_role" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "permission" (
    "id_permission" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id_permission")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id_role" INTEGER NOT NULL,
    "id_permission" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id_role","id_permission")
);

-- CreateTable
CREATE TABLE "user" (
    "id_user" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id_user" INTEGER NOT NULL,
    "id_role" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id_user","id_role")
);

-- CreateTable
CREATE TABLE "client" (
    "id_client" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "carwash" (
    "id_carwash" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "capacity" INTEGER,
    "photo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "carwash_pkey" PRIMARY KEY ("id_carwash")
);

-- CreateTable
CREATE TABLE "service" (
    "id_service" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "id_carwash" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id_service")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id_price_history" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "id_service" INTEGER NOT NULL,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id_price_history")
);

-- CreateTable
CREATE TABLE "appointment" (
    "id_appointment" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_carwash" INTEGER NOT NULL,
    "id_service" INTEGER NOT NULL,
    "id_vehicle" INTEGER NOT NULL,
    "id_client" INTEGER NOT NULL,
    "id_state_history" INTEGER NOT NULL,
    "id_promotion" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id_appointment")
);

-- CreateTable
CREATE TABLE "promotion" (
    "id_promotion" SERIAL NOT NULL,
    "description" TEXT,
    "discount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_carwash" INTEGER NOT NULL,

    CONSTRAINT "promotion_pkey" PRIMARY KEY ("id_promotion")
);

-- CreateTable
CREATE TABLE "state" (
    "id_state" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id_state")
);

-- CreateTable
CREATE TABLE "state_histories" (
    "id_state_history" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "id_state" INTEGER NOT NULL,

    CONSTRAINT "state_histories_pkey" PRIMARY KEY ("id_state_history")
);

-- CreateTable
CREATE TABLE "global_brand" (
    "id_global_brand" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_brand_pkey" PRIMARY KEY ("id_global_brand")
);

-- CreateTable
CREATE TABLE "global_model" (
    "id_global_model" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_global_brand" INTEGER NOT NULL,

    CONSTRAINT "global_model_pkey" PRIMARY KEY ("id_global_model")
);

-- CreateTable
CREATE TABLE "user_brand" (
    "id_user_brand" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "user_brand_pkey" PRIMARY KEY ("id_user_brand")
);

-- CreateTable
CREATE TABLE "user_model" (
    "id_user_model" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_user_brand" INTEGER NOT NULL,

    CONSTRAINT "user_model_pkey" PRIMARY KEY ("id_user_model")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "id_vehicle" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT,
    "plate" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_global_model" INTEGER NOT NULL,
    "id_user_model" INTEGER NOT NULL,
    "id_carwash" INTEGER NOT NULL,
    "id_client" INTEGER NOT NULL,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id_vehicle")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "carwash_id_user_key" ON "carwash"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "service_name_id_carwash_key" ON "service"("name", "id_carwash");

-- CreateIndex
CREATE UNIQUE INDEX "price_history_id_service_created_at_key" ON "price_history"("id_service", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "state_name_context_key" ON "state"("name", "context");

-- CreateIndex
CREATE UNIQUE INDEX "global_brand_name_key" ON "global_brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "global_model_name_key" ON "global_model"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_plate_key" ON "vehicle"("plate");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "role"("id_role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_id_permission_fkey" FOREIGN KEY ("id_permission") REFERENCES "permission"("id_permission") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "role"("id_role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carwash" ADD CONSTRAINT "carwash_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service" ADD CONSTRAINT "service_id_carwash_fkey" FOREIGN KEY ("id_carwash") REFERENCES "carwash"("id_carwash") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_id_service_fkey" FOREIGN KEY ("id_service") REFERENCES "service"("id_service") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_id_carwash_fkey" FOREIGN KEY ("id_carwash") REFERENCES "carwash"("id_carwash") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_id_service_fkey" FOREIGN KEY ("id_service") REFERENCES "service"("id_service") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_id_vehicle_fkey" FOREIGN KEY ("id_vehicle") REFERENCES "vehicle"("id_vehicle") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_id_state_history_fkey" FOREIGN KEY ("id_state_history") REFERENCES "state_histories"("id_state_history") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_id_promotion_fkey" FOREIGN KEY ("id_promotion") REFERENCES "promotion"("id_promotion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion" ADD CONSTRAINT "promotion_id_carwash_fkey" FOREIGN KEY ("id_carwash") REFERENCES "carwash"("id_carwash") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "state_histories" ADD CONSTRAINT "state_histories_id_state_fkey" FOREIGN KEY ("id_state") REFERENCES "state"("id_state") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_model" ADD CONSTRAINT "global_model_id_global_brand_fkey" FOREIGN KEY ("id_global_brand") REFERENCES "global_brand"("id_global_brand") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_brand" ADD CONSTRAINT "user_brand_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_model" ADD CONSTRAINT "user_model_id_user_brand_fkey" FOREIGN KEY ("id_user_brand") REFERENCES "user_brand"("id_user_brand") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_id_global_model_fkey" FOREIGN KEY ("id_global_model") REFERENCES "global_model"("id_global_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_id_user_model_fkey" FOREIGN KEY ("id_user_model") REFERENCES "user_model"("id_user_model") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_id_carwash_fkey" FOREIGN KEY ("id_carwash") REFERENCES "carwash"("id_carwash") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;
