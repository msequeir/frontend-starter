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
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="pure-form">
    <fieldset>
      <legend>Search by Author and Title</legend>

      <!-- Label and Input for Author -->
      <label for="author">Author</label>
      <input id="author" type="text" v-model="author" placeholder="Username" />

      <!-- Label and Input for Title -->
      <label for="title">Title</label>
      <input id="title" type="text" v-model="title" placeholder="Title" />

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
