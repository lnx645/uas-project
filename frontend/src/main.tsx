import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import routes from "./routes";
import "./styles/globals.css";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);
