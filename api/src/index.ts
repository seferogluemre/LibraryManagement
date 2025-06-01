import { authorController } from "#modules/author";
import { categoryController } from "#modules/category";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { authController } from "@modules/auth";
import { classroomController } from "@modules/classroom";
import { studentController } from "@modules/student";
import { studentClassroomController } from "@modules/student-classroom";
import { transferHistoryController } from "@modules/transfer-history";
import { userController } from "@modules/users";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Kütüphane Takip API",
          version: "1.0.0",
          description: "Kütüphane yönetim sistemi API dokümantasyonu",
        },
        tags: [
          { name: "Authentication", description: "Kimlik doğrulama işlemleri" },
          { name: "Users", description: "Kullanıcı yönetimi" },
          { name: "Students", description: "Öğrenci yönetimi" },
          { name: "Classrooms", description: "Sınıf yönetimi" },
          {
            name: "Student-Classroom",
            description: "Öğrenci-Sınıf ilişki yönetimi",
          },
          {
            name: "Transfer History",
            description: "Öğrenci transfer geçmişi yönetimi",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    })
  )
  .use(userController)
  .use(authController)
  .use(studentController)
  .use(classroomController)
  .use(studentClassroomController)
  .use(transferHistoryController)
  .use(authorController)
  .use(categoryController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

console.log(
  `📚 Swagger UI: http://${app.server?.hostname}:${app.server?.port}/swagger`
);
