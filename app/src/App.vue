<script setup lang="ts">
import { ref } from 'vue'

const postUrl = ref('')

function handleSubmit() {
  console.log(postUrl.value)
}
</script>

<template>
  <main>
    <section>
      <header>
        <h1>SMC</h1>
      </header>

      <form @submit.prevent="handleSubmit">
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
