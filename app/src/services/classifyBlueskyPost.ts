export type BlueskyPostKind = 'text' | 'images' | 'video' | 'gif' | 'unsupported'

export function classifyBlueskyPost(post: unknown): BlueskyPostKind {
  // invalid post
  if (typeof post !== 'object' || post === null) {
    return 'unsupported'
  }

  // post without embed = text
  if (!('embed' in post)) {
    return 'text'
  }
  const embed = post.embed

  // invalid embed
  if (typeof embed !== 'object' || embed === null) {
    return 'unsupported'
  }

  // invalid embed of $type = unsupported
  if (!('$type' in embed) || typeof embed.$type !== 'string') {
    return 'unsupported'
  }

  // image embed == images
  if (embed.$type === 'app.bsky.embed.images#view') {
    return 'images'
  }

  // video embed == video
  if (embed.$type === 'app.bsky.embed.video#view') {
    // presentation value is gif
    // bluesky post embeds have an an optional presentation value that describes how to render the video.
    if ('presentation' in embed && embed.presentation === 'gif') {
      return 'gif'
    }

    // default presentation value is video
    return 'video'
  }

  // embed == video gif or external gif provider
  if (embed.$type === 'app.bsky.embed.external#view') {
    if (!('external' in embed) || typeof embed.external !== 'object' || embed.external === null) {
      return 'unsupported'
    }

    const external = embed.external

    if (!('uri' in external) || typeof external.uri !== 'string') {
      return 'unsupported'
    }

    // convert uri into url for decoding
    let requestUrl: URL
    try {
      requestUrl = new URL(external.uri)
    } catch {
      return 'unsupported'
    }

    // check that the protocol, hostname, port, and pathnames all match klipy and .gif format
    if (
      requestUrl.protocol !== 'https:' ||
      requestUrl.hostname !== 'static.klipy.com' ||
      requestUrl.port !== '' ||
      !requestUrl.pathname.toLowerCase().endsWith('.gif')
    ) {
      return 'unsupported'
    }

    // all checks passed
    return 'gif'
  }

  // if it doesnt pass any checks, return unsupported
  return 'unsupported'
}
