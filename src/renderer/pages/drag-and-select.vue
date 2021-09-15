<template>
  <div class="view-container">
    <h1 class="page-title">DRAG & SELECT</h1>
    <div class="drag-and-select-container">
      <div id="select-component" class="select-component select"></div>
      <div class="view-container view"></div>
      <button class="base-button button" @click="getImages">
        IMPORT PICTURES
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { Image } from '@/types/custom-types'

export default defineComponent({
  setup() {
    const images = ref<Image[]>([])

    async function getImages(): Promise<void> {
      const result = await window.electron.invoke(
        'get-images-from-dialog-async'
      )
      images.value = [...images.value, ...result]
    }

    return { images, getImages }
  },
})
</script>
