// import { startOverdueBooksCron } from "#modules/notifications/cron-jobs/overdue-books.cron";
// import "#modules/notifications/queues/notification.worker";
import { transferHistoryController } from "#modules/transfer-histories";
import { handleElysiaError } from "@config/error-handler";
import { prepareSwaggerConfig } from "@config/swagger-config";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { authController } from "@modules/auth";
import { authorController } from "@modules/authors";
import { bookAssignmentController } from "@modules/book-assignment";
import { bookController } from "@modules/books";
import { categoryController } from "@modules/categories";
import { classroomController } from "@modules/classrooms";
import { notificationController } from "@modules/notifications";
import { publisherController } from "@modules/publishers";
import { reportController } from "@modules/reports";
import { studentClassroomController } from "@modules/student-classrooms";
import { studentController } from "@modules/students";
import { userController } from "@modules/users";
import { websockets } from "@modules/websockets";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: {
          title: "Kütüphane Takip API",
          version: "1.0.0",
          description: "Kütüphane yönetim sistemi API dokümantasyonu",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: [
          { name: "Auth", description: "Kimlik doğrulama işlemleri" },
          { name: "Books", description: "Kitap yönetimi" },
          { name: "Students", description: "Öğrenci yönetimi" },
          { name: "Book Assignments", description: "Kitap ödünç işlemleri" },
          { name: "Reports", description: "Raporlar ve istatistikler" },
        ],
        servers: [
          {
            url: "http://localhost:3000",
            description: "Development server",
          },
        ],
      },
      swaggerOptions: {
        persistAuthorization: true,
        displayOperationId: false,
        filter: true,
        tagsSorter: "alpha",
      },
    })
  )
  .onError(handleElysiaError)
  .use(userController)
  .use(authController)
  .use(studentController)
  .use(classroomController)
  .use(studentClassroomController)
  .use(transferHistoryController)
  .use(authorController)
  .use(categoryController)
  .use(bookController)
  .use(publisherController)
  .use(bookAssignmentController)
  .use(reportController)
  .use(notificationController)
  .use(websockets)
  .get("/health", () => ({ status: "ok" }), {
    detail: {
      tags: ["System"],
      description: "API sağlık kontrolü",
    },
  })
  .listen(process.env.PORT || 3000);

if (process.env.NODE_ENV === "development") {
  const tags = [
    { name: "User", description: "User endpoints" },
    { name: "Auth", description: "Auth endpoints" },
    { name: "Student", description: "Student endpoints" },
    { name: "Classroom", description: "Classroom endpoints" },
    { name: "Student-Classroom", description: "Student-Classroom endpoints" },
    { name: "Transfer History", description: "Transfer History endpoints" },
    { name: "Author", description: "Author endpoints" },
    { name: "Category", description: "Category endpoints" },
    { name: "Book", description: "Book endpoints" },
    { name: "Publisher", description: "Publisher endpoints" },
    { name: "Book Assignment", description: "Book Assignment endpoints" },
    { name: "Report", description: "Report endpoints" },
    { name: "Notification", description: "Notification endpoints" },
    { name: "Websocket", description: "Websocket endpoints" },
    { name: "System", description: "System endpoints" },
  ];

  const swaggerConfig = await prepareSwaggerConfig({ tags });

  app.use(swagger(swaggerConfig));
}

// startOverdueBooksCron();

console.log(
  `🦊 Elysia çalışıyor kardeş ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;