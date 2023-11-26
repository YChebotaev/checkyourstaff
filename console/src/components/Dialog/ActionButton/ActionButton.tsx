import { type FC } from "react";
import { Root } from "./styled";

export const ActionButton: FC<{ children: string; onClick(): void }> = ({
  children,
  onClick,
}) => <Root onClick={onClick}>{children}</Root>;
