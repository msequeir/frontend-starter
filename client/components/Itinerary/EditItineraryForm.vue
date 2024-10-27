<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["itinerary"]);
const content = ref(props.itinerary.content);
const newCollaborator = ref(""); // Field for adding a collaborator username or ID
const collaborators = ref([...props.itinerary.collaborators]); // Holds the current collaborators

const emit = defineEmits(["editItinerary", "refreshItineraries"]);

const editItinerary = async () => {
  try {
    // Send updated content and collaborators to backend
    await fetchy(`/api/itineraries/${props.itinerary._id}`, "PATCH", {
      body: {
        content: content.value,
        collaboratorId: newCollaborator.value || null, // Only send if not empty
      },
    });

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
  <form @submit.prevent="editItinerary" class="edit-itinerary-form">
    <p class="author">{{ props.itinerary.author }}</p>
    <p class="itinerary-id">Itinerary Id: {{ props.itinerary._id }}</p>

    <label for="newCollaborator" class="form-label">Add Collaborator (ID or Username):</label>
    <input id="newCollaborator" v-model="newCollaborator" placeholder="Collaborator ID or Username" class="collaborator-input" />

    <div>
      <h4>Collaborators:</h4>
      <ul class="collaborators-list">
        <li v-for="collaborator in collaborators" :key="collaborator">
          {{ collaborator }}
        </li>
      </ul>
    </div>

    <label for="content" class="form-label">Content:</label>
    <textarea id="content" v-model="content" placeholder="Content" required></textarea>

    <div class="form-footer">
      <menu class="button-group">
        <li><button class="save-button" type="submit">Save</button></li>
        <li><button class="cancel-button" @click="emit('editItinerary')">Cancel</button></li>
      </menu>
      <p v-if="props.itinerary.dateCreated !== props.itinerary.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.itinerary.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.itinerary.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
.edit-itinerary-form {
  background-color: #f4f4f4;
  border-radius: 12px;
  padding: 2em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: "Poppins", sans-serif;
}

.author,
.itinerary-id {
  font-weight: bold;
  color: #2a9d8f;
  font-size: 1.1em;
}

.form-label {
  font-size: 1em;
  font-weight: 600;
  color: #2a9d8f;
  margin-bottom: 0.25em;
}

.collaborator-input,
textarea {
  font-size: 1em;
  padding: 0.75em;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  transition: border-color 0.3s;
}

textarea {
  height: 8em;
  resize: none;
}

textarea:focus,
.collaborator-input:focus {
  border-color: #2a9d8f;
  outline: none;
}

.collaborators-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 1em;
  list-style-type: none;
  padding: 0;
}

.save-button,
.cancel-button {
  padding: 0.8em 1.4em;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button {
  background-color: #2a9d8f;
  color: #fff;
  border: none;
}

.save-button:hover {
  background-color: #e76f51;
}

.cancel-button {
  background-color: #ccc;
  color: #333;
  border: none;
}

.cancel-button:hover {
  background-color: #bbb;
}

.timestamp {
  font-size: 0.9em;
  font-style: italic;
  color: #555;
}
</style>
