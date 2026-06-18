import React from "react";
import {
  Await,
  Outlet,
  useLoaderData,
  type LoaderFunction,
  type MiddlewareFunction,
} from "react-router";
import api from "@/utils/axios";
import {
  useTopUsersWeekly,
  useActiveUsers,
  useTopTags,
} from "@/hooks/use-active-users";

import { Header } from "@/layouts/app/header";
import { LeftSidebar } from "@/layouts/app/left-sidebar";
import { RightSidebar } from "@/layouts/app/right-sidebar";
import { BottomNav } from "./app/bottom-nav";
import { userAuthContext } from "@/context/userContext";



export const middlewareAuth: MiddlewareFunction = async ({ context }) => {
  try {
    const token = localStorage.getItem("__auth");
    if (token) {
      const data = await api.get("/api/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.data) {
        const user: any = data?.data;
        context.set(userAuthContext, { ...user });
      }
    } else {
      context.set(userAuthContext, null);
    }
  } catch (error) {
    context.set(userAuthContext, null);
  }
};

export const loader: LoaderFunction = async ({ context }) => {
  const ctx = context.get(userAuthContext ?? null);
  return { user: ctx };
};

export const Component = () => {
  const user: any = useLoaderData();
  const [onlineUsers] = useActiveUsers();
  const [topUsers] = useTopUsersWeekly();
  const [trending] = useTopTags();
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-sm font-semibold text-tertiary">
          Loading forum layout...
        </div>
      }
    >
      <Await resolve={user}>
        <div className="min-h-screen bg-stone-100  selection:bg-brand-solid/10 antialiased">
          <Header />
          <div className="max-w-350 mx-auto px-4 flex gap-2 md:gap-4">
            <LeftSidebar />

            <main className="flex-1 min-w-0  px-0  min-h-[calc(100vh-3.5rem)] pb-20 lg:pb-6">
              <Outlet />
            </main>
            <RightSidebar
              onlineUsers={onlineUsers}
              topUsers={topUsers}
              trending={trending}
            />
          </div>
          <BottomNav />
        </div>
      </Await>
    </React.Suspense>
  );
};
