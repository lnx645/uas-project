import {
  ArrowCircleUp,
  ArrowDown,
  ArrowUp,
  MessageCircle01,
  Share01,
} from "@untitledui/icons";
import { useState, useEffect, useRef, memo } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Avatar } from "../base/avatar/avatar";
import { useAsyncValue } from "react-router";
import { PostLikeModalList } from "./UserPostLikeListModal";
import { timeAgoConverter } from "@/utils/timeago";
import { usePostCommentStore, type Comment } from "./postCommentStore";
import { Button } from "../base/buttons/button";

// ==========================================
// INTERFACES PROPS
// ==========================================
interface PostCardProps {
  postId: number;
  title: string;
  postType: "QUESTION" | "POST";
  preview?: string;
  tag?: string;
  authorInitials?: any;
  upvotes?: number;
  answers?: number;
  isLiked: boolean;
  timeAgo?: string;
  authorName?: string;
  srcAvatarUrl?: string;
  onHide?: () => void;
  onDelete?: () => void;
  onUpdate?: () => void;
  onSave?: () => void;
}

interface CommentItemProps {
  postId: number;
  comment: Comment;
  depth: number;
  parentName?: string;
  currentUserLoginId: number;
  isLast?: boolean; // Prop baru untuk mendeteksi posisi terakhir
  onFetchReplies: (postId: number, commentId: number) => Promise<any>;
  onAddReply: (postId: number, commentId: number, text: string) => Promise<any>;
  onEditComment: (
    postId: number,
    commentId: number,
    text: string,
  ) => Promise<any>;
  onDeleteComment: (postId: number, commentId: number) => Promise<any>;
}

// Custom hook listener WebSocket / Realtime provider
const useCommentRealtimeListener = (postId: number) => {
  const { receiveNewComment, receiveEditedComment, receiveDeletedComment } =
    usePostCommentStore();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Echo) {
      const channel = (window as any).Echo.channel(`post.${postId}`)
        .listen(".comment.created", (data: any) => {
          receiveNewComment(postId, data.parentId, data.comment);
        })
        .listen(".comment.updated", (data: any) => {
          receiveEditedComment(postId, data.commentId, data.text);
        })
        .listen(".comment.deleted", (data: any) => {
          receiveDeletedComment(postId, data.commentId);
        });

      return () => {
        (window as any).Echo.leaveChannel(`post.${postId}`);
      };
    }
  }, [postId, receiveNewComment, receiveEditedComment, receiveDeletedComment]);
};

const CompactSpinner = () => (
  <svg
    className="animate-spin h-3 w-3 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const PostHeader = ({
  authorName,
  srcAvatarUrl,
  timeAgo,
  tag,
  onHide,
  onSave,
  onUpdate,
  onDelete,
}: any) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = authorName
    ? authorName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="flex items-start justify-between mb-2.5">
      <div className="flex items-center gap-2">
        <Avatar
          src={srcAvatarUrl}
          initials={initials}
          size="sm"
          className="rounded-full"
        />
        <div>
          <p className="text-[13px] font-bold text-gray-900 hover:underline cursor-pointer leading-tight">
            {authorName}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {timeAgo}
            {tag && (
              <span className="text-gray-400 font-medium ml-1">
                · dalam{" "}
                <span className="hover:underline text-blue-600 cursor-pointer">
                  #{tag}
                </span>
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => {
            setShowMenu(!showMenu);
          }}
          className="text-gray-400 hover:text-gray-700 px-1 text-xs font-bold tracking-widest cursor-pointer outline-none"
        >
          •••
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded shadow-md z-10 py-1 text-[12px]">
            <button
              onClick={() => {
                onHide?.();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium"
            >
              Sembunyikan
            </button>
            <button
              onClick={() => {
                onSave?.();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium"
            >
              Simpan
            </button>
            <button
              onClick={() => {
                onUpdate?.();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium"
            >
              Update
            </button>
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={() => {
                onDelete?.();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 font-bold"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface PostActionsProps {
  showComments: boolean;
  isLiked?: boolean;
  onVote: () => void;
  onToggleComments: () => void;
  labelComment?: string;
}

export const PostActions = ({
  showComments,
  isLiked = false,
  onVote,
  onToggleComments,
  labelComment = "Komentar",
}: PostActionsProps) => {
  return (
    <div className="flex items-center justify-between border-t border-stone-100 pt-2 mt-2 bg-white select-none">
      <div className="flex gap-1 py-0.5 border border-stone-200 px-1 items-center rounded-full transition-colors">
        <Button
          onClick={onVote}
          size="xs"
          iconLeading={ArrowUp}
          color={isLiked ? "primary" : "tertiary-destructive"}
          className={"font-normal rounded-full text-xs"}
        >
          <span>Dukung Naik</span>
        </Button>
        <div className="w-[1px] h-4 bg-stone-300/60 mx-0.5"></div>
        <Button
          iconLeading={ArrowDown}
          size="xs"
          className="rounded-full"
          color="tertiary"
        ></Button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleComments}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-bold transition-all rounded-full cursor-pointer outline-none ${
            showComments
              ? "bg-stone-100 text-stone-900"
              : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
          }`}
        >
          <MessageCircle01 className="w-4 h-4 stroke-[2px]" />
          <span>{labelComment}</span>
        </button>
        <button className="flex items-center justify-center p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-all rounded-full cursor-pointer outline-none">
          <Share01 className="w-4 h-4 stroke-[2px]" />
        </button>
      </div>
    </div>
  );
};

const CommentForm = ({
  onSubmit,
  value,
  onChange,
  placeholder,
  avatarUrl,
  authorName,
  isSubmitting,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiRef,
}: any) => (
  <div className="relative mt-2.5 w-full z-10" ref={emojiRef}>
    <form onSubmit={onSubmit} className="flex items-center gap-2 pt-0.5">
      <Avatar
        src={avatarUrl}
        initials={authorName.substring(0, 2).toUpperCase()}
        size="sm"
        className="rounded-full shrink-0"
      />
      <div
        className={`flex-1 relative flex items-center bg-stone-100 border border-stone-200 rounded-full px-3.5 py-1.5 group/input ${isSubmitting ? "opacity-60" : ""}`}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-transparent text-[12px] text-stone-900 focus:outline-none placeholder:text-stone-400 pr-8"
        />
        <div className="absolute right-3.5 flex items-center select-none text-[14px]">
          <button
            type="button"
            onClick={() => {
              if (!isSubmitting) setShowEmojiPicker(!showEmojiPicker);
            }}
            disabled={isSubmitting}
            className="hover:text-gray-600 cursor-pointer"
          >
            😀
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !value.trim()}
        className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[12px] font-bold shrink-0 hover:bg-blue-700 cursor-pointer disabled:bg-stone-100 disabled:text-stone-400 min-w-[64px] flex justify-center items-center h-8 transition-colors"
      >
        {isSubmitting ? <CompactSpinner /> : "Kirim"}
      </button>
    </form>
    {showEmojiPicker && (
      <div className="absolute left-10 mt-1 z-30 shadow-2xl scale-90 origin-top-left">
        <EmojiPicker
          theme={Theme.LIGHT}
          onEmojiClick={(emojiData) => onChange(value + emojiData.emoji)}
          width={290}
          height={300}
        />
      </div>
    )}
  </div>
);

const CommentItem = memo(
  ({
    postId,
    comment,
    depth,
    parentName,
    currentUserLoginId,
    onFetchReplies,
    onAddReply,
    onEditComment,
    onDeleteComment,
  }: CommentItemProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [editText, setEditText] = useState(comment.text);
    const [showMenu, setShowMenu] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [isLocalLoading, setIsLocalLoading] = useState(false);
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);

    const nextDepth = depth + 1;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node))
          setShowMenu(false);
        if (
          emojiRef.current &&
          !emojiRef.current.contains(event.target as Node)
        )
          setShowEmojiPicker(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggleReplies = async () => {
      if (
        isCollapsed &&
        comment.replies.length === 0 &&
        comment.repliesCount > 0
      ) {
        setIsLocalLoading(true);
        await onFetchReplies(postId, comment.id);
        setIsLocalLoading(false);
      }
      setIsCollapsed(!isCollapsed);
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyText.trim() || isSubmittingReply) return;
      setIsSubmittingReply(true);
      try {
        await onAddReply(postId, comment.id, replyText);
        setReplyText("");
        setIsReplying(false);
        setIsCollapsed(false);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmittingReply(false);
      }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editText.trim()) return;
      await onEditComment(postId, comment.id, editText);
      setIsEditing(false);
    };

    const handleDeleteClick = async () => {
      if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?"))
        return;
      await onDeleteComment(postId, comment.id);
    };

    const hasReplies =
      comment.replies && comment.replies.length > 0 && !isCollapsed;
    const isMyComment = Number(currentUserLoginId) === Number(comment.authorId);

    const MAX_SHIFT_DEPTH = 3;
    const currentShift = depth > MAX_SHIFT_DEPTH ? MAX_SHIFT_DEPTH : depth;

    const paddingLeftValue = currentShift * 2;
    const containerClass =
      depth === 0
        ? "w-full  gap-2.5 group"
        : "w-full  gap-2.5 group transition-all";

    return (
      <div
        className={`w-full relative ${containerClass}`}
        style={{ paddingLeft: `${paddingLeftValue}px` }}
      >
        <div className="flex flex-col items-start w-full relative z-10">
          <div className="flex items-start gap-2.5 group w-full relative">
            <div className="inline-block shrink-0 mt-0.5">
              <Avatar
                src={comment.authorAvatarUrl}
                initials={
                  comment.authorName
                    ? comment.authorName.substring(0, 2).toUpperCase()
                    : "US"
                }
                size="xs"
                className="rounded-full border border-stone-100"
              />
            </div>
            <div className="max-w-[88%] flex items-start gap-1 relative min-w-0">
              <div className="bg-stone-50 border border-[#e1e1e1] rounded-2xl px-3 py-2 min-w-0 transition-colors group-hover:bg-stone-100/60">
                <span className="font-bold text-[12px] text-stone-900 block leading-tight hover:underline cursor-pointer mb-0.5">
                  {comment.authorName}
                </span>
                {isEditing ? (
                  <form
                    onSubmit={handleEditSubmit}
                    className="mt-1.5 flex gap-1.5 w-full min-w-[220px]"
                  >
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 border border-stone-300 rounded-lg bg-white px-2.5 py-1 text-[12px] focus:outline-none focus:border-blue-500 font-medium"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors"
                    >
                      Simpan
                    </button>
                  </form>
                ) : (
                  <p className="text-[12px] text-stone-800 whitespace-pre-wrap leading-relaxed">
                    {depth > 0 && parentName && (
                      <span className="text-blue-600 font-bold mr-1 select-none hover:underline cursor-pointer">
                        @{parentName.split(" ")[0]}
                      </span>
                    )}
                    {comment.text}
                  </p>
                )}
              </div>
              {isMyComment && (
                <div className="relative shrink-0 self-center" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-stone-700 p-1 text-[12px] font-bold transition-all cursor-pointer rounded-full hover:bg-stone-100"
                  >
                    •••
                  </button>
                  {showMenu && (
                    <div className="absolute left-0 mt-1 w-24 bg-white border border-stone-200 rounded-xl shadow-lg z-20 py-1 text-[11px] overflow-hidden">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-stone-50 text-stone-700 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteClick();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 font-semibold border-t border-stone-50"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="text-[11px] text-stone-500 mt-1 mb-1 ml-[38px] flex items-center gap-2 select-none font-medium relative">
            <button className="hover:text-blue-600 cursor-pointer font-bold transition-colors">
              Suka
            </button>
            <span className="text-stone-300 select-none">·</span>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="hover:text-stone-800 cursor-pointer font-bold transition-colors"
            >
              Balas
            </button>
            <span className="text-stone-300 select-none">·</span>
            <span className="text-stone-400 text-[10px] font-normal">
              {comment.timeAgo}
            </span>
            {comment.repliesCount > 0 && (
              <>
                <span className="text-stone-300 select-none">·</span>
                <button
                  onClick={handleToggleReplies}
                  className="text-blue-600 hover:text-blue-700 cursor-pointer font-bold flex items-center gap-1 transition-colors"
                >
                  {isCollapsed
                    ? `Lihat Balasan (${comment.repliesCount})`
                    : "Sembunyikan"}
                </button>
              </>
            )}
            {isLocalLoading && (
              <div className="animate-spin h-3 w-3 border-2 border-stone-200 border-t-blue-600 rounded-full ml-1"></div>
            )}
          </div>
        </div>
        {isReplying && (
          <div
            className="w-full pl-9 mt-1.5 mb-1.5 relative z-20"
            ref={emojiRef}
          >
            <form
              onSubmit={handleReplySubmit}
              className="flex gap-2 items-center max-w-[88%]"
            >
              <div
                className={`flex-1 relative flex items-center bg-stone-100 border border-stone-200 rounded-full px-3.5 py-1.5 group/input ${isSubmittingReply ? "opacity-60" : ""}`}
              >
                <input
                  type="text"
                  placeholder={`Balas ${comment.authorName.split(" ")[0]}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isSubmittingReply}
                  className="w-full bg-transparent text-[12px] text-stone-900 focus:outline-none placeholder:text-stone-400 font-medium pr-6"
                  autoFocus
                />
                <div className="absolute right-3 flex items-center text-[13px] select-none">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isSubmittingReply)
                        setShowEmojiPicker(!showEmojiPicker);
                    }}
                    disabled={isSubmittingReply}
                    className="hover:scale-110 transition-transform cursor-pointer"
                  >
                    😀
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmittingReply || !replyText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold disabled:bg-stone-200 disabled:text-stone-400 h-7.5 flex items-center cursor-pointer transition-colors shrink-0"
              >
                {isSubmittingReply ? <CompactSpinner /> : "Kirim"}
              </button>
            </form>
            {showEmojiPicker && (
              <div className="absolute left-9 mt-1 z-30 shadow-xl scale-75 origin-top-left">
                <EmojiPicker
                  theme={Theme.LIGHT}
                  onEmojiClick={(emojiData) =>
                    setReplyText((prev) => prev + emojiData.emoji)
                  }
                  width={260}
                  height={280}
                />
              </div>
            )}
          </div>
        )}
        {hasReplies && (
          <div className="w-full flex flex-col items-start relative z-10">
            {comment.replies.map((childComment, index) => (
              <CommentItem
                key={childComment.id}
                postId={postId}
                comment={childComment}
                depth={nextDepth}
                parentName={comment.authorName}
                currentUserLoginId={currentUserLoginId}
                isLast={index === comment.replies.length - 1} // Kirim status jika ini anak terakhir
                onFetchReplies={onFetchReplies}
                onAddReply={onAddReply}
                onEditComment={onEditComment}
                onDeleteComment={onDeleteComment}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
CommentItem.displayName = "CommentItem";

const CommentTreeWrapper = ({
  postId,
  currentUserLoginId,
}: {
  postId: number;
  currentUserLoginId: number;
}) => {
  const comments = usePostCommentStore(
    (state) => state.commentsByPost[postId] || [],
  );
  const { fetchReplies, addReplyComment, editComment, deleteComment } =
    usePostCommentStore();

  return (
    <div className="w-full mt-4 relative flex flex-col items-start">
      {comments.map((comment, index) => (
        <CommentItem
          key={comment.id}
          postId={postId}
          comment={comment}
          depth={0}
          currentUserLoginId={currentUserLoginId}
          isLast={index === comments.length - 1} 
          onFetchReplies={fetchReplies}
          onAddReply={addReplyComment}
          onEditComment={editComment}
          onDeleteComment={deleteComment}
        />
      ))}
    </div>
  );
};

export const PostCard = ({
  postId,
  title,
  preview,
  postType,
  tag,
  upvotes = 0,
  isLiked,
  answers = 0,
  timeAgo = "",
  authorName,
  srcAvatarUrl,
  onHide,
  onDelete,
  onUpdate,
  onSave,
}: PostCardProps) => {
  useCommentRealtimeListener(postId);

  const [showComments, setShowComments] = useState(false);
  const [rootCommentInput, setRootCommentInput] = useState("");
  const [showRootRootEmojiPicker, setShowRootEmojiPicker] = useState(false);
  const [isSubmittingRoot, setIsSubmittingRoot] = useState(false);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);

  // @ts-ignore
  const user: any = useAsyncValue();
  const USER_LOGIN_SEKARANG_ID = user?.user?.id;
  const USER_LOGIN_SEKARANG_AVATAR = user?.user?.avatarUrl;
  const USER_LOGIN_SEKARANG_NAME = user?.user?.name || "Anonymous";

  const rootEmojiRef = useRef<HTMLDivElement>(null);

  const hasCommentsData = usePostCommentStore(
    (state) => !!state.commentsByPost[postId],
  );
  const isLoading = usePostCommentStore(
    (state) => state.loadingPosts[postId] || false,
  );
  const voted = usePostCommentStore(
    (state) => state.votedPosts[postId] || false,
  );

  const { toggleVote, fetchRootComments, addRootComment } =
    usePostCommentStore();

  const finalIsLiked = voted ? !isLiked : isLiked;
  const count = voted ? (isLiked ? upvotes - 1 : upvotes + 1) : upvotes;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rootEmojiRef.current &&
        !rootEmojiRef.current.contains(event.target as Node)
      )
        setShowRootEmojiPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleComments = async () => {
    if (!showComments && !hasCommentsData) {
      await fetchRootComments(postId);
    }
    setShowComments(!showComments);
  };

  const handleAddRootComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootCommentInput.trim() || isSubmittingRoot) return;
    setIsSubmittingRoot(true);
    try {
      await addRootComment(postId, rootCommentInput);
      setRootCommentInput("");
      setShowRootEmojiPicker(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingRoot(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-4 mb-3 relative">
      <PostHeader
        authorName={authorName}
        srcAvatarUrl={srcAvatarUrl}
        timeAgo={timeAgoConverter(timeAgo) as any}
        tag={tag}
        onHide={onHide}
        onSave={onSave}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />

      <div className="mb-2.5 mt-2">
        <div className="flex flex-col items-start gap-1.5 w-full">
          {postType === "QUESTION" && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-100 uppercase tracking-wide select-none">
              Pertanyaan
            </span>
          )}
          <p className="text-[17px] font-bold text-gray-950 leading-snug w-full">
            {title}
          </p>
        </div>

        {preview && (
          <p className="text-[13px] text-stone-700 leading-relaxed whitespace-pre-wrap pt-1">
            {preview}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-stone-100 pt-2 pb-1 text-[11px] text-stone-500 font-medium select-none">
        <div className="flex items-center gap-1">
          <span className="text-stone-400">
            <ArrowCircleUp size={14} />
          </span>
          <button
            onClick={() => setIsLikeModalOpen(true)}
            className="hover:underline cursor-pointer font-bold text-blue-600 outline-none"
          >
            {count.toLocaleString("id-ID")} Orang
          </button>
        </div>
        <div
          onClick={toggleComments}
          className="hover:underline cursor-pointer select-none font-semibold text-stone-500"
        >
          {answers} {postType === "QUESTION" ? "Jawaban" : "Komentar"}
        </div>
      </div>

      <PostActions
        isLiked={finalIsLiked}
        showComments={showComments}
        onVote={() => toggleVote(postId)}
        onToggleComments={toggleComments}
        labelComment={postType === "QUESTION" ? "Jawab" : "Komentar"}
      />

      {showComments && (
        <div className="mt-2.5 pt-1 border-t border-stone-100 bg-stone-50/40 -mx-4 -mb-4 px-4 pb-3 rounded-b-lg flex flex-col items-start w-full relative">
          {isLoading ? (
            <div className="w-full text-center py-4 text-xs text-stone-400 font-semibold bg-white border border-stone-100 rounded-lg my-2 shadow-sm">
              Memuat {postType === "QUESTION" ? "jawaban" : "komentar"}...
            </div>
          ) : (
            <CommentTreeWrapper
              postId={postId}
              currentUserLoginId={USER_LOGIN_SEKARANG_ID}
            />
          )}
          <CommentForm
            onSubmit={handleAddRootComment}
            value={rootCommentInput}
            onChange={setRootCommentInput}
            placeholder={
              postType === "QUESTION"
                ? `Bantu jawab sebagai ${USER_LOGIN_SEKARANG_NAME.split(" ")[0]}...`
                : `Tulis komentar sebagai ${USER_LOGIN_SEKARANG_NAME.split(" ")[0]}...`
            }
            avatarUrl={USER_LOGIN_SEKARANG_AVATAR}
            authorName={USER_LOGIN_SEKARANG_NAME}
            isSubmitting={isSubmittingRoot}
            showEmojiPicker={showRootRootEmojiPicker}
            setShowEmojiPicker={setShowRootEmojiPicker}
            emojiRef={rootEmojiRef}
          />
        </div>
      )}
      <PostLikeModalList
        isOpen={isLikeModalOpen}
        onOpenChange={setIsLikeModalOpen}
        postId={postId}
      />
    </div>
  );
};
