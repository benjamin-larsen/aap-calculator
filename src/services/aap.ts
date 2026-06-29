import { reactive, toRaw } from "vue";
import { rangeOverlapsRange, type DateRange } from "./utils";
import type BigNumber from "bignumber.js";

export interface AAPRate {
  range: DateRange;
  rate: BigNumber;
}

export const YEAR_PERIOD = 260;
export const rates: AAPRate[] = reactive([]);

export function sortRates() {
  rates.sort((a, b) => a.range[1].valueOf() - b.range[1].valueOf())
}

export function rateOverlaps(range: DateRange, except?: AAPRate) {
  return rates.some(r => r !== except && rangeOverlapsRange(range, r.range));
}