<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const tags = ref("");
const rating = ref(0);
const itineraryId = ref("");
const imageUrls = ref<string[]>([]); // Change to array
const newImageUrl = ref(""); // Temporary storage for new image URL input
const emit = defineEmits(["refreshPosts"]);

const createPost = async () => {
  try {
    // Send only the first image URL to the backend
    await fetchy("/api/posts", "POST", {
      body: {
        title: title.value,
        tags: tags.value,
        rating: rating.value,
        itineraryId: itineraryId.value,
        imageUrl: imageUrls.value[0], // Send the first URL need to add with edit as in be
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const addImageUrl = () => {
  if (newImageUrl.value) {
    imageUrls.value.push(newImageUrl.value); // Add new image URL to the array
    newImageUrl.value = ""; // Clear the input
  }
};

const removeImageUrl = (url: string) => {
  imageUrls.value = imageUrls.value.filter((img) => img !== url); // Remove image URL
};

const emptyForm = () => {
  title.value = "";
  tags.value = "";
  rating.value = 0;
  itineraryId.value = "";
  imageUrls.value = []; // Reset to empty array
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

    <label for="itineraryId">Itinerary Id:</label>
    <input id="itineraryId" v-model="itineraryId" placeholder="Itinerary Id" required />

    <label for="newImageUrl">Image URL:</label>
    <input id="newImageUrl" v-model="newImageUrl" placeholder="Add Image URL" @keyup.enter="addImageUrl" />
    <button type="button" @click="addImageUrl">Add Image</button>

    <div>
      <h4>Image URLs:</h4>
      <ul>
        <li v-for="url in imageUrls" :key="url">{{ url }} <button type="button" @click="removeImageUrl(url)">Remove</button></li>
      </ul>
    </div>

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
