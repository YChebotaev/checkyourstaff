import { useCallback, useState, type FC } from "react";
import { Navigate } from "react-router-dom";
import { AuthVerifyData } from "@checkyourstaff/console-backend/types";
import { useAuthVerify } from "../hooks/useAuthVerify";
import { setToken } from "../utils/setToken";
import { refresh } from "../main";
import { getToken } from "../utils/getToken";

export const SignInSuccessPage: FC = () => {
  const [redirectTo, setRedirectTo] = useState<"stats" | "failed" | null>(
    () => {
      const token = getToken();

      return token ? "stats" : null;
    },
  );

  useAuthVerify({
    onSuccess: useCallback(({ valid, token }: AuthVerifyData) => {
      if (valid) {
        if (token) {
          setToken(token);

          setRedirectTo("stats");
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
