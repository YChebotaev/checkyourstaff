import { type FC } from "react";
import { AppError } from "../../../layouts/AppError";

export const SigninFailedPage: FC = () => {
  return <AppError message={"Не удалось войти"} />;
};
