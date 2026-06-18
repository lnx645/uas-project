import { useAsyncValue } from "react-router";
import { Plus, Home02, Compass03, MessageCheckSquare, Bell01 } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";

const mobileNavItems = [
  { label: "Beranda", icon: Home02, active: true },
  { label: "Explore", icon: Compass03, active: false },
  { label: "Tanya", icon: MessageCheckSquare, active: false },
  { label: "Notif", icon: Bell01, active: false },
];

export const BottomNav = () => {
  const user: any = useAsyncValue();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-t border-secondary shadow-lg">
      <div className="flex items-center justify-around h-14 relative max-w-md mx-auto">
        
        {/* Nav Item Kiri (Slot 1 & 2) */}
        {mobileNavItems.slice(0, 2).map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium transition-colors ${
              item.active ? "text-brand-secondary font-semibold" : "text-tertiary"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}

        {/* Center Floating Action Button (FAB) Style */}
        <div className="flex-1 flex items-center justify-center -translate-y-2">
          <button className="w-11 h-11 rounded-full bg-brand-solid text-white flex items-center justify-center shadow-md shadow-brand-solid/20 active:scale-95 transition-transform">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Item Kanan (Slot 3) */}
        <button
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium text-tertiary`}
        >
          <MessageCheckSquare className="w-5 h-5" />
          <span>Tanya</span>
        </button>

        {/* Slot 4 Dinamis: Menampilkan Avatar jika sudah Login, atau icon Notif jika Guest */}
        <button
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium text-tertiary`}
        >
          {user?.user ? (
            <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-secondary">
              <Avatar size="sm" src={user?.user?.avatarUrl} />
            </div>
          ) : (
            <Bell01 className="w-5 h-5" />
          )}
          <span>{user?.user ? "Profil" : "Notif"}</span>
        </button>

      </div>
    </nav>
  );
};