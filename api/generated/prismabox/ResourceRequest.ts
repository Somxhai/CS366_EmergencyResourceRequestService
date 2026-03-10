import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ResourceRequestPlain = t.Object(
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
);

export const ResourceRequestRelations = t.Object(
  {
    items: t.Array(
      t.Object(
        {
          id: t.String(),
          requestId: t.String(),
          itemId: t.String(),
          amount: t.Integer(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    extraItems: t.Array(
      t.Object(
        {
          id: t.String(),
          requestId: t.String(),
          name: t.String(),
          amount: t.Integer(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
    assignTeams: t.Array(
      t.Object(
        {
          id: t.String(),
          requestId: t.String(),
          teamId: t.String(),
          assignedAt: t.Date(),
        },
        { additionalProperties: false },
      ),
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const ResourceRequestPlainInputCreate = t.Object(
  {
    priority: t.Optional(
      t.Union([t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("CRITICAL")], {
        additionalProperties: false,
      }),
    ),
    requestFor: t.String(),
    status: t.Optional(
      t.Union(
        [t.Literal("NEW"), t.Literal("IN_PROGRESS"), t.Literal("CLOSED")],
        { additionalProperties: false },
      ),
    ),
    requestedAt: t.Optional(t.Date()),
    requesterName: t.String(),
    phone: t.String(),
    address: t.String(),
    description: t.Optional(__nullable__(t.String())),
    latitude: t.Number(),
    longitude: t.Number(),
  },
  { additionalProperties: false },
);

export const ResourceRequestPlainInputUpdate = t.Object(
  {
    priority: t.Optional(
      t.Union([t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("CRITICAL")], {
        additionalProperties: false,
      }),
    ),
    requestFor: t.Optional(t.String()),
    status: t.Optional(
      t.Union(
        [t.Literal("NEW"), t.Literal("IN_PROGRESS"), t.Literal("CLOSED")],
        { additionalProperties: false },
      ),
    ),
    requestedAt: t.Optional(t.Date()),
    requesterName: t.Optional(t.String()),
    phone: t.Optional(t.String()),
    address: t.Optional(t.String()),
    description: t.Optional(__nullable__(t.String())),
    latitude: t.Optional(t.Number()),
    longitude: t.Optional(t.Number()),
  },
  { additionalProperties: false },
);

export const ResourceRequestRelationsInputCreate = t.Object(
  {
    items: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    extraItems: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
    assignTeams: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

export const ResourceRequestRelationsInputUpdate = t.Partial(
  t.Object(
    {
      items: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      extraItems: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
      assignTeams: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
      ),
    },
    { additionalProperties: false },
  ),
);

export const ResourceRequestWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: false })]),
          OR: t.Array(Self, { additionalProperties: false }),
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
          description: t.String(),
          latitude: t.Number(),
          longitude: t.Number(),
        },
        { additionalProperties: false },
      ),
    { $id: "ResourceRequest" },
  ),
);

export const ResourceRequestWhereUnique = t.Recursive(
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
              incidentId: t.String(),
              priority: t.Union(
                [t.Literal("LOW"), t.Literal("NORMAL"), t.Literal("CRITICAL")],
                { additionalProperties: false },
              ),
              requestFor: t.String(),
              status: t.Union(
                [
                  t.Literal("NEW"),
                  t.Literal("IN_PROGRESS"),
                  t.Literal("CLOSED"),
                ],
                { additionalProperties: false },
              ),
              requestedAt: t.Date(),
              requesterName: t.String(),
              phone: t.String(),
              address: t.String(),
              description: t.String(),
              latitude: t.Number(),
              longitude: t.Number(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "ResourceRequest" },
);

export const ResourceRequestSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      incidentId: t.Boolean(),
      priority: t.Boolean(),
      requestFor: t.Boolean(),
      status: t.Boolean(),
      requestedAt: t.Boolean(),
      requesterName: t.Boolean(),
      phone: t.Boolean(),
      address: t.Boolean(),
      description: t.Boolean(),
      latitude: t.Boolean(),
      longitude: t.Boolean(),
      items: t.Boolean(),
      extraItems: t.Boolean(),
      assignTeams: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ResourceRequestInclude = t.Partial(
  t.Object(
    {
      priority: t.Boolean(),
      status: t.Boolean(),
      items: t.Boolean(),
      extraItems: t.Boolean(),
      assignTeams: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const ResourceRequestOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      incidentId: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestFor: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requestedAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      requesterName: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      phone: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      address: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      description: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      latitude: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
      longitude: t.Union([t.Literal("asc"), t.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const ResourceRequest = t.Composite(
  [ResourceRequestPlain, ResourceRequestRelations],
  { additionalProperties: false },
);

export const ResourceRequestInputCreate = t.Composite(
  [ResourceRequestPlainInputCreate, ResourceRequestRelationsInputCreate],
  { additionalProperties: false },
);

export const ResourceRequestInputUpdate = t.Composite(
  [ResourceRequestPlainInputUpdate, ResourceRequestRelationsInputUpdate],
  { additionalProperties: false },
);
