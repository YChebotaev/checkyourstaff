import { type FC, type ReactNode } from "react";
import { getToken } from "../utils/getToken";

export const TokenGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const token = getToken()

  if (token == null) {
    if (location.pathname.startsWith('/signin')) {
      return children
    } else {
      location.pathname = '/signin'
    }
  }

  return null
};
