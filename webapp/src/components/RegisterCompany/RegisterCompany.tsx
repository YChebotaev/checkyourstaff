import { useState, type FC } from "react";
import { MainButton } from "../MainButton";
import { Input } from "../Input";
import { Root } from "./styled";
import { useGetAccountsByName } from "../../hooks/useGetAccountsByName";
import { Text } from "../Text";

export const RegisterCompany: FC<{
  completeDisabled: boolean;
  onComplete(): void;
  onChangeName(value: string): void;
}> = ({ completeDisabled, onComplete, onChangeName }) => {
  const [name, setName] = useState("");
  const { data: accounts } = useGetAccountsByName(name);
  const accountExist = accounts != null ? Boolean(accounts.length) : false;

  return (
    <Root>
      <div>
        <Input
          placeholder="Введите название компании"
          maxLength={250}
          onChange={(e) => {
            const value = (Reflect.get(e.target, "value") as string).trim();

            setName(name);

            onChangeName(value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onComplete();
            }
          }}
        />
        {accountExist && (
          <Text red>
            Аккаунт с таким названием уже существует. Обратитесь к
            администратору аккаунта, чтобы присоединиться к нему
          </Text>
        )}
      </div>
      <MainButton
        text="Далее (шаг 1/2)"
        {...MainButton.disabledProps(completeDisabled || accountExist)}
        onClick={() => {
          onComplete();
        }}
      />
    </Root>
  );
};
