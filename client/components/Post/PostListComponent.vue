<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
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
  <!-- Section to create a post, only visible if the user is logged in -->
  <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
    <CreatePostForm @refreshPosts="getPosts" />
  </section>

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
  <p v-else-if="loaded">No posts found</p>

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
