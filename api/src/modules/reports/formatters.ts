import { BaseFormatter } from "@utils/base-formatter";
import { reportResponseSchema } from "./dtos";
import { ReportsResponse } from "./types";

export abstract class ReportsFormatter {
  static response(data: ReportsResponse) {
    return BaseFormatter.convertData(data, reportResponseSchema);
  }
}
