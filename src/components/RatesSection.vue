<template>
  <h1 class="mb-6">Satser</h1>
  <div style="display: flex; gap: 6px; flex-direction: column;">
    <Card v-for="rate in rates">
      <template #title>{{ formatDateRange(rate.range) }}</template>
      <template #content>
        <div style="display: flex; gap: 2px;">
          <div style="flex-grow: 1;">
            <p class="p-1">Årlig sats: {{ formatMoney(rate.rate.multipliedBy(YEAR_PERIOD).toString()) }}</p>
            <p class="p-1">Dagsats: {{ formatMoney(rate.rate.toString()) }}</p>
          </div>
          <Button @click="updateRate(rate)" style="flex-shrink: 0;" icon="pi pi-pencil" />
          <Button @click="deleteRate(rate)" severity="danger" style="flex-shrink: 0;" icon="pi pi-times" />
        </div>
      </template>
    </Card>
  </div>
  <Button style="margin-top: 6px;" type="button" label="Ny Sats" severity="info" icon="pi pi-plus" @click="newRate" />
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js';
import { Button, Card, useConfirm, useDialog } from 'primevue';
import RateModal from './RateModal.vue';
import { rates, sortRates, YEAR_PERIOD, type AAPRate } from '../services/aap.ts';
import { formatDateRange, formatMoney, type DateRange } from '../services/utils.ts';

const dialog = useDialog();
const confirm = useConfirm();

function newRate() {
  dialog.open(RateModal, {
    props: {
      header: 'Legg til ny sats',
      modal: true,
      style: {
        width: '50vw',
      },
      breakpoints: { '575px': '100vw' }
    },
    data: {
      closeButton: "Legg til"
    },
    emits: {
      onSubmit({ period, rate }: { period: DateRange, rate: BigNumber }) {
        rates.push({
          range: period,
          rate
        });

        sortRates();
      }
    }
  })
}

function deleteRate(rate: AAPRate) {
  confirm.require({
    message: `Slett sats for ${formatDateRange(rate.range)}`,
    header: 'Er du sikker?',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      const index = rates.indexOf(rate);
      if (index == -1) return;

      rates.splice(index, 1);
    },
  });
}

function updateRate(currentRate: AAPRate) {
  dialog.open(RateModal, {
    props: {
      header: 'Oppdater sats',
      modal: true,
      style: {
        width: '50vw',
      },
      breakpoints: { '575px': '100vw' }
    },
    data: {
      closeButton: "Oppdater",
      previousRate: currentRate
    },
    emits: {
      onSubmit({ period, rate }: { period: DateRange, rate: BigNumber }) {
        currentRate.range = period;
        currentRate.rate = rate;

        sortRates();
      }
    }
  })
}

</script>

<style>
.rates {
  display: flex;
  flex-direction: column;
  align-items: start;
}
</style>