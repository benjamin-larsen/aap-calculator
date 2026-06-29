<template>
  <InputText
  :defaultValue="formattedValue"
  ref="input"
  @input="handleInput"
  @select="handleSelectionChange"
  @focus="handleSelectionChange"
  @selectionchange="handleSelectionChange" />
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js';
import { ref, toRaw, useTemplateRef, watch } from 'vue';
import { formatNumber, seperateNumber } from '../services/utils';
import { InputText } from 'primevue';

const formattedValue = ref("");
const model = defineModel<BigNumber>();
let latestModel: BigNumber | null = null;

const inputEl = useTemplateRef<{
  $el: HTMLInputElement
}>("input");

function setCursor(input: HTMLInputElement, position: number) {
  if (document.activeElement === input) {
    input.setSelectionRange(position, position);
  }
}

function handleSelectionChange() {
  const input = inputEl.value?.$el;
  if (!input) return;

  if (input.selectionEnd === null || input.selectionStart === null) return;

  const max = Math.max(input.value.length - 3, 0);

  input.setSelectionRange(Math.min(input.selectionStart, max), Math.min(input.selectionEnd, max));
}

function updateInput(input: HTMLInputElement, value: string) {
  const numberValue = formatNumber(value);

  var position = input.selectionEnd !== null ? input.value.length - input.selectionEnd : null;
  
  // Add spaces to Number
  formattedValue.value = seperateNumber(numberValue) + " kr";
  input.value = formattedValue.value;

  if (position !== null) {
    setCursor(input, input.value.length - position);
  }

  return numberValue;
}

watch(model, (value) => {
  const input = inputEl.value;
  if (!input) return;

  // Don't update input if it's the same model we set.
  if (toRaw(value) === latestModel) return;

  updateInput(input.$el, value ? value.toFixed(0) : "0");
}, { immediate: true });

watch(inputEl, (input) => {
  if (!input) return;

  updateInput(input.$el, model.value ? model.value.toFixed(0) : "0");
});

function handleInput() {
  const input = inputEl.value;
  if (!input) return;

  const numberValue = updateInput(input.$el, input.$el.value);

  // change model value
  latestModel = new BigNumber(numberValue);
  model.value = latestModel;
}
</script>

<style>
.money-input {
  display: flex;
  align-items: center;
}

.money-input>* {
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
}

.money-input>input {
  padding: 0;
  margin: 0;
  min-width: 0;
  flex-grow: 1;
  border: none;
  background: none;
  text-align: right;
}

.money-input>input:focus {
  outline: none;
}

.money-input>span {
  flex-shrink: 0;
}
</style>