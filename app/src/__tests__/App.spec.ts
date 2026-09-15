import { afterEach, describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

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

    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    fetchSpy
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ did: 'did:plc:abc123' }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            posts: [
              {
                uri: 'at://did:plc:abc123/app.bsky.feed.post/3l6oveex3ii2l',
              },
            ],
          }),
          { status: 200 },
        ),
      )

    await form.trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('')
  })

  it('shows an error when the Bluesky post cannot be retrieved', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 503,
      }),
    )

    const wrapper = mount(App)

    await wrapper.get('#post-url').setValue('https://bsky.app/profile/did:plc:abc123/post/abc123')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('Could not retrieve this Bluesky post')
  })

  // image post should show its detected type and first image
  it('shows the detected type and first image for an image post', async () => {
    const apiData = {
      posts: [
        {
          embed: {
            $type: 'app.bsky.embed.images#view',
            images: [
              {
                thumb: 'https://cdn.bsky.app/thumb.jpg',
                fullsize: 'https://cdn.bsky.app/fullsize.jpg',
                alt: 'Example image',
                aspectRatio: {
                  width: 1200,
                  height: 800,
                },
              },
            ],
          },
        },
      ],
    }

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(apiData), {
        status: 200,
      }),
    )

    const wrapper = mount(App)

    await wrapper.get('#post-url').setValue('https://bsky.app/profile/did:plc:abc123/post/abc123')

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Detected post type: images')
    expect(wrapper.get('img').attributes('src')).toBe('https://cdn.bsky.app/fullsize.jpg')
    expect(wrapper.get('img').attributes('alt')).toBe('Example image')
  })
})
