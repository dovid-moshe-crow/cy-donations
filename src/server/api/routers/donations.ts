/* eslint-disable */

import { z } from "zod";
import axios from "axios";
import { GoogleSpreadsheet } from "google-spreadsheet";

type Currency = "ils" | "usd";

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

(async () => {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    private_key: process.env
      .GOOGLE_PRIVATE_KEY!.split(String.raw`\n`)
      .join("\n"),
  });
})();

import { createTRPCRouter, publicProcedure } from "../trpc";

export const donationsRouter = createTRPCRouter({
  data: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({}) => {
      await doc.loadInfo();
      const rows = await doc.sheetsByTitle["גיבוי"]?.getRows();

      if (!rows) {
        return { donations: [] as Donation[] };
      }

      const data = rows.map((x) => ({
        currency: x["צורת תשלום"] == 2 ? "ils" : "usd",
        name: x["נתרם בשם"],
        amb: x["שם שגריר"],
        amountILS: parseInt(x["סכום שקלים"]),
        amountUSD: parseInt(x["סכום דולרים"]),
        dedication: x["הקדשה"],
      }));

      const totalAmountILS: number = data
        .map((x) => x.amountILS)
        .reduce((a, b) => a + b, 0);
      const amountUSD = data
        .filter((x) => x.currency == "usd")
        .map((x) => x.amountUSD)
        .reduce((a, b) => a + b, 0);
      const amountILS = data
        .filter((x) => x.currency == "ils")
        .map((x) => x.amountILS)
        .reduce((a, b) => a + b, 0);

      const target = 10000;

      return {
        donations: data as Donation[],
        totalAmountILS,
        amountUSD,
        amountILS,
        percent: (totalAmountILS / target) * 100,
        target,
      };
    }),
});

type Donation = {
  currency: Currency;
  name: string;
  amb: string;
  amountILS: number;
  amountUSD: number;
  dedication: string;
  percent: number;
};
