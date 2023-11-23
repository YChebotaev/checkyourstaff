import { type FC } from "react";
import { Root, Link } from "./styled";
import type { NavMenuItemProps } from "../types";

const renderIcon = (active: boolean, icon: NavMenuItemProps["icon"]) => {
  if (typeof icon === "function") {
    return icon({ active });
  }

  return icon;
};

export const NavMenuItem: FC<
  NavMenuItemProps & {
    active: boolean;
  }
> = ({ title, href, icon, active }) => {
  return (
    <Root $active={active}>
      <Link to={href}>{renderIcon(active, icon)}</Link>
    </Root>
  );
};
