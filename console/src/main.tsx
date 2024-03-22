import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useApiClient } from "./hooks/useApiClient";
import { createApiClient } from "./lib/createApiClient";
import { createQueryClient } from "./lib/createQueryClient";
import { createRouter } from "./lib/createRouter";
import { AccountGuard } from "./components/AccountGuard";
import { TokenGuard } from "./components/TokenGuard";
import "./index.css";

const apiClient = createApiClient();
const queryClient = createQueryClient();
const reactRoot = ReactDOM.createRoot(document.getElementById("root")!);

export const refresh = () => {
  reactRoot.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <useApiClient.Provider apiClient={apiClient}>
          <TokenGuard>
            {(skipAccounts) =>
              skipAccounts ? (
                <RouterProvider router={createRouter()} />
              ) : (
                <AccountGuard
                  skip={
                    location.pathname.startsWith("/selectAccount") ||
                    location.pathname.startsWith("/signout") ||
                    location.pathname.startsWith('/signin')
                  }
                >
                  {() => <RouterProvider router={createRouter()} />}
                </AccountGuard>
              )
            }
          </TokenGuard>
        </useApiClient.Provider>
      </QueryClientProvider>
    </StrictMode>,
  );
};

refresh();
