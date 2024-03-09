import { useMutation } from "@tanstack/react-query";
import { useEffect, type FC, type ReactNode, useMemo } from "react";
import { useApiClient } from "../hooks/useApiClient";
import { VerifyData } from "@checkyourstaff/webapp-backend/types";

const getBotType = () => {
  const url = new URL(window.location.href);

  return url.searchParams.get("fromBot") as "polling-bot" | "control-bot";
};

export const WebAppProvider: FC<{
  fallback: ReactNode;
  onSuccess(): void;
  onError(): void;
  children(): ReactNode;
}> = ({ fallback, onSuccess, onError, children }) => {
  const apiClient = useApiClient();
  const { data, mutate } = useMutation({
    async mutationFn() {
      const { data } = await apiClient.post<VerifyData>("/verify", {
        initData: Telegram.WebApp.initData,
        bot: getBotType(),
      });

      return data;
    },
    onSuccess: onSuccess,
    onError: onError,
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  return useMemo(() => {
    if (data && data.valid) {
      return children();
    }

    return fallback;
  }, [data, fallback, children]);
};
