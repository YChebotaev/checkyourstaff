import { type FC } from "react";
import { Root } from "./styled";
import { Star } from "./Star";

export const ScoreControl: FC<{
  value: number;
  minScore: number;
  maxScore: number;
  onChange(value: number): void;
}> = ({ value, maxScore, onChange }) => {
  return (
    <Root>
      {new Array(maxScore).fill(0).map((_, i) => (
        <Star
          key={i}
          filled={value <= i}
          onClick={() => {
            onChange(i + 1);
          }}
        />
      ))}
    </Root>
  );
};
