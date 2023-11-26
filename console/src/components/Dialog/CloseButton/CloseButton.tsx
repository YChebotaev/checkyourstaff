import { type FC } from "react";
import { Root } from "./styled";
import { Close as CloseIcon } from "../../../icons/Close";

export const CloseButton: FC<{ onClick(): void }> = ({ onClick }) => (
  <Root tabIndex={0} onClick={onClick}>
    <CloseIcon />
  </Root>
);
