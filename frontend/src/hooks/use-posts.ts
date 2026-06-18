import { useState, useEffect } from "react";
import api from "@/utils/axios";

export const useFetchPostData = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("__auth");

    const getPosts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/posts");
        setPosts(response.data);
      } catch (err: any) {
        console.error("Gagal fetch posts:", err);
        setError(err.response?.data?.error || "Gagal memuat postingan");
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, []);
  return [posts, isLoading, error] as const;
};