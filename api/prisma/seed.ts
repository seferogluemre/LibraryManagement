import { faker } from "@faker-js/faker";
import { config } from "dotenv";

import prisma from "../src/core/prisma";

// Load environment variables from .env file
config({ path: "../../.env" });

const predefinedVesselTypes = Array.from(
  new Set(["Tanker", "Cargo", "Container", "Bulk Carrier", "Passenger"])
);

async function main() {
  try {
    // 1. Önce Admin ve Öğretmen kullanıcıları oluştur
    console.info("👥 Kullanıcılar oluşturuluyor...");
    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin User",
        hashedPassword:
          "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LHd.5CpOr/yLCQxKi", // 123456
        role: "ADMIN",
      },
    });

    const teachers = await Promise.all(
      Array.from({ length: 3 }).map(async (_, index) => {
        return prisma.user.create({
          data: {
            email: `teacher${index + 1}@example.com`,
            name: faker.person.fullName(),
            hashedPassword:
              "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LHd.5CpOr/yLCQxKi", // 123456
            role: "TEACHER",
          },
        });
      })
    );

    // 2. Kategoriler oluştur
    console.info("📚 Kategoriler oluşturuluyor...");
    const categories = await Promise.all(
      ["Roman", "Bilim Kurgu", "Tarih", "Edebiyat", "Bilim"].map((name) =>
        prisma.category.create({
          data: { name },
        })
      )
    );

    // 3. Yayınevleri oluştur
    console.info("🏢 Yayınevleri oluşturuluyor...");
    const publishers = await Promise.all(
      Array.from({ length: 5 }).map(() =>
        prisma.publisher.create({
          data: {
            name: faker.company.name(),
          },
        })
      )
    );

    // 4. Yazarlar oluştur
    console.info("✍️ Yazarlar oluşturuluyor...");
    const authors = await Promise.all(
      Array.from({ length: 10 }).map(() =>
        prisma.author.create({
          data: {
            name: faker.person.fullName(),
          },
        })
      )
    );

    // 5. Sınıflar oluştur
    console.info("🏫 Sınıflar oluşturuluyor...");
    const classrooms = await Promise.all(
      ["9-A", "9-B", "10-A", "10-B", "11-A", "11-B"].map((name) =>
        prisma.classroom.create({
          data: { name },
        })
      )
    );

    // 6. Öğrenciler oluştur
    console.info("👨‍🎓 Öğrenciler oluşturuluyor...");
    const students = await Promise.all(
      Array.from({ length: 30 }).map((_, index) =>
        prisma.student.create({
          data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            studentNo: 1000 + index,
            classId:
              classrooms[Math.floor(Math.random() * classrooms.length)].id,
          },
        })
      )
    );

    // 7. Kitaplar oluştur
    console.info("📖 Kitaplar oluşturuluyor...");
    const books = await Promise.all(
      Array.from({ length: 50 }).map(() =>
        prisma.book.create({
          data: {
            title: faker.lorem.words(3),
            isbn: faker.string.numeric(13),
            publishedYear: faker.number.int({ min: 2000, max: 2023 }),
            totalCopies: faker.number.int({ min: 1, max: 5 }),
            availableCopies: 1,
            authorId: authors[Math.floor(Math.random() * authors.length)].id,
            categoryId:
              categories[Math.floor(Math.random() * categories.length)].id,
            publisherId:
              publishers[Math.floor(Math.random() * publishers.length)].id,
            addedById: teachers[Math.floor(Math.random() * teachers.length)].id,
          },
        })
      )
    );

    // 8. Kitap Atamaları oluştur
    console.info("📚 Kitap atamaları oluşturuluyor...");
    await Promise.all(
      Array.from({ length: 20 }).map(async () => {
        const student = students[Math.floor(Math.random() * students.length)];
        const book = books[Math.floor(Math.random() * books.length)];
        const teacher = teachers[Math.floor(Math.random() * teachers.length)];

        // Bazı kitapları teslim edilmiş, bazılarını edilmemiş olarak işaretle
        const isReturned = Math.random() > 0.5;
        const assignedAt = faker.date.past();
        const returnDue = new Date(assignedAt);
        returnDue.setDate(assignedAt.getDate() + 14); // 14 gün ödünç süresi

        return prisma.bookAssignment.create({
          data: {
            studentId: student.id,
            bookId: book.id,
            assignedById: teacher.id,
            assignedAt,
            returnDue,
            returned: isReturned,
            returnedAt: isReturned
              ? faker.date.between({ from: assignedAt, to: returnDue })
              : null,
          },
        });
      })
    );

    console.info("✅ Seed işlemi başarıyla tamamlandı!");
  } catch (error) {
    console.error("❌ Seed işlemi sırasında hata:", error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Seed hatası:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
