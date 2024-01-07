import { type FC, type ReactNode } from "react";

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};
