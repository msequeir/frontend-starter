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
  <form @submit.prevent="handleSubmit" class="pure-form">
    <fieldset>
      <legend>Search by Author</legend>

      <!-- Label and Input for Author -->
      <label for="author">Author</label>
      <input id="author" type="text" v-model="author" placeholder="Username" />

      <!-- Submit Button -->
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}

label {
  margin-right: 0.5em;
}
</style>
