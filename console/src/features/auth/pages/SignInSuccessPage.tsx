import { useCallback, type FC } from "react";
import type { AuthVerifyData } from "@checkyourstaff/console-backend/types";
import { useNavigate } from "react-router-dom";
import { useAuthVerify } from "../hooks/useAuthVerify";
import { setToken } from "../../../lib/setToken";
import { refresh } from "../../../main";
import { useApiClient } from "../../../hooks/useApiClient";
import { setAccountId } from "../../../lib/setAccountId";

export const SignInSuccessPage: FC = () => {
  const navigate = useNavigate();
  const apiClient = useApiClient();

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

              refresh();

              navigate("/stats");
            } else {
              refresh();

              navigate("/selectAccount");
            }
          }
        } else {
          navigate("/signin/failed");
        }
      },
      [apiClient, navigate],
    ),
    onError: useCallback(() => {
      navigate("/signin/failed");
    }, [navigate]),
  });

  return null;
};
