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
    <label for="content">Content:</label>
    <textarea id="content" v-model="content" placeholder="Enter your itinerary content..." required></textarea>
    <button type="submit" class="pure-button-primary">Create Itinerary</button>
  </form>
</template>

<style scoped>
.create-itinerary-form {
  background-color: #f9f9f9; /* Light background color for the form */
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1.5em;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  max-width: 100%; /* Change to 100% to take full width of the parent */
  width: 100%; /* Ensures the form takes full available width */
  margin: 0 auto; /* Center the form on the page */
}

label {
  font-size: 1.2em; /* Larger font size for the label */
  color: #264653; /* Color that matches your theme */
}

textarea {
  font-family: inherit;
  font-size: 1em;
  height: 10em; /* Increased height for better content visibility */
  padding: 0.75em; /* Increased padding for comfort */
  border: 1px solid #dee2e6; /* Border for input areas */
  border-radius: 4px;
  resize: none; /* Prevent resizing */
  transition: border-color 0.3s; /* Smooth transition for focus state */
  width: 100%; /* Ensure the textarea takes full width */
}

textarea:focus {
  border-color: #2a9d8f; /* Accent color on focus */
  outline: none; /* Remove default outline */
}

button {
  background-color: #2a9d8f; /* Accent color for buttons */
  color: white; /* White text for buttons */
  padding: 0.7em 1.2em; /* Padding for better button size */
  border: none; /* Remove default border */
  border-radius: 4px; /* Rounded corners */
  font-size: 1em; /* Consistent font size */
  cursor: pointer; /* Pointer cursor for buttons */
  transition: background-color 0.3s; /* Smooth transition for hover state */
}

button:hover {
  background-color: #e76f51; /* Darker shade on hover */
}
</style>
