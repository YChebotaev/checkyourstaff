import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { type AxiosError } from "axios";
import type { AuthVerifyData, } from "@checkyourstaff/console-backend/types";
import { useApiClient } from "../../../hooks/useApiClient";

export const useAuthVerify = ({
  onSuccess,
  onError,
}: {
  onSuccess(data: AuthVerifyData): void;
  onError(error: AxiosError): void
}) => {
  const apiClient = useApiClient();
  const [searchParams] = useSearchParams();

  const { mutate } = useMutation({
    async mutationFn() {
      return apiClient.authVerify({
        id: searchParams.get("id")! /* Telegram user id */,
        firstName: searchParams.get("first_name")!,
        lastName: searchParams.get("last_name")!,
        username: searchParams.get("username")!,
        photoUrl: searchParams.get("photo_url")!,
        authDate: searchParams.get("auth_date")!,
        hash: searchParams.get("hash")!,
      })
    },
    onSuccess(data) {
      onSuccess(data);
    },
    onError(error: AxiosError) {
      onError(error)
    }
  });

  useEffect(() => {
    mutate();
  }, [mutate]);
};
