<script setup lang="ts">
import ItineraryListComponent from "@/components/Itinerary/ItineraryListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Itineraries</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <ItineraryListComponent />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  background-color: #f9f9f9; /* Light background color for the page */
}

h1 {
  text-align: center;
  margin-bottom: 1em;
  color: #264653; /* Color matching your link colors */
  font-family: "Poppins", sans-serif; /* Fun font for headings */
}

section {
  background: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
  border-radius: 8px;
  padding: 2em;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
  margin-bottom: 2em;
}

h1[v-if="isLoggedIn"],
h1[v-else] {
  color: #2a9d8f; /* Accent color for welcome messages */
}

ItineraryListComponent {
  width: 100%;
  max-width: 800px; /* Limit the width of the itinerary list for better readability */
}
</style>
