import { type FC, type ReactNode } from "react";

import { Root, Title, Actions } from "./styled";

export const TitleWithAction: FC<{
  variant?: "gray";
  action?: ReactNode;
  children: ReactNode;
}> = ({ variant = "gray", action, children }) => (
  <Root $variant={variant}>
    <Title>{children}</Title>
    <Actions>{action}</Actions>
  </Root>
);
