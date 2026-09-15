import { describe, expect, it } from 'vitest'
import { classifyBlueskyPost } from './classifyBlueskyPost'

describe('classifyBlueskyPost', () => {
  // post without an embed should be text
  it('classifies a post without an embed as text', () => {
    const post = {
      uri: 'at://did:plc:example/app.bsky.feed.post/example',
      record: {
        text: 'This is a text-only post',
      },
    }

    expect(classifyBlueskyPost(post)).toBe('text')
  })

  // post with an image embed should be images
  it('classifies an image embed as images', () => {
    const post = {
      embed: {
        $type: 'app.bsky.embed.images#view',
        images: [],
      },
    }

    expect(classifyBlueskyPost(post)).toBe('images')
  })

  // video with gif presentation should be gif
  it('classifies a GIF-style video embed as gif', () => {
    const post = {
      embed: {
        $type: 'app.bsky.embed.video#view',
        presentation: 'gif',
      },
    }

    expect(classifyBlueskyPost(post)).toBe('gif')
  })

  // video with default presentation should be video
  it('classifies a default video embed as video', () => {
    const post = {
      embed: {
        $type: 'app.bsky.embed.video#view',
        presentation: 'default',
      },
    }

    expect(classifyBlueskyPost(post)).toBe('video')
  })

  // invalid post should be unsupported
  it('classifies invalid post data as unsupported', () => {
    expect(classifyBlueskyPost(null)).toBe('unsupported')
  })

  // unknown embed type should be unsupported
  it('classifies an unknown embed type as unsupported', () => {
    const post = {
      embed: {
        $type: 'app.bsky.embed.external#view',
      },
    }

    expect(classifyBlueskyPost(post)).toBe('unsupported')
  })
})
