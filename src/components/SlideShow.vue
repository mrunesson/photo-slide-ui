<script setup lang="ts">
import type { PhotoResponse } from '@/types/photo'

defineProps<{
  photo: PhotoResponse | null
  isLoading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div class="slideshow-container">
    <!-- Active photo display with smooth fade transition -->
    <Transition name="fade">
      <div v-if="photo" :key="photo.image_url" class="photo-wrapper">
        <img
          :src="photo.image_url"
          :alt="photo.path"
          class="photo-image"
          decoding="async"
        />

        <div class="photo-info" v-if="photo.album || photo.path">
          <span v-if="photo.album" class="album-badge">{{ photo.album }}</span>
          <span class="photo-title">{{ photo.path.split('/').pop() }}</span>
        </div>
      </div>
    </Transition>

    <!-- Initial loading state -->
    <div v-if="isLoading && !photo" class="state-overlay">
      <div class="spinner"></div>
      <p class="state-text">Loading slide show...</p>
    </div>

    <!-- Error state -->
    <div v-if="error && !photo" class="state-overlay error-state">
      <p class="error-text">{{ error }}</p>
      <button class="retry-button" @click="emit('retry')">Retry</button>
    </div>
  </div>
</template>

<style scoped>
.slideshow-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.photo-image {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.photo-info {
  position: absolute;
  bottom: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  pointer-events: none;
  z-index: 10;
  transition: opacity 0.3s ease;
}

.album-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.photo-title {
  opacity: 0.9;
  font-weight: 400;
}

.state-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #fff;
  z-index: 20;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
}

.error-state {
  text-align: center;
  padding: 20px;
}

.error-text {
  color: #ff6b6b;
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.retry-button {
  background: #fff;
  color: #000;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.retry-button:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
