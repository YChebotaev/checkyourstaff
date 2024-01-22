import {
  parseDate,
  pollAnswerGetByPollSessionIdAndPollQuestionIdAndUserId,
  pollAnswersGetBySampleGroupId,
  pollGet,
  pollQuestionGet,
  sampleGroupGet,
  sampleGroupsGetByAccountId,
  textFeedbacksGetByAccountId,
  textFeedbacksGetBySampleGroupId,
} from "@checkyourstaff/persistence";
import { groupBy } from "lodash";
import type {
  TextFeedbackResp,
  TextFeedbackSampleGroup,
  TextFeedbackValue,
} from "../types";

export const getTextFeedback = async ({ accountId }: { accountId: number }) => {
  const result: TextFeedbackResp = [];

  const sampleGroups = await sampleGroupsGetByAccountId(accountId);

  for (const sampleGroup of sampleGroups) {
    const group: TextFeedbackSampleGroup = {
      title: sampleGroup.name,
      values: [],
    };

    result.push(group);

    const pollAnswers = await pollAnswersGetBySampleGroupId(sampleGroup.id);
    const textFeedbacks = await textFeedbacksGetBySampleGroupId(sampleGroup.id);

    for (const textFeedback of textFeedbacks) {
      const pollQuestion = textFeedback.pollQuestionId
        ? await pollQuestionGet(textFeedback.pollQuestionId)
        : undefined;

      const value: TextFeedbackValue = {
        id: textFeedback.id,
        date: parseDate(textFeedback.createdAt).toISOString(),
        text: textFeedback.text,
        question: pollQuestion?.text,
        score: pollAnswers.find(
          ({ pollQuestionId, pollSessionId, userId }) =>
            pollQuestionId === textFeedback.pollQuestionId &&
            pollSessionId === textFeedback.pollSessionId &&
            userId === textFeedback.userId,
        )?.score,
      };

      group.values.push(value);
    }
  }

  return result;
};
