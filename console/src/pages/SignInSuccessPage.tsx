import { useCallback, useState, type FC } from "react";
import { Navigate } from "react-router-dom";
import { AuthVerifyData } from "@checkyourstaff/console-backend/types";
import { useAuthVerify } from "../hooks/useAuthVerify";
import { setToken } from "../utils/setToken";
import { refresh } from "../main";
import { getToken } from "../utils/getToken";
import { useApiClient } from "../hooks/useApiClient";
import { setAccountId } from "../utils/setAccountId";

export const SignInSuccessPage: FC = () => {
  const apiClient = useApiClient();
  const [redirectTo, setRedirectTo] = useState<
    "stats" | "failed" | "selectAccount" | null
  >(() => {
    const token = getToken();

    return token ? "stats" : null;
  });

  useAuthVerify({
    onSuccess: useCallback(
      async ({ valid, token }: AuthVerifyData) => {
        if (valid) {
          if (token) {
            setToken(token);

            const accounts = await apiClient.getAccounts();

            if (accounts.length === 0) {
              // TODO: To implement
            } else if (accounts.length === 1) {
              setAccountId(accounts[0].id);

              setRedirectTo("stats");
            } else {
              setRedirectTo("selectAccount");
            }

            refresh();
          }
        } else {
          setRedirectTo("failed");
        }
      },
      [apiClient],
    ),
  });

  if (redirectTo == null) {
    return null;
  } else if (redirectTo === "failed") {
    return "Не удается подтвердить подлинность аккаунта";
  } else if (redirectTo === "selectAccount") {
    return <Navigate to="/selectAccount" />;
  } else if (redirectTo === "stats") {
    return <Navigate to="/stats" />;
  }
};
