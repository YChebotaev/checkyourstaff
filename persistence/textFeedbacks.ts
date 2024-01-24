import { knex } from "./knex";
import { logger } from "./logger";
import { TextFeedback } from "./types";

export const textFeedbackCreate = async ({
  userId,
  accountId,
  sampleGroupId,
  pollId,
  pollQuestionId,
  pollSessionId,
  text,
}: {
  userId: number;
  accountId: number;
  sampleGroupId: number;
  pollId?: number;
  pollQuestionId?: number | null;
  pollSessionId?: number | null;
  text: string;
}) => {
  const [{ id }] = await knex
    .insert({
      userId,
      accountId,
      sampleGroupId,
      pollId,
      pollQuestionId,
      pollSessionId,
      text,
      createdAt: new Date().getTime(),
    })
    .into("textFeedbacks")
    .returning("id");

  logger.info(
    "Text feedback created with id = %s for poll question id = %s",
    id,
    pollQuestionId,
  );

  return id as number;
};

export const textFeedbackGet = async (id: number) => {
  return knex
    .select<TextFeedback[]>("*")
    .from("textFeedbacks")
    .where("id", id)
    .first();
};

export const textFeedbacksGetByAccountId = async (accountId: number) => {
  return (
    await knex
      .select<TextFeedback[]>("*")
      .from("textFeedbacks")
      .where("accountId", accountId)
  ).filter(({ deleted }) => !deleted);
};

export const textFeedbacksGetBySampleGroupId = async (
  sampleGroupId: number,
) => {
  return (
    await knex
      .select<TextFeedback[]>("*")
      .from("textFeedbacks")
      .where("sampleGroupId", sampleGroupId)
  ).filter(({ deleted }) => !deleted);
};

export const textFeedbackDelete = async (id: number) => {
  await knex("textFeedbacks")
    .update({
      deleted: true,
      updatedAt: new Date().getTime(),
    })
    .where("id", id);

  logger.info("Text feedback with id = %s deleted", id);
};
