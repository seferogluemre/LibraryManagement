import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SessionPlain = t.Object({
  id: t.String(),
  userId: t.String(),
  accessToken: t.String(),
  refreshToken: t.String(),
  expiresAt: t.Date(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export const SessionRelations = t.Object({
  user: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
    hashedPassword: t.String(),
    role: t.Union([t.Literal("TEACHER"), t.Literal("ADMIN")]),
    createdAt: t.Date(),
  }),
});

export const SessionPlainInputCreate = t.Object({
  accessToken: t.String(),
  refreshToken: t.String(),
  expiresAt: t.Date(),
});

export const SessionPlainInputUpdate = t.Object({
  accessToken: t.Optional(t.String()),
  refreshToken: t.Optional(t.String()),
  expiresAt: t.Optional(t.Date()),
});

export const SessionRelationsInputCreate = t.Object({
  user: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
});

export const SessionRelationsInputUpdate = t.Partial(
  t.Object({
    user: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  }),
);

export const SessionWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          userId: t.String(),
          accessToken: t.String(),
          refreshToken: t.String(),
          expiresAt: t.Date(),
          createdAt: t.Date(),
          updatedAt: t.Date(),
        },
        { additionalProperties: true },
      ),
    { $id: "Session" },
  ),
);

export const SessionWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), userId: t.String() },
            { additionalProperties: true },
          ),
          { additionalProperties: true },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ userId: t.String() })],
          { additionalProperties: true },
        ),
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
            userId: t.String(),
            accessToken: t.String(),
            refreshToken: t.String(),
            expiresAt: t.Date(),
            createdAt: t.Date(),
            updatedAt: t.Date(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Session" },
);

export const SessionSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    userId: t.Boolean(),
    accessToken: t.Boolean(),
    refreshToken: t.Boolean(),
    expiresAt: t.Boolean(),
    createdAt: t.Boolean(),
    updatedAt: t.Boolean(),
    user: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const SessionInclude = t.Partial(
  t.Object({ user: t.Boolean(), _count: t.Boolean() }),
);

export const SessionOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    accessToken: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    refreshToken: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    expiresAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    updatedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Session = t.Composite([SessionPlain, SessionRelations]);

export const SessionInputCreate = t.Composite([
  SessionPlainInputCreate,
  SessionRelationsInputCreate,
]);

export const SessionInputUpdate = t.Composite([
  SessionPlainInputUpdate,
  SessionRelationsInputUpdate,
]);
