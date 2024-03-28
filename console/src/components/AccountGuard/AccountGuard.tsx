import { type FC, type ReactNode } from "react";
import { ActualRequest } from "./ActualRequest";

export const AccountGuard: FC<{ skip: boolean; children: ReactNode }> = ({
  skip,
  children,
}) => {
  if (skip) {
    return children;
  } else {
    return <ActualRequest children={children} />;
  }
};
