import { type FC } from "react";
import { Root, Title, Template, Input } from "./styled";

export const Preview: FC<{
  onChangeRole(value: string): void;
  onChangeUsername(value: string): void;
}> = ({ onChangeRole, onChangeUsername }) => (
  <Root data-preview>
    <Title>Укажите должность и логин в telegram</Title>
    <Template>
      <Input
        placeholder="<Введите должность>"
        onChange={(e) => onChangeRole(e.target.value)}
      />{" "}
      прочитал ваш анонимный комментарий и хочет подробнее изучить ситуацию и
      обсудить её с вами.
      <br />
      <br />
      Если вам важно обсудить её, то вы можете лично написать в telegram @
      <Input
        placeholder="<Введите имя пользователя в telegram>"
        onChange={(e) => onChangeUsername(e.target.value)}
      />
      .<br />
      <br />
      Если хотите остатья анонимным, то просто проигнорируйте это сообщение.
    </Template>
  </Root>
);
