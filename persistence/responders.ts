import { knex } from "./knex";
import { logger } from "./logger";
import type { Responder } from "./types";

export const responderCreate = async ({
  sampleGroupId,
  userId,
  inviteId,
}: {
  sampleGroupId: number;
  userId: number;
  inviteId: number
}) => {
  const [{ id }] = await knex
    .insert({
      sampleGroupId,
      userId,
      inviteId,
      createdAt: new Date().getTime(),
    })
    .into("responders")
    .returning("id");

  logger.info(
    "Responder created with id = %s for sample group id = %s",
    id,
    sampleGroupId,
  );

  return id as number;
};

export const responderGet = async (id: number) => {
  const responder = await knex
    .select("*")
    .from("responders")
    .where("id", id)
    .first<Responder>();

  if (!responder) {
    logger.warn("Responder with id = %s not found", id);

    return;
  }

  if (responder.deleted) {
    logger.warn("Responder with id = %s was found, but deleted", id);

    return;
  }

  return responder;
};

export const respondersGetBySampleGroupId = async (sampleGroupId: number) => {
  return (
    await knex
      .select<Responder[]>("*")
      .from("responders")
      .where("sampleGroupId", sampleGroupId)
  ).filter((responder) => !responder.deleted);
};

export const responderGetBySampleGroupIdAndUserId = async (
  sampleGroupId: number,
  userId: number,
) => {
  const responder = await knex
    .select<Responder[]>("*")
    .from("responders")
    .where("sampleGroupId", sampleGroupId)
    .andWhere("userId", userId)
    .first();

  if (!responder) {
    logger.warn(
      "Responder with sample group id = %s and user id = %s not found",
      sampleGroupId,
      userId,
    );

    return;
  }

  if (responder.deleted) {
    logger.warn(
      "Responder with sample group id = %s and user id = %s found, but deleted",
      sampleGroupId,
      userId,
    );

    return;
  }

  return responder;
};

export const respondersGetByUserId = async (userId: number) => {
  return (
    await knex
      .select<Responder[]>("*")
      .from("responders")
      .where("userId", userId)
  ).filter(({ deleted }) => !deleted);
};

export const respondersGetByInviteId = async (inviteId: number) => {
  return (
    await knex
      .select<Responder[]>("*")
      .from("responders")
      .where("inviteId", inviteId)
  ).filter(({ deleted }) => !deleted);
}

export const responderDelete = async (id: number) => {
  await knex("responders")
    .update({
      deleted: true,
      updatedAt: new Date().getTime(),
    })
    .where("id", id);

  logger.info("Responder with id = %s deleted", id);
};
