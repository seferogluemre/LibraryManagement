import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String(),
  hashedPassword: t.String(),
  role: t.Union([t.Literal("TEACHER"), t.Literal("ADMIN")]),
  createdAt: t.Date(),
});

export const UserRelations = t.Object({
  createdBooks: t.Array(
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
  session: __nullable__(
    t.Object({
      id: t.String(),
      userId: t.String(),
      accessToken: t.String(),
      refreshToken: t.String(),
      expiresAt: t.Date(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
    }),
  ),
  Notification: t.Array(
    t.Object({
      id: t.String(),
      type: t.Union([t.Literal("OVERDUE_BOOK"), t.Literal("SYSTEM")]),
      userId: t.String(),
      message: t.String(),
      isRead: t.Boolean(),
      metadata: __nullable__(t.Any()),
      createdAt: t.Date(),
    }),
    { additionalProperties: true },
  ),
});

export const UserPlainInputCreate = t.Object({
  name: t.String(),
  email: t.String(),
  hashedPassword: t.String(),
  role: t.Union([t.Literal("TEACHER"), t.Literal("ADMIN")]),
});

export const UserPlainInputUpdate = t.Object({
  name: t.Optional(t.String()),
  email: t.Optional(t.String()),
  hashedPassword: t.Optional(t.String()),
  role: t.Optional(t.Union([t.Literal("TEACHER"), t.Literal("ADMIN")])),
});

export const UserRelationsInputCreate = t.Object({
  createdBooks: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
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
  session: t.Optional(
    t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  ),
  Notification: t.Optional(
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

export const UserRelationsInputUpdate = t.Partial(
  t.Object({
    createdBooks: t.Partial(
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
    session: t.Partial(
      t.Object({
        connect: t.Object({
          id: t.String(),
        }),
        disconnect: t.Boolean(),
      }),
    ),
    Notification: t.Partial(
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

export const UserWhere = t.Partial(
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
          hashedPassword: t.String(),
          role: t.Union([t.Literal("TEACHER"), t.Literal("ADMIN")]),
          createdAt: t.Date(),
        },
        { additionalProperties: true },
      ),
    { $id: "User" },
  ),
);

export const UserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), email: t.String() },
            { additionalProperties: true },
          ),
          { additionalProperties: true },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ email: t.String() })],
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
            hashedPassword: t.String(),
            role: t.Union([t.Literal("TEACHER"), t.Literal("ADMIN")]),
            createdAt: t.Date(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "User" },
);

export const UserSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    name: t.Boolean(),
    email: t.Boolean(),
    hashedPassword: t.Boolean(),
    role: t.Boolean(),
    createdAt: t.Boolean(),
    createdBooks: t.Boolean(),
    assignments: t.Boolean(),
    session: t.Boolean(),
    Notification: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const UserInclude = t.Partial(
  t.Object({
    role: t.Boolean(),
    createdBooks: t.Boolean(),
    assignments: t.Boolean(),
    session: t.Boolean(),
    Notification: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const UserOrderBy = t.Partial(
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
    hashedPassword: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const User = t.Composite([UserPlain, UserRelations]);

export const UserInputCreate = t.Composite([
  UserPlainInputCreate,
  UserRelationsInputCreate,
]);

export const UserInputUpdate = t.Composite([
  UserPlainInputUpdate,
  UserRelationsInputUpdate,
]);
