import { Children, type FC, type ReactNode } from "react";
import { Root, Separator } from "./styled";
import { intersperse } from "../../../utils/intersperse";

export const Actions: FC<{ children: ReactNode }> = ({ children }) => {
  return <Root>{intersperse(Children.toArray(children), <Separator />)}</Root>;
};
