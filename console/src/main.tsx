import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@checkyourstaff/console-backend/client";
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
import { LogoutPage } from "./pages/LogoutPage";
import { getToken } from "./utils/getToken";
import { getAccountId } from "./utils/getAccountId";
import { setAccountId } from "./utils/setAccountId";

const apiClient = createClient({
  baseURL: import.meta.env["VITE_BACKEND_URL"],
  getToken: () => getToken() ?? undefined,
});

const queryClient = new QueryClient();

const fetchAccounts = async () => {
  const data = await queryClient.fetchQuery({
    queryKey: ["accounts"],
    async queryFn() {
      return apiClient.getAccounts();
    },
  });

  return data;
};

const fetchStats = async () => {
  return queryClient.fetchQuery({
    queryKey: ["stats"],
    async queryFn() {
      return apiClient.getStats({
        accountId: getAccountId()!,
      });
    },
  });
};

const fetchCharts = async (sampleGroupId: number) => {
  return queryClient.fetchQuery({
    queryKey: ["charts"],
    async queryFn() {
      return apiClient.getCharts({
        accountId: getAccountId()!,
        sampleGroupId,
      });
    },
  });
};

const fetchSampleGroups = async () => {
  return queryClient.fetchQuery({
    queryKey: ["sampleGroups"],
    async queryFn() {
      return apiClient.getSampleGroups({
        accountId: getAccountId()!,
      });
    },
  });
};

const fetchTextFeedback = async () => {
  return queryClient.fetchQuery({
    queryKey: ["textFeedback"],
    async queryFn() {
      return apiClient.getTextFeedback({
        accountId: getAccountId()!,
      });
    },
  });
};

const createRouter = () => {
  const token = getToken();
  const accountId = getAccountId();
  const isAuthenticated = token != null;
  const hasAccount = accountId != null;

  if (isAuthenticated) {
    console.log(99);

    if (hasAccount) {
      console.log(102);

      return createBrowserRouter([
        {
          id: "navigate-stats",
          index: true,
          element: <Navigate to="/stats" />,
        },
        {
          id: "stats",
          path: "/stats",
          element: <StatsPage />,
          async loader() {
            return {
              stats: await fetchStats(),
            } satisfies StatsLoaderResult;
          },
        },
        {
          id: "charts",
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
          id: "charts-details",
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
          id: "feedback",
          path: "/feedback",
          element: <FeedbackPage />,
          async loader() {
            return {
              feedbackData: await fetchTextFeedback(),
            } satisfies FeedbackLoaderResult;
          },
        },
        {
          id: "signout",
          path: "/signout",
          element: <LogoutPage />,
        },
      ]);
    } else {
      console.log(158);

      return createBrowserRouter([
        {
          id: "navigate-select-account",
          path: "*",
          element: <Navigate to="/selectAccount" />,
        },
        {
          id: "select-account",
          path: "/selectAccount",
          element: <SelectAccountPage />,
          async loader() {
            return {
              accounts: await fetchAccounts(),
            } satisfies SelectAccountLoaderResult;
          },
        },
        {
          id: "signout",
          path: "/signout",
          element: <LogoutPage />,
        },
      ]);
    }
  } else {
    console.log(181);

    return createBrowserRouter([
      {
        id: "signin",
        path: "/signin",
        element: <SignInPage />,
      },
      {
        id: "signin-success",
        path: "/signin/success",
        element: <SignInSuccessPage />,
      },
      {
        id: "signout",
        path: "/signout",
        element: <LogoutPage />,
      },
      {
        id: "navigate-signin",
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

{
  const token = getToken();

  if (window.location.pathname === "/signin/success") {
    refresh();
  } else if (token == null) {
    if (window.location.pathname !== "/signin") {
      window.location.href = "/signin";
    }

    refresh();
  } else {
    apiClient
      .getAccounts()
      .then((accounts) => {
        const accountId = getAccountId();

        /**
         * @todo
         * Если `accountId` нет в списке `accounts`,
         * это значит, что пользователь потерял
         * свой административный доступ.
         * В этом случае должно быть
         * перенаправление куда-то
         */

        if (accountId == null) {
          if (accounts.length === 0) {
            // TODO: To implement
          } else if (accounts.length === 1) {
            setAccountId(accounts[0].id);

            window.location.href = "/stats";
          } else {
            window.location.href = "/selectAccount";
          }
        }

        refresh();
      })
      .catch((e) => {
        // TODO: To implement

        console.error(e);
      });
  }
}
