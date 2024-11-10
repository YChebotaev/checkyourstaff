import { type FC } from "react";
import { Root, Tab } from "./styled";

export type TabConfig = {
  key: number;
  title: string;
  onSelect?(key: number): void;
};

export const PillTabs: FC<{
  activeTab: TabConfig["key"];
  items: TabConfig[];
  onChange(tab: TabConfig["key"]): void;
}> = ({ activeTab, items, onChange }) => {
  return (
    <Root>
      {items.map(({ key, title, onSelect }) => (
        <Tab
          key={key}
          $active={activeTab === key}
          onClick={() => {
            onSelect && onSelect(key);

            onChange(key);
          }}
        >
          {title}
        </Tab>
      ))}
    </Root>
  );
};
