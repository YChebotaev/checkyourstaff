import {
  pollSessionsGetByAccountIdAndSampleGroupId,
  pollQuestionsGetByPollId,
  pollAnswersGetByPollQuestionIdAndPollSessionIdAndSampleGroupId
} from "@checkyourstaff/persistence";
import { calculatePollAnswersAverage } from "@checkyourstaff/common/calculatePollAnswersAverage";
import {
  ChartsDataResp,
  ChartsDataRespQuestion,
  ChartsDataRespSession,
} from "../types";

export const getCharts = async ({
  accountId,
  sampleGroupId,
}: {
  accountId: number;
  sampleGroupId: number;
}) => {
  return (await Promise.all(
    (
      await pollSessionsGetByAccountIdAndSampleGroupId(accountId, sampleGroupId)
    )
      .sort((a, b) => {
        return Number(a.createdAt) - Number(b.createdAt);
      })
      .map(async (pollSession) => {
        const pollQuestions = await pollQuestionsGetByPollId(
          pollSession.pollId,
        );

        return {
          date: new Date(Number(pollSession.createdAt)).toISOString(),
          values: await Promise.all(
            pollQuestions.map(async (pollQuestion) => {
              const pollAnswers =
                await pollAnswersGetByPollQuestionIdAndPollSessionIdAndSampleGroupId(
                  pollQuestion.id,
                  pollSession.id,
                  sampleGroupId,
                );
              const average = calculatePollAnswersAverage(pollAnswers);

              return {
                title: pollQuestion.text,
                value: average,
              } as ChartsDataRespQuestion;
            }),
          ),
        } as ChartsDataRespSession;
      }),
  )) as ChartsDataResp;
};
