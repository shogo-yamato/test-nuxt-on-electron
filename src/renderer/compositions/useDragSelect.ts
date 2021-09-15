import { ref, onMounted, onBeforeUnmount } from '@nuxtjs/composition-api'
import DragSelect from 'dragselect'

export default function useDragSelect() {
  const dragSelect = ref<DragSelect>()

  onMounted((): void => {
    dragSelect.value = new DragSelect({
      area: document.getElementById('select-component') as HTMLDivElement,
      selectedClass: '-selected',
      selectorClass: 'dragselect-selector',
      draggability: false,
    })

    dragSelect.value.subscribe('callback', ({ items }: CallbackObject) => {
      console.log(items)
    })
  })

  onBeforeUnmount((): void => {
    document.querySelector('.ds-selector-area')?.remove()
  })

  return { dragSelect }
}
