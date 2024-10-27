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
  } catch (e) {
    console.error("Failed to delete itinerary:", e);
    return;
  }
  emit("refreshItineraries");
};
</script>

<template>
  <div class="itinerary-card">
    <p class="itinerary-content">{{ props.itinerary.content }}</p>
    <div class="action-bar">
      <menu v-if="props.itinerary.author === currentUsername || props.itinerary.collaborators.includes(currentUsername)">
        <li>
          <button class="edit-button" @click="emit('editItinerary', props.itinerary._id)">Edit</button>
        </li>
        <li>
          <button class="delete-button" @click="deleteItinerary">Delete</button>
        </li>
      </menu>
      <div class="timestamp">
        <p v-if="props.itinerary.dateCreated !== props.itinerary.dateUpdated">Edited on: {{ formatDate(props.itinerary.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.itinerary.dateCreated) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.itinerary-card {
  background-color: #f4f4f4;
  border-radius: 12px;
  padding: 1.5em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5em;
  font-family: "Poppins", sans-serif;
}

.itinerary-content {
  font-weight: bold;
  font-size: 1.2em;
  color: #2a9d8f;
  margin-bottom: 1em;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

menu {
  display: flex;
  gap: 1em;
  list-style: none;
  padding: 0;
  margin: 0;
}

.edit-button,
.delete-button {
  padding: 0.6em 1.2em;
  font-size: 1em;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #2a9d8f;
  color: #fff;
  border: none;
}

.edit-button:hover {
  background-color: #21867a;
}

.delete-button {
  background-color: #e76f51;
  color: #fff;
  border: none;
}

.delete-button:hover {
  background-color: #d65c41;
}

.timestamp {
  font-size: 0.9em;
  font-style: italic;
  color: #6c757d;
}
</style>
