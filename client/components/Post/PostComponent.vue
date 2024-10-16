<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

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
</script>

<template>
  <p class="title">{{ props.post.title }}</p>
  <!-- Display image URLs as images-->
  <div v-if="props.post.imageUrls && props.post.imageUrls.length > 0" class="post-images">
    <div v-for="(url, index) in props.post.imageUrls" :key="index" class="image-container">
      <img :src="url" alt="Post image" class="post-image" />
    </div>
  </div>

  <p class="author">{{ props.post.author }}</p>
  <p class="tags">Tags: {{ props.post.tags }}</p>
  <p class="rating">Rating: {{ props.post.rating }}</p>
  <p class="itineraryId">{{ props.post.itineraryId }}</p>
  <p>{{ props.post.content }}</p>
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
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
