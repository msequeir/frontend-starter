<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["itinerary"]);
const content = ref(props.itinerary.content);

// Field for adding a collaborator username or ID
const newCollaborator = ref("");

// Holds the current collaborators (copying from props)
const collaborators = ref([...props.itinerary.collaborators]);

const emit = defineEmits(["editItinerary", "refreshItineraries"]);

const editItinerary = async () => {
  try {
    // Send updated content and collaborators to backend
    await fetchy(`/api/itineraries/${props.itinerary._id}`, "PATCH", {
      body: {
        content: content.value,
        collaboratorId: newCollaborator.value ? newCollaborator.value : null, // Only send if not empty
      },
    });

    // If a new collaborator was added, push it to the local list
    if (newCollaborator.value) {
      collaborators.value.push(newCollaborator.value);
      newCollaborator.value = ""; // Clear input after successful addition
    }
  } catch (e) {
    console.error("Failed to update itinerary:", e);
    return;
  }

  emit("editItinerary");
  emit("refreshItineraries");
};
</script>

<template>
  <form @submit.prevent="editItinerary()">
    <p class="author">{{ props.itinerary.author }}</p>
    Itinerary Id: {{ props.itinerary._id }}

    <label for="newCollaborator">Add Collaborator (ID or Username):</label>
    <input id="newCollaborator" v-model="newCollaborator" placeholder="CollaboratorId or Username" />

    <!-- List current collaborators -->
    <div>
      <h4>Collaborators:</h4>
      <ul>
        <li v-for="collaborator in collaborators" :key="collaborator">
          {{ collaborator }}
        </li>
      </ul>
    </div>

    <label for="content">Content:</label>
    <textarea id="content" v-model="content" placeholder="Content" required></textarea>

    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editItinerary')">Cancel</button></li>
      </menu>
      <p v-if="props.itinerary.dateCreated !== props.itinerary.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.itinerary.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.itinerary.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
