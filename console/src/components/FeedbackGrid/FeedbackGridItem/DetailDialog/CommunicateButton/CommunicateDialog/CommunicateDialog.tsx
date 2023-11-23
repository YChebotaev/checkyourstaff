import { useState, type FC } from "react";
import { Inner, Body, Actions, Button, Input } from "./styled";
import { Dialog } from "../../../../../Dialog";
import { StartCommunicationButton } from "./StartCommunicationButton";
import { useInsideDialog } from "../../../../../../hooks/useInsideDialog";

export const CommunicateDialog: FC<{
  id: string;
  onStartCommunication(): void;
}> = ({ id, onStartCommunication }) => {
  const { handleClose } = useInsideDialog();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

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
              placeholder="Ваша должность"
              onChange={(e) => {
                setRole(e.target.value);
              }}
            />
          </p>
          <p>
            <Input
              type="text"
              placeholder="Ваш ник в телеграмме"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </p>
          <p>
            <div>
              <b>Предпросмотр</b>
            </div>
            <p>
              {role ? role : "<Введите должность>"} прочитал ваш анонимный отзыв
              и хочет подробнее изучить ситуацию и обсудить её с вами. Если вам
              важно обсудить это, то вы можете лично написать в телеграм @
              {username ? username : "<Введите имя пользователя в телеграмме>"}.
              Если хотите остаться анонимным, то просто проигнорируйте это
              сообщение
            </p>
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
            disable={username.trim() === "" || role.trim() === ""}
            username={username}
            role={role}
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
