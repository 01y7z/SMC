type BlueskyPostReference = {
  profileIdentifier: string
  recordKey: string
}

export function parseBlueskyPostUrl(input: string): BlueskyPostReference | null {
  try {
    const parsedUrl = new URL(input)
    const splitUrl = parsedUrl.pathname.split('/')

    if (parsedUrl.hostname !== 'bsky.app') {
      return null
    }

    if (parsedUrl.protocol !== 'https:') {
      return null
    }

    if (parsedUrl.port !== '') {
      return null
    }

    if (parsedUrl.pathname.includes('//')) {
      return null
    }

    const filteredUrl = splitUrl.filter((segment) => segment.length > 0)
    const profileIdentifier = filteredUrl[1]
    const recordKey = filteredUrl[3]

    if (!profileIdentifier || !recordKey) {
      return null
    }
    if (filteredUrl.length !== 4) {
      return null
    }

    if (filteredUrl[0] !== 'profile' || filteredUrl[2] !== 'post') {
      return null
    }

    const reference: BlueskyPostReference = {
      profileIdentifier,
      recordKey,
    }

    return reference
  } catch {
    return null
  }
}
