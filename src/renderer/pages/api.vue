<template>
  <div class="view-container">
    <h1 class="page-title">API</h1>
    <div class="api-container">
      <div v-if="$fetchState.pending" class="image -center">😽</div>
      <div v-else-if="$fetchState.error" class="image -center">🙀</div>
      <img
        v-else-if="cat"
        alt="ランダムな猫ちゃん"
        class="image"
        :src="cat.url"
      />
      <button
        class="base-button"
        :disabled="$fetchState.pending"
        @click="$fetch"
      >
        😻
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const {
      $config: { apiKey },
    } = useContext()

    const cat = ref<{
      breeds: []
      height: number
      id: string
      url: string
      width: number
    } | null>(null)

    useFetch(async () => {
      cat.value = (
        await (
          await fetch('https://api.thecatapi.com/v1/images/search', {
            headers: {
              'x-api-key': apiKey,
            },
          })
        ).json()
      )[0]
    })

    return { cat }
  },
})
</script>
