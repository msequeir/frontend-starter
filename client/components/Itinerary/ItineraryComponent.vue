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
  <p class="itinerary">{{ props.itinerary.content }}</p>
  <div class="base">
    <menu v-if="props.itinerary.author == currentUsername || props.itinerary.collaborators.includes(currentUsername)">
      <li><button class="btn-small pure-button" @click="emit('editItinerary', props.itinerary._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteItinerary">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.itinerary.dateCreated !== props.itinerary.dateUpdated">Edited on: {{ formatDate(props.itinerary.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.itinerary.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.itinerary {
  font-weight: bolder;
  font-size: 1.2em;
  /* text-align: center; */
}
.author {
  font-weight: bold;
  font-size: 1.2em;
}

.image-container {
  width: 500px;
  height: 500px;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
