import { HTMLAttributes, type FC } from "react";
import { Root } from "./styled";

export const Textarea: FC<HTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <Root {...props} />
);
