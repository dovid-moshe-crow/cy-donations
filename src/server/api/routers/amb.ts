/* eslint-disable */

import { z } from "zod";
import axios from "axios";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const ambRouter = createTRPCRouter({
  data: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      return await powerlink(id);
    }),
});

export async function powerlink(campaignId: string): Promise<Array<Amb>> {
  const result = await axios.post(
    "https://api.powerlink.co.il/api/query",
    {
      objecttype: "1020",
      sort_type: "desc",
      fields: "pcfsystemfield333,pcfUSDSUM,pcfLS,pcfsystemfield331",
      query: `(pcfsystemfield326 = ${campaignId})`,
    },
    {
      headers: {
        "Content-type": "application/json",
        tokenId: process.env.POWERLINK_TOKEN_ID,
      },
      timeout: 4000,
    }
  );

  const data: Amb[] = result.data["data"]["Data"].map(
    (x: Record<string, string>) => ({
      name: x["pcfsystemfield333"],
      amountUSD: x["pcfUSDSUM"],
      amountILS: x["pcfLS"],
      target: x["pcfsystemfield331"],
    })
  );

  return data.map((x) => ({
    ...x,
    percent: (x.amountILS / x.target) * 100,
  }));
}

type Amb = {
  name: string;
  amountUSD: number;
  amountILS: number;
  percent: number;
  target: number;
};
