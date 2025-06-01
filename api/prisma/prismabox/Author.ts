import { t } from "elysia";

import { __nullable__ } from "./__nullable__";

export const AuthorPlain = t.Object({ id: t.String(), name: t.String() });

export const AuthorRelations = t.Object({
  books: t.Array(
    t.Object({
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
    { additionalProperties: true }
  ),
});

export const AuthorPlainInputCreate = t.Object({ name: t.String() });

export const AuthorPlainInputUpdate = t.Object({
  name: t.Optional(t.String()),
});

export const AuthorRelationsInputCreate = t.Object({
  books: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true }
      ),
    })
  ),
});

export const AuthorRelationsInputUpdate = t.Partial(
  t.Object({
    books: t.Partial(
      t.Object({
        connect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true }
        ),
        disconnect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true }
        ),
      })
    ),
  })
);

export const AuthorWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          name: t.String(),
        },
        { additionalProperties: true }
      ),
    { $id: "Author" }
  )
);

export const AuthorWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: true }),
          { additionalProperties: true }
        ),
        t.Union([t.Object({ id: t.String() })], { additionalProperties: true }),
        t.Partial(
          t.Object({
            AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
            NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
            OR: t.Array(Self, { additionalProperties: true }),
          }),
          { additionalProperties: true }
        ),
        t.Partial(t.Object({ id: t.String(), name: t.String() })),
      ],
      { additionalProperties: true }
    ),
  { $id: "Author" }
);

export const AuthorSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    name: t.Boolean(),
    books: t.Boolean(),
    _count: t.Boolean(),
  })
);

export const AuthorInclude = t.Partial(
  t.Object({ books: t.Boolean(), _count: t.Boolean() })
);

export const AuthorOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    name: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  })
);

export const Author = t.Composite([AuthorPlain, AuthorRelations]);

export const AuthorInputCreate = t.Composite([
  AuthorPlainInputCreate,
  AuthorRelationsInputCreate,
]);

export const AuthorInputUpdate = t.Composite([
  AuthorPlainInputUpdate,
  AuthorRelationsInputUpdate,
]);
