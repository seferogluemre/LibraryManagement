import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PublisherPlain = t.Object({ id: t.String(), name: t.String() });

export const PublisherRelations = t.Object({
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

export const PublisherPlainInputCreate = t.Object({ name: t.String() });

export const PublisherPlainInputUpdate = t.Object({
  name: t.Optional(t.String()),
});

export const PublisherRelationsInputCreate = t.Object({
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

export const PublisherRelationsInputUpdate = t.Partial(
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

export const PublisherWhere = t.Partial(
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
    { $id: "Publisher" },
  ),
);

export const PublisherWhereUnique = t.Recursive(
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
        t.Partial(t.Object({ id: t.String(), name: t.String() })),
      ],
      { additionalProperties: true },
    ),
  { $id: "Publisher" },
);

export const PublisherSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    name: t.Boolean(),
    books: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const PublisherInclude = t.Partial(
  t.Object({ books: t.Boolean(), _count: t.Boolean() }),
);

export const PublisherOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    name: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Publisher = t.Composite([PublisherPlain, PublisherRelations]);

export const PublisherInputCreate = t.Composite([
  PublisherPlainInputCreate,
  PublisherRelationsInputCreate,
]);

export const PublisherInputUpdate = t.Composite([
  PublisherPlainInputUpdate,
  PublisherRelationsInputUpdate,
]);
