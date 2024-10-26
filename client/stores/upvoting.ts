// src/stores/upvoteStore.ts
import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";

export const useUpvoteStore = defineStore("upvoteStore", {
  state: () => ({
    upvotes: {} as Record<string, { count: number; hasUpvoted: boolean }>,
  }),
  actions: {
    async loadUpvoteStatus(postId: string) {
      if (!this.upvotes[postId]) {
        const localStatus = localStorage.getItem(`upvoted-${postId}`);
        const hasUpvoted = localStatus === "true";

        // Fetch upvote count from backend
        const countResponse = await fetchy(`/api/posts/${postId}/upvote`, "GET");
        const upvoteCount = countResponse.upvotes;

        this.upvotes[postId] = { count: upvoteCount, hasUpvoted };
      }
    },
    async toggleUpvote(postId: string) {
      const postUpvote = this.upvotes[postId];
      postUpvote.hasUpvoted = !postUpvote.hasUpvoted;

      // Persist upvote status locally
      localStorage.setItem(`upvoted-${postId}`, postUpvote.hasUpvoted.toString());

      // Update count based on upvote status
      postUpvote.count += postUpvote.hasUpvoted ? 1 : -1;

      // Send request to backend
      await fetchy(`/api/posts/${postId}/upvote`, "POST");
    },
  },
});
