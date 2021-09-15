<template>
  <div class="view-container">
    <h1 class="page-title">DRAG & SELECT</h1>
    <div class="drag-and-select-container">
      <div class="select-component select">
        <img
          v-for="(image, index) in images"
          :key="`select-${index}`"
          class="select-item"
          :src="image.path"
          :alt="image.name"
        />
      </div>
      <div class="view-container view"></div>
      <button class="base-button button" @click="getImages">
        IMPORT PICTURES
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from '@nuxtjs/composition-api'
import useSelectable from '@/compositions/useSelectable'
import { Image } from '@/types/custom-types'

export default defineComponent({
  setup() {
    const images = ref<Image[]>([])
    const { selectable } = useSelectable()

    async function getImages(): Promise<void> {
      const result = await window.electron.invoke(
        'get-images-from-dialog-async'
      )
      images.value = [...images.value, ...result]
      await nextTick()
      selectable.value.add(document.querySelectorAll('.select-item'))
    }

    return { images, getImages }
  },
})
</script>
