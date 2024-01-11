import { type FC } from "react";
import { Root } from "./styled";
import {
  Star as StarIcon,
  StarFill as StarFillIcon,
} from "../../../../../icons";

export const Star: FC<{ filled: boolean; onClick(): void }> = ({
  filled,
  onClick,
}) => <Root onClick={onClick}>{filled ? <StarIcon /> : <StarFillIcon />}</Root>;
