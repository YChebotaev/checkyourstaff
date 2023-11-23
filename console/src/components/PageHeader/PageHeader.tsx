import { type FC } from "react";
import { Root } from "./styled";

export const PageHeader: FC<{ children: string }> = ({ children }) => (
  <Root>{children}</Root>
);
