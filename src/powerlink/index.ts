/* eslint-disable */

import axios from "axios";
import { Amb, Donation } from "../types";

type PowerlinkParams = {
  objecttype: number;
  sort_type: "desc" | "asc";
  page_size: number;
  fields?: string;
  query?: Map<string, string>;
};

async function powerlink(params: PowerlinkParams) {
  let queryString: string | undefined = undefined;

  if (params.query) {
    queryString = "";
    let first = true;
    for (const [key, value] of params.query) {
      if (first) {
        queryString += `(${key} = ${value})`;
        first = false;
      } else {
        queryString += ` AND (${key} = ${value})`;
      }
    }
  }

  console.log(queryString)

  const result = await axios.post(
    "https://api.powerlink.co.il/api/query",
    {
      objecttype: params.objecttype.toString(),
      sort_type: params.sort_type,
      page_size: params.page_size.toString(),
      fields: !params.fields ? undefined : params.fields,
      query: queryString,
    },
    {
      headers: {
        "Content-type": "application/json",
        tokenId: process.env.POWERLINK_TOKEN_ID,
      },
      timeout: 4000,
    }
  );

  return result.data["data"]["Data"];
}

async function donations(campaignId: string, ambId?: string) {
  const query = new Map();
  query.set("pcfsystemfield141", campaignId);
  if (ambId) {
    query.set("pcfSAGRIR", ambId);
  }

  const ambs = await amb(campaignId);

  const data: Donation[] = (
    await powerlink({
      objecttype: 1009,
      page_size: 500,
      sort_type: "desc",
      query,
      fields:
        "pcfsystemfield337,pcfsystemfield288,pcfSAGRIR,pcfsystemfield139,pcfsUSD,pcfsystemfield290",
    })
  ).map((x: Record<string, any>) => ({
    currency: x["pcfsystemfield337"] == 2 ? "ils" : "usd",
    name: x["pcfsystemfield288"],
    amb: ambs.find((e) => e.id == x["pcfSAGRIR"])?.name,
    amountILS: x["pcfsystemfield139"],
    amountUSD: x["pcfsUSD"],
    dedication: x["pcfsystemfield290"],
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
    donations: data,
    totalAmountILS,
    amountUSD,
    amountILS,
    percent: (totalAmountILS / target) * 100,
    target,
  };
}

export async function amb(campaignId: string): Promise<Array<Amb>> {
  const data: Amb[] = (
    await powerlink({
      objecttype: 1020,
      page_size: 500,
      sort_type: "desc",
      query: new Map().set("pcfsystemfield326", campaignId),
      fields:
        "pcfsystemfield333,pcfUSDSUM,pcfLS,pcfsystemfield331,customobject1020id",
    })
  ).map((x: Record<string, string>) => ({
    id: x["customobject1020id"],
    name: x["pcfsystemfield333"],
    amountUSD: x["pcfUSDSUM"],
    amountILS: x["pcfLS"],
    target: x["pcfsystemfield331"],
  }));

  return data.map((x) => ({
    ...x,
    percent: (x.amountILS / x.target) * 100,
  }));
}
export default {
  donations,
  amb,
};
