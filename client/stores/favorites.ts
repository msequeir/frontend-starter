// stores/favoriteStore.ts

import { defineStore } from "pinia";
import { ref } from "vue";

// Define the structure of a Post object directly in the component
interface Post {
  _id: string;
  title: string;
  author: string;
  imageUrls?: string[];
  tags: string[];
  rating: number;
  itineraryId: string;
  dateCreated: string;
  dateUpdated: string;
}

export const useFavoriteStore = defineStore("favoriteStore", () => {
  // State: A reactive array to store the favorite posts
  const favorites = ref<Post[]>([]);

  // Getter: Get all favorite posts
  const getFavorites = () => favorites.value;

  // Action: Add a post to the favorites list
  const addFavorite = (post: Post) => {
    // Check if the post is already in favorites
    const exists = favorites.value.find((favPost) => favPost._id === post._id);
    if (!exists) {
      favorites.value.push(post);
    }
  };

  // Action: Remove a post from the favorites list
  const removeFavorite = (postId: string) => {
    favorites.value = favorites.value.filter((post) => post._id !== postId);
  };

  // Action: Check if a post is already in the favorites list
  const isFavorite = (postId: string) => {
    return favorites.value.some((post) => post._id === postId);
  };

  return {
    favorites,
    getFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
});
