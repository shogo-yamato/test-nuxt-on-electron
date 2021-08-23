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
      <button class="base-button" @click="getSampleText">
        GET TEXT FROM FILE
      </button>
      <button class="base-button" @click="getSampleTextAsync">
        GET TEXT FROM FILE (ASYNC)
      </button>
      <div class="images">
        <p v-if="!images.length" class="empty">No images are loaded🥺</p>
        <img
          v-for="(image, index) in images"
          v-else
          :key="index"
          loading="lazy"
          class="image"
          :src="image"
          :alt="`image-${index + 1}`"
        />
      </div>
      <button class="base-button" @click="getImagesFromDialog">
        GET IMAGES FROM DIALOG
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      text: 'initial text data',
      images: [] as { path: string; loading: boolean }[],
    }
  },
  methods: {
    async getSampleText(): Promise<void> {
      this.text = await window.electron.invoke('get-sample-text')
    },
    async getSampleTextAsync(): Promise<void> {
      this.text = await window.electron.invoke('get-sample-text-async')
    },
    async getImagesFromDialog(): Promise<void> {
      const images = await window.electron.invoke('get-images-from-dialog')
      if (images) this.images = images
    },
  },
})
</script>

<style lang="scss" scoped>
@import 'assets/scss/app';

.filesystem-container {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  align-items: center;
  justify-content: flex-start;

  > .textarea {
    width: 500px;
    padding: 16px;
    font-size: 1.6rem;
    line-height: 1.5;
    color: $black-dark-grey;
    background-color: $white-dr-white;
    border: 1px solid $grey;
    border-radius: 3px;
  }

  > .images {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    align-items: center;
    width: 80%;
    min-height: 300px;
  }

  > .images > .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 300px;
  }

  > .images > .image {
    width: 100%;
    height: 300px;
    object-fit: contain;
  }

  > .images > .image.-loading {
    filter: blur(8px);
  }
}
</style>
