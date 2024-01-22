import { useEffect, useRef, type FC } from "react";
import { AuthLayout } from "../layouts/AuthLayout";

export const SignInPage: FC = () => {
  const loginWidgetParentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = document.createElement("script");

    s.src = "https://telegram.org/js/telegram-widget.js?22";
    s.dataset.telegramLogin = "checkyourstaffcontrolbot";
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
    </AuthLayout>
  );
};
