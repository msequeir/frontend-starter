<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

// Access user store values
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main class="home-main">
    <!-- <h1 class="main-title">Home Page</h1> -->

    <section class="main-title">
      <h1 v-if="isLoggedIn" class="welcome-message">Welcome, {{ currentUsername }}!</h1>
      <h1 v-else class="login-message">Please log in to see the posts</h1>
    </section>

    <PostListComponent />
  </main>
</template>

<style scoped>
.home-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5em;
  background-color: #e0f7f1; /* Light and clean background */
  min-height: 100vh;
}

.main-title {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 1em;
}

.welcome-section {
  margin-bottom: 2em;
}

.welcome-message,
.login-message {
  font-size: 1.5em;
  color: #6fc5d6; /* Light blue text */
  text-align: center;
  margin: 0.5em 0;
}
</style>
