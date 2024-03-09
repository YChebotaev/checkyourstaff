import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useApiClient } from "./hooks/useApiClient";
import { RegisterPage } from "./pages/RegisterPage";
import { PollSessionPage } from "./pages/PollSessionPage";
import { InvitePage } from "./pages/InvitePage";
import { KickPage } from "./pages/KickPage";
import { WebAppProvider } from "./components/WebAppProvider";
import { BullseyeLayout } from "./layouts/BullseyeLayout";
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
  {
    path: "kick",
    element: <KickPage />,
  },
]);

const rootEl = document.getElementById("root")!;

const reactRoot = ReactDOM.createRoot(rootEl);

reactRoot.render(
  <StrictMode>
    <useApiClient.Provider apiClient={apiClient}>
      <QueryClientProvider client={queryClient}>
        <WebAppProvider
          fallback={
            <BullseyeLayout>
              <span className="primary-loader"></span>
            </BullseyeLayout>
          }
          onSuccess={() => {
            Telegram.WebApp.ready();
          }}
          onError={() => {
            Telegram.WebApp.showAlert(
              "initData integrity not confirmed",
              () => {
                Telegram.WebApp.close();
              },
            );
          }}
        >
          {() => <RouterProvider router={router} />}
        </WebAppProvider>
      </QueryClientProvider>
    </useApiClient.Provider>
  </StrictMode>,
);
