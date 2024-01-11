import { useState, type FC } from "react";
import { Root, Text, ScoreWrapper, FeedbackWrapper } from "./styled";
import { ScoreControl } from "./ScoreControl";
import { FeedbackControl } from "./FeedbackControl";
import { type Answer } from "..";
import { MainButton } from "../../../components/MainButton";

export const PollQuestion: FC<{
  index: number;
  count: number;
  text: string;
  minScore: number;
  maxScore: number;
  textFeedbackRequestTreshold: number;
  onComplete(answer: Answer): void;
}> = ({
  index,
  count,
  text,
  minScore,
  maxScore,
  textFeedbackRequestTreshold,
  onComplete,
}) => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  return (
    <Root>
      <Text>{text}</Text>
      <ScoreWrapper>
        <ScoreControl
          value={score}
          minScore={minScore}
          maxScore={maxScore}
          onChange={setScore}
        />
      </ScoreWrapper>
      {(score <= textFeedbackRequestTreshold && score !== 0) && (
        <FeedbackWrapper>
          <FeedbackControl value={feedback} onChange={setFeedback} />
        </FeedbackWrapper>
      )}
      <MainButton
        text={`Далее (${index + 1}/${count})`}
        {...MainButton.disabledProps(
          score <= textFeedbackRequestTreshold && feedback.trim() === "",
        )}
        onClick={() => {
          onComplete({
            score,
            textFeedback: feedback,
          });
        }}
      />
    </Root>
  );
};
