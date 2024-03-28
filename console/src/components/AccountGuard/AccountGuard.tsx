import { type FC, type ReactNode } from "react";
import { ActualRequest } from "./ActualRequest";
import { ErrorBoundary } from "../ErrorBoundary";
import { AppError } from "../../layouts/AppError";

export const AccountGuard: FC<{ skip: boolean; children: ReactNode }> = ({
  skip,
  children,
}) =>
  skip ? (
    children
  ) : (
    <ErrorBoundary fallback={<AppError message={AppError.injectedByCloneElement} />}>
      <ActualRequest children={children} />
    </ErrorBoundary>
  );
