/* eslint-disable */

import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import powerlink from "../../../powerlink";
import excel from "../../../excel";

export const donationsRouter = createTRPCRouter({
  donations: publicProcedure
    .input(
      z.object({
        campaignId: z
          .string()
          .uuid()
          .default("177b5cd5-2a69-4933-992e-1dd3599eb77e"),
        source: z.enum(["excel", "powerlink"]).default("powerlink"),
        ambId: z.string().uuid().optional(),
      })
    )
    .query(async ({ input }) =>
      input.source == "excel"
        ? await excel.donations(input.campaignId, input.ambId)
        : powerlink.donations(input.campaignId, input.ambId)
    ),
});
