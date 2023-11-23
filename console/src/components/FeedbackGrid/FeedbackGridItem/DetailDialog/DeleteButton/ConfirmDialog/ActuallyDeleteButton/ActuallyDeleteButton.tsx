import { type FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { Root } from "./styled";
import { useInsideDialog } from "../../../../../../../hooks/useInsideDialog";
import { useApiClient } from "../../../../../../../hooks/useApiClient";
import { parseFeedbackId } from "../../../../../../../utils/parseFeedbackId";

export const ActuallyDeleteButton: FC<{
  id: string;
  onSuccess(id: string): void;
}> = ({ id, onSuccess }) => {
  const apiClient = useApiClient();
  const { handleClose } = useInsideDialog();
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

      handleClose();
    },
  });

  return (
    <Root
      onClick={() => {
        mutate();
      }}
    >
      Подтвердить
    </Root>
  );
};
