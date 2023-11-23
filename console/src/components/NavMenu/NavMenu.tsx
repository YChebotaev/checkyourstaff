import { type FC } from "react";
import { Root, ItemsWrapper } from "./styled";
import { NavMenuItem } from "./NavMenuItem";
import type { NavMenuProps } from "./types";

export const NavMenu: FC<NavMenuProps> = ({ items, activeKey }) => {
  return (
    <Root>
      <ItemsWrapper>
        {items.map((item) => (
          <NavMenuItem active={activeKey === item.key} {...item} />
        ))}
      </ItemsWrapper>
    </Root>
  );
};
