import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AssignTeamPlain = t.Object(
  {
    id: t.String(),
    requestId: t.String(),
    teamId: t.String(),
    assignedAt: t.Date(),
  },
  { additionalProperties: false },
);

export const AssignTeamRelations = t.Object(
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

export const AssignTeamPlainInputCreate = t.Object(
  { assignedAt: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const AssignTeamPlainInputUpdate = t.Object(
  { assignedAt: t.Optional(t.Date()) },
  { additionalProperties: false },
);

export const AssignTeamRelationsInputCreate = t.Object(
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

export const AssignTeamRelationsInputUpdate = t.Partial(
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

export const AssignTeamWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
          id: t.String(),
          requestId: t.String(),
          teamId: t.String(),
          assignedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "AssignTeam" },
  ),
);

export const AssignTeamWhereUnique = t.Recursive(
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
              teamId: t.String(),
              assignedAt: t.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "AssignTeam" },
);

export const AssignTeamSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      requestId: t.Boolean(),
      teamId: t.Boolean(),
      assignedAt: t.Boolean(),
      request: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const AssignTeamInclude = t.Partial(
  t.Object(
    { request: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
);

export const AssignTeamOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      teamId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      assignedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const AssignTeam = t.Composite([AssignTeamPlain, AssignTeamRelations], {
  additionalProperties: false,
});

export const AssignTeamInputCreate = t.Composite(
  [AssignTeamPlainInputCreate, AssignTeamRelationsInputCreate],
  { additionalProperties: false },
);

export const AssignTeamInputUpdate = t.Composite(
  [AssignTeamPlainInputUpdate, AssignTeamRelationsInputUpdate],
  { additionalProperties: false },
);
