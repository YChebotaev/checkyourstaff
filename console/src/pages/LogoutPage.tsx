import { useEffect, type FC } from "react";
import { clearToken } from "../utils/clearToken";
import { clearAccountId } from "../utils/clearAccountId";

export const LogoutPage: FC = () => {
  useEffect(() => {
    clearToken();
    clearAccountId();
  }, []);

  return null;
};
