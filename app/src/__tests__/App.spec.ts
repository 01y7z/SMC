import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('SMC')
  })

  it('shows an error for an invalid Bluesky URL', async () => {
    const wrapper = mount(App)

    await wrapper.get('#post-url').setValue('https://example.com')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('[role="alert"]').text()).toBe('Enter a valid Bluesky post URL')
  })

  it('old error disappears after a valid Bluesky URL is inputted', async () => {
    const wrapper = mount(App)
    const input = wrapper.get('#post-url')
    const form = wrapper.get('form')

    await input.setValue('https://example.com')
    await form.trigger('submit')
    expect(wrapper.get('[role="alert"]').text()).toBe('Enter a valid Bluesky post URL')

    await input.setValue('https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l')
    await form.trigger('submit')
    expect(wrapper.get('[role="alert"]').text()).toBe('')
  })
})
