<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1 class="main-title">Home Page</h1>
    <section class="welcome-section">
      <h1 v-if="isLoggedIn" class="welcome-message">Welcome {{ currentUsername }}!</h1>
      <h1 v-else class="login-message">Please login!</h1>
    </section>
    <PostListComponent />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #e0f7f1; /* Change this to your preferred color */
  min-height: 100vh; /* Full height */
}

.main-title {
  font-size: 2.5em; /* Larger font size */
  color: #333; /* Darker text color */
  margin-bottom: 20px; /* Space below the title */
}

.welcome-section {
  margin-bottom: 40px; /* Space below the welcome section */
}

.welcome-message,
.login-message {
  font-size: 1.5em; /* Font size for the welcome/login messages */
  color: #6fc5d6; /* Light blue color */
  text-align: center;
  margin: 10px 0; /* Margin above and below the messages */
}
</style>
