<template>
  <div class="view-container">
    <h1 class="page-title">API</h1>
    <div class="api-container">
      <img v-if="cat" :src="cat.url" alt="猫ちゃん" class="image" />
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

    const { fetch: nuxtFetch } = useFetch(async () => {
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

    nuxtFetch()

    return { cat }
  },
})
</script>

<style lang="scss" scoped>
.api-container {
  display: flex;
  align-items: center;
  justify-content: center;

  > .image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
