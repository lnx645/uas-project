import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import {
  MessageCircle01,
  Plus,
  Tag01,
  Link01,
  ArrowUp,
} from "@untitledui/icons";
import { NavLink, Outlet, useAsyncValue } from "react-router";

export const ProfileLayout = () => {
  const data: any = useAsyncValue();
  const user = data?.user;

  const name = user?.name ?? "Dadan Hidayat";
  const kredensial = user?.kredensial ?? "-";
  const avatarUrl = user?.avatarUrl ?? "";
  const bio =
    user?.bio ??
    "Pecinta teknologi, anime, dan kuliner. Berbagi pengetahuan tentang dunia digital dan kehidupan sehari-hari.";
  const link = user?.link ?? null;
  const followers = user?.followers ?? 282;
  const totalPoints = user?.points ?? 4750;
  const totalPosts = user?.totalPosts ?? 1400;
  const badge = user?.badge ?? "Gold Member";
  const tags: string[] = user?.tags ?? [
    "runningthreads",
    "AnimeThreads",
    "FoodThreads",
    "carsofthreads",
    "TechThreads",
    "GameThreads",
  ];

  const visibleTags = tags.slice(0, 4);
  const extraTags = tags.length - visibleTags.length;

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const badgeStyle: Record<string, string> = {
    "Gold Member": "bg-yellow-50 text-yellow-700 border-yellow-300",
    "Silver Member": "bg-gray-100 text-gray-600 border-gray-300",
    "Bronze Member": "bg-orange-50 text-orange-700 border-orange-300",
    "Platinum Member": "bg-purple-50 text-purple-700 border-purple-300",
  };
  const badgeClass =
    badgeStyle[badge] ?? "bg-gray-100 text-gray-600 border-gray-300";

  const tabs = [
    { label: "Pertanyaan", to: "/profile/questions" },
    { label: "Kiriman", to: "/profile" },
    { label: "Jawaban", to: "/profile/answers" },
    { label: "Tersimpan", to: "/profile/saved" },
  ];

  return (
    <div className="flex flex-col border-x border-x-stone-200 min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 pt-5 pb-0">
        <div className="flex items-start gap-3 mb-3">
          {avatarUrl ? (
            <Avatar size="2xl" status="online" src={avatarUrl} />
          ) : (
            <div className="w-18 h-18 rounded-full bg-[#b92b27] flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-semibold">
                {initials}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 leading-tight truncate">
              {name}
            </h1>
            <p className="text-[13px] text-gray-500 truncate">{kredensial}</p>
            <span
              className={`inline-flex items-center gap-1 self-start mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}
            >
              🏅 {badge}
            </span>
          </div>
        </div>

        {bio && (
          <p className="text-[13px] text-gray-700 leading-snug mb-2">{bio}</p>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#b92b27] hover:underline mb-2"
          >
            <Link01 className="w-3.5 h-3.5" />
            {link.replace(/^https?:\/\//, "")}
          </a>
        )}

        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="bg-red-50 text-[#b92b27] border border-red-200 rounded-full px-3 py-0.5 text-[12px] cursor-pointer hover:bg-red-100 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {extraTags > 0 && (
              <span className="bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-3 py-0.5 text-[12px]">
                +{extraTags} lainnya
              </span>
            )}
          </div>
        )}
        <div className="flex items-stretch border-t border-gray-100 py-3 gap-0 mb-1">
          <div className="flex flex-col items-center flex-1">
            <span className="text-[15px] font-semibold text-gray-900">
              {followers.toLocaleString("id-ID")}
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5">Pengikut</span>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-[15px] font-semibold text-gray-900">
              {totalPoints.toLocaleString("id-ID")}
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5">Poin</span>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-[15px] font-semibold text-gray-900">
              {totalPosts >= 1000
                ? `${(totalPosts / 1000).toFixed(1).replace(".", ",")}rb`
                : totalPosts.toLocaleString("id-ID")}
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5">Kiriman</span>
          </div>
        </div>

        <div className="flex gap-2 pb-4">
          <Button className="w-full" iconLeading={<Plus className="w-4 h-4" />}>
            Ikuti
          </Button>
          <Button
            color="primary"
            className="w-full"
            iconLeading={<Tag01 className="w-4 h-4" />}
          >
            Sebut
          </Button>
          <Button
            color="secondary"
            className="w-full"
            iconLeading={<MessageCircle01 className="w-4 h-4" />}
          >
            Chat
          </Button>
        </div>
      </div>

      <div className="flex bg-white border-b border-gray-200 sticky top-0 z-10">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/profile"}
            className={({ isActive }) =>
              `flex-1 text-center text-[12px] font-semibold py-3 border-b-2 transition-colors ${
                isActive
                  ? "text-[#b92b27] border-[#b92b27]"
                  : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <div className="flex flex-col gap-0">
        <Outlet />
      </div>
    </div>
  );
};
