import { useAsyncValue } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { SearchLg, MessageCircle02, MessageCheckSquare, Bell01 } from "@untitledui/icons";
import { UserDropdown } from "./user-dropdown";

export const Header = () => {
  const user: any = useAsyncValue();

  return (
    <nav className="h-14 w-full sticky top-0 z-50 bg-primary border-b border-secondary backdrop-blur-md bg-opacity-95">
      <div className="max-w-350 h-full px-4 mx-auto flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-brand-solid flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-sm">
            M
          </div>
          <h1 className="font-bold text-primary text-base tracking-tight hidden sm:block">
            mardi<span className="text-brand-secondary">ra</span>
          </h1>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-2 md:mx-6">
          <div className="relative w-full">
            <SearchLg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
            <input
              placeholder="Cari di Mardira Forums..."
              className="w-full text-sm rounded-full border border-secondary bg-secondary/30 pl-10 pr-4 py-2 outline-none focus:bg-primary focus:border-brand-solid focus:ring-1 focus:ring-brand-solid transition-all placeholder:text-tertiary/70"
            />
          </div>
        </div>

        {/* Right Side: Actions & Conditional Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-0.5 border-r border-secondary pr-2">
            <Button size="sm" color="tertiary" iconLeading={MessageCircle02} className="rounded-full" />
            <Button size="sm" color="tertiary" iconLeading={MessageCheckSquare} className="rounded-full" />
            <Button size="sm" color="tertiary" iconLeading={Bell01} className="rounded-full" />
          </div>

          {/* Menggunakan Optional Chaining yang ketat */}
          {user?.user ? (
            <UserDropdown />
          ) : (
            <Button href="/login" size="sm" color="primary" className="rounded-full px-5 font-semibold text-xs">
              Log In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};