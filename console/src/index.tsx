import React from "react";
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

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <useApiClient.Provider apiClient={apiClient}>
        <RouterProvider router={router} />
      </useApiClient.Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
