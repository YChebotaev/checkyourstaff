import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type {
  StatsResp,
  ChartsDataResp,
  TextFeedbackResp,
  AccountsResp,
  SampleGroupsData,
} from "@checkyourstaff/console-backend/types";
import { useApiClient } from "./hooks/useApiClient";
import { ChartsPage } from "./pages/ChartsPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { StatsPage } from "./pages/StatsPage";
import type {
  SelectAccountLoaderResult,
  StatsLoaderResult,
  ChartsLoaderResult,
  FeedbackLoaderResult,
} from "./types";
import { SignInPage } from "./pages/SignInPage";
import { SignInSuccessPage } from "./pages/SignInSuccessPage";
import { SelectAccountPage } from "./pages/SelectAccountPage";
import { getToken } from "./utils/getToken";
import { getAccountId } from "./utils/getAccountId";
// import { setAccountId } from "./utils/setAccountId";
// import { setToken } from "./utils/setToken";

const apiClient = axios.create({
  baseURL: import.meta.env["VITE_BACKEND_URL"],
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const queryClient = new QueryClient();

const fetchAccounts = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: ["accounts"],
    async queryFn() {
      const { data } = await apiClient.get<AccountsResp>("/accounts");

      return data;
    },
  });

  return data;
};

const fetchStats = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: ["stats"],
    async queryFn() {
      const { data } = await apiClient.get<StatsResp>("/stats", {
        params: {
          accountId: getAccountId(),
        },
      });

      return data;
    },
  });

  return data;
};

const fetchCharts = async (sampleGroupId: number) => {
  const data = await queryClient.fetchQuery({
    queryKey: ["charts"],
    async queryFn() {
      const { data } = await apiClient.get<ChartsDataResp>("/charts", {
        params: {
          accountId: getAccountId(),
          sampleGroupId,
        },
      });

      return data;
    },
  });

  return data;
};

const fetchSampleGroups = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: ["sampleGroups"],
    async queryFn() {
      const { data } = await apiClient.get<SampleGroupsData>("/sampleGroups", {
        params: {
          accountId: getAccountId(),
        },
      });

      return data;
    },
  });

  return data;
};

const fetchTextFeedback = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: ["textFeedback"],
    async queryFn() {
      const { data } = await apiClient.get<TextFeedbackResp>("/textFeedback", {
        params: {
          accountId: getAccountId(),
        },
      });

      return data;
    },
  });

  return data;
};

const createRouter = () => {
  const token = getToken();
  const accountId = getAccountId();
  const isAuthenticated = token != null;
  const hasAccount = accountId != null;

  if (isAuthenticated) {
    if (hasAccount) {
      return createBrowserRouter([
        {
          index: true,
          element: <Navigate to="/stats" />,
        },
        {
          path: "/stats",
          element: <StatsPage />,
          async loader() {
            return {
              stats: await fetchStats(),
            } satisfies StatsLoaderResult;
          },
        },
        {
          path: "/charts",
          element: <ChartsPage />,
          async loader() {
            const sampleGroups = await fetchSampleGroups();
            const sampleGroupId = sampleGroups[0].id;

            return {
              sampleGroupId,
              chartsData: await fetchCharts(sampleGroupId),
            } satisfies ChartsLoaderResult;
          },
        },
        {
          path: "/charts/:sampleGroupId",
          element: <ChartsPage />,
          async loader({ params: { sampleGroupId: sampleGroupIdStr } }) {
            const sampleGroupId = Number(sampleGroupIdStr);

            return {
              sampleGroupId,
              chartsData: await fetchCharts(sampleGroupId),
            } satisfies ChartsLoaderResult;
          },
        },
        {
          path: "/feedback",
          element: <FeedbackPage />,
          async loader() {
            return {
              feedbackData: await fetchTextFeedback(),
            } satisfies FeedbackLoaderResult;
          },
        },
      ]);
    } else {
      return createBrowserRouter([
        {
          path: "*",
          element: <Navigate to="/selectAccount" />,
        },
        {
          path: "/selectAccount",
          element: <SelectAccountPage />,
          async loader() {
            return {
              accounts: await fetchAccounts(),
            } satisfies SelectAccountLoaderResult;
          },
        },
      ]);
    }
  } else {
    return createBrowserRouter([
      {
        path: "/signin",
        element: <SignInPage />,
      },
      {
        path: "/signin/success",
        element: <SignInSuccessPage />,
      },
      {
        path: "*",
        element: <Navigate to="/signin" />,
      },
    ]);
  }
};

const reactRoot = ReactDOM.createRoot(document.getElementById("root")!);

export const refresh = () => {
  reactRoot.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <useApiClient.Provider apiClient={apiClient}>
          <RouterProvider router={createRouter()} />
        </useApiClient.Provider>
      </QueryClientProvider>
    </StrictMode>,
  );
};

// TODO: Debug only
// setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNTU2ODIyN30.Bxrr4BrRdwjfxoqONaNgdADL59zRCkuTjvgrhTpCYIs')
// setAccountId(1)

refresh();
