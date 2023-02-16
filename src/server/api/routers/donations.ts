import { z } from "zod";
import axios from "axios";
import { GoogleSpreadsheet } from "google-spreadsheet";

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
      const rows = await doc.sheetsByIndex[0]?.getRows();

      if (!rows) {
        return { donations: [] as Donation[] };
      }

      const data = rows.map((x) => ({
        name: x["שם"],
        amount: x["סכום"],
        dedication: x["הקדשה"],
      }));
      return {
        donations: data,
      };
    }),
});

type Donation = {
  name: string;
  amount: string;
  dedication: string;
};
