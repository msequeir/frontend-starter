<template>
  <button @click="toggleUpvote">
    <span v-if="upvoteStore.upvotes[props.postId]?.hasUpvotedByUser.has(userStore.currentUsername)" class="highlighted"> 👍 {{ upvoteStore.upvotes[props.postId]?.count }} </span>
    <span v-else> 👍 {{ upvoteStore.upvotes[props.postId]?.count }} </span>
  </button>
</template>

<script setup lang="ts">
import { useUpvoteStore } from "@/stores/upvoting";
import { useUserStore } from "@/stores/user"; // Import user store
import { onMounted } from "vue";

const props = defineProps(["postId"]);
const upvoteStore = useUpvoteStore();
const userStore = useUserStore(); // Access the user store

// Load the upvote status when component mounts
onMounted(async () => {
  await upvoteStore.loadUpvoteStatus(props.postId, userStore.currentUsername); // Pass current username
});

const toggleUpvote = async () => {
  await upvoteStore.toggleUpvote(props.postId, userStore.currentUsername); // Pass current username
};
</script>

<style scoped>
.highlighted {
  color: blue; /* Change this to your preferred highlight color */
}
</style>
