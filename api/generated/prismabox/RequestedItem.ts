import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RequestedItemPlain = t.Object(
  {
    id: t.String(),
    requestId: t.String(),
    itemId: t.String(),
    amount: t.Integer(),
  },
  { additionalProperties: false },
);

export const RequestedItemRelations = t.Object(
  {
    request: t.Object(
      {
        id: t.String(),
        incidentId: t.String(),
        priority: t.String(),
        requestFor: t.String(),
        status: t.Union(
          [t.Literal("NEW"), t.Literal("IN_PROGRESS"), t.Literal("CLOSED")],
          { additionalProperties: false },
        ),
        requestedAt: t.Date(),
        requesterName: t.String(),
        phone: t.String(),
        address: t.String(),
        description: __nullable__(t.String()),
        latitude: t.Number(),
        longitude: t.Number(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const RequestedItemPlainInputCreate = t.Object(
  { amount: t.Integer() },
  { additionalProperties: false },
);

export const RequestedItemPlainInputUpdate = t.Object(
  { amount: t.Optional(t.Integer()) },
  { additionalProperties: false },
);

export const RequestedItemRelationsInputCreate = t.Object(
  {
    request: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const RequestedItemRelationsInputUpdate = t.Partial(
  t.Object(
    {
      request: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
);

export const RequestedItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          requestId: t.String(),
          itemId: t.String(),
          amount: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "RequestedItem" },
  ),
);

export const RequestedItemWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        t.Union([t.Object({ id: t.String() })], {
          additionalProperties: false,
        }),
        t.Partial(
          t.Object({
            AND: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            NOT: t.Union([
              Self,
              t.Array(Self, { additionalProperties: false }),
            ]),
            OR: t.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        t.Partial(
          t.Object(
            {
              id: t.String(),
              requestId: t.String(),
              itemId: t.String(),
              amount: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RequestedItem" },
);

export const RequestedItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      requestId: t.Boolean(),
      itemId: t.Boolean(),
      amount: t.Boolean(),
      request: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RequestedItemInclude = t.Partial(
  t.Object(
    { request: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const RequestedItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      itemId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const RequestedItem = t.Composite(
  [RequestedItemPlain, RequestedItemRelations],
  { additionalProperties: false },
);

export const RequestedItemInputCreate = t.Composite(
  [RequestedItemPlainInputCreate, RequestedItemRelationsInputCreate],
  { additionalProperties: false },
);

export const RequestedItemInputUpdate = t.Composite(
  [RequestedItemPlainInputUpdate, RequestedItemRelationsInputUpdate],
  { additionalProperties: false },
);
