import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useApiClient } from "./hooks/useApiClient";
import { createApiClient } from "./lib/createApiClient";
import { createQueryClient } from "./lib/createQueryClient";
import { createRouter } from "./lib/createRouter";
import { AccountGuard } from "./components/AccountGuard";
import { AppLoading } from "./layouts/AppLoading";
import "./index.css";

const apiClient = createApiClient();
const queryClient = createQueryClient();
const rootEl = document.getElementById("root")!;
const reactRoot = ReactDOM.createRoot(rootEl);
const locationStartsWith = (prefix: string) =>
  location.pathname.startsWith(prefix);

export const refresh = () => {
  reactRoot.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <useApiClient.Provider apiClient={apiClient}>
          <Suspense fallback={<AppLoading />}>
            <AccountGuard
              skip={["/selectAccount", "/signout", "/signin"].some(
                locationStartsWith,
              )}
            >
              <RouterProvider router={createRouter()} />
            </AccountGuard>
          </Suspense>
        </useApiClient.Provider>
      </QueryClientProvider>
    </StrictMode>,
  );
};

refresh();
