import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { getBotType } from "./lib/getBotType";
import { createApiClient } from "./lib/createApiClient";
import { createQueryClient } from "./lib/createQueryClient";
import { useApiClient } from "./hooks/useApiClient";
import { RegisterPage } from "./pages/RegisterPage";
import { PollSessionPage } from "./pages/PollSessionPage";
import { InvitePage } from "./pages/InvitePage";
import { KickPage } from "./pages/KickPage";
import { WebAppProvider } from "./components/WebAppProvider/WebAppProvider";
import { BullseyeLayout } from "./layouts/BullseyeLayout";
import "./global.css";

const apiClient = createApiClient();
const queryClient = createQueryClient();
const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/pollSession",
    element: <PollSessionPage />,
  },
  {
    path: "/invite",
    element: <InvitePage />,
  },
  {
    path: "/kick",
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
          botType={getBotType()}
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
          <RouterProvider router={router} />
        </WebAppProvider>
      </QueryClientProvider>
    </useApiClient.Provider>
  </StrictMode>,
);
