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
      console.warn(response.msg || "No favorite posts found."); // Log warning if no favorites
    }
  } catch (error) {
    console.error("Failed to load favorite posts:", error);
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
  <p v-else-if="loaded" class="no-posts-msg">No favorite posts found</p>

  <!-- Loading state -->
  <p v-else class="loading-msg">Loading your favorites...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1.2em;
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 0.8em;
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  padding: 1.5em;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for a floating effect */
}

.posts {
  padding: 1.5em;
}

.loading-msg,
.no-posts-msg {
  text-align: center;
  font-size: 1.2em;
  color: #606060; /* Subtle color for non-intrusive messages */
  margin-top: 1em;
}

.loading-msg {
  animation: fadeIn 1s ease-in-out infinite alternate; /* Fading animation for loading */
}

@keyframes fadeIn {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
</style>
