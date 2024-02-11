import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { VerifyData } from "@checkyourstaff/webapp-backend/types";
import { BullseyeLayout } from "./layouts/BullseyeLayout";
import { useApiClient } from "./hooks/useApiClient";
import { RegisterPage } from "./pages/RegisterPage";
import { PollSessionPage } from "./pages/PollSessionPage";
import { InvitePage } from "./pages/InvitePage";
import { Text } from "./components/Text";
import "./global.css";

const apiClient = axios.create({
  baseURL: import.meta.env["VITE_BACKEND_URL"],
});
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "pollSession",
    element: <PollSessionPage />,
  },
  {
    path: "invite",
    element: <InvitePage />,
  },
]);

const rootEl = document.getElementById("root");

const getBotType = () => {
  const url = new URL(window.location.href);

  return url.searchParams.get("fromBot") as "polling-bot" | "control-bot";
};

if (!rootEl) {
  Telegram.WebApp.showAlert('Cannot find react root element ("#root")');
} else {
  const reactRoot = ReactDOM.createRoot(rootEl);

  apiClient
    .post<VerifyData>("/verify", {
      initData: Telegram.WebApp.initData,
      bot: getBotType(),
    })
    .then(({ data }) => {
      Telegram.WebApp.ready();

      if (data.valid) {
        reactRoot.render(
          <React.StrictMode>
            <useApiClient.Provider apiClient={apiClient}>
              <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
              </QueryClientProvider>
            </useApiClient.Provider>
          </React.StrictMode>,
        );
      } else {
        reactRoot.render(
          <React.StrictMode>
            <BullseyeLayout>
              <Text>initData integrity not confirmed</Text>
            </BullseyeLayout>
          </React.StrictMode>,
        );

        Telegram.WebApp.showAlert("initData integrity not confirmed", () => {
          Telegram.WebApp.close();
        });
      }
    })
    .catch((e) => {
      Telegram.WebApp.showAlert(e.stack);
    });
}
