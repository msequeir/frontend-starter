<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const collaborators = ref<string[]>([]); // Change to array

const emit = defineEmits(["refreshItineraries"]);

const createItinerary = async () => {
  try {
    // Send only the first image URL to the backend
    await fetchy("/api/itineraries", "POST", {
      body: {
        content: content.value,
        collaborators: collaborators.value[0], // Send the first URL need to add with edit as in be
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshItineraries");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createItinerary">
    <label for="content">Content:</label>
    <textarea id="content" v-model="content" placeholder="Content" required></textarea>

    <button type="submit" class="pure-button-primary pure-button">Create Itinerary</button>
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
