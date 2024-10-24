<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

// Access the user store to check if the user is logged in
storeToRefs(useUserStore());

// Define reactive states for loading and managing posts, editing status, and search filters
const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);

async function getFavoritePosts() {
  try {
    posts.value = await fetchy("/api/posts", "GET");
  } catch (_) {
    return;
  }
}

// Fetch posts when the component is mounted
onBeforeMount(async () => {
  await getFavoritePosts();
  loaded.value = true;
});
</script>

<template>
  <!-- Posts section displaying each post, with edit functionality -->
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <!-- Conditionally show either PostComponent or EditPostForm based on editing state -->
      <FavoritePostComponent />
    </article>
  </section>

  <!-- No posts found message -->
  <p v-else-if="loaded">No posts found</p>

  <!-- Loading state -->
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
