<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import PostComponent from "../Post/PostComponent.vue";

// Access the user store
const { currentUsername } = storeToRefs(useUserStore());

// Define the type for a post
interface Post {
  _id: string;
  title: string;
  author: string;
  imageUrls: string[];
  tags: string[];
  rating: number;
  itineraryId: string;
  dateCreated: string;
  dateUpdated: string;
  isFavorited: boolean;
}

// Define reactive states for loading and managing posts
const loaded = ref(false);
const posts = ref<Post[]>([]);

// Fetch the user's favorite posts
async function getFavoritePosts() {
  try {
    const response = await fetchy("/api/favorites", "GET");
    if (response.favorites) {
      posts.value = response.favorites.reverse(); // Update with the favorites array
    } else {
      console.error(response.msg); // Log the message if no favorites
    }
  } catch (error) {
    console.error("Failed to load favorite posts", error);
  } finally {
    loaded.value = true;
  }
}

// Fetch favorite posts when the component is mounted
onBeforeMount(async () => {
  await getFavoritePosts();
});
</script>

<template>
  <!-- Posts section displaying each favorite post -->
  <section class="posts" v-if="loaded && posts.length > 0">
    <article v-for="post in posts" :key="post._id">
      <!-- Pass the post as a prop to the PostComponent -->
      <PostComponent :post="post" />
    </article>
  </section>

  <!-- No favorite posts found message -->
  <p v-else-if="loaded">No favorite posts found</p>

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
