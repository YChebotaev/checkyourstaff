import { type FC } from "react";
import { MainButton } from "../../../components/MainButton";
import { Input } from "../../../components/Input";
import { Root } from "./styled";

export const FirstStep: FC<{
  completeDisabled: boolean;
  onComplete(): void;
  onChangeName(value: string): void;
}> = ({ completeDisabled, onComplete, onChangeName }) => {
  return (
    <Root>
      <Input
        placeholder="Введите название компании"
        onChange={(e) => {
          const value = (Reflect.get(e.target, "value") as string).trim();

          onChangeName(value);
        }}
      />
      <MainButton
        text="Далее (шаг 1/2)"
        {...MainButton.disabledProps(completeDisabled)}
        onClick={() => {
          onComplete();
        }}
      />
    </Root>
  );
};
