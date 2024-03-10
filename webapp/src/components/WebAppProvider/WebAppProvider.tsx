import { useMutation } from "@tanstack/react-query";
import { useEffect, type FC, type ReactNode, useMemo } from "react";
import type { BotType, VerifyData } from "@checkyourstaff/webapp-backend/types";
import { useApiClient } from "../../hooks/useApiClient";

export const WebAppProvider: FC<{
  botType: BotType;
  fallback: ReactNode;
  onSuccess(): void;
  onError(): void;
  children: ReactNode;
}> = ({ botType, fallback, onSuccess, onError, children }) => {
  const apiClient = useApiClient();
  const { data, mutate } = useMutation({
    async mutationFn() {
      const { data } = await apiClient.post<VerifyData>("/verify", {
        initData: Telegram.WebApp.initData,
        bot: botType,
      });

      return data;
    },
    onSuccess: onSuccess,
    onError: onError,
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  return useMemo(
    () => (data && data.valid ? children : fallback),
    [data, fallback, children],
  );
};
