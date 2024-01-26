import { knex } from "./knex";
import { logger } from "./logger";
import type { PollSession, PollingState } from "./types";

export const pollSessionCreate = async ({
  pollId,
  accountId,
  sampleGroupId,
  pollingState, // TODO: Remove
}: {
  pollId: number;
  accountId: number;
  sampleGroupId: number;
  pollingState?: PollingState; // TODO: Remove
}) => {
  const [{ id }] = await knex
    .insert({
      pollId,
      accountId,
      sampleGroupId,
      pollingState: pollingState ? JSON.stringify(pollingState) : null, // TODO: Remove
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

// TODO: Remove
export const pollSessionUpdatePollingState = async (
  id: number,
  updater: (pollingState: PollingState) => PollingState,
) => {
  const { pollingState } = await knex
    .select("pollingState")
    .from("pollSessions")
    .where("id", id)
    .first<Pick<PollSession, "pollingState">>();

  await knex("pollSessions")
    .update({
      pollingState: JSON.stringify(updater(JSON.parse(String(pollingState)))),
    })
    .where("id", id);
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

  return {
    ...pollSession,
    pollingState: JSON.parse(String(pollSession.pollingState)), // TODO: Remove
  } as PollSession;
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
