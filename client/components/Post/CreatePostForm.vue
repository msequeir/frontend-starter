<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const tags = ref("");
const rating = ref(0); // Rating as number
const itineraryId = ref("");
const imageUrls = ref<string[]>([]);
const newImageUrl = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async () => {
  try {
    // Send only the first image URL to the backend
    await fetchy("/api/posts", "POST", {
      body: {
        title: title.value,
        tags: tags.value,
        rating: rating.value,
        itineraryId: itineraryId.value,
        imageUrl: imageUrls.value[0],
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const addImageUrl = () => {
  if (newImageUrl.value) {
    imageUrls.value.push(newImageUrl.value);
    newImageUrl.value = "";
  }
};

const removeImageUrl = (url: string) => {
  imageUrls.value = imageUrls.value.filter((img) => img !== url);
};

const emptyForm = () => {
  title.value = "";
  tags.value = "";
  rating.value = 0;
  itineraryId.value = "";
  imageUrls.value = [];
};

// Function to set rating based on the star clicked
const setRating = (stars: number) => {
  rating.value = stars;
};
</script>

<template>
  <form @submit.prevent="createPost">
    <label for="title">Title:</label>
    <input id="title" v-model="title" placeholder="Post title" required />

    <label for="tags">Tags:</label>
    <input id="tags" v-model="tags" placeholder="Tags (comma-separated)" />

    <label for="rating">Rating:</label>
    <div class="star-rating">
      <span v-for="star in 5" :key="star" @click="setRating(star)" class="star">
        {{ star <= rating ? "★" : "☆" }}
      </span>
    </div>

    <label for="itineraryId">Itinerary Id:</label>
    <input id="itineraryId" v-model="itineraryId" placeholder="Itinerary Id" required />

    <label for="newImageUrl">Image URL:</label>
    <input id="newImageUrl" v-model="newImageUrl" placeholder="Add only 1 image URL" @keyup.enter="addImageUrl" />
    <button type="button" @click="addImageUrl">Add Image</button>

    <div>
      <h4>Image URLs:</h4>
      <ul>
        <li v-for="url in imageUrls" :key="url">
          {{ url }}
          <button type="button" @click="removeImageUrl(url)">Remove</button>
        </li>
      </ul>
    </div>

    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: #f9f9f9; /* Light background for contrast */
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em; /* Increased gap for better spacing */
  padding: 2em; /* More padding for a spacious feel */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  font-family: "Poppins", sans-serif; /* Set the preferred font */
}

h4 {
  margin-top: 1em; /* Margin for the heading */
  color: #264653; /* Darker teal for headings */
  font-family: "Poppins", sans-serif; /* Set the preferred font */
}

label {
  font-weight: bold; /* Bold labels for clarity */
  color: #264653; /* Darker teal for labels */
  font-family: "Poppins", sans-serif; /* Set the preferred font */
}

input {
  padding: 0.8em; /* Padding for input fields */
  border: 1px solid #e0e0e0; /* Light border for inputs */
  border-radius: 0.5em; /* Rounded corners for inputs */
  font-size: 1em; /* Consistent font size */
  width: 100%; /* Full width for inputs */
  font-family: "Poppins", sans-serif; /* Set the preferred font */
}

input::placeholder {
  color: #b0b0b0; /* Light gray for placeholder text */
}

.star-rating {
  display: inline-flex;
  font-size: 2em; /* Larger stars for visibility */
  cursor: pointer;
}

.star {
  color: gold;
}

.star:hover,
.star-rating:hover .star {
  color: orange; /* Hover effect for stars */
}

button {
  padding: 0.8em 1.5em; /* Padding for buttons */
  background-color: #2a9d8f; /* Primary button color */
  color: white; /* Text color */
  border: none; /* No border */
  border-radius: 0.5em; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s; /* Smooth transition for background color */
  font-family: "Poppins", sans-serif; /* Set the preferred font */
}

button:hover {
  background-color: #264653; /* Darker color on hover */
}

ul {
  list-style-type: none; /* No bullet points for list */
  padding: 0; /* Remove default padding */
  margin: 0; /* Remove default margin */
}

li {
  display: flex; /* Flexbox for list items */
  justify-content: space-between; /* Space between text and button */
  align-items: center; /* Center alignment */
  padding: 0.5em 0; /* Padding for list items */
}

li button {
  background-color: #e76f51; /* Red color for remove buttons */
}

li button:hover {
  background-color: #c56d4f; /* Darker red on hover */
}
</style>
