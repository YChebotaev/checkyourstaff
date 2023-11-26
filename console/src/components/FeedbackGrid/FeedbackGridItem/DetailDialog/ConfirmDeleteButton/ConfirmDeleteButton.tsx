import { type FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { ActionButton } from "../../../../Dialog";
import { useApiClient } from "../../../../../hooks/useApiClient";
import { parseFeedbackId } from "../../../../../utils/parseFeedbackId";

export const ConfirmDeleteButton: FC<{
  id: string;
  onSuccess(id: string): void;
}> = ({ id, onSuccess }) => {
  const apiClient = useApiClient();
  const { mutate } = useMutation({
    async mutationFn() {
      const { sessionId, feedbackType, feedbackId } = parseFeedbackId(id) ?? {};
      const { data } = await apiClient.post("/deleteFeedback", {
        sessionId,
        feedbackType,
        feedbackId,
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
      Подтвердить удаление
    </ActionButton>
  );
};
