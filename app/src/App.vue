<script setup lang="ts">
import { computed, ref } from 'vue'
import { parseBlueskyPostUrl } from './utils/parseBlueskyPostUrl'
import { fetchBlueskyPost } from './services/fetchBlueskyPost'
import { classifyBlueskyPost, type BlueskyPostKind } from './services/classifyBlueskyPost'
import { extractBlueskyImages, type BlueskyImage } from './services/extractBlueskyImages'

const postUrl = ref('')
const validationError = ref('')
const retrievedPost = ref<unknown | null>(null)
const postKind = ref<BlueskyPostKind | null>(null)
const extractedImages = ref<BlueskyImage[]>([])

const selectedImage = computed(() => {
  if (extractedImages.value[0]) {
    return extractedImages.value[0]
  }

  return null
})

async function handleSubmit() {
  retrievedPost.value = null
  postKind.value = null
  extractedImages.value = []
  const parsedResult = parseBlueskyPostUrl(postUrl.value)

  if (parsedResult === null) {
    validationError.value = 'Enter a valid Bluesky post URL'
    return
  }

  validationError.value = ''
  try {
    const post = await fetchBlueskyPost(parsedResult)
    retrievedPost.value = post

    const kind = classifyBlueskyPost(post)
    postKind.value = kind

    if (kind === 'images') {
      const localExtractedImages = extractBlueskyImages(post)

      if (localExtractedImages === null) {
        postKind.value = null
        retrievedPost.value = null
        validationError.value = 'Could not read images from this Bluesky post'

        return
      }

      extractedImages.value = localExtractedImages
    }
  } catch {
    validationError.value = 'Could not retrieve this Bluesky post'
  }
}
</script>

<template>
  <main>
    <section>
      <header>
        <h1>SMC</h1>
      </header>

      <form novalidate @submit.prevent="handleSubmit">
        <p role="alert">{{ validationError }}</p>
        <label for="post-url">Input your Bluesky post link here.</label>
        <input
          id="post-url"
          type="url"
          required
          autocomplete="url"
          spellcheck="false"
          placeholder="https://bsky.app/profile/xxx.bsky.social/post/xxx"
          v-model.trim="postUrl"
        />
        <button type="submit">Submit</button>
      </form>
      <p v-if="postKind">Detected post type: {{ postKind }}</p>
      <img v-if="selectedImage" :src="selectedImage.fullsize" :alt="selectedImage.alt" />
      <p>Supports BlueSky posts with images, video, GIF-style media or text only.</p>
    </section>
  </main>
</template>
