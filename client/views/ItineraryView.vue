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
      <h1 v-if="isLoggedIn"></h1>
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
  background-color: #ffffff; /* Updated to match the light and clean aesthetic */
}

h1 {
  text-align: center;
  margin-bottom: 1em;
  color: #264653; /* Color matching your link colors */
  font-family: "Poppins", sans-serif; /* Fun font for headings */
}

section {
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
