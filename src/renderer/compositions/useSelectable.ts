import { ref, onMounted, onBeforeUnmount } from '@nuxtjs/composition-api'
import Selectable from 'selectable.js'

export default function useSelectable() {
  const selectable = ref<any>()

  onMounted((): void => {
    selectable.value = new Selectable({
      appendTo: '.select-component',
      classes: {
        selected: '-selected',
        container: 'select-component',
        selecting: '-selecting',
        selectable: 'select-item',
        deselecting: '-deselecting',
      },
    })
    selectable.value.on(
      'end',
      (_: any, selected: any, unselected: any): void => {
        console.dir({ selected, unselected })
      }
    )
  })

  onBeforeUnmount(() => selectable.value.destroy())

  return { selectable }
}
