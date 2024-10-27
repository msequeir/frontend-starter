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
          <button class="edit-button" @click="emit('editItinerary', props.itinerary._id)">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 16 16">
              <rect width="1.997" height="5.657" x="10.472" y="1.701" fill="#8852ff" transform="rotate(-45.001 11.47 4.53)"></rect>
              <polygon fill="#ffa62e" points="12.824,7.176 8.824,3.176 1,11 1,15 5,15"></polygon>
              <path fill="#e783d4" d="M11.172,0.828l-1.065,1.065l4,4l1.065-1.065c1.105-1.105,1.105-2.895,0-4l0,0 C14.067-0.276,12.276-0.276,11.172,0.828z"></path>
            </svg>
          </button>
        </li>
        <li>
          <button class="delete-button" @click="deleteItinerary">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 16 16">
              <polygon fill="#6a2eff" points="12,4 10,1 6,1 4,4"></polygon>
              <polygon fill="#9d70ff" points="13,15 3,15 1.5,4 14.5,4"></polygon>
              <rect width="14" height="2" x="1" y="2" fill="#6a2eff"></rect>
            </svg>
          </button>
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
