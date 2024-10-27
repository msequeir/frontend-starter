<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

// Access the user store to check if the user is logged in
const { isLoggedIn } = storeToRefs(useUserStore());

// Define reactive states for loading and managing posts, editing status, and search filters
const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");
let searchTitle = ref("");

async function getPosts(author?: string, title?: string) {
  let query: Record<string, string>;

  if (author !== undefined && title !== undefined) {
    query = { author, title };
  } else if (author !== undefined) {
    query = { author };
  } else if (title !== undefined) {
    query = { title };
  } else query = {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
    if (author !== undefined || title !== undefined) {
      postResults = postResults.reverse();
    }
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  searchTitle.value = title ? title : "";
  posts.value = postResults;
}

// Function to update the post currently being edited
function updateEditing(id: string) {
  editing.value = id;
}

// Fetch posts when the component is mounted
onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <!-- Search bar and header -->
  <div class="row">
    <h2 v-if="!searchAuthor && !searchTitle">Posts:</h2>
    <h2 v-else>
      Posts by {{ searchAuthor }} <span v-if="searchTitle">with title "{{ searchTitle }}"</span>:
    </h2>
    <SearchPostForm @getPostsByAuthorAndTitle="getPosts" />
  </div>

  <!-- Posts section displaying each post, with edit functionality -->
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <!-- Conditionally show either PostComponent or EditPostForm based on editing state -->
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
    </article>
  </section>

  <!-- No posts found message -->
  <p v-else-if="loaded" class="no-posts">No posts found</p>

  <!-- Loading state -->
  <p v-else>Loading...</p>
</template>

<style scoped>
body {
  background-image: url("https://your-image-url.com/background.jpg"); /* Replace with a relaxing travel-themed background image */
  background-size: cover;
  background-position: center;
  color: #4a4a4a; /* Soft text color */
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 20px; /* Add padding for spacing */
  background: rgba(255, 255, 255, 0.8); /* Light translucent background for readability */
  border-radius: 15px; /* Rounded corners */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Soft shadow effect */
}

h2 {
  color: #2c3e50; /* Darker color for headers */
  font-family: "Poppins", sans-serif; /* Use Poppins font for headers */
}

.no-posts {
  font-family: "Poppins", sans-serif; /* Consistent font for no posts message */
  color: #555; /* Color for no posts message */
  text-align: center; /* Center the message */
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: #ffffff; /* White background for individual posts */
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  transition: transform 0.2s; /* Smooth transition for hover effect */
}

article:hover {
  transform: scale(1.02); /* Slight scaling effect on hover */
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
