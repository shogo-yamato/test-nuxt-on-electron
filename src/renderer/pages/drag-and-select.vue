<template>
  <div class="view-container">
    <h1 class="page-title">DRAG & SELECT</h1>
    <div class="drag-and-select-container">
      <div id="select-component" class="select-component select">
        <button
          v-for="(image, index) in images"
          :key="`select-${index}`"
          type="button"
          class="button"
        >
          <img class="image" :src="image.path" :alt="image.name" />
        </button>
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
import { Image } from '@/types/custom-types'
import useDragSelect from '@/compositions/useDragSelect'

export default defineComponent({
  setup() {
    const images = ref<Image[]>([])
    const { dragSelect } = useDragSelect()

    async function getImages(): Promise<void> {
      const result = await window.electron.invoke(
        'get-images-from-dialog-async'
      )
      images.value = [...images.value, ...result]
      await nextTick()
      dragSelect.value?.addSelectables(
        Array.from(document.querySelectorAll('.button'))
      )
    }

    return { images, getImages }
  },
})
</script>
