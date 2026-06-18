import { useState, useRef, useEffect } from "react";

interface Comment {
  id: string;
  authorName: string;
  authorInitials: string;
  avatarColor?: string;
  text: string;
  timeAgo: string;
  liked: boolean;
  replies?: Reply[];
}

interface Reply {
  id: string;
  authorName: string;
  authorInitials: string;
  avatarColor?: string;
  mentionName?: string;
  text: string;
  timeAgo: string;
  liked: boolean;
  isAnonymous?: boolean;
}

interface CommentSectionProps {
  currentUserName?: string;
  currentUserInitials?: string;
  postId?: string;
}

const Avatar = ({
  initials,
  color = "#888",
  size = 32,
  showEditBadge = false,
  isAnonymous = false,
}: {
  initials: string;
  color?: string;
  size?: number;
  showEditBadge?: boolean;
  isAnonymous?: boolean;
}) => (
  <div style={{ position: "relative", flexShrink: 0 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: isAnonymous ? "#4CAF50" : color,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {isAnonymous ? (
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          <circle cx="17" cy="17" r="4" fill="#555" stroke="none" />
          <line x1="17" y1="15" x2="17" y2="19" stroke="white" strokeWidth="1.5" />
          <line x1="15" y1="17" x2="19" y2="17" stroke="white" strokeWidth="1.5" />
        </svg>
      ) : (
        initials
      )}
    </div>
    {showEditBadge && (
      <div
        style={{
          position: "absolute",
          bottom: -1,
          right: -1,
          width: 14,
          height: 14,
          background: "#1877F2",
          borderRadius: "50%",
          border: "2px solid white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </div>
    )}
  </div>
);

const DotsMenu = ({
  onHide,
  onDelete,
}: {
  onHide?: () => void;
  onDelete?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          borderRadius: "50%",
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#65676B",
          fontSize: 16,
          flexShrink: 0,
        }}
        aria-label="Opsi"
      >
        •••
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 32,
            background: "white",
            border: "1px solid #e4e6ea",
            borderRadius: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            zIndex: 10,
            minWidth: 140,
            overflow: "hidden",
          }}
        >
          {[
            { label: "Sembunyikan", onClick: onHide, danger: false },
            { label: "Laporkan", onClick: undefined, danger: false },
            { label: "Hapus", onClick: onDelete, danger: true },
          ].map(({ label, onClick, danger }) => (
            <button
              key={label}
              onClick={() => { onClick?.(); setOpen(false); }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 14px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                color: danger ? "#e74c3c" : "#1c1e21",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f2f5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const InputBar = ({
  placeholder,
  avatarInitials,
  avatarColor,
  onSubmit,
  mention,
  size = 32,
}: {
  placeholder: string;
  avatarInitials: string;
  avatarColor?: string;
  onSubmit?: (text: string) => void;
  mention?: string;
  size?: number;
}) => {
  const [text, setText] = useState(mention ? `@${mention} ` : "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && text.trim()) {
      onSubmit?.(text.trim());
      setText("");
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Avatar initials={avatarInitials} color={avatarColor} size={size} showEditBadge />
      <div
        style={{
          flex: 1,
          background: "#f0f2f5",
          borderRadius: 20,
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: 13,
            color: "#1c1e21",
          }}
        />
        <div style={{ display: "flex", gap: 8, color: "#65676B", fontSize: 17, alignItems: "center", flexShrink: 0 }}>
          {["😊", "📷", "🎬", "GIF", "🎭"].map((icon, i) => (
            <span key={i} style={{ cursor: "pointer", fontSize: i === 3 ? 11 : 17, fontWeight: i === 3 ? 700 : 400 }}>
              {icon}
            </span>
          ))}
          {text.trim() && (
            <span
              style={{ color: "#1877F2", cursor: "pointer", fontSize: 18 }}
              onClick={() => { onSubmit?.(text.trim()); setText(""); }}
            >
              ➤
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommentSection = ({
  currentUserName = "Dadan Hidayat",
  currentUserInitials = "DH",
  postId,
}: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      authorName: "Kg Tau",
      authorInitials: "KT",
      avatarColor: "#1877F2",
      text: "iOS BRP?",
      timeAgo: "2j",
      liked: false,
      replies: [
        {
          id: "r1",
          authorName: "Peserta anonim",
          authorInitials: "PA",
          isAnonymous: true,
          mentionName: "Kg Tau",
          text: "18.1",
          timeAgo: "2j",
          liked: false,
        },
      ],
    },
  ]);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const toggleLikeComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, liked: !c.liked } : c))
    );
  };

  const toggleLikeReply = (commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: c.replies?.map((r) =>
                r.id === replyId ? { ...r, liked: !r.liked } : r
              ),
            }
          : c
      )
    );
  };

  const addComment = (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      authorName: currentUserName,
      authorInitials: currentUserInitials,
      avatarColor: "#888",
      text,
      timeAgo: "Baru saja",
      liked: false,
      replies: [],
    };
    setComments((prev) => [...prev, newComment]);
  };

  const addReply = (commentId: string, text: string) => {
    const newReply: Reply = {
      id: Date.now().toString(),
      authorName: currentUserName,
      authorInitials: currentUserInitials,
      avatarColor: "#888",
      text,
      timeAgo: "Baru saja",
      liked: false,
    };
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...(c.replies || []), newReply] }
          : c
      )
    );
    setReplyingTo(null);
  };

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", padding: "8px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          paddingBottom: 6,
          borderBottom: "1px solid #e4e6ea",
        }}
      >
        <span style={{ fontSize: 13, color: "#65676B" }}>
          {comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)} komentar
        </span>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: "#65676B",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Paling Relevan ▾
        </button>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Avatar initials={comment.authorInitials} color={comment.avatarColor} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
                <div
                  style={{
                    background: "#f0f2f5",
                    borderRadius: 18,
                    padding: "7px 12px",
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1c1e21", marginBottom: 2 }}>
                    {comment.authorName}
                  </div>
                  <div style={{ fontSize: 14, color: "#1c1e21" }}>{comment.text}</div>
                </div>
                <DotsMenu />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 3, marginLeft: 4, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#65676B" }}>{comment.timeAgo}</span>
                <button
                  onClick={() => toggleLikeComment(comment.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    color: comment.liked ? "#1877F2" : "#65676B",
                    padding: 0,
                  }}
                >
                  Suka
                </button>
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#65676B",
                    padding: 0,
                  }}
                >
                  Balas
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#65676B",
                    padding: 0,
                  }}
                >
                  Bagikan
                </button>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <div
                    style={{
                      width: 32,
                      display: "flex",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ width: 2, background: "#e4e6ea", borderRadius: 1 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <Avatar
                            initials={reply.authorInitials}
                            color={reply.avatarColor}
                            size={28}
                            isAnonymous={reply.isAnonymous}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
                              <div
                                style={{
                                  background: reply.isAnonymous ? "#e7f3ff" : "#f0f2f5",
                                  borderRadius: 18,
                                  padding: "7px 12px",
                                  flex: 1,
                                }}
                              >
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#1c1e21", marginBottom: 2 }}>
                                  {reply.authorName}
                                </div>
                                <div style={{ fontSize: 13, color: "#1c1e21" }}>
                                  {reply.mentionName && (
                                    <span style={{ color: "#1877F2", fontWeight: 500 }}>
                                      {reply.mentionName}{" "}
                                    </span>
                                  )}
                                  {reply.text}
                                </div>
                              </div>
                              <DotsMenu />
                            </div>
                            <div style={{ display: "flex", gap: 12, marginTop: 3, marginLeft: 4, alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: "#65676B" }}>{reply.timeAgo}</span>
                              <button
                                onClick={() => toggleLikeReply(comment.id, reply.id)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: reply.liked ? "#1877F2" : "#65676B",
                                  padding: 0,
                                }}
                              >
                                Suka
                              </button>
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#65676B",
                                  padding: 0,
                                }}
                              >
                                Balas
                              </button>
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#65676B",
                                  padding: 0,
                                }}
                              >
                                Bagikan
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {replyingTo === comment.id && (
                      <div style={{ marginTop: 4 }}>
                        <InputBar
                          placeholder={`Balas sebagai ${currentUserName}...`}
                          avatarInitials={currentUserInitials}
                          avatarColor="#888"
                          size={28}
                          onSubmit={(text) => addReply(comment.id, text)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {replyingTo === comment.id && !comment.replies?.length && (
                <div style={{ marginTop: 6 }}>
                  <InputBar
                    placeholder={`Balas sebagai ${currentUserName}...`}
                    avatarInitials={currentUserInitials}
                    avatarColor="#888"
                    size={28}
                    onSubmit={(text) => addReply(comment.id, text)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 8, borderTop: "1px solid #e4e6ea", paddingTop: 10 }}>
        <InputBar
          placeholder={`Balas sebagai ${currentUserName}`}
          avatarInitials={currentUserInitials}
          avatarColor="#888"
          onSubmit={addComment}
        />
      </div>
    </div>
  );
};