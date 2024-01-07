import { type FC, type ReactNode } from "react";
import { Root } from "./styled";

export const Text: FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => <Root className={className}>{children}</Root>;
