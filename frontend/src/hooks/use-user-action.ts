import api from "@/utils/axios";
import { create } from "zustand";

export interface User {
  id: number;
  name: string;
  username: string;
  isFollowing: boolean;
}

export interface FollowMap {
  [userId: number]: boolean;
}

export interface LoadingMap {
  [userId: number]: boolean;
}

export interface FollowState {
  followingMap: FollowMap;
  loadingStates: LoadingMap;
  error: string | null;
  setInitialFollowStatus: (userId: number, isFollowing: boolean) => void;
  toggleFollow: (targetUserId: number) => Promise<void>;
}

export const useFollowStore = create<FollowState>((set, get) => ({
  followingMap: {},
  loadingStates: {},
  error: null,

  setInitialFollowStatus: (userId: number, isFollowing: boolean) => {
    if (get().followingMap[userId] !== undefined) return;
    set((state) => ({
      followingMap: { ...state.followingMap, [userId]: isFollowing },
    }));
  },

  toggleFollow: async (targetUserId: number) => {
    const previousStatus = !!get().followingMap[targetUserId];

    set((state) => ({
      followingMap: { ...state.followingMap, [targetUserId]: !previousStatus },
      loadingStates: { ...state.loadingStates, [targetUserId]: true },
      error: null,
    }));

    const url = previousStatus
      ? `/api/v1/users/${targetUserId}/unfollow`
      : `/api/v1/users/${targetUserId}/follow`;

    try {
      await api.post<void>(url);
    } catch (err: any) {
      set((state) => ({
        followingMap: { ...state.followingMap, [targetUserId]: previousStatus },
        error:
          err.response?.data?.message || "Gagal memperbarui status follow.",
      }));
      console.error("Follow/Unfollow Axios Error:", err);
    } finally {
      set((state) => ({
        loadingStates: { ...state.loadingStates, [targetUserId]: false },
      }));
    }
  },
}));
