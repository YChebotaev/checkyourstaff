import { type FC, type ReactNode } from "react";
import { Root } from "./styled";

export const BullseyeLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <Root>{children}</Root>
);
