import { type FC } from "react";
import { MainButton } from "../MainButton";
import { Root } from "./styled";
import { Input } from "../Input";
import { InviteMemebers } from "../InviteMemebers";

export const CreateSampleGroup: FC<{
  completeDisabled: boolean;
  minimumContactsCount: number;
  onComplete(): void;
  onChangeGroupName(value: string): void;
  onChangeList(value: string): void;
}> = ({
  completeDisabled,
  minimumContactsCount,
  onComplete,
  onChangeGroupName,
  onChangeList,
}) => (
  <Root>
    <Input
      placeholder="Введите название группы сотрудников"
      onChange={(e) => {
        const value = (Reflect.get(e.target, "value") as string).trim();

        onChangeGroupName(value);
      }}
    />
    <InviteMemebers
      minimumContactsCount={minimumContactsCount}
      onChangeList={onChangeList}
    />
    <MainButton
      text="Пригласить сотрудников (шаг 2/2)"
      {...MainButton.disabledProps(completeDisabled)}
      onClick={() => {
        onComplete();
      }}
    />
  </Root>
);
