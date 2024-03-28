import { type FC } from "react";
import { BullseyeLayout } from "../BullseyeLayout";
import { ErrorText } from "./styled";

type AppErrorType = FC<{ message: string | symbol }> & {
  injectedByCloneElement: symbol;
};

export const AppError: AppErrorType = ({ message }) => (
  <BullseyeLayout>
    <ErrorText>
      {typeof message === "symbol" ? message.toString() : message}
    </ErrorText>
  </BullseyeLayout>
);

AppError.injectedByCloneElement = Symbol("AppError.injectedByCloneElement");
