<script setup lang="ts">
import { ref } from 'vue'
import { parseBlueskyPostUrl } from './utils/parseBlueskyPostUrl'

const postUrl = ref('')
const validationError = ref('')

function handleSubmit() {
  const parsedResult = parseBlueskyPostUrl(postUrl.value)

  if (parsedResult === null) {
    validationError.value = 'Enter a valid Bluesky post URL'
    return
  }

  validationError.value = ''
  console.log(parsedResult)
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
      <p>Supports BlueSky posts with images, video, GIF-style media or text only.</p>
    </section>
  </main>
</template>
