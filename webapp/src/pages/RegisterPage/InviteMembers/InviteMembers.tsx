import { type FC } from "react";
import { MainButton } from "../../../components/MainButton";
import { Help, Root } from "./styled";
import { Input } from "../../../components/Input";
import { Textarea } from "./styled";

export const InviteMembers: FC<{
  completeDisabled: boolean;
  minimumContactsCount: number
  onComplete(): void;
  onChangeGroupName(value: string): void;
  onChangeList(value: string): void;
}> = ({ completeDisabled, minimumContactsCount, onComplete, onChangeGroupName, onChangeList }) => (
  <Root>
    <Input
      placeholder="Введите название группы сотрудников"
      onChange={(e) => {
        const value = (Reflect.get(e.target, "value") as string).trim();

        onChangeGroupName(value);
      }}
    />
    <Textarea
      placeholder="В каждой строчке введите номер телефона или email-адрес сотрудника"
      onChange={(e) => {
        const value = (Reflect.get(e.target, "value") as string).trim();

        onChangeList(value);
      }}
    />
    <Help>Пригласите минимум {minimumContactsCount} человек</Help>
    <MainButton
      text="Пригласить сотрудников (шаг 2/2)"
      {...MainButton.disabledProps(completeDisabled)}
      onClick={() => {
        onComplete();
      }}
    />
  </Root>
);
