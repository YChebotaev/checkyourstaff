import { StrictMode, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useApiClient } from "./hooks/useApiClient";
import { StatsPage } from "./pages/StatsPage";
import { ChartsPage } from "./pages/ChartsPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import type {
  ChartsLoaderResult,
  FeedbackLoaderResult,
  StatsLoaderResult,
} from "./types";
import reportWebVitals from "./reportWebVitals";
import "./style.css";
import {
  StatsResp,
  ChartsDataResp,
  TextFeedbackResp,
} from "@checkyourstaff/service/types";
import { AppLoading } from "./layouts/AppLoading";
import { ForgotPage } from "./pages/ForgotPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import type { AuthCheckData } from "@checkyourstaff/console-backend/types";

const queryClient = new QueryClient();

const fetchStats = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: ["stats"],
    async queryFn() {
      const { data } = await apiClient.get<StatsResp>("/stats");

      return data;
    },
  });

  return data;
};

const fetchChartsData = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: ["chartsData"],
    async queryFn() {
      const { data } = await apiClient.get<ChartsDataResp>("/chartsData");

      return data;
    },
  });

  return data;
};

const fetchTextFeedback = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: ["textFeedback"],
    async queryFn() {
      const { data } = await apiClient.get<TextFeedbackResp>("/textFeedback");

      return data;
    },
  });

  return data;
};

const apiClient = axios.create({
  baseURL: process.env["REACT_APP_SERVICE_URL"],
});
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const router = createBrowserRouter([
  {
    index: true,
    element: <Navigate replace to="/stats" />,
  },
  {
    path: "/signin",
    element: <Navigate replace to="/" />,
  },
  {
    path: "/signup",
    element: <Navigate replace to="/" />,
  },
  {
    path: "/forgot",
    element: <Navigate replace to="/" />,
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
      return {
        chartsData: await fetchChartsData(),
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

const authRouter = createBrowserRouter([
  {
    index: true,
    element: <Navigate to="/signin" />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/forgot",
    element: <ForgotPage />,
  },
]);

root.render(
  <StrictMode>
    <AppLoading />
  </StrictMode>,
);

let authorizationIterceptorId: number;

const init = async () => {
  const { data } = await apiClient.post<AuthCheckData>("/auth/check", {
    accessToken: localStorage.getItem("accessToken"),
  });

  const wrapper = (children: ReactNode) => (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <useApiClient.Provider apiClient={apiClient}>
          {children}
        </useApiClient.Provider>
      </QueryClientProvider>
    </StrictMode>
  );

  if (data.authenticated) {
    authorizationIterceptorId = apiClient.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    root.render(wrapper(<RouterProvider router={router} />));
  } else {
    root.render(wrapper(<RouterProvider router={authRouter} />));
  }
};

export const reload = async () => {
  apiClient.interceptors.request.eject(authorizationIterceptorId);

  await init();
};

init();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
