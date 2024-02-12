import { type FC } from "react";
import { MainButton } from "../MainButton";
import { Input } from "../Input";
import { Root } from "./styled";

export const RegisterCompany: FC<{
  completeDisabled: boolean;
  onComplete(): void;
  onChangeName(value: string): void;
}> = ({ completeDisabled, onComplete, onChangeName }) => {
  return (
    <Root>
      <div>
        <Input
          placeholder="Введите название компании"
          maxLength={250}
          onChange={(e) => {
            const value = (Reflect.get(e.target, "value") as string).trim();

            onChangeName(value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onComplete();
            }
          }}
        />
      </div>
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
