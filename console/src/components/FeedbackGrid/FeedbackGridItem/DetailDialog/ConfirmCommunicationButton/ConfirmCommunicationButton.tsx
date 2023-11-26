import { type FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { ActionButton } from "../../../../Dialog";
import { useApiClient } from "../../../../../hooks/useApiClient";
import { parseFeedbackId } from "../../../../../utils/parseFeedbackId";

export const ConfirmCommunicationButton: FC<{
  id: string;
  username: string;
  role: string;
  onSuccess(id: string): void;
}> = ({ id, username, role, onSuccess }) => {
  const apiClient = useApiClient();
  const { mutate } = useMutation({
    async mutationFn() {
      const { sessionId, feedbackType, feedbackId } = parseFeedbackId(id) ?? {};
      const { data } = await apiClient.post("/sendMessage", {
        sessionId,
        feedbackType,
        feedbackId,
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
