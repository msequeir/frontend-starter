<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const collaborators = ref<string[]>([]); // Change to array

const emit = defineEmits(["refreshItineraries"]);

const createItinerary = async () => {
  try {
    // Send only the first collaborator to the backend
    await fetchy("/api/itineraries", "POST", {
      body: {
        content: content.value,
        collaborators: collaborators.value[0], // Send the first collaborator
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
  collaborators.value = []; // Reset collaborators
};
</script>

<template>
  <form @submit.prevent="createItinerary" class="create-itinerary-form">
    <label for="content" class="form-label">Content:</label>
    <textarea id="content" v-model="content" placeholder="Enter your itinerary content..." required></textarea>
    <button type="submit" class="submit-button">Create Itinerary</button>
  </form>
</template>

<style scoped>
.create-itinerary-form {
  background-color: #f4f4f4;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 2em;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  font-family: "Poppins", sans-serif;
}

.form-label {
  font-size: 1.1em;
  font-weight: 600;
  color: #2a9d8f;
  margin-bottom: 0.25em;
}

textarea {
  font-size: 1em;
  padding: 0.75em;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;
  transition: border-color 0.3s;
  width: 100%;
}

textarea:focus {
  border-color: #2a9d8f;
  outline: none;
}

.submit-button {
  background-color: #2a9d8f;
  color: #fff;
  padding: 0.8em 1.4em;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #e76f51;
}
</style>
