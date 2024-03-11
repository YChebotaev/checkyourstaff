import { useEffect, type FC } from "react";
import { clearToken } from "../../../lib/clearToken";
import { clearAccountId } from "../../../lib/clearAccountId";

export const LogoutPage: FC = () => {
  useEffect(() => {
    clearToken();
    clearAccountId();
  }, []);

  return null;
};
