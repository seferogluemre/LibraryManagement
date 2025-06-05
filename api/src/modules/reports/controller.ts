import Elysia from "elysia";
import { reportIndexDto } from "./dtos";
import { ReportsFormatter } from "./formatters";
import { ReportsService } from "./service";

export const app = new Elysia({
  prefix: "/reports",
  name: "Reports",
  detail: {
    tags: ["Reports"],
  },
}).get(
  "",
  async ({ query }) => {
    const limit = query.limit || 5;
    const reports = await ReportsService.getReports(limit as number);
    return ReportsFormatter.response(reports);
  },
  reportIndexDto
);
