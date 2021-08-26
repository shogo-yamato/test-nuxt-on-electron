<template>
  <div class="view-container">
    <h1 class="page-title">FILESYSTEM</h1>
    <div class="filesystem-container">
      <textarea
        id="textarea"
        v-model="text"
        name="textarea"
        cols="30"
        rows="10"
        class="textarea"
      ></textarea>
      <!-- <button class="base-button" @click="getSampleTextAsync">FAIL</button> -->
      <button class="base-button" @click="getTextFromDialogAsync">
        GET TEXT FROM DIALOG (ASYNC)
      </button>
      <button class="base-button" @click="saveTextFromTextareaAsync">
        SAVE TEXT FROM TEXTAREA (ASYNC)
      </button>
      <div class="images">
        <p v-if="!images.length" class="empty">No images are loaded🥺</p>
        <label
          v-for="(image, index) in images"
          v-else
          :key="index"
          class="label"
          :class="{ '-checked': image.checked }"
        >
          <img
            loading="lazy"
            class="image"
            :src="image.path"
            :alt="`image-${index + 1}`"
          />
          <span class="text">{{ image.name }}</span>
          <input v-model="image.checked" type="checkbox" />
        </label>
      </div>
      <!-- <button class="base-button" @click="getImagesFromDialog">
        GET IMAGES FROM DIALOG
      </button> -->
      <button class="base-button" @click="getImagesFromDialogAsync">
        GET IMAGES FROM DIALOG (ASYNC)
      </button>
      <button
        class="base-button"
        :disabled="!images.some((image) => image.checked) || isCopyingFile"
        @click="copyImagesToDifferentDirectory"
      >
        COPY IMAGES TO DIFFERENT DIRECTORY
      </button>
      <button
        class="base-button"
        :disabled="!images.some((image) => image.checked) || isMovingFile"
        @click="moveImagesToDifferentDirectory"
      >
        MOVE IMAGES TO DIFFERENT DIRECTORY
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Image } from '@/types/custom-types'

export default Vue.extend({
  data() {
    return {
      text: 'initial text data',
      images: [] as Image[],
      isCopyingFile: false,
      isMovingFile: false,
    }
  },
  computed: {
    checkedImages(): Image[] {
      return this.images.filter((image) => image.checked)
    },
  },
  methods: {
    // async getSampleText(): Promise<void> {
    //   this.text = await window.electron.invoke('get-sample-text')
    // },
    // async getSampleTextAsync(): Promise<void> {
    //   const text = await window.electron.invoke('get-sample-text-async')
    //   if (text) this.text = text
    // },
    async getTextFromDialogAsync(): Promise<void> {
      const text = await window.electron.invoke('get-text-from-dialog-async')
      if (text) this.text = text
    },
    async saveTextFromTextareaAsync(): Promise<void> {
      await window.electron.invoke('save-text-from-textarea-async', this.text)
    },
    // async getImagesFromDialog(): Promise<void> {
    //   const images = await window.electron.invoke('get-images-from-dialog')
    //   if (images) this.images = images
    // },
    async getImagesFromDialogAsync(): Promise<void> {
      const images = await window.electron.invoke(
        'get-images-from-dialog-async'
      )
      if (images) this.images = images
    },
    async copyImagesToDifferentDirectory(): Promise<void> {
      this.isCopyingFile = true
      await window.electron.invoke(
        'copy-images-to-different-directory',
        this.checkedImages
      )
      this.isCopyingFile = false
    },
    async moveImagesToDifferentDirectory(): Promise<void> {
      this.isMovingFile = true
      await window.electron.invoke(
        'move-images-to-different-directory',
        this.checkedImages
      )
      this.isMovingFile = false
    },
  },
})
</script>
