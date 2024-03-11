import { type FC } from "react";
import { format } from "date-fns";
import { Root, Left, Right, Date, IsNew } from "./styled";
import { Score } from '../../../../components/Score'

export const Header: FC<{
  date: string;
  score?: number;
}> = ({ date, score }) => (
  <Root>
    <Left>
      <Date>{format(date, "dd.MM.yyyy")}</Date>
      <IsNew>Новый отзыв</IsNew>
    </Left>
    <Right>{score != null && <Score score={score} />}</Right>
  </Root>
);
