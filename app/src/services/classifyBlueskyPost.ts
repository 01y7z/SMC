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

  // if it doesnt pass any checks, return unsupported
  return 'unsupported'
}
