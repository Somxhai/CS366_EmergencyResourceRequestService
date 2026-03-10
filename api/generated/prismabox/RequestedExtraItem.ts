import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const RequestedExtraItemPlain = t.Object(
  {
    id: t.String(),
    requestId: t.String(),
    name: t.String(),
    amount: t.Integer(),
  },
  { additionalProperties: false },
);

export const RequestedExtraItemRelations = t.Object(
  {
    request: t.Object(
      {
        id: t.String(),
        incidentId: t.String(),
        priority: t.Union(
          [t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("CRITICAL")],
          { additionalProperties: false },
        ),
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

export const RequestedExtraItemPlainInputCreate = t.Object(
  { name: t.String(), amount: t.Integer() },
  { additionalProperties: false },
);

export const RequestedExtraItemPlainInputUpdate = t.Object(
  { name: t.Optional(t.String()), amount: t.Optional(t.Integer()) },
  { additionalProperties: false },
);

export const RequestedExtraItemRelationsInputCreate = t.Object(
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

export const RequestedExtraItemRelationsInputUpdate = t.Partial(
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

export const RequestedExtraItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          requestId: t.String(),
          name: t.String(),
          amount: t.Integer(),
        },
        { additionalProperties: false },
      ),
    { $id: "RequestedExtraItem" },
  ),
);

export const RequestedExtraItemWhereUnique = t.Recursive(
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
              name: t.String(),
              amount: t.Integer(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "RequestedExtraItem" },
);

export const RequestedExtraItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      requestId: t.Boolean(),
      name: t.Boolean(),
      amount: t.Boolean(),
      request: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const RequestedExtraItemInclude = t.Partial(
  t.Object(
    { request: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const RequestedExtraItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      name: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      amount: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const RequestedExtraItem = t.Composite(
  [RequestedExtraItemPlain, RequestedExtraItemRelations],
  { additionalProperties: false },
);

export const RequestedExtraItemInputCreate = t.Composite(
  [RequestedExtraItemPlainInputCreate, RequestedExtraItemRelationsInputCreate],
  { additionalProperties: false },
);

export const RequestedExtraItemInputUpdate = t.Composite(
  [RequestedExtraItemPlainInputUpdate, RequestedExtraItemRelationsInputUpdate],
  { additionalProperties: false },
);
