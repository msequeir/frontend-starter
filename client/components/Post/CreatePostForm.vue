<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const tags = ref("");
const rating = ref(0);
const itineraryId = ref("");
const imageUrl = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async () => {
  try {
    await fetchy("/api/posts", "POST", {
      body: { title: title.value, tags: tags.value, rating: rating.value, itineraryId: itineraryId.value, imageUrl: imageUrl.value },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  tags.value = "";
  rating.value = 0;
  itineraryId.value = "";
  imageUrl.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost">
    <label for="title">Title:</label>
    <input id="title" v-model="title" placeholder="Post title" required />

    <label for="tags">Tags:</label>
    <input id="tags" v-model="tags" placeholder="Tags (comma-separated)" />

    <label for="rating">Rating (0-5):</label>
    <input id="rating" type="number" v-model="rating" min="0" max="5" required />

    <label for="itineraryId">Itinerary ID:</label>
    <input id="itineraryId" v-model="itineraryId" placeholder="Itinerary ID" required />

    <label for="imageUrl">Image URL:</label>
    <input id="imageUrl" v-model="imageUrl" placeholder="Image URL" />

    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
