import { useEffect, type FC } from "react";
import { Navigate } from "react-router";
import { clearToken } from "../../../lib/clearToken";
import { clearAccountId } from "../../../lib/clearAccountId";

export const SignOutPage: FC = () => {
  useEffect(() => {
    clearToken();
    clearAccountId();
  }, []);

  return <Navigate to="/signin" />;
};
