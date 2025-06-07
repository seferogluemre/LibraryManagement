import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClassroomPlain = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.Date(),
  createdById: t.String(),
});

export const ClassroomRelations = t.Object({
  students: t.Array(
    t.Object({
      id: t.String(),
      name: t.String(),
      email: __nullable__(t.String()),
      studentNo: t.Integer(),
      classId: t.String(),
    }),
    { additionalProperties: true },
  ),
  oldTransfer: t.Array(
    t.Object({
      id: t.String(),
      studentId: t.String(),
      oldClassId: t.String(),
      newClassId: t.String(),
      notes: __nullable__(t.String()),
      transferDate: t.Date(),
      createdAt: t.Date(),
      createdById: t.String(),
    }),
    { additionalProperties: true },
  ),
  newTransfer: t.Array(
    t.Object({
      id: t.String(),
      studentId: t.String(),
      oldClassId: t.String(),
      newClassId: t.String(),
      notes: __nullable__(t.String()),
      transferDate: t.Date(),
      createdAt: t.Date(),
      createdById: t.String(),
    }),
    { additionalProperties: true },
  ),
  createdBy: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
    hashedPassword: t.String(),
    role: t.Union([t.Literal("TEACHER"), t.Literal("ADMIN")]),
    createdAt: t.Date(),
  }),
});

export const ClassroomPlainInputCreate = t.Object({ name: t.String() });

export const ClassroomPlainInputUpdate = t.Object({
  name: t.Optional(t.String()),
});

export const ClassroomRelationsInputCreate = t.Object({
  students: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
  oldTransfer: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
  newTransfer: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
  createdBy: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
});

export const ClassroomRelationsInputUpdate = t.Partial(
  t.Object({
    students: t.Partial(
      t.Object({
        connect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
        disconnect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
      }),
    ),
    oldTransfer: t.Partial(
      t.Object({
        connect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
        disconnect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
      }),
    ),
    newTransfer: t.Partial(
      t.Object({
        connect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
        disconnect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
      }),
    ),
    createdBy: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  }),
);

export const ClassroomWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          name: t.String(),
          createdAt: t.Date(),
          createdById: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "Classroom" },
  ),
);

export const ClassroomWhereUnique = t.Recursive(
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
            name: t.String(),
            createdAt: t.Date(),
            createdById: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Classroom" },
);

export const ClassroomSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    name: t.Boolean(),
    createdAt: t.Boolean(),
    students: t.Boolean(),
    oldTransfer: t.Boolean(),
    newTransfer: t.Boolean(),
    createdBy: t.Boolean(),
    createdById: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const ClassroomInclude = t.Partial(
  t.Object({
    students: t.Boolean(),
    oldTransfer: t.Boolean(),
    newTransfer: t.Boolean(),
    createdBy: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const ClassroomOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    name: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    createdById: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Classroom = t.Composite([ClassroomPlain, ClassroomRelations]);

export const ClassroomInputCreate = t.Composite([
  ClassroomPlainInputCreate,
  ClassroomRelationsInputCreate,
]);

export const ClassroomInputUpdate = t.Composite([
  ClassroomPlainInputUpdate,
  ClassroomRelationsInputUpdate,
]);
