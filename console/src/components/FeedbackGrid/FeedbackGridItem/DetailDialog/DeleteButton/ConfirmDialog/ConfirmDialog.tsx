import { type FC } from "react";
import { Dialog } from "../../../../../Dialog";
import { useInsideDialog } from "../../../../../../hooks/useInsideDialog";
import { Actions, Button, Inner, Body } from "./styled";
import { ActuallyDeleteButton } from "./ActuallyDeleteButton";

export const ConfirmDialog: FC<{ id: string, onSuccess(id: string): void }> = ({ id, onSuccess }) => {
  const { handleClose } = useInsideDialog();

  return (
    <Dialog>
      <Inner>
        <Body>Подтверждаете удаление отзыва?</Body>
        <Actions>
          <Button onClick={handleClose}>Отмена</Button>
          <ActuallyDeleteButton id={id} onSuccess={onSuccess} />
        </Actions>
      </Inner>
    </Dialog>
  );
};
