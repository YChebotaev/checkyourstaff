import { useEffect, type FC, type ReactNode, useState } from "react";
import { getToken } from "../lib/getToken";

export const TokenGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const token = getToken();
  const [result, setResult] = useState<ReactNode>(null);

  useEffect(() => {
    if (token == null) {
      if (location.pathname.startsWith("/signin")) {
        setResult(children);
      } else {
        location.pathname = "/signin";
      }
    }
  }, [children, token]);

  return result;
};
