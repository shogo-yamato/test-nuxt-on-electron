import { ref, onMounted, onBeforeUnmount } from '@nuxtjs/composition-api'
import DragSelect from 'dragselect'

export default function useDragSelect() {
  const dragSelect = ref<DragSelect>()
  const selectedElements = ref<HTMLElement[]>()

  onMounted((): void => {
    dragSelect.value = new DragSelect({
      area: document.getElementById('select-component') as HTMLDivElement,
      selectedClass: '-selected',
      selectorClass: 'select-selector',
      selectableClass: 'select-item',
      draggability: false,
    })

    dragSelect.value.subscribe('callback', ({ items }: CallbackObject) => {
      selectedElements.value = items
    })
  })

  onBeforeUnmount((): void => {
    document.querySelector('.ds-selector-area')?.remove()
  })

  return { dragSelect, selectedElements }
}
