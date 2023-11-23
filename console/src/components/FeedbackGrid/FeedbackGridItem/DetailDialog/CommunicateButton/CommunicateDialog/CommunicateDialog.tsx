import { useState, type FC } from "react";
import { Inner, Body, Actions, Button, Input } from "./styled";
import { Dialog } from "../../../../../Dialog";
import { StartCommunicationButton } from "./StartCommunicationButton";
import { useInsideDialog } from "../../../../../../hooks/useInsideDialog";

export const CommunicateDialog: FC<{
  id: string
  onStartCommunication(): void;
}> = ({ id, onStartCommunication }) => {
  const { handleClose } = useInsideDialog();
  const [username, setUsername] = useState("");

  return (
    <Dialog>
      <Inner>
        <Body>
          <p>
            Вы уверены, что вы хотите вступить в коммуникацию с сотрудником?
          </p>
          <p>
            <Input
              type="text"
              placeholder="Ваш ник в телеграмме"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          </p>
        </Body>
        <Actions>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              handleClose();
            }}
          >
            Отмена
          </Button>
          <StartCommunicationButton
            id={id}
            disable={username.trim() === ""}
            username={username}
            onSuccess={() => {
              handleClose();

              onStartCommunication();
            }}
          />
        </Actions>
      </Inner>
    </Dialog>
  );
};
