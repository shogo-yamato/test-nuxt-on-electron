<template>
  <div class="test-component">
    <h1 class="title">This is a test component.</h1>
    <p class="message">{{ messageFromMain }}</p>
    <p class="message">{{ messageFromMenu }}</p>
    <nuxt-link class="link" to="/tutorial">INTERNAL LINK</nuxt-link>
    <button class="button" @click="openDummyWindow">OPEN DUMMY WINDOW</button>
    <button class="button" @click="closeOtherWindows">
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
