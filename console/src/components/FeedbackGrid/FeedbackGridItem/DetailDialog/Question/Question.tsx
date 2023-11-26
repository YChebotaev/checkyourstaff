import { type FC } from "react";
import { Root, Blind } from "./styled";

export const Question: FC<{ blinded: boolean; children: string }> = ({
  blinded,
  children,
}) =>
  blinded ? (
    <Root>
      <Blind />
      {children}
    </Root>
  ) : (
    <Root>{children}</Root>
  );
