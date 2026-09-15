<script setup lang="ts">
import { ref } from 'vue'
import { parseBlueskyPostUrl } from './utils/parseBlueskyPostUrl'
import { fetchBlueskyPost } from './services/fetchBlueskyPost'
import { classifyBlueskyPost, type BlueskyPostKind } from './services/classifyBlueskyPost'

const postUrl = ref('')
const validationError = ref('')
const retrievedPost = ref<unknown | null>(null)
const postKind = ref<BlueskyPostKind | null>(null)

async function handleSubmit() {
  retrievedPost.value = null
  postKind.value = null
  const parsedResult = parseBlueskyPostUrl(postUrl.value)

  if (parsedResult === null) {
    validationError.value = 'Enter a valid Bluesky post URL'
    return
  }

  validationError.value = ''
  try {
    const post = await fetchBlueskyPost(parsedResult)

    retrievedPost.value = post
    postKind.value = classifyBlueskyPost(post)
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
      <p>Supports BlueSky posts with images, video, GIF-style media or text only.</p>
    </section>
  </main>
</template>
