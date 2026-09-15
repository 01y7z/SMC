export type BlueskyImage = {
  thumb: string
  fullsize: string
  alt: string
  aspectRatio: {
    width: number
    height: number
  } | null
}

export function extractBlueskyImages(post: unknown): BlueskyImage[] | null {
  //invalid post or post without embed
  if (typeof post !== 'object' || post === null || !('embed' in post)) {
    return null
  }

  const embed = post.embed

  if (typeof embed !== 'object' || embed === null) {
    return null
  }

  if (!('$type' in embed) || embed.$type !== 'app.bsky.embed.images#view') {
    return null
  }

  if (!('images' in embed) || !Array.isArray(embed.images)) {
    return null
  }

  const images = embed.images

  if (images.length <= 0 || images.length > 4) {
    return null
  }

  const extractedImages: BlueskyImage[] = []

  for (const image of images) {
    if (typeof image !== 'object' || image === null) {
      return null
    }

    if (!('thumb' in image) || typeof image.thumb !== 'string') {
      return null
    }

    if (!('fullsize' in image) || typeof image.fullsize !== 'string') {
      return null
    }

    if (!('alt' in image) || typeof image.alt !== 'string') {
      return null
    }

    let aspectRatio: BlueskyImage['aspectRatio'] = null

    // if aspect ratio exists, check that its an object with a valid width and height
    if ('aspectRatio' in image) {
      if (typeof image.aspectRatio !== 'object' || image.aspectRatio === null) {
        return null
      }

      if (
        !('width' in image.aspectRatio) ||
        typeof image.aspectRatio.width !== 'number' ||
        !Number.isInteger(image.aspectRatio.width) ||
        image.aspectRatio.width <= 0
      ) {
        return null
      }

      if (
        !('height' in image.aspectRatio) ||
        typeof image.aspectRatio.height !== 'number' ||
        !Number.isInteger(image.aspectRatio.height) ||
        image.aspectRatio.height <= 0
      ) {
        return null
      }

      aspectRatio = {
        width: image.aspectRatio.width,
        height: image.aspectRatio.height,
      }
    }

    extractedImages.push({
      thumb: image.thumb,
      fullsize: image.fullsize,
      alt: image.alt,
      aspectRatio,
    })
  }

  return extractedImages
}
