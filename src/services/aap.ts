import { computed, reactive } from "vue";
import { diffDays, filterWeekdays, normalizeDateRange, rangeOverlapsRange, type DateRange } from "./utils.js";
import type BigNumber from "bignumber.js";

export interface AAPRate {
  range: DateRange;
  rate: BigNumber;
}

export interface Payout {
  range: DateRange;
  sum: BigNumber;
}

export const YEAR_PERIOD = 260;
export const rates: AAPRate[] = reactive([]);
export const payouts = computed(() => {
  const result: Payout[] = [];

  for (const rate of rates) {
    const [start, end] = normalizeDateRange(rate.range);
    const startingMonth = (start.getFullYear() * 12) + start.getMonth();
    const endingMonth = (end.getFullYear() * 12) + end.getMonth();
    
    for (var i = startingMonth; i <= endingMonth; i++) {
      const year = Math.floor(i / 12);
      const month = i % 12;
      const startDate = i === startingMonth ? start : new Date(year, month, 1);
      const endDate = i === endingMonth ? end : new Date(year, month + 1, 0);

      const {
        startingDay,
        days
      } = diffDays(startDate, endDate);

      const businessDays = filterWeekdays(startingDay, days);

      result.push({
        range: [startDate, endDate],
        sum: rate.rate.multipliedBy(businessDays)
      })
    }
  }

  return result;
});

export function sortRates() {
  rates.sort((a, b) => a.range[1].valueOf() - b.range[1].valueOf())
}

export function rateOverlaps(range: DateRange, except?: AAPRate) {
  return rates.some(r => r !== except && rangeOverlapsRange(range, r.range));
}