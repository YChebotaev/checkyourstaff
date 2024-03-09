import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useApiClient } from "./hooks/useApiClient";
import { createApiClient } from "./lib/createApiClient";
import { createQueryClient } from "./lib/createQueryClient";
import { createRouter } from "./lib/createRouter";
import { AccountGuard } from "./components/AccountGuard";
import "./index.css";

const apiClient = createApiClient();
const queryClient = createQueryClient();
const reactRoot = ReactDOM.createRoot(document.getElementById("root")!);

export const refresh = () => {
  reactRoot.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <useApiClient.Provider apiClient={apiClient}>
          <AccountGuard>
            {() => <RouterProvider router={createRouter()} />}
          </AccountGuard>
        </useApiClient.Provider>
      </QueryClientProvider>
    </StrictMode>,
  );
};

refresh()
