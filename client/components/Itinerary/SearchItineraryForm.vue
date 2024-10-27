<script setup lang="ts">
import { ref } from "vue";

// Define reactive references for author and title
const author = ref("");

// Define an emit function for sending data to the parent component
const emit = defineEmits(["getItineraryByAuthor"]);

// Function to handle form submission
function handleSubmit() {
  if (author.value) {
    emit("getItineraryByAuthor", author.value);
  } else {
    emit("getItineraryByAuthor");
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="search-form">
    <fieldset>
      <legend>Search by Author</legend>

      <!-- Label and Input for Author -->
      <label for="author">Author</label>
      <input id="author" type="text" v-model="author" placeholder="Username" />

      <!-- Submit Button -->
      <button type="submit" class="search-button">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
.search-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1.5em;
  background-color: #f7fafc; /* Light background color for emphasis */
  border-radius: 0.5em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

fieldset {
  display: flex;
  flex-direction: column;
  gap: 1em;
  border: none; /* Remove default border */
}

legend {
  font-size: 1.2em;
  font-weight: bold;
  color: #264653; /* Darker color for contrast */
  margin-bottom: 0.5em;
}

label {
  font-size: 1em;
  color: #264653; /* Consistent color scheme */
  margin-right: 0.5em;
}

input {
  padding: 0.5em;
  border: 1px solid #d1d5db;
  border-radius: 0.3em;
}

input:focus {
  outline: none;
  border-color: #2a9d8f; /* Highlight on focus */
  box-shadow: 0 0 5px rgba(42, 157, 143, 0.2);
}

.search-button {
  padding: 0.7em 1.2em;
  color: #ffffff;
  background-color: #2a9d8f; /* Consistent button color */
  border: none;
  border-radius: 0.3em;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #21867a; /* Darker shade on hover */
}
</style>
