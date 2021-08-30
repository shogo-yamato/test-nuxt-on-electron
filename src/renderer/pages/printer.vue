<template>
  <div class="view-container">
    <h1 class="page-title">PRINTER</h1>
    <div class="printer-container">
      <button class="base-button" @click="getPrinters">GET PRINTERS</button>
      <ul v-if="printers.length" class="printers">
        <li v-for="(printer, index) in printers" :key="index" class="printer">
          {{ printer }}
        </li>
      </ul>
      <button class="base-button" @click="printWindow">PRINT WINDOW</button>
      <button class="base-button" @click="printContactSheet">
        PRINT CONTACT SHEET
      </button>
      <nuxt-link to="/contact-sheet">LINK TO CONTACT SHEET</nuxt-link>
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
    async printContactSheet() {
      await window.electron.invoke('mutate-contact-sheet-images')
      await window.electron.invoke('print-contact-sheet')
    },
  },
})
</script>
