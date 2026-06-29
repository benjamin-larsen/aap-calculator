import BigNumber from "bignumber.js";
import { fromPercentage } from "../utils";
import type { TaxRates } from "./types";

export const Rates2026: TaxRates = {
  minimumStandardDeduction: {
    rate: fromPercentage("46%"),
    limit: new BigNumber("92000")
  },
  personalAllowance: new BigNumber("114540"),
  welfareTax: {
    rate: fromPercentage("7.6%"),
    limit: new BigNumber("99650")
  },
  commonTax: fromPercentage("22%"),
  taxBrackets: [
    {
      rate: fromPercentage("1.7%"),
      minimum: new BigNumber("226100")
    },
    {
      rate: fromPercentage("4.0%"),
      minimum: new BigNumber("318300")
    },
    {
      rate: fromPercentage("13.7%"),
      minimum: new BigNumber("725050")
    },
    {
      rate: fromPercentage("16.8%"),
      minimum: new BigNumber("980100")
    },
    {
      rate: fromPercentage("17.8%"),
      minimum: new BigNumber("1467200")
    }
  ]
};