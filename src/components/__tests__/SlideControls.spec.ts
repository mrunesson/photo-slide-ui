import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SlideControls from '../SlideControls.vue'

describe('SlideControls.vue', () => {
  it('renders progress and duration and emits events on button clicks', async () => {
    const wrapper = mount(SlideControls, {
      props: {
        durationSeconds: '10',
        progressPercent: 45,
        isPaused: false,
        notification: null,
        isFullscreen: false,
      },
    })

    expect(wrapper.text()).toContain('Interval:')
    expect(wrapper.text()).toContain('10s')

    const buttons = wrapper.findAll('button')
    // Slower button
    await buttons[0].trigger('click')
    expect(wrapper.emitted('slowDown')).toHaveLength(1)

    // Faster button
    await buttons[1].trigger('click')
    expect(wrapper.emitted('speedUp')).toHaveLength(1)

    // Pause button
    await buttons[2].trigger('click')
    expect(wrapper.emitted('togglePause')).toHaveLength(1)

    // Next button
    await buttons[3].trigger('click')
    expect(wrapper.emitted('forceNext')).toHaveLength(1)

    wrapper.unmount()
  })

  it('displays notification when provided', () => {
    const wrapper = mount(SlideControls, {
      props: {
        durationSeconds: '8',
        progressPercent: 0,
        isPaused: true,
        notification: {
          message: 'Speed: 8s per photo',
          timestamp: Date.now(),
        },
        isFullscreen: false,
      },
    })

    expect(wrapper.text()).toContain('Speed: 8s per photo')
    wrapper.unmount()
  })
})
