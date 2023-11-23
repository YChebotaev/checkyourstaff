import { type FC } from "react";
import { Star as StarIcon } from '../../../icons/Star'
import { StarFill as StarFillIcon } from '../../../icons/StarFill'

export const Star: FC<{ filled: boolean }> = ({ filled }) =>
  filled ? <StarIcon /> : <StarFillIcon />;
