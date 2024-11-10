import {
  pollAnsersByAccountIdAndPollQuestionId,
  sampleGroupGet,
  pollSessionGet,
} from "@checkyourstaff/persistence";
import { calculatePollAnswersAverage } from "@checkyourstaff/common/calculatePollAnswersAverage";
import { groupBy, toPairs } from "lodash";
import { endOfDay } from 'date-fns'

export const getChartsByQuestionId = async ({
  accountId,
  questionId,
}: {
  accountId: number;
  questionId: number;
}) => {
  const all = {
    name: 'Все сотрудники',
    values: []
  }
  const result: any[] = [all]
  const pollAnswers = await pollAnsersByAccountIdAndPollQuestionId(accountId, questionId)
  const pollAnswersBySampleGroupId = groupBy(pollAnswers, 'sampleGroupId')

  for (const [sampleGroupIdStr, pollsAnswers] of toPairs(pollAnswersBySampleGroupId)) {
    const sampleGroup = await sampleGroupGet(Number(sampleGroupIdStr))
    const pollsAnswersByPollSessionsId = groupBy(pollsAnswers, 'pollSessionId')
    const values = []

    for (const [pollSessionIdStr, pollAnswers] of toPairs(pollsAnswersByPollSessionsId)) {
      const pollSession = await pollSessionGet(Number(pollSessionIdStr))
      const dateStr = endOfDay(Number(pollSession.createdAt)).toISOString()
      const average = calculatePollAnswersAverage(pollAnswers)

      values.push({
        date: dateStr,
        value: average
      })
    }

    result.push({
      name: sampleGroup.name,
      values
    })
  }

  const pollAnswersByPollSessionDay = groupBy(
    pollAnswers,
    ({ createdAt }) => endOfDay(Number(createdAt)).toISOString()
  )

  for (const [pollSessionDayStr, pollAnswers] of toPairs(pollAnswersByPollSessionDay)) {
    all.values.push({
      date: pollSessionDayStr,
      value: calculatePollAnswersAverage(pollAnswers)
    })
  }

  return result
};
