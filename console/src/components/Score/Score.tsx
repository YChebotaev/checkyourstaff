import { type FC } from "react";
import { Root } from "./styled";
import { Star } from "./Star"

export const Score: FC<{ score: number }> = ({ score }) => (
  <Root>
    {[0, 0, 0, 0, 0].map((_, i) => (
      <Star filled={score <= i} />
    ))}
  </Root>
);
