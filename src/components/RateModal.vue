<script setup lang="ts">
import { Button, DatePicker, FloatLabel, Select } from 'primevue';
import { computed, inject, ref, shallowRef, watchEffect, type ComputedRef } from 'vue';
import MoneyInput from './MoneyInput.vue';
import BigNumber from 'bignumber.js';
import { diffDays, filterWeekdays, isDateRange, rangeWithinOther, type DateRange } from '../services/utils.ts';
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions';
import { rateOverlaps, YEAR_PERIOD, type AAPRate } from '../services/aap.ts';

const emit = defineEmits(['submit']);

const dialogRef = inject<ComputedRef<DynamicDialogInstance>>('dialogRef')?.value;
const dialogData: {
  closeButton: string,
  previousRate?: AAPRate
} = (dialogRef?.data) || {};

const rateTypes = [
  "Dagsats",
  "Årlig sats",
  "Utbetaling"
];

const selectedRateType = ref<string>(dialogData.previousRate ? "Dagsats" : "Utbetaling");
const dailyRate = shallowRef<BigNumber>(dialogData.previousRate?.rate || new BigNumber(0));
const paymentSum = shallowRef<BigNumber>(new BigNumber(0));
const paymentPeriod = ref<Date[]>([]);
const paymentPeriodValid = ref<boolean>(false);
const paymentValid = ref<boolean>(false);
const yearRate = shallowRef<BigNumber>(new BigNumber(0));

function calculateYearlyRate() {
  return yearRate.value.dividedBy(YEAR_PERIOD);
}

function calculatePeriodRate() {
  if (paymentPeriod.value.length !== 2 || paymentPeriod.value.some(d => !d)) return new BigNumber(0);

  const {
    startingDay,
    days
  } = diffDays(paymentPeriod.value[0], paymentPeriod.value[1]);

  const businessDays = filterWeekdays(startingDay, days);

  return paymentSum.value.dividedBy(businessDays);
}

function syncYearlyRate() {
  yearRate.value = dailyRate.value.multipliedBy(YEAR_PERIOD);
}

const ratePeriodKinds = [
  "Før 1. Mai",
  "Etter 1. Mai",
  "Egendefinert"
];

const ratePeriodKind = ref<string | null>(null);
const ratePeriod = ref<Date[]>([]);
const rateYear = ref<Date>(new Date());

if (dialogData.previousRate) {
  const [start, end] = dialogData.previousRate.range;
  const sameYear = start.getFullYear() == end.getFullYear();
  const isBeforeMay = sameYear && start.getMonth() === 0
                    && start.getDate() === 1
                    && end.getMonth() === 3
                    && end.getDate() === 30;
  const isAfterMay = sameYear && start.getMonth() === 4
                    && start.getDate() === 1
                    && end.getMonth() === 11
                    && end.getDate() === 31;

  ratePeriod.value = [start, end];

  if (isBeforeMay || isAfterMay) {
    rateYear.value = new Date(start.getFullYear(), 0);
  }

  if (isBeforeMay) {
    ratePeriodKind.value = "Før 1. Mai";
  } else if (isAfterMay) {
    ratePeriodKind.value = "Etter 1. Mai";
  } else {
    ratePeriodKind.value = "Egendefinert";
  }
}

function isPaymentPeriodValid() {
  if (
    isDateRange(ratePeriod.value)
    && isDateRange(paymentPeriod.value)
    && !rangeWithinOther(paymentPeriod.value, ratePeriod.value)
  ) return false;

  return true;
}

watchEffect(() => {
  switch (selectedRateType.value) {
    case "Dagsats": {
      syncYearlyRate();
      break;
    }

    case "Årlig sats": {
      dailyRate.value = calculateYearlyRate();
      break;
    }

    case "Utbetaling": {
      dailyRate.value = calculatePeriodRate();

      // Daily Rate as result of Payment Calculation should be a whole integer.
      paymentValid.value = dailyRate.value.isInteger();
      paymentPeriodValid.value = isPaymentPeriodValid();

      syncYearlyRate();
      break;
    }
  }
});

watchEffect(() => {
  if (!rateYear.value) return;

  const year = rateYear.value.getFullYear();

  switch (ratePeriodKind.value) {
    case "Før 1. Mai": {
      ratePeriod.value = [
        new Date(year, 0, 1),
        new Date(year, 3, 30)
      ];
      break;
    }

    case "Etter 1. Mai": {
      ratePeriod.value = [
        new Date(year, 4, 1),
        new Date(year, 11, 31)
      ];
      break;
    }
  }
});

const periodOverlaps = computed<boolean>(() => {
  if (!isDateRange(ratePeriod.value)) return false;

  return rateOverlaps(ratePeriod.value, dialogData.previousRate);
});

const canSubmit = computed<boolean>(() => {
  if (!isDateRange(ratePeriod.value)) return false;
  if (!ratePeriodKind.value || !ratePeriodKinds.includes(ratePeriodKind.value)) return false;
  if (!rateTypes.includes(selectedRateType.value)) return false;

  if (selectedRateType.value === "Utbetaling") {
    if (!paymentValid.value) return false;
    if (!paymentPeriodValid.value) return false;
    if (!isDateRange(paymentPeriod.value)) return false;
  }

  if ((dailyRate.value.integerValue().comparedTo(1) ?? -1) < 0) return false;

  if (periodOverlaps.value) return false;

  return true;
});

function submit() {
  if (!isDateRange(ratePeriod.value)) return;
  if (!canSubmit.value) return;
  if (!dialogRef) return;

  emit('submit', {
    period: ratePeriod.value,
    rate: dailyRate.value.integerValue()
  });

  dialogRef.close();
}

</script>

<template>
  <FloatLabel variant="in">
    <Select v-model="selectedRateType" :options="rateTypes" style="width: 100%" />
    <label>Sats type</label>
  </FloatLabel>

  <h2 style="margin: 12px 0">Sats Beregning</h2>

  <FloatLabel variant="in" style="margin-bottom: 8px;">
    <MoneyInput v-model="dailyRate" style="width: 100%" :disabled="selectedRateType !== 'Dagsats'" />
    <label>Dagsats</label>
  </FloatLabel>

  <template v-if="selectedRateType == 'Årlig sats'">
    <FloatLabel variant="in" style="margin-bottom: 8px;">
      <MoneyInput v-model="yearRate" style="width: 100%" />
      <label>Årlig år</label>
    </FloatLabel>
  </template>
  <template v-else-if="selectedRateType == 'Utbetaling'">
    <FloatLabel variant="in" style="margin-bottom: 8px;">
      <MoneyInput :invalid="!paymentValid" v-model="paymentSum" style="width: 100%" />
      <label>Utbetaling i perioden</label>
    </FloatLabel>

    <FloatLabel variant="in">
      <DatePicker :invalid="!paymentPeriodValid" v-model="paymentPeriod" selectionMode="range" :manualInput="false"
        style="width: 100%" />
      <label>Utbetalings-periode</label>
    </FloatLabel>
  </template>

  <h2 style="margin: 0; margin-top: 12px;">Andre Detaljer</h2>
  <p v-if="periodOverlaps" style="margin: 0; margin-bottom: 12px; color: red">Periode overlapper med en annen.</p>

  <FloatLabel variant="in" style="margin-bottom: 8px;">
    <Select :options="ratePeriodKinds" v-model="ratePeriodKind" style="width: 100%" />
    <label>Periode for sats</label>
  </FloatLabel>

  <FloatLabel variant="in" v-if="ratePeriodKind == 'Egendefinert'">
    <DatePicker v-model="ratePeriod" selectionMode="range" :manualInput="false" style="width: 100%" />
    <label>Egendefinert periode</label>
  </FloatLabel>

  <FloatLabel variant="in" v-else-if="ratePeriodKind == 'Før 1. Mai' || ratePeriodKind == 'Etter 1. Mai'">
    <DatePicker v-model="rateYear" view="year" dateFormat="yy" :manualInput="false" style="width: 100%" />
    <label>År</label>
  </FloatLabel>

  <Button @click="submit" style="margin-top: 8px;" :disabled="!canSubmit" type="button" :label="dialogData.closeButton"
    severity="success" icon="pi pi-check" />
</template>