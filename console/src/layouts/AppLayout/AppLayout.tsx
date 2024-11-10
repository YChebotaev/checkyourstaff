import { type FC, type ReactNode } from "react";
import { NavMenu, type NavMenuProps } from "../../components/NavMenu";
import { Root, MenuRow, ContentRow } from "./styled";
import { AppContainer } from "../../components/AppContainer";

export const AppLayout: FC<{
  navMenu: NavMenuProps;
  children: ReactNode;
}> = ({ navMenu, children }) => (
  <Root>
    <MenuRow>
      <NavMenu {...navMenu} />
    </MenuRow>
    <ContentRow>
      <AppContainer>{children}</AppContainer>
    </ContentRow>
  </Root>
);
