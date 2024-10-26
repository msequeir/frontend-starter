<script setup lang="ts">
import { useUserStore } from "@/stores/user"; // Import the user store
import { computed } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps({
  postId: String, // ID of the post
  isFavorited: Boolean, // Initial favorite status passed from parent
});

const emit = defineEmits(["toggleFavorite"]);

// Access the user store
const userStore = useUserStore();

// Compute the favorite status based on the store
const isFavorited = computed(() => userStore.isPostFavorited(props.postId));

const toggleFavorite = async () => {
  try {
    const action = isFavorited.value ? "DELETE" : "POST"; // Determine action based on current status
    await fetchy(`/api/posts/${props.postId}/favorite`, action); // Send request to favorite/unfavorite

    // Update the user store based on the new status
    if (isFavorited.value) {
      userStore.removeFavorite(props.postId); // Remove from favorites in store
    } else {
      userStore.addFavorite(props.postId); // Add to favorites in store
    }

    // Emit an event to notify the parent component of the change
    emit("toggleFavorite", !isFavorited.value);
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
  }
};
</script>

<template>
  <button @click="toggleFavorite" class="favorite-btn">
    <span v-if="isFavorited">❤️</span>
    <span v-else>🤍</span>
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
