import { type FC } from "react";
import { Root } from "./styled";

export const SectionHeader: FC<{ children: string }> = ({ children }) => (
  <Root>{children}</Root>
);
