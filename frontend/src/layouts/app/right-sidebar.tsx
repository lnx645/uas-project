import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Link } from "react-router";

export const RightSidebar = ({
  onlineUsers = [],
  topUsers = [],
  trending = [],
}: any) => (
  <aside className="hidden xl:flex flex-col w-77.5 shrink-0 py-4 pl-2 gap-4 h-[calc(100vh-4rem)] sticky top-14 self-start overflow-y-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
    <div className="rounded-xl border border-secondary bg-primary p-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-tertiary mb-3.5">
        Paling Aktif Minggu Ini
      </h2>
      <div className="flex flex-col gap-3">
        {topUsers?.map((user: any, i: any) => (
          <div
            key={user?.name}
            className="flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xs font-bold text-tertiary w-4 text-center shrink-0">
                {i + 1}
              </span>
              <Avatar
                size="sm"
                src={user?.avatarUrl}
                status={user?.isOnline ? "online" : "offline"}
                className="ring-1 ring-secondary shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary truncate group-hover:text-brand-secondary transition-colors">
                  {user?.name}
                </p>
                <p className="text-xs text-tertiary truncate">
                  {user?.kredensial ?? "Unknown"}
                </p>
              </div>
            </div>
            <Badge
              color="error"
              size="sm"
              className="font-bold tracking-tight shrink-0 rounded-md"
            >
              {user?.points} pt
            </Badge>
          </div>
        ))}
      </div>
    </div>

    {/* Card 2: Sedang Tren */}
    <div className="rounded-xl border border-secondary bg-white p-4">
      <h2 className="text-xs font-bold uppercase tracking-wider text-tertiary mb-3">
        Sedang Tren
      </h2>
      <div className="flex flex-col gap-2.5">
        {trending?.map((tag: any) => (
          <div key={tag?.id} className="group cursor-pointer">
            <Link
              to={"/post/tag/" + tag?.slug}
              className="text-sm font-semibold text-brand-secondary group-hover:underline"
            >
              #{tag?.name}
            </Link>
            <p className="text-[11px] text-tertiary">
              {tag?.totalPost} postingan hari ini
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Card 3: Sedang Online */}
    <div className="rounded-xl border border-secondary bg-white p-4">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-tertiary">
          Sedang Online
        </h2>
        <Badge
          size="sm"
          className="bg-green-500/10 text-green-600 font-bold border-none px-2 rounded-full"
        >
          {onlineUsers?.length || 0} Aktif
        </Badge>
      </div>
      <div className="flex flex-col gap-3 max-h-24 min-h-24 overflow-y-auto no-scrollbar">
        {onlineUsers?.length > 0 ? (
          onlineUsers?.map((user: any) => (
            <div key={user?.id} className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Avatar
                  size="sm"
                  src={user?.avatarUrl}
                  className="ring-1 ring-secondary"
                />
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary truncate leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-tertiary truncate">
                  {user?.kredensial ?? "Penguna Quora"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-tertiary italic text-center py-2">
            Tidak ada yang online
          </p>
        )}
      </div>
    </div>
  </aside>
);
