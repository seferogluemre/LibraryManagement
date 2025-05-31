import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TransferHistoryPlain = t.Object({
  id: t.String(),
  studentId: t.String(),
  oldClassId: t.String(),
  newClassId: t.String(),
  notes: __nullable__(t.String()),
  transferDate: t.Date(),
  createdAt: t.Date(),
});

export const TransferHistoryRelations = t.Object({
  student: t.Object({
    id: t.String(),
    name: t.String(),
    email: __nullable__(t.String()),
    studentNo: t.Integer(),
    classId: t.String(),
  }),
  oldClass: t.Object({ id: t.String(), name: t.String(), createdAt: t.Date() }),
  newClass: t.Object({ id: t.String(), name: t.String(), createdAt: t.Date() }),
});

export const TransferHistoryPlainInputCreate = t.Object({
  notes: t.Optional(__nullable__(t.String())),
  transferDate: t.Optional(t.Date()),
});

export const TransferHistoryPlainInputUpdate = t.Object({
  notes: t.Optional(__nullable__(t.String())),
  transferDate: t.Optional(t.Date()),
});

export const TransferHistoryRelationsInputCreate = t.Object({
  student: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  oldClass: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  newClass: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
});

export const TransferHistoryRelationsInputUpdate = t.Partial(
  t.Object({
    student: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
    oldClass: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
    newClass: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  }),
);

export const TransferHistoryWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          studentId: t.String(),
          oldClassId: t.String(),
          newClassId: t.String(),
          notes: t.String(),
          transferDate: t.Date(),
          createdAt: t.Date(),
        },
        { additionalProperties: true },
      ),
    { $id: "TransferHistory" },
  ),
);

export const TransferHistoryWhereUnique = t.Recursive(
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
            studentId: t.String(),
            oldClassId: t.String(),
            newClassId: t.String(),
            notes: t.String(),
            transferDate: t.Date(),
            createdAt: t.Date(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "TransferHistory" },
);

export const TransferHistorySelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    studentId: t.Boolean(),
    student: t.Boolean(),
    oldClassId: t.Boolean(),
    oldClass: t.Boolean(),
    newClassId: t.Boolean(),
    newClass: t.Boolean(),
    notes: t.Boolean(),
    transferDate: t.Boolean(),
    createdAt: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const TransferHistoryInclude = t.Partial(
  t.Object({
    student: t.Boolean(),
    oldClass: t.Boolean(),
    newClass: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const TransferHistoryOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    studentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    oldClassId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    newClassId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    notes: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    transferDate: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const TransferHistory = t.Composite([
  TransferHistoryPlain,
  TransferHistoryRelations,
]);

export const TransferHistoryInputCreate = t.Composite([
  TransferHistoryPlainInputCreate,
  TransferHistoryRelationsInputCreate,
]);

export const TransferHistoryInputUpdate = t.Composite([
  TransferHistoryPlainInputUpdate,
  TransferHistoryRelationsInputUpdate,
]);
