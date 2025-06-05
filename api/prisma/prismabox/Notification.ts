import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NotificationPlain = t.Object({
  id: t.String(),
  type: t.Union([t.Literal("OVERDUE_BOOK"), t.Literal("SYSTEM")]),
  userId: t.String(),
  message: t.String(),
  isRead: t.Boolean(),
  metadata: __nullable__(t.Any()),
  createdAt: t.Date(),
});

export const NotificationRelations = t.Object({
  user: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
    hashedPassword: t.String(),
    role: t.Union([t.Literal("TEACHER"), t.Literal("ADMIN")]),
    createdAt: t.Date(),
  }),
});

export const NotificationPlainInputCreate = t.Object({
  type: t.Union([t.Literal("OVERDUE_BOOK"), t.Literal("SYSTEM")]),
  message: t.String(),
  isRead: t.Optional(t.Boolean()),
  metadata: t.Optional(__nullable__(t.Any())),
});

export const NotificationPlainInputUpdate = t.Object({
  type: t.Optional(t.Union([t.Literal("OVERDUE_BOOK"), t.Literal("SYSTEM")])),
  message: t.Optional(t.String()),
  isRead: t.Optional(t.Boolean()),
  metadata: t.Optional(__nullable__(t.Any())),
});

export const NotificationRelationsInputCreate = t.Object({
  user: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
});

export const NotificationRelationsInputUpdate = t.Partial(
  t.Object({
    user: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  }),
);

export const NotificationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          type: t.Union([t.Literal("OVERDUE_BOOK"), t.Literal("SYSTEM")]),
          userId: t.String(),
          message: t.String(),
          isRead: t.Boolean(),
          metadata: t.Any(),
          createdAt: t.Date(),
        },
        { additionalProperties: true },
      ),
    { $id: "Notification" },
  ),
);

export const NotificationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: true }),
          { additionalProperties: true },
        ),
        t.Union([t.Object({ id: t.String() })], { additionalProperties: true }),
        t.Partial(
          t.Object({
            AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
            NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
            OR: t.Array(Self, { additionalProperties: true }),
          }),
          { additionalProperties: true },
        ),
        t.Partial(
          t.Object({
            id: t.String(),
            type: t.Union([t.Literal("OVERDUE_BOOK"), t.Literal("SYSTEM")]),
            userId: t.String(),
            message: t.String(),
            isRead: t.Boolean(),
            metadata: t.Any(),
            createdAt: t.Date(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Notification" },
);

export const NotificationSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    type: t.Boolean(),
    userId: t.Boolean(),
    message: t.Boolean(),
    isRead: t.Boolean(),
    metadata: t.Boolean(),
    createdAt: t.Boolean(),
    user: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const NotificationInclude = t.Partial(
  t.Object({ type: t.Boolean(), user: t.Boolean(), _count: t.Boolean() }),
);

export const NotificationOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    message: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    isRead: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    metadata: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Notification = t.Composite([
  NotificationPlain,
  NotificationRelations,
]);

export const NotificationInputCreate = t.Composite([
  NotificationPlainInputCreate,
  NotificationRelationsInputCreate,
]);

export const NotificationInputUpdate = t.Composite([
  NotificationPlainInputUpdate,
  NotificationRelationsInputUpdate,
]);
