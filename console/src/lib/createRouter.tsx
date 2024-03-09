import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ChartsSkeletonPage } from "../pages/ChartsSkeletonPage";
import { FeedbackSkeletonPage } from "../pages/FeedbackSkeletonPage";
import { StatsSkeletonPage } from "../pages/StatsSkeletonPage";
import { getAccountId } from "../utils/getAccountId";
import { getToken } from "../utils/getToken";
import { ChartsPage } from "../pages/ChartsPage";
import { ChartsRedirectToDefaultPage } from "../pages/ChartsRedirectToDefaultPage";
import { FeedbackPage } from "../pages/FeedbackPage";
import { LogoutPage } from "../pages/LogoutPage";
import { SelectAccountPage } from "../pages/SelectAccountPage";
import { SelectAccountSkeletonPage } from "../pages/SelectAccountSkeletonPage";
import { SignInPage } from "../pages/SignInPage";
import { SignInSuccessPage } from "../pages/SignInSuccessPage";
import { StatsPage } from "../pages/StatsPage";

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
      element: <LogoutPage />,
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
      element: <LogoutPage />,
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
      element: <LogoutPage />,
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
