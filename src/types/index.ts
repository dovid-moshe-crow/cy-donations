type Currency = "ils" | "usd";

export type Donation = {
  currency: Currency;
  name: string;
  amb: string;
  amountILS: number;
  amountUSD: number;
  dedication: string;
  percent: number;
};


export type Amb = {
  id: string;
  name: string;
  amountUSD: number;
  amountILS: number;
  percent: number;
  target: number;
};
