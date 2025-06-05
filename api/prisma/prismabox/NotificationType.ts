import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NotificationType = t.Union([
  t.Literal("OVERDUE_BOOK"),
  t.Literal("SYSTEM"),
]);
