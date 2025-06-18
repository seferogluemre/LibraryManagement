/*
  Warnings:

  - A unique constraint covering the columns `[author_name]` on the table `authors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publisher_name]` on the table `publishers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "authors_author_name_key" ON "authors"("author_name");

-- CreateIndex
CREATE UNIQUE INDEX "publishers_publisher_name_key" ON "publishers"("publisher_name");
