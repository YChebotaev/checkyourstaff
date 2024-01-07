import { HTMLAttributes, type FC } from "react";
import { Root } from "./styled";

export const Input: FC<HTMLAttributes<HTMLInputElement>> = (props) => (
  <Root {...props} />
);
