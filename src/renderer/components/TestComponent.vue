<template>
  <div class="test-component">
    <h2 class="title">This is a test component.</h2>
    <p class="message">{{ messageFromMain }}</p>
    <p class="message">{{ messageFromMenu }}</p>
    <button class="base-button" @click="openDummyWindow">
      OPEN DUMMY WINDOW
    </button>
    <button class="base-button" @click="closeOtherWindows">
      CLOSE OTHER WINDOWS
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IpcRendererEvent } from 'electron'

export default Vue.extend({
  data() {
    return {
      messageFromMain: 'initial message: main',
      messageFromMenu: 'initial message: menu',
    }
  },
  mounted() {
    window.electron.on(
      'align-all-windows',
      (_: IpcRendererEvent, message: string): void => {
        this.messageFromMenu = message
      }
    )
    window.electron.on('open-contact-sheet', () => {
      this.$router.push('/contact-sheet')
    })
  },
  methods: {
    async openDummyWindow(): Promise<void> {
      this.messageFromMain = await window.electron.invoke('open-dummy-window')
    },
    async closeOtherWindows(): Promise<void> {
      this.messageFromMain = await window.electron.invoke('close-other-windows')
    },
  },
})
</script>
