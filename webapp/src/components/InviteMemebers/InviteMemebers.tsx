import { type FC } from "react";
import { Textarea, Help } from "./styled";
import { type TextareaProps } from "../Textarea";

export const InviteMemebers: FC<{
  minimumContactsCount?: number;
  textareaProps?: TextareaProps;
  onChangeList(v: string): void;
}> = ({ minimumContactsCount, textareaProps, onChangeList }) => {
  return (
    <>
      <Textarea
        {...textareaProps}
        placeholder="В каждой строчке введите номер телефона или email-адрес сотрудника. Через запятую можно указать несколько контактов одного сотрудника"
        onChange={(e) => {
          const value = (Reflect.get(e.target, "value") as string).trim();

          onChangeList(value);
        }}
      />
      {minimumContactsCount != null && (
        <Help>Пригласите минимум {minimumContactsCount} человек</Help>
      )}
    </>
  );
};
