<template>
  <div class="view-container">
    <h1 class="page-title">DRAG & SELECT</h1>
    <div class="drag-and-select-container">
      <div id="select-component" class="select-component select">
        <button
          v-for="image in images"
          :key="`select-${image.id}`"
          type="button"
          class="select-item"
          :data-id="image.id"
        >
          <img class="image" :src="image.path" :alt="image.name" />
        </button>
      </div>
      <div class="view-component view">
        <div class="wrap">
          <img
            v-for="image in selectedImages"
            :key="image.id"
            class="image"
            :src="image.path"
            :alt="image.name"
          />
        </div>
      </div>
      <button class="base-button button" @click="getImages">
        IMPORT PICTURES
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  nextTick,
  ComputedRef,
} from '@nuxtjs/composition-api'
import { Image } from '@/types/custom-types'
import useDragSelect from '@/compositions/useDragSelect'

export default defineComponent({
  setup() {
    const images = ref<Image[]>([])
    const { dragSelect, selectedElements } = useDragSelect()

    async function getImages(): Promise<void> {
      const result = await window.electron.invoke(
        'get-images-from-dialog-async'
      )
      images.value = [...images.value, ...result]
      await nextTick()
      dragSelect.value?.addSelectables(
        Array.from(document.querySelectorAll('.select-item'))
      )
    }

    const selectedImages: ComputedRef<Image[]> = computed((): Image[] => {
      return images.value.filter((image) =>
        (selectedElements.value
          ? selectedElements.value.map((element) => element.dataset.id)
          : []
        ).includes(image.id)
      )
    })

    return { images, getImages, selectedImages }
  },
})
</script>
