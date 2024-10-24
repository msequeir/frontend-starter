<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps({
  postId: String, // ID of the post
  isFavorited: Boolean, // Whether the post is currently favorited
});

const emit = defineEmits(["toggleFavorite"]);

const isFavorited = ref(props.isFavorited);

const toggleFavorite = async () => {
  try {
    const action = isFavorited.value ? "DELETE" : "POST"; // Toggle the favorite status
    await fetchy(`/api/posts/${props.postId}/favorite`, action); // Send favorite/unfavorite request

    // Toggle favorite status locally
    isFavorited.value = !isFavorited.value;

    // Emit an event to notify the parent component of the change
    emit("toggleFavorite", isFavorited.value);
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
  }
};
</script>

<template>
  <button @click="toggleFavorite" class="favorite-btn">
    <span v-if="isFavorited">⭐</span>
    <span v-else>☆</span>
  </button>
</template>

<style scoped>
.favorite-btn {
  cursor: pointer; /* Pointer cursor on hover */
  font-size: 1.5em; /* Larger font size for the emoji */
  display: flex; /* Use flexbox to center content */
  align-items: center; /* Vertically center the content */
}
</style>
