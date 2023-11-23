import { type FC } from "react";
import { Root } from "./styled";
import { useDialog } from "../../../../../hooks/useDialog";
import { ConfirmDialog } from "./ConfirmDialog";

export const DeleteButton: FC<{ id: string, onSuccess(id: string): void }> = ({ id, onSuccess }) => {
  const { element: confirmDialogElement, toggle: toggleConfirmDialog } =
    useDialog(<ConfirmDialog id={id} onSuccess={onSuccess} />);

  return (
    <Root onClick={() => toggleConfirmDialog()}>
      Удалить
      {confirmDialogElement}
    </Root>
  );
};
