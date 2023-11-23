import { type FC } from "react";
import { Dialog } from "../../../Dialog";
import { Header } from "../Header";
import { Body } from "../styled";
import { Inner, Actions, Button } from "./styled";
import { DeleteButton } from "./DeleteButton";
import { CommunicateButton } from "./CommunicateButton";
import { useInsideDialog } from "../../../../hooks/useInsideDialog";

export const DetailDialog: FC<{
  id: string
  date: string;
  text: string;
  score?: number;
  onDeleteItem(id: string): void
}> = ({ id, date, text, score, onDeleteItem }) => {
  const { handleClose } = useInsideDialog();

  return (
    <Dialog>
      <Inner>
        <Header date={date} score={score} />
        <Body>{text}</Body>
        <Actions>
          <Button onClick={handleClose}>Закрыть</Button>
          <DeleteButton id={id} onSuccess={onDeleteItem} />
          <CommunicateButton id={id} />
        </Actions>
      </Inner>
    </Dialog>
  );
};
