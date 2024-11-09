import { type FC, type ReactNode } from "react";

import { Root } from "./styled";

export const AppContainer: FC<{ children: ReactNode }> = ({ children }) => (
  <Root>{children}</Root>
);
