import { knex } from "./knex";
import { logger } from "./logger";
import type { PollSession } from "./types";

export const pollSessionCreate = async ({
  pollId,
  accountId,
  sampleGroupId,
}: {
  pollId: number;
  accountId: number;
  sampleGroupId: number;
}) => {
  const [{ id }] = await knex
    .insert({
      pollId,
      accountId,
      sampleGroupId,
      createdAt: new Date().getTime(),
    })
    .into("pollSessions")
    .returning("id");

  logger.info(
    "Poll session created with id = %s for sample group id = %s and poll id = %s",
    id,
    sampleGroupId,
    pollId,
  );

  return id as number;
};

export const pollSessionGet = async (id: number) => {
  const pollSession = await knex
    .select("*")
    .from("pollSessions")
    .where("id", id)
    .first<PollSession>();

  if (!pollSession) {
    logger.warn("Poll session with id = %s not found", id);

    return;
  }

  if (pollSession.deleted) {
    logger.warn("Poll session with id = %s was found but deleted", id);

    return;
  }

  return pollSession;
};

export const pollSessionsGetByAccountId = async (accountId: number) => {
  return (
    await knex
      .select<PollSession[]>("*")
      .from("pollSessions")
      .where("accountId", accountId)
  ).filter(({ deleted }) => !deleted);
};

export const pollSessionsGetByAccountIdAndSampleGroupId = async (
  accountId: number,
  sampleGroupId: number,
) => {
  return (
    await knex
      .select<PollSession[]>("*")
      .from("pollSessions")
      .where("accountId", accountId)
      .andWhere("sampleGroupId", sampleGroupId)
  ).filter(({ deleted }) => !deleted);
};

export const pollSessionsGetLastTwoByAccountIdAndSampleGroupId = async (
  accountId: number,
  sampleGroupId: number,
) => {
  return (
    await knex
      .select<PollSession[]>("*")
      .from("pollSessions")
      .where("accountId", accountId)
      .andWhere("sampleGroupId", sampleGroupId)
      .limit(2)
      .orderBy("createdAt")
  ).filter(({ deleted }) => !deleted);
};

export const pollSessionsGetByPollId = async (pollId: number) => {
  return (
    await knex
      .select<PollSession[]>("*")
      .from("pollSessions")
      .where("pollId", pollId)
  ).filter(({ deleted }) => !deleted);
};
