import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const StudentPlain = t.Object({
  id: t.String(),
  name: t.String(),
  email: __nullable__(t.String()),
  studentNo: t.Integer(),
  classId: t.String(),
});

export const StudentRelations = t.Object({
  class: t.Object({ id: t.String(), name: t.String() }),
  assignments: t.Array(
    t.Object({
      id: t.String(),
      studentId: t.String(),
      bookId: t.String(),
      assignedAt: t.Date(),
      returnDue: t.Date(),
      returned: t.Boolean(),
      returnedAt: __nullable__(t.Date()),
    }),
    { additionalProperties: true },
  ),
});

export const StudentPlainInputCreate = t.Object({
  name: t.String(),
  email: t.Optional(__nullable__(t.String())),
  studentNo: t.Integer(),
});

export const StudentPlainInputUpdate = t.Object({
  name: t.Optional(t.String()),
  email: t.Optional(__nullable__(t.String())),
  studentNo: t.Optional(t.Integer()),
});

export const StudentRelationsInputCreate = t.Object({
  class: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  assignments: t.Optional(
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

export const StudentRelationsInputUpdate = t.Partial(
  t.Object({
    class: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
    assignments: t.Partial(
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

export const StudentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          name: t.String(),
          email: t.String(),
          studentNo: t.Integer(),
          classId: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "Student" },
  ),
);

export const StudentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), studentNo: t.Integer() },
            { additionalProperties: true },
          ),
          { additionalProperties: true },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ studentNo: t.Integer() })],
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
            name: t.String(),
            email: t.String(),
            studentNo: t.Integer(),
            classId: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Student" },
);

export const StudentSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    name: t.Boolean(),
    email: t.Boolean(),
    studentNo: t.Boolean(),
    class: t.Boolean(),
    classId: t.Boolean(),
    assignments: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const StudentInclude = t.Partial(
  t.Object({
    class: t.Boolean(),
    assignments: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const StudentOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    name: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    email: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    studentNo: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    classId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Student = t.Composite([StudentPlain, StudentRelations]);

export const StudentInputCreate = t.Composite([
  StudentPlainInputCreate,
  StudentRelationsInputCreate,
]);

export const StudentInputUpdate = t.Composite([
  StudentPlainInputUpdate,
  StudentRelationsInputUpdate,
]);
