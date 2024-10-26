<script setup lang="ts">
import { ref } from "vue";

// Define reactive references for author and title
const author = ref("");
const title = ref("");

// Define an emit function for sending data to the parent component
const emit = defineEmits(["getPostsByAuthorAndTitle"]);

// Function to handle form submission
function handleSubmit() {
  if (author.value || title.value) {
    emit("getPostsByAuthorAndTitle", author.value, title.value);
  } else {
    emit("getPostsByAuthorAndTitle");
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="search-form">
    <fieldset>
      <legend>Search by Author and Title</legend>

      <!-- Label and Input for Author -->
      <label for="author" class="form-label">Author</label>
      <input id="author" type="text" v-model="author" placeholder="Username" class="form-input" />

      <!-- Label and Input for Title -->
      <label for="title" class="form-label">Title</label>
      <input id="title" type="text" v-model="title" placeholder="Title" class="form-input" />

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
  background-color: #e0f7f1; /* Light mint green background */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.form-label {
  margin-bottom: 0.5em;
  font-weight: bold;
  color: #555; /* Slightly darker text for labels */
}

.form-input {
  padding: 0.5em;
  border: 1px solid #ccc; /* Light border */
  border-radius: 4px; /* Rounded corners for input fields */
  font-family: "Poppins", sans-serif; /* Poppins font for input fields */
}

.search-button {
  background-color: #6fc5d6; /* Button color to match theme */
  color: white; /* Text color for button */
  padding: 0.5em 1em; /* Padding for button */
  border: none; /* Remove default border */
  border-radius: 4px; /* Rounded corners for button */
  cursor: pointer; /* Pointer cursor on hover */
  font-family: "Poppins", sans-serif; /* Poppins font for button */
}

.search-button:hover {
  background-color: #5bb3c0; /* Darker shade on hover */
}
</style>
