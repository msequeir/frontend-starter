<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="logo">
        <RouterLink :to="{ name: 'Home' }">
          <img src="@/assets/images/wanderylogo.webp" />
        </RouterLink>
      </div>
      <div class="create-post" v-if="isLoggedIn">
        <RouterLink :to="{ name: 'CreatePost' }" :class="{ underline: currentRouteName == 'CreatePost' }"> Create Post </RouterLink>
      </div>
      <div class="title">
        <RouterLink :to="{ name: 'Home' }">
          <h1>Wanderly</h1>
        </RouterLink>
      </div>
      <div class="nav-links">
        <ul>
          <li v-if="isLoggedIn">
            <RouterLink :to="{ name: 'Favorites' }" :class="{ underline: currentRouteName == 'Favorites' }"> Favorites ❤️ </RouterLink>
            <RouterLink :to="{ name: 'Itinerary' }" :class="{ underline: currentRouteName == 'Itinerary' }"> Itinerary </RouterLink>
            <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
          </li>
          <li v-else>
            <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
          </li>
        </ul>
      </div>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"); /* Import Poppins font */

nav {
  padding: 1.5em 2.5em;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 2px solid #e0e0e0;
}

.logo {
  margin-right: 1em; /* Add spacing between logo and Create Post */
}

.create-post {
  margin-right: 1em; /* Add spacing between Create Post and title */
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

h1 {
  font-size: 2.5em;
  margin: 0;
  color: #2a9d8f;
  font-family: "Lobster", cursive; /* Title font */
}

img {
  height: 3em;
}

a {
  font-size: large;
  color: #264653;
  text-decoration: none;
  transition: color 0.3s;
  font-family: "Poppins", sans-serif; /* Fun font for links */
}

a:hover {
  color: #e76f51;
}

.nav-links {
  margin-left: auto; /* Align links to the right */
}

ul {
  list-style-type: none;
  display: flex; /* Flexbox for horizontal alignment */
  gap: 2em; /* Spacing between links */
}

li {
  position: relative;
}

li:not(:last-child)::after {
  content: "";
  display: inline-block;
  width: 1px;
  height: 20px;
  background-color: #dee2e6;
  margin-left: 1em;
}

.underline {
  text-decoration: underline;
}

.toast {
  background: rgba(255, 255, 204, 0.9);
  padding: 1em;
  border-radius: 10px;
  margin: 1em 2.5em;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s ease-in-out;
}
</style>
