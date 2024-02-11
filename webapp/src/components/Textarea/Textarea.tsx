import { HTMLAttributes, type FC } from "react";
import { Root } from "./styled";

export type TextareaProps = HTMLAttributes<HTMLTextAreaElement> & {
  placeholder?: string;
  rows?: number;
};

export const Textarea: FC<TextareaProps> = (props) => <Root {...props} />;
