import { createBrowserRouter } from "react-router";
import App from "./App";
import { ProfileLayout } from "./layouts/profile-layout";
import { middlewareAuth } from "@/layouts/app-layout";
const login = () => import("./view/login");
const reigster = () => import("./view/reigster");
const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "login",
        lazy: login,
      },
      {
        path: "register",
        lazy: reigster,
      },
      {
        lazy: () => import("@/layouts/app-layout"),
        middleware:[middlewareAuth],
        children: [
          {
            path: "",
            lazy: () => import("./view/explore"),
          },
          {
            path: "explore",
            lazy: () => import("./view/explore"),
          },
          {
            path: "post/1",
            lazy: () => import("./view/posts-detail"),
          },
          {
            path: "/user/profile/settings",
            lazy: () => import("./view/settings"),
          },
          {
            path: "user",
            Component: ProfileLayout,
            children: [
              {
                path: "profile",
                lazy: () => import("./view/profile"),
              },
            ],
          },
        ],
      },
    ],
  },
]);
export default router;
