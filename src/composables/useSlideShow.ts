import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { PhotoResponse } from '@/types/photo'
import { fetchNextPhoto, preloadImage } from '@/api/photoService'

export function useSlideShow(initialDurationMs: number = 10000) {
  const currentPhoto = ref<PhotoResponse | null>(null)
  const nextPhoto = ref<PhotoResponse | null>(null)
  const isPreloadingNext = ref(false)
  const isLoading = ref(false)
  const isPaused = ref(false)
  const error = ref<string | null>(null)

  const duration = ref(initialDurationMs)
  const minDuration = 1000 // 1s minimum
  const maxDuration = 60000 // 60s maximum
  const stepDuration = 1000 // 1s step

  const elapsed = ref(0)
  let lastTimestamp = performance.now()
  let animationFrameId: number | null = null

  const notification = ref<{ message: string; timestamp: number } | null>(null)
  let notificationTimeout: ReturnType<typeof setTimeout> | null = null

  const progressPercent = computed(() => {
    if (duration.value <= 0) return 0
    return Math.min(100, Math.max(0, (elapsed.value / duration.value) * 100))
  })

  const durationSeconds = computed(() => (duration.value / 1000).toFixed(0))

  function showNotification(message: string) {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
    }
    notification.value = { message, timestamp: Date.now() }
    notificationTimeout = setTimeout(() => {
      notification.value = null
    }, 2000)
  }

  async function preloadNextPhoto() {
    if (isPreloadingNext.value) return
    isPreloadingNext.value = true
    try {
      const photo = await fetchNextPhoto()
      await preloadImage(photo.image_url)
      nextPhoto.value = photo
    } catch (e) {
      console.warn('Failed to preload next photo:', e)
      nextPhoto.value = null
    } finally {
      isPreloadingNext.value = false
    }
  }

  async function forceNext() {
    elapsed.value = 0
    lastTimestamp = performance.now()

    if (nextPhoto.value) {
      const ready = nextPhoto.value
      nextPhoto.value = null
      currentPhoto.value = ready
      error.value = null
      // Preload next image in background
      preloadNextPhoto()
    } else {
      isLoading.value = !currentPhoto.value
      try {
        const photo = await fetchNextPhoto()
        await preloadImage(photo.image_url)
        currentPhoto.value = photo
        error.value = null
        preloadNextPhoto()
      } catch (err: unknown) {
        console.error('Error fetching photo:', err)
        if (err instanceof Error) {
          error.value = err.message
        } else {
          error.value = 'Failed to load photo'
        }
      } finally {
        isLoading.value = false
      }
    }
  }

  function speedUp() {
    if (duration.value > minDuration) {
      duration.value = Math.max(minDuration, duration.value - stepDuration)
      showNotification(`Speed: ${duration.value / 1000}s per photo (+fast)`)
    } else {
      showNotification(`Maximum speed reached (${minDuration / 1000}s)`)
    }
  }

  function slowDown() {
    if (duration.value < maxDuration) {
      duration.value = Math.min(maxDuration, duration.value + stepDuration)
      showNotification(`Speed: ${duration.value / 1000}s per photo (-slow)`)
    } else {
      showNotification(`Minimum speed reached (${maxDuration / 1000}s)`)
    }
  }

  function togglePause() {
    isPaused.value = !isPaused.value
    lastTimestamp = performance.now()
    showNotification(isPaused.value ? 'Slideshow Paused' : 'Slideshow Resumed')
  }

  function tick(now: number) {
    const delta = now - lastTimestamp
    lastTimestamp = now

    if (!isPaused.value && !isLoading.value && currentPhoto.value) {
      elapsed.value += delta
      if (elapsed.value >= duration.value) {
        forceNext()
      }
    }

    animationFrameId = requestAnimationFrame(tick)
  }

  onMounted(async () => {
    lastTimestamp = performance.now()
    animationFrameId = requestAnimationFrame(tick)
    await forceNext()
  })

  onUnmounted(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
    }
  })

  return {
    currentPhoto,
    isLoading,
    isPaused,
    error,
    duration,
    durationSeconds,
    progressPercent,
    notification,
    forceNext,
    speedUp,
    slowDown,
    togglePause,
  }
}
