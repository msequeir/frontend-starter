// src/stores/upvoteStore.ts
import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";

export const useUpvoteStore = defineStore("upvoteStore", {
  state: () => ({
    upvotes: {} as Record<string, { count: number; hasUpvotedByUser: Set<string> }>,
  }),
  actions: {
    async loadUpvoteStatus(postId: string, currentUsername: string) {
      if (!this.upvotes[postId]) {
        // Fetch upvote count and users from backend
        const countResponse = await fetchy(`/api/posts/${postId}/upvote`, "GET");
        const upvoteCount = countResponse.upvotes;

        // Initialize the set of users who have upvoted
        const upvotedUsers = new Set<string>(countResponse.upvotedByUsers || []);

        // Check if current user has upvoted
        const hasUpvoted = upvotedUsers.has(currentUsername);

        this.upvotes[postId] = { count: upvoteCount, hasUpvotedByUser: upvotedUsers };
      }
    },
    async toggleUpvote(postId: string, currentUsername: string) {
      const postUpvote = this.upvotes[postId];

      // Toggle the user's upvote status
      if (postUpvote.hasUpvotedByUser.has(currentUsername)) {
        postUpvote.hasUpvotedByUser.delete(currentUsername);
        postUpvote.count -= 1; // Decrement count
      } else {
        postUpvote.hasUpvotedByUser.add(currentUsername);
        postUpvote.count += 1; // Increment count
      }

      // Send request to backend
      await fetchy(`/api/posts/${postId}/upvote`, "POST");

      // Update local storage
      localStorage.setItem(`upvoted-${postId}`, postUpvote.hasUpvotedByUser.has(currentUsername).toString());
    },
  },
});
