import { type FC } from "react";
import { type ContactsRecord } from "@checkyourstaff/common/parseContactsList";
import { Text } from "../Text";
import { MainButton } from "../MainButton";
import { Root, Label, Block } from "./styled";

export const EverythingOk: FC<{
  name: string;
  groupName: string;
  contacts: ContactsRecord[];
  onComplete(): void;
}> = ({ name, groupName, contacts: contactGroups, onComplete }) => (
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
          {contactGroups.map((contacts, i) => (
            <tr key={i}>
              <td>{contacts.map(({ value }) => value).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Block>
    <MainButton text="Завершить" onClick={onComplete} />
  </Root>
);
