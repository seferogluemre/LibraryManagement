/*
  Warnings:

  - You are about to drop the column `user_role` on the `users` table. All the data in the column will be lost.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TEACHER', 'ADMIN');

-- DropIndex
DROP INDEX "users_user_role_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "user_role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropEnum
DROP TYPE "user_roles";

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");
