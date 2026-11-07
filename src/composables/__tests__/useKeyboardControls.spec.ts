import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useKeyboardControls } from '../useKeyboardControls'

describe('useKeyboardControls', () => {
  it('triggers registered actions on keyboard events', () => {
    const forceNext = vi.fn()
    const speedUp = vi.fn()
    const slowDown = vi.fn()
    const togglePause = vi.fn()
    const toggleFullscreen = vi.fn()

    const TestComponent = defineComponent({
      setup() {
        useKeyboardControls({
          forceNext,
          speedUp,
          slowDown,
          togglePause,
          toggleFullscreen,
        })
        return () => h('div')
      },
    })

    const wrapper = mount(TestComponent)

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ' }))
    expect(forceNext).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }))
    expect(speedUp).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '-' }))
    expect(slowDown).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }))
    expect(togglePause).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }))
    expect(toggleFullscreen).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('ignores keyboard shortcuts when focus is inside input elements', () => {
    const forceNext = vi.fn()
    const speedUp = vi.fn()
    const slowDown = vi.fn()
    const TestComponent = defineComponent({
      setup() {
        useKeyboardControls({
          forceNext,
          speedUp,
          slowDown,
        })
        return () => h('input', { id: 'test-input' })
      },
    })

    const wrapper = mount(TestComponent)
    const inputEl = wrapper.find('input').element

    const event = new KeyboardEvent('keydown', { code: 'Space', key: ' ', bubbles: true })
    Object.defineProperty(event, 'target', { value: inputEl, enumerable: true })
    window.dispatchEvent(event)

    expect(forceNext).not.toHaveBeenCalled()
    const plusEvent = new KeyboardEvent('keydown', { key: '+', code: 'Minus', bubbles: true })
    Object.defineProperty(plusEvent, 'target', { value: inputEl, enumerable: true })
    window.dispatchEvent(plusEvent)

    expect(speedUp).not.toHaveBeenCalled()
    expect(slowDown).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('prefers speed shortcut characters over physical key codes', () => {
    const speedUp = vi.fn()
    const slowDown = vi.fn()
    const TestComponent = defineComponent({
      setup() {
        useKeyboardControls({
          forceNext: vi.fn(),
          speedUp,
          slowDown,
        })
        return () => h('div')
      },
    })

    const wrapper = mount(TestComponent)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '+', code: 'Minus' }))
    expect(speedUp).toHaveBeenCalledTimes(1)
    expect(slowDown).not.toHaveBeenCalled()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '-', code: 'Equal' }))
    expect(slowDown).toHaveBeenCalledTimes(1)
    expect(speedUp).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '?', code: 'Equal' }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '?', code: 'Minus' }))
    expect(speedUp).toHaveBeenCalledTimes(1)
    expect(slowDown).toHaveBeenCalledTimes(1)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '=', code: 'Equal' }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '+', code: 'NumpadAdd' }))
    expect(speedUp).toHaveBeenCalledTimes(3)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '_', code: 'Minus' }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '-', code: 'NumpadSubtract' }))
    expect(slowDown).toHaveBeenCalledTimes(3)

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Equal' }))
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Minus' }))
    expect(speedUp).toHaveBeenCalledTimes(4)
    expect(slowDown).toHaveBeenCalledTimes(4)

    wrapper.unmount()
  })
})
