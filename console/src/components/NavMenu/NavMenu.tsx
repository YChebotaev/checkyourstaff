import { type FC } from "react";
import { Root, ItemsWrapper } from "./styled";
import { NavMenuItem } from "./NavMenuItem";
import type { NavMenuProps } from "./types";
import { AppContainer } from "../AppContainer";

export const NavMenu: FC<NavMenuProps> = ({ items, activeKey }) => {
  return (
    <Root>
      <AppContainer>
        <ItemsWrapper>
          {items.map((item) => (
            <NavMenuItem active={activeKey === item.key} {...item} />
          ))}
        </ItemsWrapper>
      </AppContainer>
    </Root>
  );
};
