import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUsername = ref("");
    const favoritePosts = ref<string[]>([]); // Add state to track favorite posts

    const isLoggedIn = computed(() => currentUsername.value !== "");

    const resetStore = () => {
      currentUsername.value = "";
      favoritePosts.value = []; // Reset favorite posts on logout
    };

    const createUser = async (username: string, password: string) => {
      await fetchy("/api/users", "POST", {
        body: { username, password },
      });
    };

    const loginUser = async (username: string, password: string) => {
      await fetchy("/api/login", "POST", {
        body: { username, password },
      });
    };

    const updateSession = async () => {
      try {
        const { username, favorites } = await fetchy("/api/session", "GET", { alert: false });
        currentUsername.value = username;
        favoritePosts.value = favorites || []; // Set initial favorite posts from session data
      } catch {
        currentUsername.value = "";
        favoritePosts.value = []; // Clear favorites if session update fails
      }
    };

    const logoutUser = async () => {
      await fetchy("/api/logout", "POST");
      resetStore();
    };

    const updateUserUsername = async (username: string) => {
      await fetchy("/api/users/username", "PATCH", { body: { username } });
    };

    const updateUserPassword = async (currentPassword: string, newPassword: string) => {
      await fetchy("/api/users/password", "PATCH", { body: { currentPassword, newPassword } });
    };

    const deleteUser = async () => {
      await fetchy("/api/users", "DELETE");
      resetStore();
    };

    const addFavorite = (postId: string | undefined) => {
      if (postId) {
        if (!favoritePosts.value.includes(postId)) {
          favoritePosts.value.push(postId); // Add to favorites
        }
      }
    };

    const removeFavorite = (postId: string | undefined) => {
      favoritePosts.value = favoritePosts.value.filter((id) => id !== postId); // Remove from favorites
    };

    const isPostFavorited = (postId: string | undefined) => {
      if (postId) {
        return favoritePosts.value.includes(postId); // Check if a post is favorited
      }
    };

    return {
      currentUsername,
      isLoggedIn,
      favoritePosts,
      createUser,
      loginUser,
      updateSession,
      logoutUser,
      updateUserUsername,
      updateUserPassword,
      deleteUser,
      addFavorite,
      removeFavorite,
      isPostFavorited,
    };
  },
  { persist: true },
);
