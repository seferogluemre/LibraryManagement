import { authGuard } from "@utils/auth-middleware";
import Elysia from "elysia";
import {
  transferHistoryCreateDto,
  transferHistoryDestroyDto,
  transferHistoryFromClassDto,
  transferHistoryIndexDto,
  transferHistoryRecentDto,
  transferHistoryShowDto,
  transferHistoryStudentDto,
  transferHistoryToClassDto,
} from "./dtos";
import { TransferHistoryFormatter } from "./formatters";
import { TransferHistoryService } from "./service";
import { TransferHistoryRecord } from "./types";

export const app = new Elysia({
  prefix: "/transfer-history",
  name: "TransferHistory",
  detail: {
    tags: ["Transfer History"],
  },
})
  .derive(async (context) => {
    const authContext = {
      user: null as any,
      isAuthenticated: false,
    };
    try {
      const user = await authGuard(context.headers);
      authContext.user = user;
      authContext.isAuthenticated = true;
    } catch (error) {
      // do nothing
    }
    return authContext;
  })
  .get(
    "/",
    async ({ query }) => {
      const transfers = await TransferHistoryService.index(query);
      return TransferHistoryFormatter.listResponse(
        transfers as unknown as TransferHistoryRecord[]
      );
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
    async ({ body, user }) => {
      const transfer = await TransferHistoryService.create(body, user.id);
      return TransferHistoryFormatter.response(transfer);
    },
    {
      ...transferHistoryCreateDto,
      beforeHandle: [
        ({ isAuthenticated }) => {
          if (!isAuthenticated) {
            throw new Error("Unauthorized");
          }
        },
      ],
    }
  )
  .get(
    "/student/:studentId",
    async ({ params: { studentId } }) => {
      const transfers =
        await TransferHistoryService.getStudentTransferHistory(studentId);
      return TransferHistoryFormatter.listResponse(
        transfers as unknown as TransferHistoryRecord[]
      );
    },
    transferHistoryStudentDto
  )
  .get(
    "/class/:classId/from",
    async ({ params: { classId } }) => {
      const transfers =
        await TransferHistoryService.getTransfersFromClass(classId);
      return TransferHistoryFormatter.listResponse(
        transfers as unknown as TransferHistoryRecord[]
      );
    },
    transferHistoryFromClassDto
  )
  .get(
    "/class/:classId/to",
    async ({ params: { classId } }) => {
      const transfers =
        await TransferHistoryService.getTransfersToClass(classId);
      return TransferHistoryFormatter.listResponse(
        transfers as unknown as TransferHistoryRecord[]
      );
    },
    transferHistoryToClassDto
  )
  .get(
    "/recent/:limit?",
    async ({ params: { limit } }) => {
      const transfers = await TransferHistoryService.getRecentTransfers(
        limit ? parseInt(limit) : 10
      );
      return TransferHistoryFormatter.summaryListResponse(
        transfers as unknown as TransferHistoryRecord[]
      );
    },
    transferHistoryRecentDto
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await TransferHistoryService.destroy(id);
      return TransferHistoryFormatter.deleteResponse();
    },
    {
      ...transferHistoryDestroyDto,
      beforeHandle: [
        ({ isAuthenticated }) => {
          if (!isAuthenticated) {
            throw new Error("Unauthorized");
          }
        },
      ],
    }
  );
