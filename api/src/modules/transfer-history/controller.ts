import Elysia, { t } from "elysia";
import {
  transferHistoryCreateDto,
  transferHistoryIndexDto,
  transferHistoryShowDto,
  transferHistoryStudentDto,
} from "./dtos";
import { TransferHistoryFormatter } from "./formatters";
import { TransferHistoryService } from "./service";

export const app = new Elysia({
  prefix: "/transfer-history",
  name: "TransferHistory",
  detail: {
    tags: ["Transfer History"],
  },
})
  .get(
    "/",
    async ({ query }) => {
      const transfers = await TransferHistoryService.index(query);
      return TransferHistoryFormatter.listResponse(transfers);
    },
    transferHistoryIndexDto
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const transfer = await TransferHistoryService.show(id);
      return TransferHistoryFormatter.response(transfer);
    },
    transferHistoryShowDto
  )
  .post(
    "/",
    async ({ body }) => {
      const transfer = await TransferHistoryService.create(body);
      return TransferHistoryFormatter.response(transfer);
    },
    transferHistoryCreateDto
  )
  .get(
    "/student/:studentId",
    async ({ params: { studentId } }) => {
      const transfers =
        await TransferHistoryService.getStudentTransferHistory(studentId);
      return TransferHistoryFormatter.listResponse(transfers);
    },
    transferHistoryStudentDto
  )
  .get(
    "/class/:classId/from",
    async ({ params: { classId } }) => {
      const transfers =
        await TransferHistoryService.getTransfersFromClass(classId);
      return TransferHistoryFormatter.listResponse(transfers);
    },
    {
      params: t.Object({
        classId: t.String(),
      }),
      response: {
        200: transferHistoryIndexDto.response[200],
        404: transferHistoryShowDto.response[404],
      },
      detail: {
        summary: "Sınıftan Yapılan Transferler",
        description:
          "Belirtilen sınıftan başka sınıflara yapılan transferleri gösterir",
      },
    }
  )
  .get(
    "/class/:classId/to",
    async ({ params: { classId } }) => {
      const transfers =
        await TransferHistoryService.getTransfersToClass(classId);
      return TransferHistoryFormatter.listResponse(transfers);
    },
    {
      params: t.Object({
        classId: t.String(),
      }),
      response: {
        200: transferHistoryIndexDto.response[200],
        404: transferHistoryShowDto.response[404],
      },
      detail: {
        summary: "Sınıfa Yapılan Transferler",
        description:
          "Belirtilen sınıfa diğer sınıflardan yapılan transferleri gösterir",
      },
    }
  )
  .get(
    "/recent/:limit?",
    async ({ params: { limit } }) => {
      const transfers = await TransferHistoryService.getRecentTransfers(
        limit ? parseInt(limit) : 10
      );
      return TransferHistoryFormatter.summaryListResponse(transfers);
    },
    {
      params: t.Object({
        limit: t.Optional(t.String()),
      }),
      response: {
        200: t.Array(
          t.Object({
            id: t.String(),
            studentName: t.String(),
            studentNo: t.Number(),
            oldClassName: t.String(),
            newClassName: t.String(),
            transferDate: t.Date(),
            notes: t.Optional(t.String()),
          })
        ),
      },
      detail: {
        summary: "Son Transfer Kayıtları",
        description: "En son yapılan N adet transferi özet olarak gösterir",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await TransferHistoryService.destroy(id);
      return TransferHistoryFormatter.deleteResponse();
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Object({
          message: t.String(),
        }),
        404: transferHistoryShowDto.response[404],
      },
      detail: {
        summary: "Transfer Kaydını Sil",
        description: "Belirtilen transfer kaydını sistemden siler",
      },
    }
  );
