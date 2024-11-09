import { type FC, type ReactNode } from "react";
import { NavMenu, type NavMenuProps } from "../../components/NavMenu";
import { Root, MenuRow, ContentRow } from "./styled";

export const AppLayout: FC<{
  navMenu: NavMenuProps;
  children: ReactNode;
}> = ({ navMenu, children }) => (
  <Root>
    <MenuRow>
      <NavMenu {...navMenu} />
    </MenuRow>
    <ContentRow>{children}</ContentRow>
  </Root>
);
