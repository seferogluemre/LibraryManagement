import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CategoryPlain = t.Object({ id: t.String(), name: t.String() });

export const CategoryRelations = t.Object({
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
    { additionalProperties: true },
  ),
});

export const CategoryPlainInputCreate = t.Object({ name: t.String() });

export const CategoryPlainInputUpdate = t.Object({
  name: t.Optional(t.String()),
});

export const CategoryRelationsInputCreate = t.Object({
  books: t.Optional(
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

export const CategoryRelationsInputUpdate = t.Partial(
  t.Object({
    books: t.Partial(
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

export const CategoryWhere = t.Partial(
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
        { additionalProperties: true },
      ),
    { $id: "Category" },
  ),
);

export const CategoryWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), name: t.String() },
            { additionalProperties: true },
          ),
          { additionalProperties: true },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ name: t.String() })],
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
        t.Partial(t.Object({ id: t.String(), name: t.String() })),
      ],
      { additionalProperties: true },
    ),
  { $id: "Category" },
);

export const CategorySelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    name: t.Boolean(),
    books: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const CategoryInclude = t.Partial(
  t.Object({ books: t.Boolean(), _count: t.Boolean() }),
);

export const CategoryOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    name: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Category = t.Composite([CategoryPlain, CategoryRelations]);

export const CategoryInputCreate = t.Composite([
  CategoryPlainInputCreate,
  CategoryRelationsInputCreate,
]);

export const CategoryInputUpdate = t.Composite([
  CategoryPlainInputUpdate,
  CategoryRelationsInputUpdate,
]);
