import { PostCard } from "@/components/posts/PostCard";
import { CreatePostForm } from "@/features/create-post/create-post-form";
import { useFetchPostData } from "@/hooks/use-posts";
import api from "@/utils/axios";
import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const token = localStorage.getItem("__auth");
  try {
    const data = Object.fromEntries(formData);

    const res = await api.post("/api/v1/post/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    alert(error);
  }

  
};

export const Component = () => {
  const [posts,isLoading] = useFetchPostData();

  return (
    <div>
      <CreatePostForm />

      <div className="mt-4  ">
        {posts.map((e) => {
          return (
            <PostCard
              key={e?.id}
              isLiked={e?.liked}
              postId={e?.id}
              answers={24}
              srcAvatarUrl={e?.authorAvatarUrl}
              authorInitials={e?.authorName}
              postType={e?.postType}
              upvotes={e?.likesCount}
              timeAgo={e?.createdAt}
              authorName={e?.authorName}
              title={e.title}
              preview={e?.content}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Component;
