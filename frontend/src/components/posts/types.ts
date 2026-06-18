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

export interface PostCardProps {
  postId: number;
  title: string;
  preview?: string;
  tag?: string;
  upvotes?: number;
  answers?: number;
  timeAgo?: string;
  authorName?: string;
  srcAvatarUrl?: string;
}

export interface CommentItemProps {
  comment: Comment;
  depth: number;
  currentUserLoginId: number;
  onAddReply: (targetId: number, text: string) => Promise<void>;
  onEditComment: (targetId: number, newText: string) => void;
  onDeleteComment: (targetId: number) => void;
  onFetchReplies: (commentId: number) => Promise<Comment[]>;
}