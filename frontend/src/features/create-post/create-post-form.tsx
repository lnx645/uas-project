import { Dialog, DialogTrigger } from "@/components/application/modals/modal";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { TextArea } from "@/components/base/textarea/textarea";
import { Component } from "@/view/login";
import {
  Edit02,
  Edit05,
  Globe01,
  MessageCircle01,
  Users01,
  X,
  EyeOff,
  User01,
} from "@untitledui/icons";
import { useState, useEffect, useRef } from "react";
import { Modal, ModalOverlay } from "react-aria-components";
import { useAsyncValue, useFetcher } from "react-router";

const PostModalContent = ({
  initialTab,
  onClose,
  user,
}: {
  initialTab: "ask" | "post";
  onClose: () => void;
  user: any;
}) => {
  const [activeTab, setActiveTab] = useState<"ask" | "post">(initialTab);
  const [visibility, setVisibility] = useState<"PUBLIC" | "FOLLOWERS">("PUBLIC");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.data && "message" in fetcher.data) {
      formRef.current?.reset();
      
      setIsAnonymous(false);
      setVisibility("PUBLIC");
      
      const timer = setTimeout(() => {
        onClose();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [fetcher.data, onClose]);

  return (
    <div className="p-5 flex flex-col h-full min-h-87.5">
      <div className="flex justify-end mb-2">
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex border-b border-stone-200 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("ask")}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "ask"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          Tambah Pertanyaan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("post")}
          className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "post"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          Buat Postingan
        </button>
      </div>

      <fetcher.Form
        ref={formRef} 
        action=""
        method="POST"
        className="flex-1 flex flex-col justify-between"
      >
        <input
          type="hidden"
          name="intent"
          value={activeTab === "ask" ? "create-question" : "create-post"}
        />
        <input type="hidden" name="visibility" value={visibility} />
        <input type="hidden" name="isAnonymous" value={String(isAnonymous)} />

        <div className="space-y-4 flex-1">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Avatar 
                size="xs" 
                src={isAnonymous ? undefined : user?.user?.avatarUrl} 
                placeholderIcon={isAnonymous ? User01 : undefined}
              />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-stone-700">
                  {isAnonymous ? "Pengguna Anonim" : (user?.user?.name || "Pengguna")}
                </span>

                <div className="relative mt-1 flex">
                  <select
                    value={visibility}
                    onChange={(e) =>
                      setVisibility(e.target.value as "PUBLIC" | "FOLLOWERS")
                    }
                    name="visibility"
                    className="appearance-none bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-medium pl-6 pr-4 py-0.5 rounded-full border border-stone-200 cursor-pointer focus:outline-none"
                  >
                    <option value="PUBLIC">Publik</option>
                    <option value="FOLLOWERS">Pengikut Saja</option>
                  </select>
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
                    {visibility === "PUBLIC" ? (
                      <Globe01 className="w-3 h-3" />
                    ) : (
                      <Users01 className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium transition-colors ${
                isAnonymous 
                  ? "bg-stone-900 border-stone-900 text-white hover:bg-stone-800" 
                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              <EyeOff className="w-3 h-3" />
              {isAnonymous ? "Anonim Aktif" : "Tanya secara Anonim"}
            </button>
          </div>

          {activeTab === "ask" ? (
            <div className="space-y-2">
              <TextArea
                name="title"
                placeholder='Mulai pertanyaan Anda dengan "Apa", "Mengapa", "Bagaimana", dll.'
                className="w-full text-sm placeholder:text-stone-400 font-medium"
                rows={3}
              />
              <p className="text-[11px] text-stone-500">
                Tips: Pastikan pertanyaan ringkas dan visibilitas diatur sesuai
                keinginan Anda.
              </p>
            </div>
          ) : (
            <TextArea
              name="content"
              placeholder="Bagikan pemikiran, cerita, atau pengetahuan Anda..."
              className="w-full text-sm placeholder:text-stone-400"
              rows={5}
            />
          )}
        </div>

        <div className="mt-2 text-xs">
          {fetcher.data?.error && (
            <p className="text-red-500 bg-red-50 p-2 rounded border border-red-200 font-medium">
              ❌ {fetcher.data.error}
            </p>
          )}
          {fetcher.data?.message && (
            <p className="text-green-600 bg-green-50 p-2 rounded border border-green-200 font-medium">
              ✅ {fetcher.data.message}
            </p>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t border-stone-100 mt-4">
          <Button type="button" color="tertiary" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" isDisabled={isLoading} size="sm">
            {isLoading
              ? "Mengirim..."
              : activeTab === "ask"
                ? "Tambah Pertanyaan"
                : "Post"}
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
};

export const CreatePostForm = () => {
  const user: any = useAsyncValue();
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"ask" | "post">("ask");

  const openModalWithMode = (mode: "ask" | "post") => {
    setModalMode(mode);
    setIsOpen(true);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg mt-2">
      <div className="px-4 pt-4 pb-3">
        <div className="flex gap-3 items-center">
          <Avatar size="sm" src={user?.user?.avatarUrl} />
          <div
            onClick={() => openModalWithMode("ask")}
            className="h-9 hover:bg-stone-200/50 hover:border-stone-300 flex items-center px-3 text-xs text-stone-400 cursor-pointer rounded-lg border border-stone-200 w-full bg-stone-100 select-none"
          >
            Apa yang ingin Anda tanyakan atau diskusikan?
          </div>
        </div>

        <div className="flex mt-2 items-center gap-1">
          <Button
            color="tertiary"
            size="xs"
            iconLeading={MessageCircle01}
            className="flex-1"
            onClick={() => openModalWithMode("ask")}
          >
            Tanya
          </Button>
         
          <Button
            color="tertiary"
            size="xs"
            iconLeading={Edit02}
            className="flex-1"
            onClick={() => openModalWithMode("post")}
          >
            Postingan
          </Button>
        </div>
      </div>

      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <button className="hidden" aria-label="trigger" />
        <ModalOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16">
          <Modal className="bg-white rounded-xl shadow-lg max-w-2xl w-full overflow-hidden outline-none animate-in fade-in zoom-in-95 duration-150">
            {user?.user ?   <Dialog className="outline-none">
              {({ close }) => (
                <PostModalContent
                  initialTab={modalMode}
                  onClose={close}
                  user={user}
                />
              )}
            </Dialog> : <Component/>}
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </div>
  );
};