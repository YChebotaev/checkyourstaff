import { type FC, type ReactNode } from "react";
import { getToken } from "../lib/getToken";

export const TokenGuard: FC<{ children(skipAccounts: boolean): ReactNode }> = ({
  children,
}) => {
  const token = getToken();

  if (token == null) {
    if (location.pathname.startsWith("/signin")) {
      return children(true);
    } else {
      location.pathname = "/signin";
    }
  }

  return children(false);
};
