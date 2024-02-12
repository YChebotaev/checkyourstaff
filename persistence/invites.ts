import { knex } from "./knex";
import { logger } from "./logger";
import type { ContactRecord, Invite } from "./types";
import { validateInviteContacts } from './schema'
import { maybeParseJson } from './utils'

export const inviteCreate = async ({
  sampleGroupId,
  contacts,
  // email = null,
  // phone = null,
}: {
  sampleGroupId: number;
  contacts: ContactRecord[]
  // email?: string | null;
  // phone?: string | null;
}) => {
  const contactsStr = validateInviteContacts(contacts)
    ? JSON.stringify(contacts)
    : undefined

  if (contactsStr == null) {
    throw new Error(`Contacts not valid: ${JSON.stringify(validateInviteContacts.errors)}`)
  }

  const [{ id }] = await knex
    .insert({
      sampleGroupId,
      contacts: contactsStr,
      // email,
      // phone,
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

  return {
    ...invite,
    contacts: maybeParseJson(invite.contacts)
  } as Invite;
};

/**
 * @todo Make query more efficient
 */
export const invitesGetByContacts = async (contacts: string[]) => {
  return (await knex
    .select<Invite[]>('*')
    .from('invites')).filter(invite => {
      for (const { value } of maybeParseJson<ContactRecord[]>(invite.contacts)) {
        return contacts.includes(value)
      }
    })
}

export const inviteDelete = async (id: number) => {
  await knex("invites")
    .update({
      deleted: true,
      updatedAt: new Date().getTime(),
    })
    .where("id", id);

  logger.info("Invite with id = %s deleted", id);
};
