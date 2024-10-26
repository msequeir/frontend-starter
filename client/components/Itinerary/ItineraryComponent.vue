<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["itinerary"]);
const emit = defineEmits(["editItinerary", "refreshItineraries"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteItinerary = async () => {
  try {
    await fetchy(`/api/itineraries/${props.itinerary._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshItineraries");
};
</script>

<template>
  <div class="itinerary-card">
    <p class="itinerary">{{ props.itinerary.content }}</p>
    <div class="action-bar">
      <menu v-if="props.itinerary.author === currentUsername || props.itinerary.collaborators.includes(currentUsername)">
        <li><button class="btn-small pure-button" @click="emit('editItinerary', props.itinerary._id)">Edit</button></li>
        <li><button class="button-error btn-small pure-button" @click="deleteItinerary">Delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.itinerary.dateCreated !== props.itinerary.dateUpdated">Edited on: {{ formatDate(props.itinerary.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.itinerary.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.itinerary-card {
  background-color: var(--base-bg);
  border-radius: 1em;
  padding: 1.5em; /* Added padding for better spacing */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  margin-bottom: 1.5em; /* Space between itinerary cards */
}

p {
  margin: 0;
}

.itinerary {
  font-weight: bolder;
  font-size: 1.3em; /* Increased font size for better readability */
  margin-bottom: 1em; /* Spacing below the content */
}

.action-bar {
  display: flex;
  justify-content: space-between; /* Space between buttons and timestamp */
  align-items: center;
}

menu {
  list-style-type: none;
  display: flex;
  gap: 1em; /* Spacing between buttons */
  padding: 0;
  margin: 0;
}

.timestamp {
  font-size: 0.9em;
  font-style: italic;
  color: #6c757d; /* Subtle color for the timestamp */
}
</style>
