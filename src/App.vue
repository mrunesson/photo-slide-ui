<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SlideShow from './components/SlideShow.vue'
import SlideControls from './components/SlideControls.vue'
import { useSlideShow } from './composables/useSlideShow'
import { useKeyboardControls } from './composables/useKeyboardControls'

const {
  currentPhoto,
  isLoading,
  isPaused,
  error,
  durationSeconds,
  progressPercent,
  notification,
  forceNext,
  speedUp,
  slowDown,
  togglePause,
} = useSlideShow(10000)

const isFullscreen = ref(false)

function checkFullscreen() {
  isFullscreen.value = !!document.fullscreenElement
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn('Error attempting to enable fullscreen:', err)
    })
  } else {
    document.exitFullscreen().catch((err) => {
      console.warn('Error attempting to exit fullscreen:', err)
    })
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', checkFullscreen)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', checkFullscreen)
})

useKeyboardControls({
  forceNext,
  speedUp,
  slowDown,
  togglePause,
  toggleFullscreen,
})
</script>

<template>
  <main class="app-fullscreen">
    <SlideShow
      :photo="currentPhoto"
      :is-loading="isLoading"
      :error="error"
      @retry="forceNext"
    />

    <SlideControls
      :duration-seconds="durationSeconds"
      :progress-percent="progressPercent"
      :is-paused="isPaused"
      :notification="notification"
      :is-fullscreen="isFullscreen"
      @speed-up="speedUp"
      @slow-down="slowDown"
      @force-next="forceNext"
      @toggle-pause="togglePause"
      @toggle-fullscreen="toggleFullscreen"
    />
  </main>
</template>

<style scoped>
.app-fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  overflow: hidden;
  user-select: none;
}
</style>
