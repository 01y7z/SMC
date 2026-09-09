import type { BlueskyPostReference } from '../utils/parseBlueskyPostUrl'

export function buildBlueskyPostUri(reference: BlueskyPostReference): string {
  const referenceUri = `at://${reference.profileIdentifier}/app.bsky.feed.post/${reference.recordKey}`
  return referenceUri
}

export function buildBlueskyGetPostsUrl(reference: BlueskyPostReference): URL {
  const postUri = buildBlueskyPostUri(reference)
  const requestUrl = new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts')

  requestUrl.searchParams.append('uris', postUri)
  return requestUrl
}

export function buildBlueskyResolveHandleUrl(handle: string): URL {
  const requestUrl = new URL('https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle')

  requestUrl.searchParams.append('handle', handle)
  return requestUrl
}

export async function resolveBlueskyHandle(handle: string): Promise<string> {
  const resolvedHandleUrl = buildBlueskyResolveHandleUrl(handle)
  const response = await fetch(resolvedHandleUrl)

  if (!response.ok) {
    throw new Error(`Bluesky handle request failed with status ${response.status}`)
  }

  const data: unknown = await response.json()

  if (typeof data !== 'object' || data === null) {
    throw new Error('Response body is not an object')
  }

  if (!('did' in data)) {
    throw new Error('Response body does not contain did')
  }

  if (typeof data.did !== 'string') {
    throw new Error('The did value is not a string')
  }

  if (!data.did.startsWith('did:')) {
    throw new Error('The did value is invalid')
  }

  return data.did
}

export function extractFirstBlueskyPost(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Bluesky returned an invalid posts response')
  }

  if (!('posts' in data)) {
    throw new Error('Bluesky returned an invalid posts response')
  }

  if (!Array.isArray(data.posts)) {
    throw new Error('Bluesky returned an invalid posts response')
  }

  if (data.posts.length === 0) {
    throw new Error('Bluesky post was not found')
  }

  return data.posts[0]
}

export async function fetchBlueskyPost(reference: BlueskyPostReference): Promise<unknown> {
  let profileIdentifier = reference.profileIdentifier

  if (!profileIdentifier.startsWith('did:')) {
    profileIdentifier = await resolveBlueskyHandle(profileIdentifier)
  }

  const resolvedReference: BlueskyPostReference = {
    profileIdentifier: profileIdentifier,
    recordKey: reference.recordKey,
  }

  const requestUrl = buildBlueskyGetPostsUrl(resolvedReference)
  const response = await fetch(requestUrl)

  if (!response.ok) {
    throw new Error(`Bluesky request failed with status ${response.status}`)
  }

  const data: unknown = await response.json()
  return extractFirstBlueskyPost(data)
}
