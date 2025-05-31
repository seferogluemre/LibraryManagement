import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ClassroomPlain = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.Date(),
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
          t.Object({ id: t.String(), name: t.String(), createdAt: t.Date() }),
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
    _count: t.Boolean(),
  }),
);

export const ClassroomInclude = t.Partial(
  t.Object({ students: t.Boolean(), _count: t.Boolean() }),
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
