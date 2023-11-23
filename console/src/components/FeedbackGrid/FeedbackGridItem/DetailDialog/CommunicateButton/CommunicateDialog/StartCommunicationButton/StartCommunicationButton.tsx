import { type FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { Root } from "./styled";
import { useApiClient } from "../../../../../../../hooks/useApiClient";
import { useInsideDialog } from "../../../../../../../hooks/useInsideDialog";
import { parseFeedbackId } from "../../../../../../../utils/parseFeedbackId";

export const StartCommunicationButton: FC<{
  id: string;
  username: string;
  disable: boolean;
  onSuccess(): void;
}> = ({ id, username, disable, onSuccess }) => {
  const { handleClose } = useInsideDialog();
  const apiClient = useApiClient();
  const { mutate } = useMutation({
    async mutationFn() {
      const { sessionId, feedbackType, feedbackId } = parseFeedbackId(id) ?? {};
      const { data } = await apiClient.post("/sendMessage", {
        sessionId,
        feedbackType,
        feedbackId,
        username,
      });

      return data;
    },
    onSuccess() {
      handleClose();

      onSuccess();
    },
  });

  return (
    <Root
      disabled={disable}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        mutate();
      }}
    >
      Написать сообщение
    </Root>
  );
};
