import  { useState, useEffect } from "react";
import {
  Dialog,
  Modal,
  ModalOverlay,
  Heading,
  Button,
} from "react-aria-components";
import { X } from "@untitledui/icons";
import { Avatar } from "../base/avatar/avatar";
import { useFollowStore } from "@/hooks/use-user-action";
import api from "@/utils/axios";

export const PostLikeModalList = ({ isOpen, onOpenChange, postId }: any) => {
  const [likes, setLikes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { followingMap, loadingStates, toggleFollow, setInitialFollowStatus } =
    useFollowStore();

  useEffect(() => {
    if (isOpen && postId) {
      setIsLoading(true);
      api
        .get(`/api/post/like/users/${postId}`)
        .then((res) => {
          setLikes(res.data);

          res.data.forEach((userLike: any) => {
            if (userLike?.id) {
              setInitialFollowStatus(userLike.id, !!userLike.followingUser);
            }
          });
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, postId]);

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-stone-900/80"
    >
      <Modal className="w-full max-w-xl bg-white dark:bg-zinc-950 rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-800 outline-none max-h-[90vh] flex flex-col">
        <Dialog className="outline-none flex flex-col h-full w-full">
          {({ close }) => (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800">
                <Heading
                  slot="title"
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  {likes.length > 0
                    ? `${likes.length} Dukung Naik`
                    : "Dukung Naik"}
                </Heading>
                <Button
                  onPress={close}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none cursor-pointer p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-950"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 divide-y divide-slate-100 dark:divide-zinc-800 max-h-112.5 custom-scrollbar">
                {isLoading ? (
                  <div className="text-center py-12 text-sm text-slate-400">
                    Memuat daftar...
                  </div>
                ) : likes.length === 0 ? (
                  <div className="text-center py-12 text-sm text-slate-400">
                    Belum ada dukungan naik.
                  </div>
                ) : (
                  likes.map((userLike: any) => {
                    const isFollowing = !!followingMap[userLike?.id];
                    const isBtnLoading = !!loadingStates[userLike?.id];
                    return (
                      <div
                        key={userLike?.id}
                        className="flex items-start justify-between py-3.5 gap-4"
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {userLike?.avatar_url ? (
                            <Avatar
                              size="sm"
                              src={userLike?.avatar_url}
                              alt=""
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-sm shrink-0">
                              {userLike?.name
                                ? userLike?.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[14px] font-bold text-slate-900 dark:text-white hover:underline cursor-pointer leading-snug truncate">
                              {userLike?.name}
                            </h4>
                            <p className="text-[12px] text-slate-500 dark:text-zinc-400 leading-normal mt-0.5 break-words line-clamp-2">
                              {userLike?.kredensial || "Pengguna Aplikasi"}
                            </p>
                          </div>
                        </div>
                        <Button
                          isDisabled={isBtnLoading}
                          onClick={() => toggleFollow(userLike?.id)}
                          className={`shrink-0 inline-flex items-center gap-1 text-[13px] font-semibold px-3 py-1.5 border rounded-full transition-colors outline-none cursor-pointer disabled:opacity-60 select-none ${
                            isFollowing
                              ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800"
                              : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50/50 dark:bg-transparent dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950/30"
                          }`}
                        >
                          <span>
                            {isBtnLoading
                              ? "..."
                              : isFollowing
                                ? "✓ Mengikuti"
                                : "+ Ikuti"}
                          </span>
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};
