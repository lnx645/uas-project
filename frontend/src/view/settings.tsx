import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { userAuthContext } from "@/context/userContext";
import api from "@/utils/axios";
import { Mail01, User01, Users02, Lock01 } from "@untitledui/icons"; // Tambahkan icon gembok / lock jika ada
import {
  useAsyncValue,
  useFetcher,
  type ActionFunction,
  type LoaderFunction,
} from "react-router";
export const loader: LoaderFunction = ({ context }) => {
  const user = context.get(userAuthContext);
  console.log(user);
  
  if (!user) {
    document.location.href = "/";
    return;
  }
};
export const action: ActionFunction = async ({ request}) => {
  const formData = await request.formData();
  const intent = formData.get("intent"); // Cek form mana yang dikirim
  const token = localStorage.getItem("__auth");

  const headers = { Authorization: `Bearer ${token}` };

  try {
    if (intent === "update-profile") {
      const email = formData.get("email");
      const name = formData.get("name");
      const bio = formData.get("bio");
      const credential = formData.get("credential");

      const response = await api.post(
        "/api/v1/user/profile/edit",
        { email, name, bio, credential },
        { headers },
      );

      return {
        success: true,
        message: response.data?.message || "Profil diperbarui",
        type: "profile",
      };
    }

    if (intent === "update-password") {
      const oldPassword = formData.get("oldPassword");
      const newPassword = formData.get("newPassword");
      const confirmPassword = formData.get("confirmPassword");

      if (newPassword !== confirmPassword) {
        return {
          error: "Konfirmasi kata sandi baru tidak cocok!",
          type: "password",
        };
      }

      const response = await api.post(
        "/api/v1/user/profile/update-password",
        { oldPassword, newPassword },
        { headers },
      );

      return {
        success: true,
        message: response.data?.message || "Kata sandi diperbarui",
        type: "password",
      };
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || "Terjadi kesalahan";
    return { error: errorMessage, type: intent };
  }
};

export const Component = () => {
  const profileFetcher = useFetcher();
  const passwordFetcher = useFetcher();

  const isProfileLoading = profileFetcher.state !== "idle";
  const isPasswordLoading = passwordFetcher.state !== "idle";
  const data: any = useAsyncValue();
  return (
    <div className="py-2 space-y-8">
      {/* SECTION 1: SETELAN AKUN */}
      <div>
        <div className="py-1 border-b border-stone-200">
          <span className="text-sm font-semibold">Setelan Akun</span>
        </div>

        <profileFetcher.Form method="POST" className="flex flex-col mt-3">
          {/* Identitas Form Profil */}
          <input type="hidden" name="intent" value="update-profile" />

          <div className="flex items-center border-t py-2 border-stone-300 gap-4">
            <div className="flex-1">
              <span className="text-xs font-semibold">Email</span>
            </div>
            <div className="flex-1">
              <Input
                isReadOnly
                defaultValue={data?.user?.email}
                name="email"
                icon={Mail01}
                size="sm"
              />
            </div>
          </div>

          <div className="flex items-center border-t py-2 border-stone-300 gap-4">
            <div className="flex-1">
              <span className="text-xs font-semibold">Nama Lengkap</span>
            </div>
            <div className="flex-1">
              <Input
                defaultValue={data?.user?.name}
                name="name"
                icon={Users02}
                size="sm"
              />
            </div>
          </div>

          <div className="flex items-start border-t py-2 border-stone-300 gap-4">
            <div className="flex-1">
              <span className="text-xs font-semibold">BIO</span>
            </div>
            <div className="flex-1">
              <TextArea defaultValue={data?.user?.bio} name="bio" size="sm" />
            </div>
          </div>

          <div className="flex border-b items-center border-t py-2 border-stone-300 gap-4">
            <div className="flex-1">
              <span className="text-xs font-semibold">Kredensial</span>
            </div>
            <div className="flex-1">
              <Input
                defaultValue={data?.user?.kredensial}
                name="credential"
                icon={User01}
                size="sm"
              />
            </div>
          </div>

          <div className="mt-2">
            <Button type="submit" isDisabled={isProfileLoading}>
              {isProfileLoading ? "Menyimpan..." : "Simpan Profil"}
            </Button>
          </div>
        </profileFetcher.Form>

        {/* Umpan balik status Form Profil */}
        {profileFetcher.data?.error &&
          profileFetcher.data?.type === "update-profile" && (
            <p className="text-red-500 text-xs mt-2">
              {profileFetcher.data.error}
            </p>
          )}
        {profileFetcher.data?.success &&
          profileFetcher.data?.type === "profile" && (
            <p className="text-green-600 text-xs mt-2">
              {profileFetcher.data.message}
            </p>
          )}
      </div>

      {/* SECTION 2: KEAMANAN & KATA SANDI */}
      <div>
        <div className="py-1 border-b border-stone-200">
          <span className="text-sm font-semibold">Keamanan & Kata Sandi</span>
        </div>

        <passwordFetcher.Form method="POST" className="flex flex-col mt-3">
          {/* Identitas Form Password */}
          <input type="hidden" name="intent" value="update-password" />

          <div className="flex items-center border-t py-2 border-stone-300 gap-4">
            <div className="flex-1">
              <span className="text-xs font-semibold">Kata Sandi Saat Ini</span>
            </div>
            <div className="flex-1">
              <Input
                type="password"
                name="oldPassword"
                icon={Lock01}
                size="sm"
              />
            </div>
          </div>

          <div className="flex items-center border-t py-2 border-stone-300 gap-4">
            <div className="flex-1">
              <span className="text-xs font-semibold">Kata Sandi Baru</span>
            </div>
            <div className="flex-1">
              <Input
                type="password"
                name="newPassword"
                icon={Lock01}
                size="sm"
              />
            </div>
          </div>

          <div className="flex border-b items-center border-t py-2 border-stone-300 gap-4">
            <div className="flex-1">
              <span className="text-xs font-semibold">
                Konfirmasi Kata Sandi Baru
              </span>
            </div>
            <div className="flex-1">
              <Input
                type="password"
                name="confirmPassword"
                icon={Lock01}
                size="sm"
              />
            </div>
          </div>

          <div className="mt-2">
            <Button type="submit" isDisabled={isPasswordLoading}>
              {isPasswordLoading ? "Mengubah..." : "Ubah Kata Sandi"}
            </Button>
          </div>
        </passwordFetcher.Form>

        {/* Umpan balik status Form Password */}
        {passwordFetcher.data?.error &&
          (passwordFetcher.data?.type === "update-password" ||
            !passwordFetcher.data?.type) && (
            <p className="text-red-500 text-xs mt-2">
              {passwordFetcher.data.error}
            </p>
          )}
        {passwordFetcher.data?.success &&
          passwordFetcher.data?.type === "password" && (
            <p className="text-green-600 text-xs mt-2">
              {passwordFetcher.data.message}
            </p>
          )}
      </div>
    </div>
  );
};
