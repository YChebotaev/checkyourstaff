import { HTMLAttributes, type FC } from "react";
import { Root } from "./styled";

export type InputProps = HTMLAttributes<HTMLInputElement> & {
  placeholder?: string;
  maxLength?: number
};

export const Input: FC<InputProps> = (props) => <Root {...props} />;
