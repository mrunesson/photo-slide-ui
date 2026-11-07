import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useSlideShow } from '../useSlideShow'
import * as photoService from '@/api/photoService'

describe('useSlideShow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(photoService, 'fetchNextPhoto').mockResolvedValue({
      id: 1,
      album_id: 1,
      album_title: 'Summer Vacation',
      file_name: 'photo1.jpg',
      image_url: '/api/photos/1/image',
      taken_at: '2025-07-01T12:00:00Z',
    })
    vi.spyOn(photoService, 'preloadImage').mockResolvedValue()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('initializes with default duration and fetches the first photo on mount', async () => {
    let result!: ReturnType<typeof useSlideShow>

    const TestComponent = defineComponent({
      setup() {
        result = useSlideShow(10000)
        return () => h('div')
      },
    })

    const wrapper = mount(TestComponent)
    expect(result.duration.value).toBe(10000)
    expect(result.durationSeconds.value).toBe('10')

    await vi.advanceTimersByTimeAsync(10)
    await Promise.resolve()

    expect(result.currentPhoto.value).toEqual({
      id: 1,
      album_id: 1,
      album_title: 'Summer Vacation',
      file_name: 'photo1.jpg',
      image_url: '/api/photos/1/image',
      taken_at: '2025-07-01T12:00:00Z',
    })

    wrapper.unmount()
  })

  it('adjusts speed correctly with speedUp and slowDown', async () => {
    let result!: ReturnType<typeof useSlideShow>

    const TestComponent = defineComponent({
      setup() {
        result = useSlideShow(10000)
        return () => h('div')
      },
    })

    const wrapper = mount(TestComponent)

    result.speedUp()
    expect(result.duration.value).toBe(9000)
    expect(result.durationSeconds.value).toBe('9')
    expect(result.notification.value?.message).toContain('Speed: 9s per photo')

    result.slowDown()
    expect(result.duration.value).toBe(10000)

    result.togglePause()
    expect(result.isPaused.value).toBe(true)
    expect(result.notification.value?.message).toBe('Slideshow Paused')

    wrapper.unmount()
  })
})
