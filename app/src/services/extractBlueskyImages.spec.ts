import { describe, expect, it } from 'vitest'
import { extractBlueskyImages } from './extractBlueskyImages'

const validImage = {
  thumb: 'https://cdn.bsky.app/thumb.jpg',
  fullsize: 'https://cdn.bsky.app/fullsize.jpg',
  alt: 'Example image',
  aspectRatio: {
    width: 1200,
    height: 800,
  },
}

function createImagePost(images: unknown[]) {
  return {
    embed: {
      $type: 'app.bsky.embed.images#view',
      images,
    },
  }
}

describe('extractBlueskyImages', () => {
  // valid image should keep all of its information
  it('extracts a valid image', () => {
    expect(extractBlueskyImages(createImagePost([validImage]))).toEqual([validImage])
  })

  // image without aspect ratio should use null
  it('extracts an image without an aspect ratio', () => {
    const image = {
      thumb: 'https://cdn.bsky.app/thumb.jpg',
      fullsize: 'https://cdn.bsky.app/fullsize.jpg',
      alt: 'Example image',
    }

    expect(extractBlueskyImages(createImagePost([image]))).toEqual([
      {
        ...image,
        aspectRatio: null,
      },
    ])
  })

  // post with multiple images should return every image
  it('extracts multiple images', () => {
    const secondImage = {
      ...validImage,
      thumb: 'https://cdn.bsky.app/second-thumb.jpg',
      fullsize: 'https://cdn.bsky.app/second-fullsize.jpg',
      alt: 'Second image',
    }

    expect(extractBlueskyImages(createImagePost([validImage, secondImage]))).toEqual([
      validImage,
      secondImage,
    ])
  })

  // image missing required information should be rejected
  it('rejects an image with invalid required fields', () => {
    const imageWithoutFullsize = {
      thumb: 'https://cdn.bsky.app/thumb.jpg',
      alt: 'Example image',
    }

    expect(extractBlueskyImages(createImagePost([imageWithoutFullsize]))).toBeNull()
  })

  // invalid aspect ratio should be rejected
  it('rejects an invalid aspect ratio', () => {
    const image = {
      ...validImage,
      aspectRatio: {
        width: 0,
        height: 800,
      },
    }

    expect(extractBlueskyImages(createImagePost([image]))).toBeNull()
  })

  // empty or oversized image arrays should be rejected
  it('rejects invalid image array lengths', () => {
    expect(extractBlueskyImages(createImagePost([]))).toBeNull()
    expect(
      extractBlueskyImages(createImagePost(Array.from({ length: 5 }, () => validImage))),
    ).toBeNull()
  })

  // invalid post should be rejected
  it('rejects invalid post data', () => {
    expect(extractBlueskyImages(null)).toBeNull()
    expect(extractBlueskyImages({})).toBeNull()
  })
})
