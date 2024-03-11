import { type FC } from "react";
import { Root } from "./styled";
import type { BadgeColor } from "./types";

export const Badge: FC<{
  color: BadgeColor;
  className?: string;
  children: string;
}> = ({ color, className, children }) => (
  <Root $color={color} className={className}>
    {children}
  </Root>
);
