export function parseBlueskyPostUrl(input: string): URL | null {
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

    if (filteredUrl.length !== 4) {
      return null
    }

    if (filteredUrl[0] !== 'profile' || filteredUrl[2] !== 'post') {
      return null
    }

    return parsedUrl
  } catch {
    return null
  }
}
