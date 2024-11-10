import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ChartsSkeletonPage } from "../features/charts/pages/ChartsSkeletonPage";
import { FeedbackPage } from "../features/feedback/pages/FeedbackPage";
import { FeedbackSkeletonPage } from "../features/feedback/pages/FeedbackSkeletonPage";
import { getAccountId } from "./getAccountId";
import { getToken } from "./getToken";
import { SignOutPage } from "../features/auth/pages/LogoutPage";
import { SelectAccountPage } from "../features/account/pages/SelectAccountPage";
import { SelectAccountSkeletonPage } from "../features/account/pages/SelectAccountSkeletonPage";
import { SignInPage } from "../features/auth/pages/SignInPage";
import { SignInSuccessPage } from "../features/auth/pages/SignInSuccessPage";
import { SigninFailedPage } from "../features/auth/pages/SignInFailedPage";
import { StatsSkeletonPage } from "../features/stats/pages/StatsSkeletonPage";
import { StatsPage } from "../features/stats/pages/StatsPage";
import { ChartsIndexPage } from "../features/charts/pages/ChartsIndexPage";

const createAppRouter = () =>
  createBrowserRouter([
    {
      index: true,
      element: <Navigate to="/stats" />,
    },
    {
      path: "/stats",
      element: (
        <Suspense fallback={<StatsSkeletonPage />}>
          <StatsPage />
        </Suspense>
      ),
    },
    {
      path: "/charts",
      element: (
        <Suspense fallback={<ChartsSkeletonPage />}>
          <ChartsIndexPage />
        </Suspense>
      ),
    },
    {
      path: "/feedback",
      element: (
        <Suspense fallback={<FeedbackSkeletonPage />}>
          <FeedbackPage />
        </Suspense>
      ),
    },
    {
      path: "/signout",
      element: <SignOutPage />,
    },
  ]);

const createSelectAccountRouter = () =>
  createBrowserRouter([
    {
      path: "/selectAccount",
      element: (
        <Suspense fallback={<SelectAccountSkeletonPage />}>
          <SelectAccountPage />
        </Suspense>
      ),
    },
    {
      path: "/signout",
      element: <SignOutPage />,
    },
    {
      path: "*",
      element: <Navigate to="/selectAccount" />,
    },
  ]);

const createAuthRouter = () =>
  createBrowserRouter([
    {
      path: "/signin",
      element: <SignInPage />,
    },
    {
      path: "/signin/success",
      element: <SignInSuccessPage />,
    },
    {
      path: "/signin/failed",
      element: <SigninFailedPage />,
    },
    {
      path: "/signout",
      element: <SignOutPage />,
    },
    {
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
