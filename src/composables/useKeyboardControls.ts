import { onMounted, onUnmounted } from 'vue'

export interface KeyboardActions {
  forceNext: () => void
  speedUp: () => void
  slowDown: () => void
  togglePause?: () => void
  toggleFullscreen?: () => void
}

export function useKeyboardControls(actions: KeyboardActions) {
  function handleKeyDown(event: KeyboardEvent) {
    // Ignore key presses if an editable input/textarea is focused
    const target = event.target as HTMLElement | null
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return
    }

    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault()
      actions.forceNext()
      return
    }

    if (event.key === '-' || event.key === '_') {
      event.preventDefault()
      actions.slowDown()
      return
    }

    if (event.key === '+' || event.key === '=') {
      event.preventDefault()
      actions.speedUp()
      return
    }

    if (Array.from(event.key).length !== 1) {
      if (event.code === 'Minus' || event.code === 'NumpadSubtract') {
        event.preventDefault()
        actions.slowDown()
        return
      }

      if (event.code === 'Equal' || event.code === 'NumpadAdd') {
        event.preventDefault()
        actions.speedUp()
        return
      }
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      actions.forceNext()
      return
    }

    if ((event.key === 'f' || event.key === 'F') && actions.toggleFullscreen) {
      event.preventDefault()
      actions.toggleFullscreen()
      return
    }

    if ((event.key === 'p' || event.key === 'P') && actions.togglePause) {
      event.preventDefault()
      actions.togglePause()
      return
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}
