import { type FC } from "react";
import { type ContactRecord } from "@checkyourstaff/common/parseContactsList";
import { Text } from "../Text";
import { MainButton } from "../MainButton";
import { Root, Label, Block } from "./styled";

export const EverythingOk: FC<{
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
