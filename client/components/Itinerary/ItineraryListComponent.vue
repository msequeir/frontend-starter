<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateItineraryForm from "./CreateItineraryForm.vue";
import EditItineraryForm from "./EditItineraryForm.vue";
import ItineraryComponent from "./ItineraryComponent.vue";
import SearchItineraryForm from "./SearchItineraryForm.vue";

// Access the user store to check if the user is logged in
const { isLoggedIn } = storeToRefs(useUserStore());

// Define reactive states for loading and managing itinerary, editing status, and search filters
const loaded = ref(false);
let itineraries = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getItineraries(author?: string) {
  let query: Record<string, string>;

  if (author !== undefined) {
    query = { author };
  } else query = {};
  let itineraryResults;
  try {
    itineraryResults = await fetchy("/api/itineraries", "GET", { query });
    itineraryResults = itineraryResults.reverse();
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  itineraries.value = itineraryResults;
}

// Function to update the itinerary currently being edited
function updateEditing(id: string) {
  editing.value = id;
}

// Fetch itineraries when the component is mounted
onBeforeMount(async () => {
  await getItineraries();
  loaded.value = true;
});
</script>

<template>
  <!-- Section to create an itinerary, only visible if the user is logged in -->
  <section v-if="isLoggedIn" class="create-itinerary">
    <h2 class="section-header">Create an Itinerary:</h2>
    <CreateItineraryForm @refreshItineraries="getItineraries" />
  </section>

  <!-- Search bar and header -->
  <div class="row">
    <h2 v-if="!searchAuthor" class="header-title">Itineraries:</h2>
    <h2 v-else class="header-title">Itineraries by {{ searchAuthor }}:</h2>
    <SearchItineraryForm @getItineraryByAuthor="getItineraries" />
  </div>

  <!-- Itineraries section displaying each itinerary, with edit functionality -->
  <section class="itineraries" v-if="loaded && itineraries.length !== 0">
    <article v-for="itinerary in itineraries" :key="itinerary._id" class="itinerary-card">
      <!-- Conditionally show either ItineraryComponent or EditItineraryForm based on editing state -->
      <ItineraryComponent v-if="editing !== itinerary._id" :itinerary="itinerary" @refreshItineraries="getItineraries" @editItinerary="updateEditing" />
      <EditItineraryForm v-else :itinerary="itinerary" @refreshItineraries="getItineraries" @editItinerary="updateEditing" />
    </article>
  </section>

  <!-- No itineraries found message -->
  <p v-else-if="loaded" class="no-itineraries">No itineraries found</p>

  <!-- Loading state -->
  <p v-else class="loading">Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 80em; /* Increased width for better use of space */
  padding: 1em; /* Padding for better spacing */
}

.create-itinerary {
  width: 100%; /* Take full width */
  background-color: #f0f8ff; /* Light background color for distinction */
  border-radius: 0.5em; /* Rounded corners */
  padding: 2em; /* More padding for emphasis */
  margin-bottom: 2em; /* Space below this section */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

.header-title {
  color: #264653; /* Color to match your theme */
  font-size: 1.5em; /* Larger font size for headers */
  font-weight: bold;
  margin-bottom: 0.5em; /* Spacing below the header */
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Center align items vertically */
}

.itinerary-card {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em; /* Increased gap for better spacing */
  padding: 1.5em; /* More padding for better content visibility */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

.itineraries {
  padding: 1em 0; /* Vertical padding for the itineraries section */
}

.no-itineraries,
.loading {
  text-align: center; /* Center the text */
  font-size: 1.2em; /* Larger font size for better visibility */
  color: #e76f51; /* Accent color for messages */
}
</style>
