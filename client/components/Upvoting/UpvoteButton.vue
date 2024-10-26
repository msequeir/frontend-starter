<script setup lang="ts">
import { useUpvoteStore } from "@/stores/upvoting";
import { onMounted } from "vue";

const props = defineProps(["postId"]);
const upvoteStore = useUpvoteStore();

// Load the upvote status when component mounts
onMounted(async () => {
  await upvoteStore.loadUpvoteStatus(props.postId);
});

const toggleUpvote = async () => {
  await upvoteStore.toggleUpvote(props.postId);
};
</script>

<template>
  <button @click="toggleUpvote">
    <span v-if="upvoteStore.upvotes[props.postId]?.hasUpvoted" class="highlighted"> 👍 {{ upvoteStore.upvotes[props.postId]?.count }} </span>
    <span v-else> 👍 {{ upvoteStore.upvotes[props.postId]?.count }} </span>
  </button>
</template>

<style scoped>
.highlighted {
  color: blue;
}
</style>
