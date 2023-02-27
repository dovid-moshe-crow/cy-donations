/* eslint-disable */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import powerlink from "../../../powerlink";
import excel from "../../../excel";

export const ambRouter = createTRPCRouter({
  amb: publicProcedure
    .input(
      z.object({
        campaignId: z
          .string()
          .uuid()
          .default("177b5cd5-2a69-4933-992e-1dd3599eb77e"),
        source: z.enum(["excel", "powerlink"]).default("powerlink"),
      })
    )
    .query(async ({ input }) => {
      return input.source == "excel"
        ? await excel.amb(input.campaignId)
        : await powerlink.amb(input.campaignId);
    }),
});
