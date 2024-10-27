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
  <button @click="toggleFavorite" :class="{ favorited: isFavorited, 'favorite-btn': true }">
    <span>{{ isFavorited ? "❤️" : "🤍" }}</span>
  </button>
</template>

<style scoped>
.favorite-btn {
  cursor: pointer;
  font-size: 1.8em; /* Slightly larger font for better visibility */
  padding: 0.3em;
  border: none;
  background: none;
  transition:
    transform 0.2s ease,
    color 0.2s ease; /* Smooth transition for scale and color */
}

.favorite-btn:hover {
  transform: scale(1.2); /* Scale up on hover for a subtle effect */
}

.favorited {
  color: #e63946; /* Red color when favorited */
}
</style>
