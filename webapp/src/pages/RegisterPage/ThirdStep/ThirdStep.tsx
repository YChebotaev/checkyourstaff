import { type FC } from "react";
import { Root, Label, Block } from "./styled";
import { Text } from "../../../components/Text";
import { ContactRecord } from "..";
import { MainButton } from "../../../components/MainButton";

export const ThirdStep: FC<{
  name: string;
  groupName: string;
  contacts: ContactRecord[];
  onComplete(): void;
}> = ({ name, groupName, contacts, onComplete }) => (
  <Root>
    <Block>
      <Label>Название компании</Label>
      <Text>{name}</Text>
    </Block>
    <Block>
      <Label>Название группы сотрудников</Label>
      <Text>{groupName}</Text>
    </Block>
    <Block>
      <Label>Приглашенные сотрудники</Label>
      <table>
        <tbody>
          {contacts.map(({ value }, i) => (
            <tr key={i}>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Block>
    <MainButton text="Завершить" onClick={onComplete} />
  </Root>
);
