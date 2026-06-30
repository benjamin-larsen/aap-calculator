<script setup lang="ts">
import { Card } from 'primevue';
import { payouts } from '../services/aap';
import { formatDateRange, formatMoney } from '../services/utils';
import { computed } from 'vue';
import BigNumber from 'bignumber.js';

const total = computed(() => {
  let sum = new BigNumber(0);

  for (const payout of payouts.value) {
    sum = sum.plus(payout.sum);
  }

  return sum;
});
</script>

<template>
  <h1 class="mb-6">Utbetalinger</h1>
  <p class="p-1">Total: {{ formatMoney(total.toString()) }}</p>
  <div style="display: flex; gap: 6px; flex-direction: column;">
    <Card v-for="payout in payouts">
      <template #title>{{ formatDateRange(payout.range) }}</template>
      <template #content>
        <p class="p-1">{{ formatMoney(payout.sum.toString()) }}</p>
      </template>
    </Card>
  </div>
</template>