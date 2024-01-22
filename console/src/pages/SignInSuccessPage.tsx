import { useCallback, useState, type FC } from "react";
import { Navigate } from "react-router-dom";
import { AuthVerifyData } from "@checkyourstaff/console-backend/types";
import { useAuthVerify } from "../hooks/useAuthVerify";
import { setToken } from "../utils/setToken";
import { refresh } from "../main";
import { setAccountId } from "../utils/setAccountId";

export const SignInSuccessPage: FC = () => {
  const [redirectTo, setRedirectTo] = useState<
    "stats" | "select-account" | "failed" | null
  >(null);
  useAuthVerify({
    onSuccess: useCallback(({ valid, token, accountId }: AuthVerifyData) => {
      if (valid) {
        if (token) {
          setToken(token);

          setRedirectTo("stats");
        }

        if (accountId) {
          setAccountId(accountId);
        } else {
          setRedirectTo("select-account");
        }

        refresh();
      } else {
        setRedirectTo("failed");
      }
    }, []),
  });

  if (redirectTo == null) {
    return null;
  } else if (redirectTo === "failed") {
    return "Не удается подтвердить подлинность аккаунта";
  } else if (redirectTo === "stats") {
    return <Navigate to="/stats" />;
  }
};