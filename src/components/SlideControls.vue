<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  durationSeconds: string
  progressPercent: number
  isPaused: boolean
  notification: { message: string; timestamp: number } | null
  isFullscreen: boolean
}>()

const emit = defineEmits<{
  (e: 'speedUp'): void
  (e: 'slowDown'): void
  (e: 'forceNext'): void
  (e: 'togglePause'): void
  (e: 'toggleFullscreen'): void
}>()

const isVisible = ref(true)
let hideTimer: ReturnType<typeof setTimeout> | null = null

function resetHideTimer() {
  isVisible.value = true
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
  hideTimer = setTimeout(() => {
    isVisible.value = false
  }, 3500)
}

function handleMouseMove() {
  resetHideTimer()
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('click', handleMouseMove)
  resetHideTimer()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('click', handleMouseMove)
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
})
</script>

<template>
  <div class="controls-layer" :class="{ 'controls-hidden': !isVisible }">
    <!-- Top Progress Bar -->
    <div class="progress-bar-container">
      <div
        class="progress-bar"
        :style="{ width: `${progressPercent}%` }"
      ></div>
    </div>

    <!-- Top Bar Controls / HUD -->
    <header class="top-bar">
      <div class="app-title">
        <span class="pulse-dot" :class="{ paused: isPaused }"></span>
        <span>Slideshow</span>
      </div>

      <div class="hud-controls">
        <div class="speed-indicator">
          <span class="speed-label">Interval:</span>
          <span class="speed-value">{{ durationSeconds }}s</span>
        </div>

        <button
          class="hud-btn"
          title="Slow down (- key)"
          @click="emit('slowDown')"
        >
          <span class="btn-icon">−</span>
          <span class="btn-label">Slower</span>
        </button>

        <button
          class="hud-btn"
          title="Speed up (+ key)"
          @click="emit('speedUp')"
        >
          <span class="btn-icon">+</span>
          <span class="btn-label">Faster</span>
        </button>

        <button
          class="hud-btn"
          :title="isPaused ? 'Resume (P key)' : 'Pause (P key)'"
          @click="emit('togglePause')"
        >
          <span class="btn-icon">{{ isPaused ? '▶' : '⏸' }}</span>
          <span class="btn-label">{{ isPaused ? 'Play' : 'Pause' }}</span>
        </button>

        <button
          class="hud-btn action-next"
          title="Force next image (Space key)"
          @click="emit('forceNext')"
        >
          <span class="btn-icon">⏭</span>
          <span class="btn-label">Next (Space)</span>
        </button>

        <button
          class="hud-btn icon-only"
          :title="isFullscreen ? 'Exit Fullscreen (F key)' : 'Enter Fullscreen (F key)'"
          @click="emit('toggleFullscreen')"
        >
          <span class="btn-icon">{{ isFullscreen ? '⛶' : '⛶' }}</span>
        </button>
      </div>
    </header>

    <!-- Center/Top Toast Notifications -->
    <Transition name="toast">
      <div v-if="notification" :key="notification.timestamp" class="toast-notification">
        {{ notification.message }}
      </div>
    </Transition>

    <!-- Bottom Key Hints Bar -->
    <footer class="bottom-hints">
      <div class="hint-item"><kbd>Space</kbd> Next Image</div>
      <div class="hint-item"><kbd>-</kbd> Slow Down</div>
      <div class="hint-item"><kbd>+</kbd> Speed Up</div>
      <div class="hint-item"><kbd>P</kbd> Pause</div>
      <div class="hint-item"><kbd>F</kbd> Fullscreen</div>
    </footer>
  </div>
</template>

<style scoped>
.controls-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 100;
  transition: opacity 0.4s ease;
  user-select: none;
}

.controls-layer > * {
  pointer-events: auto;
}

.controls-hidden {
  opacity: 0;
  pointer-events: none !important;
}

.controls-hidden > * {
  pointer-events: none !important;
}

/* Progress bar */
.progress-bar-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  z-index: 110;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #42b883, #35495e, #00d2ff);
  transition: width 0.05s linear;
}

/* Top Bar */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%);
}

.app-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #42b883;
  box-shadow: 0 0 8px #42b883;
  animation: pulse 2s infinite;
}

.pulse-dot.paused {
  background: #ffb703;
  box-shadow: 0 0 8px #ffb703;
  animation: none;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

.hud-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(20, 20, 20, 0.75);
  backdrop-filter: blur(12px);
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.speed-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  margin-right: 4px;
}

.speed-value {
  font-weight: 700;
  color: #fff;
  min-width: 28px;
  font-variant-numeric: tabular-nums;
}

.hud-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.hud-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.hud-btn:active {
  transform: translateY(0);
}

.hud-btn.action-next {
  background: rgba(66, 184, 131, 0.3);
  border-color: rgba(66, 184, 131, 0.6);
}

.hud-btn.action-next:hover {
  background: rgba(66, 184, 131, 0.5);
}

.hud-btn.icon-only {
  padding: 6px 10px;
}

.btn-icon {
  font-weight: bold;
}

/* Toast */
.toast-notification {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  color: #fff;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 200;
  pointer-events: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px) scale(0.95);
}

/* Bottom Hints */
.bottom-hints {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%);
}

.hint-item {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

kbd {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-family: inherit;
  color: #fff;
  font-weight: 600;
}
</style>
