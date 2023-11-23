import { type FC } from "react";
import { Root, Left, Right, Date, IsNew } from "./styled";
import { Score } from "../../../Score";

export const Header: FC<{
  date: string;
  score?: number;
}> = ({ date, score }) => (
  <Root>
    <Left>
      <Date>12.11.23</Date>
      <IsNew>Новый отзыв</IsNew>
    </Left>
    <Right>{score != null && <Score score={score} />}</Right>
  </Root>
);
