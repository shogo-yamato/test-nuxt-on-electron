<template>
  <div class="test-component">
    <h1 class="title">This is a test component.</h1>
    <p class="message">{{ messageFromMain }}</p>
    <p class="message">{{ messageFromMenu }}</p>
    <nuxt-link to="/tutorial">INTERNAL LINK</nuxt-link>
    <button class="button" @click="openDummyWindow">OPEN DUMMY WINDOW</button>
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
    window.electron.receiveHello(
      'hello-from-menu',
      (_: IpcRendererEvent, message: string): void => {
        this.messageFromMenu = message
      }
    )
  },
  methods: {
    openDummyWindow(): void {
      window.electron.sendHelloToMain()
      window.electron.receiveHello(
        'hello-from-main',
        (_: IpcRendererEvent, message: string): void => {
          this.messageFromMain = message
        }
      )
    },
  },
})
</script>
