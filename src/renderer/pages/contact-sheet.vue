<template>
  <div class="contact-sheet-container">
    <template v-if="images.length">
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        :alt="`画像${index + 1}`"
        class="image"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'contact-sheet',
  data() {
    return {
      images: [] as string[],
    }
  },
  async mounted() {
    const images: string[] = await window.electron.invoke(
      'get-contact-sheet-images'
    )
    if (images.length) this.images = images
    await this.$nextTick()
    window.electron.send('print-current-window')
  },
})
</script>

<style lang="scss" scoped>
@import 'assets/scss/app';

.contact-sheet-container {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  width: 100%;
  min-height: 100vh;
  background-color: $white;

  > .image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
