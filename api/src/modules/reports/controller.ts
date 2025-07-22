import Elysia from "elysia";
import { dashboardStatsDto, reportIndexDto, transferStatsDto } from "./dtos";
import { ReportsFormatter } from "./formatters";
import { ReportsService } from "./service";

export const app = new Elysia({
  prefix: "/reports",
  name: "Reports",
  detail: {
    tags: ["Reports"],
  },
})
  .get(
    "",
    async ({ query }) => {
      const limit = query.limit || 5;
      const reports = await ReportsService.getReports(limit as number);
      return ReportsFormatter.response(reports);
    },
    reportIndexDto
  )
  .get(
    "/dashboard-stats",
    async () => {
      const stats = await ReportsService.getSystemStats();
      return stats;
    },
    dashboardStatsDto
  )
  .get(
    "/transfer-stats",
    async () => {
      const stats = await ReportsService.getTransferStats();
      return stats;
    },
    transferStatsDto
  );
