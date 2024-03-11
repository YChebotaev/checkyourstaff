import { type FC } from "react";
import LinesEllipsis from "react-lines-ellipsis";
import { Root, Inner, Question, Body, Footer } from "./styled";
import { Header } from "./Header";
import { useDialog } from '../../../../../hooks/useDialog'
import { DetailDialog } from "./DetailDialog";
import type { FeedbackGridItemProps } from "./types";
import { useQueryClient } from "@tanstack/react-query";

export const FeedbackGridItem: FC<
  FeedbackGridItemProps /* & {
    onDeleteItem(id: string): void;
  }*/
> = ({ id, text, score, date, question /*, onDeleteItem*/ }) => {
  const queryClient = useQueryClient();
  const { element: dialogElement, toggle: toggleDialog } = useDialog(
    <DetailDialog
      id={id}
      date={date}
      score={score}
      text={text}
      question={question}
      onDeleteItem={() => {
        queryClient.invalidateQueries({
          queryKey: ["textFeedback"],
          exact: true,
          refetchType: "active",
        });
      }}
    />,
  );

  return (
    <Root
      onClick={() => {
        toggleDialog();
      }}
    >
      <Inner>
        <Header date={date} score={score} />
        <Body>
          <LinesEllipsis text={text} maxLine={7} />
        </Body>
        <Footer>Читать полностью</Footer>
      </Inner>
      {question != null && <Question>{question}</Question>}
      {dialogElement}
    </Root>
  );
};
