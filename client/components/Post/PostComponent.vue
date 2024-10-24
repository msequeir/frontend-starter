<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import FavoriteButton from "../Favorite/FavoriteButton.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};
// Update the favorite state in the parent component
const handleToggleFavorite = (newStatus: boolean) => {
  // Directly update the post's favorite status
  console.log(`Favorite status changed to: ${newStatus}`);
};
</script>

<template>
  <p class="title">{{ props.post.title }}</p>
  <!-- Display image URLs as images-->
  <div v-if="props.post.imageUrls && props.post.imageUrls.length > 0" class="post-images">
    <div v-for="(url, index) in props.post.imageUrls" :key="index" class="image-container">
      <img :src="url" alt="Post image" class="post-image" />
    </div>
  </div>

  <div class="post-header">
    <p class="author">{{ props.post.author }}</p>
    <!-- Favorite button component with a specific class -->
    <FavoriteButton class="favorite-btn" :postId="props.post._id" :isFavorited="props.post.isFavorited" @toggleFavorite="handleToggleFavorite" />
  </div>

  <p class="tags">Tags: {{ props.post.tags }}</p>
  <p class="rating">Rating: {{ props.post.rating }}</p>
  <p class="itineraryId">{{ props.post.itineraryId }}</p>
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li>
        <button class="btn-small pure-button" @click="emit('editPost', props.post._id)">
          <!-- Pencil SVG icon -->
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 16 16">
            <rect width="1.997" height="5.657" x="10.472" y="1.701" fill="#8852ff" transform="rotate(-45.001 11.47 4.53)"></rect>
            <polygon fill="#ffa62e" points="12.824,7.176 8.824,3.176 1,11 1,15 5,15"></polygon>
            <path fill="#e783d4" d="M11.172,0.828l-1.065,1.065l4,4l1.065-1.065c1.105-1.105,1.105-2.895,0-4l0,0 C14.067-0.276,12.276-0.276,11.172,0.828z"></path>
          </svg>
        </button>
      </li>
      <li>
        <button class="btn-small pure-button" @click="deletePost">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 16 16">
            <polygon fill="#6a2eff" points="12,4 10,1 6,1 4,4"></polygon>
            <polygon fill="#9d70ff" points="13,15 3,15 1.5,4 14.5,4"></polygon>
            <rect width="14" height="2" x="1" y="2" fill="#6a2eff"></rect>
          </svg>
        </button>
      </li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.title {
  font-weight: bolder;
  font-size: 1.2em;
  text-align: center;
}
.author {
  font-weight: bold;
  font-size: 1.2em;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: center;
}

.image-container {
  width: 500px;
  height: 500px;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em 0;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  margin-right: 11em; /* Adjust this to bring the button closer to the author */
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
