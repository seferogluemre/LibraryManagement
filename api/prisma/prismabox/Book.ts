import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BookPlain = t.Object({
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
});

export const BookRelations = t.Object({
  author: t.Object({ id: t.String(), name: t.String() }),
  category: __nullable__(t.Object({ id: t.String(), name: t.String() })),
  publisher: __nullable__(t.Object({ id: t.String(), name: t.String() })),
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
      assignedById: t.String(),
      assignedAt: t.Date(),
      returnDue: t.Date(),
      returned: t.Boolean(),
      returnedAt: __nullable__(t.Date()),
    }),
    { additionalProperties: true },
  ),
});

export const BookPlainInputCreate = t.Object({
  title: t.String(),
  isbn: t.Optional(__nullable__(t.String())),
  publishedYear: t.Optional(__nullable__(t.Integer())),
  totalCopies: t.Optional(t.Integer()),
  availableCopies: t.Optional(t.Integer()),
});

export const BookPlainInputUpdate = t.Object({
  title: t.Optional(t.String()),
  isbn: t.Optional(__nullable__(t.String())),
  publishedYear: t.Optional(__nullable__(t.Integer())),
  totalCopies: t.Optional(t.Integer()),
  availableCopies: t.Optional(t.Integer()),
});

export const BookRelationsInputCreate = t.Object({
  author: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  category: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
  publisher: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
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
    category: t.Partial(
      t.Object({
        connect: t.Object({
          id: t.String(),
        }),
        disconnect: t.Boolean(),
      }),
    ),
    publisher: t.Partial(
      t.Object({
        connect: t.Object({
          id: t.String(),
        }),
        disconnect: t.Boolean(),
      }),
    ),
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
          isbn: t.String(),
          publishedYear: t.Integer(),
          totalCopies: t.Integer(),
          availableCopies: t.Integer(),
          authorId: t.String(),
          categoryId: t.String(),
          publisherId: t.String(),
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
          t.Object(
            { id: t.String(), isbn: t.String() },
            { additionalProperties: true },
          ),
          { additionalProperties: true },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ isbn: t.String() })],
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
            title: t.String(),
            isbn: t.String(),
            publishedYear: t.Integer(),
            totalCopies: t.Integer(),
            availableCopies: t.Integer(),
            authorId: t.String(),
            categoryId: t.String(),
            publisherId: t.String(),
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
    isbn: t.Boolean(),
    publishedYear: t.Boolean(),
    totalCopies: t.Boolean(),
    availableCopies: t.Boolean(),
    author: t.Boolean(),
    authorId: t.Boolean(),
    category: t.Boolean(),
    categoryId: t.Boolean(),
    publisher: t.Boolean(),
    publisherId: t.Boolean(),
    addedBy: t.Boolean(),
    addedById: t.Boolean(),
    assignments: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const BookInclude = t.Partial(
  t.Object({
    author: t.Boolean(),
    category: t.Boolean(),
    publisher: t.Boolean(),
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
    isbn: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    publishedYear: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    totalCopies: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    availableCopies: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    authorId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    categoryId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    publisherId: t.Union([t.Literal("asc"), t.Literal("desc")], {
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
