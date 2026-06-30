<script setup lang="ts">
import { ConfirmDialog, DynamicDialog } from 'primevue';
import RatesSection from './components/RatesSection.vue';
import { payouts } from './services/aap.ts';
import PayoutSection from './components/PayoutSection.vue';

</script>

<template>
  <DynamicDialog />
  <ConfirmDialog />
  <div class="header">
    AAP (Arbeidsavklaringspenger) Kalkulator
  </div>
  <div class="warningHeader">
    <span class="pi pi-info-circle"></span>
    <span>Denne nettsiden er ikke tilknyttet NAV (Arbeids- og velferdsetaten) og data kan være feil.</span>
  </div>
  <div class="app-container">
    <RatesSection />
    <PayoutSection />
  </div>
</template>

<style>
.header {
  height: 60px;
  width: 100%;
  background-color: #c30000;
  color: white;
  padding: 0 16px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
}

.warningHeader {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: start;
  background-color: #272727;
  color: #81d4fa;
  font-weight: 600;
  gap: 6px;
  font-size: 14px;
}

.app-container {
  width: 100%;
  flex-grow: 1;
  overflow: auto;
  padding: 16px;
  padding-bottom: 0;
  flex-shrink: 1 !important;
}
</style>