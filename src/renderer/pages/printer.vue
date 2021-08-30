<template>
  <div class="view-container">
    <h1 class="page-title">PRINTER</h1>
    <div class="printer-container">
      <button class="base-button" @click="getPrinters">GET PRINTERS</button>
      <ul class="printers">
        <li v-for="(printer, index) in printers" :key="index" class="printer">
          {{ printer }}
        </li>
      </ul>
      <button class="base-button" @click="printWindow">PRINT WINDOW</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { PrinterInfo } from 'electron'

export default Vue.extend({
  data() {
    return {
      printers: [] as PrinterInfo[],
    }
  },
  methods: {
    async getPrinters() {
      const printers = await window.electron.invoke('get-printers')
      if (printers) this.printers = printers
    },
    async printWindow() {
      await window.electron.invoke('print-window')
    },
  },
})
</script>
