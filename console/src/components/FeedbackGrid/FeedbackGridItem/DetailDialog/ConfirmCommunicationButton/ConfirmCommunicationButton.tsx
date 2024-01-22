import { type FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { ActionButton } from "../../../../Dialog";
import { useApiClient } from "../../../../../hooks/useApiClient";

export const ConfirmCommunicationButton: FC<{
  id: number;
  username: string;
  role: string;
  onSuccess(id: number): void;
}> = ({ id, username, role, onSuccess }) => {
  const apiClient = useApiClient();
  const { mutate } = useMutation({
    async mutationFn() {
      const { data } = await apiClient.post("/sendMessage", {
        feedbackId: id,
        username,
        role,
      });

      return data;
    },
    onSuccess() {
      onSuccess(id);
    },
  });

  return (
    <ActionButton
      onClick={() => {
        mutate();
      }}
    >
      Отправить
    </ActionButton>
  );
};
