import { type FC, type ReactNode } from "react";
import { NavMenu, type NavMenuProps } from "../../components/NavMenu";
import {
  Root,
  MenuColumn,
  NavMenuWrapper,
  ContentColumn,
  ContentWrapper,
} from "./styled";

export const AppLayout: FC<{
  navMenu: NavMenuProps;
  children: ReactNode;
}> = ({ navMenu, children }) => (
  <Root>
    <MenuColumn>
      <NavMenuWrapper>
        <NavMenu {...navMenu} />
      </NavMenuWrapper>
    </MenuColumn>
    <ContentColumn>
      <ContentWrapper>{children}</ContentWrapper>
    </ContentColumn>
  </Root>
);
