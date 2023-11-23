import { type FC } from "react";
import { Root } from "./styled";
import { useDialog } from "../../../../../hooks/useDialog";
import { CommunicateDialog } from "./CommunicateDialog";
import { useInsideDialog } from "../../../../../hooks/useInsideDialog";

export const CommunicateButton: FC<{ id: string }> = ({ id }) => {
  const { handleClose } = useInsideDialog();
  const { element: communicateDialogElement, toggle: communicateDialogToggle } =
    useDialog(
      <CommunicateDialog
        id={id}
        onStartCommunication={() => {
          handleClose();
        }}
      />,
    );

  return (
    <>
      <Root
        onClick={(e) => {
          e.stopPropagation();

          communicateDialogToggle();
        }}
      >
        Предложить сотруднику обсудить
      </Root>
      {communicateDialogElement}
    </>
  );
};
