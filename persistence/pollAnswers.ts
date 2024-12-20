import { knex } from "./knex";
import { logger } from "./logger";
import { PollAnswer } from "./types";

export const pollAnswerCreate = async ({
  userId,
  pollQuestionId,
  pollSessionId,
  sampleGroupId,
  accountId,
  score,
  // DEBUG FIELDS:
  __createdAt__,
}: {
  userId: number;
  pollQuestionId: number;
  pollSessionId: number;
  sampleGroupId: number;
  accountId: number;
  score: number;
  // DEBUG FIELDS:
  __createdAt__?: number
}) => {
  const [{ id }] = await knex
    .insert({
      userId,
      pollQuestionId,
      pollSessionId,
      sampleGroupId,
      accountId,
      score,
      createdAt: __createdAt__ ?? new Date().getTime(),
    })
    .into("pollAnswers")
    .returning("id");

  logger.info(
    "Poll answer created with id = %s for poll question id = %s with score = %s",
    id,
    pollQuestionId,
    score,
  );

  return id as number;
};

export const pollAnsersByAccountIdAndPollQuestionId = async (accountId: number, pollQuestionId: number) => {
  return (await knex
    .select<PollAnswer[]>('*')
    .from('pollAnswers')
    .where('accountId', accountId)
    .where('pollQuestionId', pollQuestionId))
    .filter(({ deleted }) => !deleted)
}

export const pollAnswersGetByPollQuestionIdAndPollSessionIdAndSampleGroupId =
  async (
    pollQuestionId: number,
    pollSessionId: number,
    sampleGroupId: number,
  ) => {
    return (
      await knex
        .select<PollAnswer[]>("*")
        .from("pollAnswers")
        .where("pollQuestionId", pollQuestionId)
        .andWhere("pollSessionId", pollSessionId)
        .andWhere("sampleGroupId", sampleGroupId)
    ).filter(({ deleted }) => !deleted);
  };

export const pollAnswersGetByAndPollSessionIdAndSampleGroupId = async (
  pollSessionId: number,
  sampleGroupId: number,
) => {
  return (
    await knex
      .select<PollAnswer[]>("*")
      .from("pollAnswers")
      .andWhere("pollSessionId", pollSessionId)
      .andWhere("sampleGroupId", sampleGroupId)
  ).filter(({ deleted }) => !deleted);
};

export const pollAnswersGetBySampleGroupId = async (sampleGroupId: number) => {
  return (
    await knex
      .select<PollAnswer[]>("*")
      .from("pollAnswers")
      .where("sampleGroupId", sampleGroupId)
  ).filter(({ deleted }) => !deleted);
};

export const pollAnswersGetByPollSessionId = async (pollSessionId: number) => {
  return (
    await knex
      .select<PollAnswer[]>("*")
      .from("pollAnswers")
      .andWhere("pollSessionId", pollSessionId)
  ).filter(({ deleted }) => !deleted);
};

export const pollAnswerGetByPollSessionIdAndPollQuestionIdAndUserId = async (
  pollSessionId: number,
  pollQuestionId: number,
  userId: number,
) => {
  return knex
    .select<PollAnswer[]>("*")
    .from("pollAnswers")
    .where("pollSessionId", pollSessionId)
    .andWhere("pollQuestionId", pollQuestionId)
    .andWhere("userId", userId)
    .first();
};
