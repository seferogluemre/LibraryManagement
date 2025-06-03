import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BookAssignmentPlain = t.Object({
  id: t.String(),
  studentId: t.String(),
  bookId: t.String(),
  assignedById: t.String(),
  assignedAt: t.Date(),
  returnDue: t.Date(),
  returned: t.Boolean(),
  returnedAt: __nullable__(t.Date()),
});

export const BookAssignmentRelations = t.Object({
  student: t.Object({
    id: t.String(),
    name: t.String(),
    email: __nullable__(t.String()),
    studentNo: t.Integer(),
    classId: t.String(),
  }),
  book: t.Object({
    id: t.String(),
    title: t.String(),
    isbn: __nullable__(t.String()),
    publishedYear: __nullable__(t.Integer()),
    totalCopies: t.Integer(),
    availableCopies: t.Integer(),
    authorId: t.String(),
    categoryId: __nullable__(t.String()),
    publisherId: __nullable__(t.String()),
    addedById: __nullable__(t.String()),
  }),
  assignedBy: t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
    hashedPassword: t.String(),
    role: t.Union([t.Literal("TEACHER"), t.Literal("ADMIN")]),
    createdAt: t.Date(),
  }),
});

export const BookAssignmentPlainInputCreate = t.Object({
  assignedAt: t.Optional(t.Date()),
  returnDue: t.Date(),
  returned: t.Optional(t.Boolean()),
  returnedAt: t.Optional(__nullable__(t.Date())),
});

export const BookAssignmentPlainInputUpdate = t.Object({
  assignedAt: t.Optional(t.Date()),
  returnDue: t.Optional(t.Date()),
  returned: t.Optional(t.Boolean()),
  returnedAt: t.Optional(__nullable__(t.Date())),
});

export const BookAssignmentRelationsInputCreate = t.Object({
  student: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  book: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  assignedBy: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
});

export const BookAssignmentRelationsInputUpdate = t.Partial(
  t.Object({
    student: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
    book: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
    assignedBy: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  }),
);

export const BookAssignmentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          studentId: t.String(),
          bookId: t.String(),
          assignedById: t.String(),
          assignedAt: t.Date(),
          returnDue: t.Date(),
          returned: t.Boolean(),
          returnedAt: t.Date(),
        },
        { additionalProperties: true },
      ),
    { $id: "BookAssignment" },
  ),
);

export const BookAssignmentWhereUnique = t.Recursive(
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
            bookId: t.String(),
            assignedById: t.String(),
            assignedAt: t.Date(),
            returnDue: t.Date(),
            returned: t.Boolean(),
            returnedAt: t.Date(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "BookAssignment" },
);

export const BookAssignmentSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    student: t.Boolean(),
    studentId: t.Boolean(),
    book: t.Boolean(),
    bookId: t.Boolean(),
    assignedBy: t.Boolean(),
    assignedById: t.Boolean(),
    assignedAt: t.Boolean(),
    returnDue: t.Boolean(),
    returned: t.Boolean(),
    returnedAt: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const BookAssignmentInclude = t.Partial(
  t.Object({
    student: t.Boolean(),
    book: t.Boolean(),
    assignedBy: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const BookAssignmentOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    studentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    bookId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    assignedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    assignedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    returnDue: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    returned: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    returnedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const BookAssignment = t.Composite([
  BookAssignmentPlain,
  BookAssignmentRelations,
]);

export const BookAssignmentInputCreate = t.Composite([
  BookAssignmentPlainInputCreate,
  BookAssignmentRelationsInputCreate,
]);

export const BookAssignmentInputUpdate = t.Composite([
  BookAssignmentPlainInputUpdate,
  BookAssignmentRelationsInputUpdate,
]);
