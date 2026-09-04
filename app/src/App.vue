<script setup lang="ts">
import { ref } from 'vue'

const postUrl = ref('')

function handleSubmit() {
  // We will add Bluesky URL validation here next.
}
</script>

<template>
  <main class="min-h-screen bg-page px-5 text-ink">
    <section class="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center py-12">
      <header class="mb-8">
        <h1 class="text-3xl font-semibold">SMC</h1>
        <p class="mt-3 max-w-lg text-muted">
          Paste a public Bluesky post to download or convert its media.
        </p>
      </header>

      <form class="w-full" @submit.prevent="handleSubmit">
        <label class="sr-only" for="post-url">Bluesky post URL</label>

        <div
          class="flex flex-col gap-2 rounded-lg border border-line bg-surface p-2
                 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20
                 sm:flex-row"
        >
          <input
            id="post-url"
            v-model.trim="postUrl"
            class="min-w-0 flex-1 bg-transparent px-3 py-3 text-ink
                   outline-none placeholder:text-muted/70"
            type="url"
            required
            autocomplete="url"
            spellcheck="false"
            placeholder="https://bsky.app/profile/.../post/..."
          />

          <button
            class="rounded-md bg-brand px-5 py-3 font-medium text-white
                   hover:bg-brand-hover focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-brand"
            type="submit"
          >
            Continue
          </button>
        </div>
      </form>

      <p class="mt-4 text-sm text-muted">
        Images, video, GIF-style media, and text-only posts.
      </p>
    </section>
  </main>
</template>