import { create } from "zustand";
import api from "@/utils/axios";

// ==========================================
// TYPES & INTERFACES
// ==========================================
export interface Comment {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  timeAgo: string;
  repliesCount: number;
  replies: Comment[];
}

interface PostCommentState {
  commentsByPost: Record<number, Comment[]>;
  loadingPosts: Record<number, boolean>;
  votedPosts: Record<number, boolean>;
  
  // REST API Actions
  toggleVote: (postId: number) => Promise<void>;
  fetchRootComments: (postId: number) => Promise<void>;
  fetchReplies: (postId: number, commentId: number) => Promise<Comment[]>;
  addRootComment: (postId: number, text: string) => Promise<void>;
  addReplyComment: (postId: number, targetCommentId: number, text: string) => Promise<void>;
  editComment: (postId: number, commentId: number, newText: string) => Promise<void>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;

  // Real-time WebSocket Receivers
  receiveNewComment: (postId: number, parentId: number | null, newComment: Comment) => void;
  receiveEditedComment: (postId: number, commentId: number, newText: string) => void;
  receiveDeletedComment: (postId: number, commentId: number) => void;
}

const getAuthConfig = () => {
  const token = localStorage.getItem("__auth");
  return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
};

// ==========================================
// PURE TREE RECURSIVE HELPERS
// ==========================================
const addReplyToTree = (list: Comment[], targetId: number, newReply: Comment): Comment[] => {
  return list.map((item) => {
    if (item.id === targetId) {
      // Hindari duplikasi rekursif jika ID sudah terdaftar di client
      if (item.replies?.some((r) => r.id === newReply.id)) return item;
      return {
        ...item,
        repliesCount: item.repliesCount + 1,
        replies: [...(item.replies || []), newReply],
      };
    }
    if (item.replies && item.replies.length > 0) {
      return { ...item, replies: addReplyToTree(item.replies, targetId, newReply) };
    }
    return item;
  });
};

const injectRepliesToTree = (list: Comment[], targetId: number, replies: Comment[]): Comment[] => {
  return list.map((item) => {
    if (item.id === targetId) {
      return { ...item, replies };
    }
    if (item.replies && item.replies.length > 0) {
      return { ...item, replies: injectRepliesToTree(item.replies, targetId, replies) };
    }
    return item;
  });
};

const editCommentInTree = (list: Comment[], targetId: number, newText: string): Comment[] => {
  return list.map((item) => {
    if (item.id === targetId) return { ...item, text: newText };
    if (item.replies && item.replies.length > 0) {
      return { ...item, replies: editCommentInTree(item.replies, targetId, newText) };
    }
    return item;
  });
};

const deleteCommentFromTree = (list: Comment[], targetId: number): Comment[] => {
  return list
    .filter((item) => item.id !== targetId)
    .map((item) => ({
      ...item,
      repliesCount: item.replies.some((r) => r.id === targetId) ? item.repliesCount - 1 : item.repliesCount,
      replies: deleteCommentFromTree(item.replies, targetId),
    }));
};

// ==========================================
// ZUSTAND STORE CREATION
// ==========================================
export const usePostCommentStore = create<PostCommentState>((set) => ({
  commentsByPost: {},
  loadingPosts: {},
  votedPosts: {},

  toggleVote: async (postId) => {
    try {
      await api.post("/api/post/vote", { postId }, getAuthConfig());
      set((state) => ({
        votedPosts: { ...state.votedPosts, [postId]: !state.votedPosts[postId] },
      }));
    } catch (error) {
      console.error("Gagal melakukan vote:", error);
    }
  },

  fetchRootComments: async (postId) => {
    set((state) => ({ loadingPosts: { ...state.loadingPosts, [postId]: true } }));
    try {
      const response = await api.get(`/api/comments/post/${postId}`, getAuthConfig());
      set((state) => ({
        commentsByPost: { ...state.commentsByPost, [postId]: response.data },
      }));
    } catch (error) {
      console.error("Gagal memuat root komentar:", error);
    } finally {
      set((state) => ({ loadingPosts: { ...state.loadingPosts, [postId]: false } }));
    }
  },

  fetchReplies: async (postId, commentId) => {
    try {
      const response = await api.get(`/api/comments/${commentId}/replies`, getAuthConfig());
      const fetchedReplies = response.data;
      set((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: injectRepliesToTree(state.commentsByPost[postId] || [], commentId, fetchedReplies),
        },
      }));
      return fetchedReplies;
    } catch (error) {
      console.error("Gagal memuat balasan:", error);
      return [];
    }
  },

  addRootComment: async (postId, text) => {
    const response = await api.post(`/api/comments/post/${postId}`, { text, parentId: null }, getAuthConfig());
    const newComment: Comment = {
      id: response.data.id,
      authorId: response.data.authorId,
      authorName: response.data.authorName,
      authorAvatarUrl: response.data.authorAvatarUrl,
      text: response.data.text,
      timeAgo: response.data.timeAgo || "Baru saja",
      repliesCount: 0,
      replies: [],
    };
    set((state) => {
      const current = state.commentsByPost[postId] || [];
      if (current.some((c) => c.id === newComment.id)) return state;
      return {
        commentsByPost: { ...state.commentsByPost, [postId]: [...current, newComment] },
      };
    });
  },

  addReplyComment: async (postId, targetCommentId, text) => {
    const response = await api.post(`/api/comments/post/${postId}`, { text, parentId: targetCommentId }, getAuthConfig());
    const newReply: Comment = {
      id: response.data.id,
      authorId: response.data.authorId,
      authorName: response.data.authorName,
      authorAvatarUrl: response.data.authorAvatarUrl,
      text: response.data.text,
      timeAgo: response.data.timeAgo || "Baru saja",
      repliesCount: 0,
      replies: [],
    };
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: addReplyToTree(state.commentsByPost[postId] || [], targetCommentId, newReply),
      },
    }));
  },

  editComment: async (postId, commentId, newText) => {
    await api.put(`/api/comments/${commentId}`, { text: newText }, getAuthConfig());
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: editCommentInTree(state.commentsByPost[postId] || [], commentId, newText),
      },
    }));
  },

  deleteComment: async (postId, commentId) => {
    await api.delete(`/api/comments/${commentId}`, getAuthConfig());
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: deleteCommentFromTree(state.commentsByPost[postId] || [], commentId),
      },
    }));
  },

  // ==========================================
  // REAL-TIME ACTIONS (WEB SOCKET EVENT LISTENERS)
  // ==========================================
  receiveNewComment: (postId, parentId, newComment) => {
    set((state) => {
      const currentComments = state.commentsByPost[postId] || [];
      if (!parentId) {
        if (currentComments.some((c) => c.id === newComment.id)) return state;
        return {
          commentsByPost: { ...state.commentsByPost, [postId]: [...currentComments, newComment] },
        };
      }
      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: addReplyToTree(currentComments, parentId, newComment),
        },
      };
    });
  },

  receiveEditedComment: (postId, commentId, newText) => {
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: editCommentInTree(state.commentsByPost[postId] || [], commentId, newText),
      },
    }));
  },

  receiveDeletedComment: (postId, commentId) => {
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: deleteCommentFromTree(state.commentsByPost[postId] || [], commentId),
      },
    }));
  },
}));