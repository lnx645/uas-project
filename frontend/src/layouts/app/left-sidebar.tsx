import { Button } from "@/components/base/buttons/button";
import {
  Plus,
  Home02,
  Compass03,
  MessageCheckSquare,
  Users01,
  BookOpen01,
  Settings01,
} from "@untitledui/icons";
import { Link } from "react-router";

const navItems = [
  { to: "/", label: "Beranda", icon: Home02, active: true },
  { to: "/explore", label: "Explore", icon: Compass03, active: false },
  { to: "/", label: "Tanya Jawab", icon: MessageCheckSquare, active: false },
  { to: "/", label: "Komunitas", icon: Users01, active: false },
  { to: "/", label: "Materi Kuliah", icon: BookOpen01, active: false },
  { to: "/", label: "Pengaturan", icon: Settings01, active: false },
];

export const LeftSidebar = () => (
  <aside className="hidden lg:flex flex-col w-64 shrink-0 py-4 pr-2 h-[calc(100vh-4rem)] sticky top-14 self-start overflow-y-auto no-scrollbar">
    <nav className="flex flex-col gap-0.5">
      {navItems.map((item) => (
        <Link
          to={item.to}
          key={item.label}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-normal transition-all ${
            item.active
              ? "bg-stone-200 text-primary font-semibold"
              : "bg-stone-100 text-tertiary hover:bg-stone-200/60 hover:text-primary"
          }`}
        >
          <item.icon
            className={`w-5 h-5 ${item.active ? "text-brand-secondary" : "text-tertiary"}`}
          />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
    <div className="mt-4 pt-4 border-t border-secondary px-4">
      <Button
        className="w-full rounded-full font-semibold shadow-sm text-xs py-2.5"
        iconLeading={Plus}
      >
        Buat Postingan
      </Button>
    </div>
  </aside>
);
