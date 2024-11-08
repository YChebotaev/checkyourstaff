import { useEffect, useRef, type FC } from "react";
import { useNavigate } from "react-router";
import { AuthLayout } from "../../../layouts/AuthLayout";
import { useApiClient } from "../../../hooks/useApiClient";
import { setToken } from "../../../lib/setToken";
import { refresh } from "../../../main";
import { setAccountId } from "../../../lib/setAccountId";

const enableTestAccount = import.meta.env.VITE_ENABLE_TEST_ACCOUNT === "true";

export const SignInPage: FC = () => {
  const loginWidgetParentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const apiClient = useApiClient();

  useEffect(() => {
    const s = document.createElement("script");

    s.src = "https://telegram.org/js/telegram-widget.js?22";
    s.dataset.telegramLogin = import.meta.env["VITE_CONTROL_BOT_NAME"];
    s.dataset.size = "large";

    const authURL = new URL(
      "/signin/success",
      import.meta.env["VITE_AUTH_URL"],
    );

    s.dataset.authUrl = authURL.toString();
    s.dataset.requestAccess = "write";

    loginWidgetParentRef.current?.appendChild(s);

    return () => {
      s.remove();
    };
  }, []);

  return (
    <AuthLayout>
      <div ref={loginWidgetParentRef} />
      {enableTestAccount && (
        <button
          onClick={async () => {
            const { token } = await apiClient.authTest();

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
          }}
        >
          Тестовый логин
        </button>
      )}
    </AuthLayout>
  );
};
