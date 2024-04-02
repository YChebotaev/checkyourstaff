import { type FC, type ReactNode } from "react";
import { ActualRequest } from "./ActualRequest";
import { ErrorBoundary } from "../ErrorBoundary";
import { AppError } from "../../layouts/AppError";

export const AccountGuard: FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={<AppError message={AppError.injectedByCloneElement} />}
  >
    <ActualRequest children={children} />
  </ErrorBoundary>
);
