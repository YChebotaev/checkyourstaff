import { useState, type FC, useMemo } from "react";
import {
  Inner,
  Text,
  Backdrop,
  Confirmation,
  ConfirmationText,
} from "./styled";
import { Header } from "../Header";
import {
  CloseButton,
  Dialog,
  Actions,
  ActionButton,
} from "../../../../../../components/Dialog";
import { useInsideDialog } from "../../../../../../hooks/useInsideDialog";
import { ConfirmDeleteButton } from "./ConfirmDeleteButton";
import { DoneRound } from "../../../../../../icons/DoneRound";
import { Question } from "./Question";
import { Preview } from "./Preview";
import { ConfirmCommunicationButton } from "./ConfirmCommunicationButton";

export const DetailDialog: FC<{
  id: number;
  date: string;
  text: string;
  score?: number;
  question?: string;
  onDeleteItem(id: number): void;
}> = ({ id, date, score, text, question, onDeleteItem }) => {
  const [state, setState] = useState<
    | "detail"
    | "delete-confirm"
    | "delete-success"
    | "contact-form"
    | "contact-success"
  >("detail");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const { handleClose } = useInsideDialog();
  const body = useMemo(() => {
    const renderDetailBody = () => (
      <>
        <Header date={date} score={score} />
        <Text>{text}</Text>
      </>
    );

    switch (state) {
      case "detail":
        return renderDetailBody();
      case "delete-confirm":
        return (
          <>
            {renderDetailBody()}
            <Backdrop>
              Вы действительно хотите удалить данный комментарий?
            </Backdrop>
          </>
        );
      case "delete-success":
        return (
          <Confirmation data-confirmation>
            <ConfirmationText>Комментарий удален</ConfirmationText>
            <DoneRound />
          </Confirmation>
        );
      case "contact-form":
        return (
          <Preview onChangeRole={setRole} onChangeUsername={setUsername} />
        );
      case "contact-success":
        return (
          <Confirmation data-confirmation>
            <ConfirmationText>Ваше сообщение отправлено!</ConfirmationText>
            <DoneRound />
          </Confirmation>
        );
    }
  }, [state, date, score, text]);
  const actions = useMemo(() => {
    switch (state) {
      case "detail":
        return (
          <Actions>
            <ActionButton
              onClick={() => {
                setState("delete-confirm");
              }}
            >
              Удалить
            </ActionButton>
            <ActionButton
              onClick={() => {
                setState("contact-form");
              }}
            >
              Предложить сотруднику обсудить
            </ActionButton>
          </Actions>
        );
      case "delete-confirm":
        return (
          <Actions>
            <ActionButton
              onClick={() => {
                setState("detail");
              }}
            >
              Отмена
            </ActionButton>
            <ConfirmDeleteButton
              id={id}
              onSuccess={() => {
                setState("delete-success");

                onDeleteItem(id);
              }}
            />
          </Actions>
        );
      case "delete-success":
        return null;
      case "contact-form":
        return (
          <Actions>
            <ActionButton
              onClick={() => {
                setState("detail");
              }}
            >
              Отмена
            </ActionButton>
            <ConfirmCommunicationButton
              id={id}
              username={username}
              role={role}
              onSuccess={() => {
                setState("contact-success");
              }}
            />
          </Actions>
        );
      case "contact-success":
    }
  }, [state, id, username, role, onDeleteItem]);
  const questionElement = useMemo(() => {
    switch (state) {
      case "detail":
      case "delete-confirm":
        return (
          question && (
            <Question blinded={state === "delete-confirm"}>{question}</Question>
          )
        );
      case "delete-success":
        return null;
      case "contact-form":
        return null;
      case "contact-success":
        return null;
    }
  }, [state, question]);

  return (
    <Dialog>
      <CloseButton onClick={handleClose} />
      {questionElement}
      <Inner>{body}</Inner>
      {actions}
    </Dialog>
  );
};
