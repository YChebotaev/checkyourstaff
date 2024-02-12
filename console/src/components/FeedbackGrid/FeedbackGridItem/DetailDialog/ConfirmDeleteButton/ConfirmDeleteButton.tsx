import { type FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { ActionButton } from "../../../../Dialog";
import { useApiClient } from "../../../../../hooks/useApiClient";

export const ConfirmDeleteButton: FC<{
  id: number;
  onSuccess(id: number): void;
}> = ({ id, onSuccess }) => {
  const apiClient = useApiClient();
  const { mutate } = useMutation({
    async mutationFn() {
      return apiClient.deleteFeedback({ feedbackId: id })
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
      Подтвердить удаление
    </ActionButton>
  );
};
