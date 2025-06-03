-- CreateIndex
CREATE INDEX "authors_author_name_idx" ON "authors"("author_name");

-- CreateIndex
CREATE INDEX "book_assignments_student_id_idx" ON "book_assignments"("student_id");

-- CreateIndex
CREATE INDEX "book_assignments_book_id_idx" ON "book_assignments"("book_id");

-- CreateIndex
CREATE INDEX "book_assignments_assigned_by_id_idx" ON "book_assignments"("assigned_by_id");

-- CreateIndex
CREATE INDEX "book_assignments_is_returned_idx" ON "book_assignments"("is_returned");

-- CreateIndex
CREATE INDEX "book_assignments_return_due_idx" ON "book_assignments"("return_due");

-- CreateIndex
CREATE INDEX "book_assignments_assigned_at_idx" ON "book_assignments"("assigned_at");

-- CreateIndex
CREATE INDEX "book_assignments_student_id_is_returned_idx" ON "book_assignments"("student_id", "is_returned");

-- CreateIndex
CREATE INDEX "book_assignments_is_returned_return_due_idx" ON "book_assignments"("is_returned", "return_due");

-- CreateIndex
CREATE INDEX "books_author_id_idx" ON "books"("author_id");

-- CreateIndex
CREATE INDEX "books_category_id_idx" ON "books"("category_id");

-- CreateIndex
CREATE INDEX "books_publisher_id_idx" ON "books"("publisher_id");

-- CreateIndex
CREATE INDEX "books_book_title_idx" ON "books"("book_title");

-- CreateIndex
CREATE INDEX "books_available_copies_idx" ON "books"("available_copies");

-- CreateIndex
CREATE INDEX "books_published_year_idx" ON "books"("published_year");

-- CreateIndex
CREATE INDEX "classrooms_classroom_name_idx" ON "classrooms"("classroom_name");

-- CreateIndex
CREATE INDEX "publishers_publisher_name_idx" ON "publishers"("publisher_name");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "students_class_id_idx" ON "students"("class_id");

-- CreateIndex
CREATE INDEX "students_student_name_idx" ON "students"("student_name");

-- CreateIndex
CREATE INDEX "transfer_histories_student_id_idx" ON "transfer_histories"("student_id");

-- CreateIndex
CREATE INDEX "transfer_histories_transfer_date_idx" ON "transfer_histories"("transfer_date");

-- CreateIndex
CREATE INDEX "transfer_histories_old_class_id_idx" ON "transfer_histories"("old_class_id");

-- CreateIndex
CREATE INDEX "transfer_histories_new_class_id_idx" ON "transfer_histories"("new_class_id");

-- CreateIndex
CREATE INDEX "users_user_role_idx" ON "users"("user_role");

-- CreateIndex
CREATE INDEX "users_user_name_idx" ON "users"("user_name");
