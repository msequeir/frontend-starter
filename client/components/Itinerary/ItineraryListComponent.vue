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
  } catch (_) {
    return;
  }
  console.log(useUserStore());
  console.log(itineraryResults);
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
  <section v-if="isLoggedIn">
    <h2>Create an Itinerary:</h2>
    <CreateItineraryForm @refreshItineraries="getItineraries" />
  </section>

  <!-- Search bar and header -->
  <div class="row">
    <h2 v-if="!searchAuthor">Itineraries:</h2>
    <h2 v-else>Itineraries by {{ searchAuthor }}:</h2>
    <SearchItineraryForm @getItineraryByAuthor="getItineraries" />
  </div>

  <!-- Itineraries section displaying each itinerary, with edit functionality -->
  <section class="itineraries" v-if="loaded && itineraries.length !== 0">
    <article v-for="itinerary in itineraries" :key="itinerary._id">
      <!-- Conditionally show either ItineraryComponent or EditItineraryForm based on editing state -->
      <ItineraryComponent v-if="editing !== itinerary._id" :itinerary="itinerary" @refreshItineraries="getItineraries" @editItinerary="updateEditing" />
      <EditItineraryForm v-else :itinerary="itinerary" @refreshItineraries="getItineraries" @editItinerary="updateEditing" />
    </article>
  </section>

  <!-- No itineraries found message -->
  <p v-else-if="loaded">No itineraries found</p>

  <!-- Loading state -->
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.itineraries {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
