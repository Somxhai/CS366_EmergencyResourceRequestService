import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ResourceRequestStatus = t.Union(
  [t.Literal("NEW"), t.Literal("IN_PROGRESS"), t.Literal("CLOSED")],
  { additionalProperties: false },
);
