import { type FC, type ReactNode } from "react";
import { Root } from "./styled";

export const Text: FC<{
  red?: boolean;
  className?: string;
  children: ReactNode;
}> = ({ red, className, children }) => (
  <Root $red={red ?? false} className={className}>
    {children}
  </Root>
);
