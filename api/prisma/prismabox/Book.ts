import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BookPlain = t.Object({
  id: t.String(),
  title: t.String(),
  authorId: t.String(),
  addedById: __nullable__(t.String()),
});

export const BookRelations = t.Object({
  author: t.Object({ id: t.String(), name: t.String() }),
  addedBy: __nullable__(
    t.Object({
      id: t.String(),
      name: t.String(),
      email: t.String(),
      hashedPassword: t.String(),
      role: t.Union([t.Literal("TEACHER"), t.Literal("ADMIN")]),
      createdAt: t.Date(),
    }),
  ),
  assignments: t.Array(
    t.Object({
      id: t.String(),
      studentId: t.String(),
      bookId: t.String(),
      assignedAt: t.Date(),
      returnDue: t.Date(),
      returned: t.Boolean(),
    }),
    { additionalProperties: true },
  ),
});

export const BookPlainInputCreate = t.Object({ title: t.String() });

export const BookPlainInputUpdate = t.Object({ title: t.Optional(t.String()) });

export const BookRelationsInputCreate = t.Object({
  author: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  addedBy: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
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

export const BookRelationsInputUpdate = t.Partial(
  t.Object({
    author: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
    addedBy: t.Partial(
      t.Object({
        connect: t.Object({
          id: t.String(),
        }),
        disconnect: t.Boolean(),
      }),
    ),
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

export const BookWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          title: t.String(),
          authorId: t.String(),
          addedById: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "Book" },
  ),
);

export const BookWhereUnique = t.Recursive(
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
            title: t.String(),
            authorId: t.String(),
            addedById: t.String(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Book" },
);

export const BookSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    title: t.Boolean(),
    author: t.Boolean(),
    authorId: t.Boolean(),
    addedBy: t.Boolean(),
    addedById: t.Boolean(),
    assignments: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const BookInclude = t.Partial(
  t.Object({
    author: t.Boolean(),
    addedBy: t.Boolean(),
    assignments: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const BookOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    title: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    authorId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    addedById: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Book = t.Composite([BookPlain, BookRelations]);

export const BookInputCreate = t.Composite([
  BookPlainInputCreate,
  BookRelationsInputCreate,
]);

export const BookInputUpdate = t.Composite([
  BookPlainInputUpdate,
  BookRelationsInputUpdate,
]);
