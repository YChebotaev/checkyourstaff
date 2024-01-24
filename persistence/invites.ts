import { knex } from "./knex";
import { logger } from "./logger";
import { Invite } from "./types";

export const inviteCreate = async ({
  sampleGroupId,
  email = null,
  phone = null,
}: {
  sampleGroupId: number;
  email?: string | null;
  phone?: string | null;
}) => {
  const [{ id }] = await knex
    .insert({
      sampleGroupId,
      email,
      phone,
      createdAt: new Date().getTime(),
    })
    .into("invites")
    .returning("id");

  logger.info(
    'Invite created with id = %s for sample group id = "%s"',
    id,
    sampleGroupId,
  );

  return id as number;
};

export const inviteGet = async (id: number) => {
  const invite = await knex
    .select("*")
    .from("invites")
    .where("id", id)
    .first<Invite>();

  if (!invite) {
    logger.warn("Invite with id = %s not found", id);

    return;
  }

  if (invite.deleted) {
    logger.warn("Invite with id = %s found but deleted", id);

    return;
  }

  return invite;
};

export const inviteDelete = async (id: number) => {
  await knex("invites")
    .update({
      deleted: true,
      updatedAt: new Date().getTime(),
    })
    .where("id", id);

  logger.info("Invite with id = %s deleted", id);
};
