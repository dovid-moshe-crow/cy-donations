/* eslint-disable */

import { GoogleSpreadsheet } from "google-spreadsheet";
import { Amb, Donation } from "../types";

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

(async () => {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    private_key: process.env
      .GOOGLE_PRIVATE_KEY!.split(String.raw`\n`)
      .join("\n"),
  });
})();

async function amb(campaignId: string): Promise<Array<Amb>> {
  console.log(campaignId);
  await doc.loadInfo();
  const rows = await doc.sheetsByTitle["שגרירים"]?.getRows();

  if (!rows) {
    return [];
  }

  const data = rows
    .filter((x) => x["קמפיין"] == campaignId)
    .map((x) => ({
      id: x["מזהה שגריר"],
      name: x["שם מלא"],
      target: parseInt(x["יעד"]),
      amountILS: parseInt(x["סהכ תרומות שקלים"]),
      amountUSD: parseInt(x["סהכ תרומות דולרים"]),
      percent: 0,
    }));

  return data.map((x) => ({
    ...x,
    percent: (x.amountILS / x.target) * 100,
  }));
}

async function donations(campaignId: string, ambId?: string) {
  await doc.loadInfo();
  const rows = await doc.sheetsByTitle["גיבוי"]?.getRows();

  if (!rows) {
    return {
      donations: [] as Donation[],
      target: 0,
      totalAmountILS: 0,
      percent: 0,
      amountILS: 0,
      amountUSD: 0,
    };
  }

  const data = rows
    .filter(
      (x) => x["ID קמפיין"] == campaignId && (!ambId || x["ID שגריר"] == ambId)
    )
    .map((x) => ({
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
}

export default { amb, donations };
