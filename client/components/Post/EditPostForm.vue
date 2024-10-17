<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const title = ref(props.post.title);
const tags = ref(props.post.tags);
const rating = ref(props.post.rating);
const itineraryId = ref(props.post.itineraryId);
const addImage = ref(""); // Field for adding an image
const removeImage = ref(""); // Field for removing an image
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", {
      body: {
        title: title.value,
        tags: tags.value,
        rating: rating.value,
        itineraryId: itineraryId.value,
        addImage: addImage.value ? addImage.value : "", // Only send if non-empty
        removeImage: removeImage.value ? removeImage.value : "", // Only send if non-empty
      },
    });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="editPost()">
    <p class="author">{{ props.post.author }}</p>

    <label for="title">Title:</label>
    <input id="title" v-model="title" placeholder="Post title" required />

    <label for="tags">Tags:</label>
    <input id="tags" v-model="tags" placeholder="Tags (comma-separated)" />

    <label for="rating">Rating (0-5):</label>
    <input id="rating" type="number" v-model="rating" min="0" max="5" required />

    <label for="itineraryId">Itinerary Id:</label>
    <input id="itineraryId" v-model="itineraryId" placeholder="Itinerary Id" required />

    <label for="addImage">Add Image URL:</label>
    <input id="addImage" v-model="addImage" placeholder="Add image URL" />

    <label for="removeImage">Remove Image URL:</label>
    <input id="removeImage" v-model="removeImage" placeholder="Remove image URL" />

    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
