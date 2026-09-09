import type { BlueskyPostReference } from '@/utils/parseBlueskyPostUrl'
import {
  buildBlueskyPostUri,
  buildBlueskyGetPostsUrl,
  fetchBlueskyPost,
  buildBlueskyResolveHandleUrl,
  resolveBlueskyHandle,
  extractFirstBlueskyPost,
} from './fetchBlueskyPost'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('fetchBlueskyPost', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a valid URI', () => {
    const reference: BlueskyPostReference = {
      profileIdentifier: 'alice.bsky.social',
      recordKey: 'abc123',
    }

    const uri = buildBlueskyPostUri(reference)
    expect(uri).toBe('at://alice.bsky.social/app.bsky.feed.post/abc123')
  })

  it('returns a URL containing the URI', () => {
    const reference: BlueskyPostReference = {
      profileIdentifier: 'alice.bsky.social',
      recordKey: 'abc123',
    }
    const url = buildBlueskyGetPostsUrl(reference)

    expect(url.origin).toBe('https://public.api.bsky.app')
    expect(url.pathname).toBe('/xrpc/app.bsky.feed.getPosts')
    expect(url.searchParams.get('uris')).toBe('at://alice.bsky.social/app.bsky.feed.post/abc123')
  })

  it('returns a Bluesky post body in JSON', async () => {
    const reference: BlueskyPostReference = {
      profileIdentifier: 'alice.bsky.social',
      recordKey: 'abc123',
    }

    const apiData = {
      posts: [
        {
          uri: 'at://did:plc:abc123/app.bsky.feed.post/abc123',
        },
      ],
    }

    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    fetchSpy
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ did: 'did:plc:abc123' }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(apiData), {
          status: 200,
        }),
      )

    const result = await fetchBlueskyPost(reference)

    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(result).toEqual(apiData.posts[0])
  })

  it('throws an error when the request fails', async () => {
    const reference: BlueskyPostReference = {
      profileIdentifier: 'did:plc:abc123',
      recordKey: 'abc123',
    }

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 503,
      }),
    )

    await expect(fetchBlueskyPost(reference)).rejects.toThrow(
      'Bluesky request failed with status 503',
    )
  })

  it('constructs the correct resolve handle url', () => {
    const url = buildBlueskyResolveHandleUrl('alice.bsky.social')

    expect(url.origin).toBe('https://public.api.bsky.app')
    expect(url.pathname).toBe('/xrpc/com.atproto.identity.resolveHandle')
    expect(url.searchParams.get('handle')).toBe('alice.bsky.social')
  })

  it('handle resolver returns the correct DID', async () => {
    const responseBody = {
      did: 'did:plc:abc123',
    }

    const fakeResponse = new Response(JSON.stringify(responseBody), {
      status: 200,
    })

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(fakeResponse)

    const resolvedHandle = await resolveBlueskyHandle('alice.bsky.social')
    expect(resolvedHandle).toBe('did:plc:abc123')
  })

  it('throws when the requested post is not found', () => {
    expect(() => extractFirstBlueskyPost({ posts: [] })).toThrow('Bluesky post was not found')
  })
})
