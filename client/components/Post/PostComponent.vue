<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import FavoriteButton from "../Favorite/FavoriteButton.vue";
import UpvoteButton from "../Upvoting/UpvoteButton.vue";

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

const handleToggleFavorite = (newStatus: boolean) => {
  console.log(`Favorite status changed to: ${newStatus}`);
};
</script>

<template>
  <p class="title">{{ props.post.title }}</p>

  <!-- Image Display -->
  <div v-if="props.post.imageUrls && props.post.imageUrls.length > 0" class="post-images">
    <div v-for="(url, index) in props.post.imageUrls" :key="index" class="image-container">
      <img :src="url" alt="Post image" class="post-image" />
    </div>
  </div>

  <div class="post-header">
    <p class="author">{{ props.post.author }}</p>
    <FavoriteButton class="favorite-btn" :postId="props.post._id" :isFavorited="props.post.isFavorited" @toggleFavorite="handleToggleFavorite" />
    <UpvoteButton :postId="props.post._id" />
  </div>

  <p class="tags">Tags: {{ props.post.tags }}</p>

  <!-- Star-based Rating -->
  <div class="rating">
    <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= props.post.rating }">★</span>
  </div>

  <p class="itineraryId">Itinerary:</p>
  <div>{{ props.post.itinerary.content }}</div>

  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li>
        <button class="btn-small pure-button" @click="emit('editPost', props.post._id)">
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
  margin: 0;
  font-family: "Poppins", sans-serif; /* Set Poppins font for paragraphs */
}

.title {
  font-weight: bolder;
  font-size: 1.5em; /* Slightly larger font size for titles */
  text-align: center;
  color: #333; /* Dark text for contrast */
}

.author {
  font-weight: bold;
  font-size: 1.2em;
  color: #555; /* Slightly lighter than the title */
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
  border: 2px solid #6fc5d6; /* Border to match the theme */
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
  margin-right: 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.2em;
  font-size: 1.5em;
}

.star {
  color: #d3d3d3; /* Default star color */
}

.star.filled {
  color: #ffc107; /* Color for filled stars */
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
  color: #888; /* Lighter text for timestamp */
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e0f7f1; /* Light mint green background for the base section */
  padding: 10px; /* Add padding for space */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}
</style>
