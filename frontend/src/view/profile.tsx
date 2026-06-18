import { PostCard } from "@/components/posts/PostCard";

export const Component = () => {
  return [1, 2, 3, 4, 5].map((e) => {
    return (
      <PostCard
      postId={2}
        timeAgo="28 Oktober 2023 18:00"
        tag="pendidikan"
        preview="Yang IBM pegang adalah Repository (gudang) know how dan computer engineer yang me maintain dan mem porting (Transfer ) software COBOL lama. IBM sudah mempunyai repository pengalaman dan keahlian untuk COBOL."
        title="WKWKWs"
        authorName="Dadan Hidayat"
        authorInitials="D"
        answers={328}
      />
    );
  });
};
