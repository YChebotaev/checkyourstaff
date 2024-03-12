import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ChartsSkeletonPage } from "../features/charts/pages/ChartsSkeletonPage";
import { FeedbackPage } from "../features/feedback/pages/FeedbackPage";
import { FeedbackSkeletonPage } from "../features/feedback/pages/FeedbackSkeletonPage";
import { getAccountId } from "./getAccountId";
import { getToken } from "./getToken";
import { ChartsPage } from "../features/charts/pages/ChartsPage";
import { ChartsRedirectToDefaultPage } from "../features/charts/pages/ChartsRedirectToDefaultPage";
import { SignOutPage } from "../features/auth/pages/LogoutPage";
import { SelectAccountPage } from "../features/account/pages/SelectAccountPage";
import { SelectAccountSkeletonPage } from "../features/account/pages/SelectAccountSkeletonPage";
import { SignInPage } from "../features/auth/pages/SignInPage";
import { SignInSuccessPage } from "../features/auth/pages/SignInSuccessPage";
import { StatsSkeletonPage } from "../features/stats/pages/StatsSkeletonPage";
import { StatsPage } from "../features/stats/pages/StatsPage";

const createAppRouter = () =>
  createBrowserRouter([
    {
      id: "navigate-stats",
      index: true,
      element: <Navigate to="/stats" />,
    },
    {
      id: "stats",
      path: "/stats",
      element: (
        <Suspense fallback={<StatsSkeletonPage />}>
          <StatsPage />
        </Suspense>
      ),
    },
    {
      id: "charts",
      path: "/charts",
      element: (
        <Suspense fallback={<ChartsSkeletonPage />}>
          <ChartsRedirectToDefaultPage />
        </Suspense>
      ),
    },
    {
      id: "charts-details",
      path: "/charts/:sampleGroupId",
      element: (
        <Suspense fallback={<ChartsSkeletonPage />}>
          <ChartsPage />
        </Suspense>
      ),
    },
    {
      id: "feedback",
      path: "/feedback",
      element: (
        <Suspense fallback={<FeedbackSkeletonPage />}>
          <FeedbackPage />
        </Suspense>
      ),
    },
    {
      id: "signout",
      path: "/signout",
      element: <SignOutPage />,
    },
  ]);

const createSelectAccountRouter = () =>
  createBrowserRouter([
    {
      id: "navigate-select-account",
      path: "*",
      element: <Navigate to="/selectAccount" />,
    },
    {
      id: "select-account",
      path: "/selectAccount",
      element: (
        <Suspense fallback={<SelectAccountSkeletonPage />}>
          <SelectAccountPage />
        </Suspense>
      ),
    },
    {
      id: "signout",
      path: "/signout",
      element: <SignOutPage />,
    },
  ]);

const createAuthRouter = () =>
  createBrowserRouter([
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
      element: <SignOutPage />,
    },
    {
      id: "navigate-signin",
      path: "*",
      element: <Navigate to="/signin" />,
    },
  ]);

export const createRouter = () => {
  const token = getToken();
  const accountId = getAccountId();
  const isAuthenticated = token != null;
  const hasAccount = accountId != null;

  if (isAuthenticated) {
    if (hasAccount) {
      return createAppRouter();
    } else {
      return createSelectAccountRouter();
    }
  } else {
    return createAuthRouter();
  }
};
