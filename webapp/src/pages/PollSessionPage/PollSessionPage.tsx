import { useState, useMemo, type FC } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import type {
  ClosePollSessionBody,
  PollSessionData,
} from "@checkyourstaff/webapp-backend/types";
import { Root } from "./styled";
import { AppLayout } from "../../layouts/AppLayout";
import { useApiClient } from "../../hooks/useApiClient";
import { PollQuestion } from "./PollQuestion";
import { LastQuestion } from "./LastQuestion";
import { Text } from "../../components/Text";
import { BullseyeLayout } from "../../layouts/BullseyeLayout";
import { useCloudStorageItem } from "../../hooks/useCloudStorageItem";

export type Answer = {
  score: number;
  textFeedback?: string;
};

export const PollSessionPage: FC = () => {
  const apiClient = useApiClient();
  const [searchParams] = useSearchParams();
  const pollSessionId = searchParams.get("pollSessionId");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const { data } = useQuery({
    queryKey: [
      "pollSession",
      {
        pollSessionId,
      },
    ],
    async queryFn() {
      const { data } = await apiClient.get<PollSessionData>("/pollSession", {
        params: {
          pollSessionId,
        },
      });

      return data;
    },
  });
  const [pollSessionComplete, setPollSessionComplete] = useCloudStorageItem(
    `poll_session_complete_${pollSessionId}`,
    {
      parse(value) {
        return value === "true";
      },
      stringify(value) {
        return value ? "true" : "fasle";
      },
    },
  );
  const { mutate } = useMutation({
    async mutationFn(vars: ClosePollSessionBody) {
      const { data } = await apiClient.post("/closePollSession", vars, {
        params: {
          pollSessionId,
        },
      });

      return data;
    },
    onSuccess() {
      Telegram.WebApp.MainButton.hideProgress();

      setPollSessionComplete(true);

      Telegram.WebApp.close();
    },
  });
  const isLastQuestion = data ? questionIndex >= data.length : false;

  // DEBUG ONLY:
  // Telegram.WebApp.CloudStorage.removeItem(`poll_session_complete_${pollSessionId}`)

  const questionElement = useMemo(() => {
    if (!data || isLastQuestion) {
      return null;
    }

    const { id, text, minScore, maxScore, textFeedbackRequestTreshold } =
      data[questionIndex];

    return (
      <PollQuestion
        key={id}
        index={questionIndex}
        count={data.length}
        text={text}
        minScore={minScore}
        maxScore={maxScore}
        textFeedbackRequestTreshold={textFeedbackRequestTreshold}
        onComplete={(answer) => {
          setAnswers((answers) => {
            const nextAnswers = [...answers];

            nextAnswers[questionIndex] = answer;

            return nextAnswers;
          });

          setQuestionIndex(questionIndex + 1);
        }}
      />
    );
  }, [data, questionIndex, isLastQuestion]);

  const lastQuestionElement = useMemo(() => {
    if (!isLastQuestion) {
      return null;
    }

    return (
      <LastQuestion
        onComplete={(text) => {
          Telegram.WebApp.MainButton.showProgress(false);

          mutate({
            finalFeedback: text,
            answers: answers.map((answer, i) => ({
              id: data![i].id,
              ...answer,
            })),
          });
        }}
      />
    );
  }, [isLastQuestion, answers, data, mutate]);

  if (pollSessionComplete == null) {
    return null;
  }

  if (pollSessionComplete) {
    return (
      <BullseyeLayout>
        <Text>Опрос завершен</Text>
      </BullseyeLayout>
    );
  }

  return (
    <AppLayout>
      <Root>{questionElement || lastQuestionElement}</Root>
    </AppLayout>
  );
};
