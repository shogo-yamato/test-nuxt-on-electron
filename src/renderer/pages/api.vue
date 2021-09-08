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
      <div class="flex">
        <button
          class="base-button"
          :disabled="isVoteButtonDisabled || $fetchState.pending"
          @click="vote(VoteValue.Upvote)"
        >
          👍
        </button>
        <button
          class="base-button"
          :disabled="isVoteButtonDisabled || $fetchState.pending"
          @click="vote(VoteValue.Downvote)"
        >
          👎
        </button>
      </div>
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

    const { fetch: fetchCat } = useFetch(async () => {
      const url = new URL('https://api.thecatapi.com/v1/images/search')
      url.search = new URLSearchParams({ limit: '1' }).toString()
      cat.value = (
        await (
          await fetch(url.href, {
            headers: {
              'x-api-key': apiKey,
            },
          })
        ).json()
      )[0]
    })

    enum VoteValue {
      Downvote = 0,
      Upvote = 1,
    }

    const isVoteButtonDisabled = ref<boolean>(false)

    async function vote(value: VoteValue) {
      isVoteButtonDisabled.value = true
      try {
        const response = await fetch('https://api.thecatapi.com/v1/votes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({
            image_id: cat.value?.id,
            value,
          }),
        })
        if (!response.ok) throw new Error(response.status.toString())
        fetchCat()
      } catch (e) {
        console.error(e)
      } finally {
        isVoteButtonDisabled.value = false
      }
    }

    return { cat, VoteValue, isVoteButtonDisabled, vote }
  },
})
</script>
