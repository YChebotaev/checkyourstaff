import { type FC } from "react";
import { Root } from "./styled";
import {
  FeedbackGridItem,
  type FeedbackGridItemProps,
} from "./FeedbackGridItem";

export const FeedbackGrid: FC<{
  items: FeedbackGridItemProps[];
  // onDeleteItem(id: string): void
}> = ({ items /*, onDeleteItem */ }) => (
  <Root>
    {items.map((item) => {
      return (
        <FeedbackGridItem key={item.id} {...item} /*onDeleteItem={onDeleteItem}*/F />
      )
    })}
  </Root>
);
