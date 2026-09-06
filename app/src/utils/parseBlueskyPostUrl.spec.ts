import { describe, expect, it } from 'vitest'
import { parseBlueskyPostUrl } from './parseBlueskyPostUrl'

describe('parseBlueskyPostUrl', () => {
  it('accepts a valid Bluesky post URL', () => {
    const result = parseBlueskyPostUrl('https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l')

    expect(result).not.toBeNull()
  })

  it('rejects a malformed URL', () => {
    const result = parseBlueskyPostUrl('example.com')

    expect(result).toBeNull()
  })

  it('rejects a non-Bluesky hostname', () => {
    const result = parseBlueskyPostUrl('https://example.com/profile/bsky.app/post/3l6oveex3ii2l')

    expect(result).toBeNull()
  })

  it('rejects a non-HTTPS URL', () => {
    const result = parseBlueskyPostUrl('http://bsky.app/profile/bsky.app/post/3l6oveex3ii2l')

    expect(result).toBeNull()
  })

  it('rejects a URL with a custom port', () => {
    const result = parseBlueskyPostUrl('https://bsky.app:5000/profile/bsky.app/post/3l6oveex3ii2l')

    expect(result).toBeNull()
  })

  it.each([
    { reason: 'a missing record key', url: 'https://bsky.app/profile/bsky.app/post' },
    {
      reason: 'an extra path section',
      url: 'https://bsky.app/profile/bsky.app/post/user/3l6oveex3ii2l',
    },
    { reason: 'a double slash', url: 'https://bsky.app/profile//bsky.app/post/3l6oveex3ii2l' },
    {
      reason: 'incorrect profile or post sections',
      url: 'https://bsky.app/profile/bsky.app/comment/3l6oveex3ii2l',
    },
  ])('rejects a URL with $reason', ({ url }) => {
    const result = parseBlueskyPostUrl(url)

    expect(result).toBeNull()
  })

  it.each([
    {
      reason: 'a URL ending with /',
      url: 'https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l/',
    },
    {
      reason: 'a URL containing a query and fragment',
      url: 'https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l?source=test#reply',
    },
    {
      reason: 'a URL containing a DID',
      url: 'https://bsky.app/profile/did:plc:ewvi7nxzyoun6zhxrhs64oiz/post/3l6oveex3ii2l',
    },
  ])('accepts a URL with $reason', ({ url }) => {
    const result = parseBlueskyPostUrl(url)

    expect(result).not.toBeNull()
  })
})
