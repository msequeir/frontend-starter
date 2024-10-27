<script setup lang="ts">
import FavoritePostListComponent from "@/components/Favorite/FavoritePostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

// Access user store values
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main class="favorites-main">
    <h1 class="page-title">Favorites Page</h1>

    <section class="welcome-section">
      <h2 v-if="isLoggedIn"></h2>
      <h2 v-else>Please login to view your favorite posts</h2>
    </section>

    <FavoritePostListComponent v-if="isLoggedIn" />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #e0f7f1; /* Use the same color as other pages */
  min-height: 100vh;
}

h1 {
  text-align: center;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
