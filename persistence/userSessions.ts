import { knex } from "./knex";
import { logger } from "./logger";
import type {
  ChatState,
  ChatStatePayload,
  ChatStateType,
  UserSession,
  UserSessionType,
} from "./types";

export const DEFAULT_CHAT_STATE: ChatState = {
  name: "noop",
};

export const userSessionCreate = async <
  P extends ChatStatePayload = ChatStatePayload,
>({
  type,
  userId,
  tgChatId,
  tgUserId,
  chatState = DEFAULT_CHAT_STATE,
}: {
  type: UserSessionType;
  userId: number;
  tgChatId: number;
  tgUserId: number;
  chatState?: ChatState<P>;
}) => {
  const [{ id }] = await knex
    .insert({
      type,
      userId,
      tgChatId,
      tgUserId,
      chatState: JSON.stringify(chatState),
      createdAt: new Date().getTime(),
    })
    .into("userSessions")
    .returning("id");

  logger.info("User session created with id = %s", id);

  return id as number;
};

export const userSessionGet = async (id: number) => {
  const userSession = await knex
    .select("*")
    .from("userSessions")
    .where("id", id)
    .first<UserSession>();

  if (!userSession) {
    logger.warn("User session with id = %s not found", id);

    return;
  }

  if (userSession.deleted) {
    logger.warn("User session with id = %s was found, but deleted", id);

    return;
  }

  return userSession;
};

export const userSessionGetByChatId = async (
  type: UserSessionType,
  tgChatId: number,
) => {
  const userSession = await knex
    .select("*")
    .from("userSessions")
    .where("tgChatId", tgChatId)
    .andWhere("type", type)
    .first<UserSession>();

  if (!userSession) {
    logger.warn("User session with chat id = %s not found", tgChatId);

    return;
  }

  if (userSession.deleted) {
    logger.warn(
      "User session with id = %s were found but deleted",
      userSession.id,
    );

    return;
  }

  return userSession;
};

export const userSessionGetByUserId = async (userId: number) => {
  const userSession = await knex
    .select("*")
    .from("userSessions")
    .where("userId", userId)
    .first<UserSession>();

  if (!userSession) {
    logger.warn("User session with user id = %s not found", userId);

    return;
  }

  if (userSession.deleted) {
    logger.warn(
      "User session with id = %s were found but deleted",
      userSession.id,
    );

    return;
  }

  return userSession;
};

export const userSessionGetByTgUserId = async (
  type: UserSessionType,
  tgUserId: number,
) => {
  const userSession = await knex
    .select("*")
    .from("userSessions")
    .where("tgUserId", tgUserId)
    .andWhere("type", type)
    .first<UserSession>();

  if (!userSession) {
    logger.warn("User session with tg user id = %s not found", tgUserId);

    return;
  }

  if (userSession.deleted) {
    logger.warn(
      "User session with id = %s were found but deleted",
      userSession.id,
    );

    return;
  }

  return userSession;
};

export const userSessionSetChatState = async <
  P extends ChatStatePayload = ChatStatePayload,
>(
  id: number,
  name: ChatStateType,
  payload?: P,
) => {
  await knex("userSessions")
    .update({ chatState: JSON.stringify({ name, payload }) })
    .where("id", id)
    .returning("id");
};

export const userSessionDelete = async (id: number) => {
  await knex("userSessions")
    .update({
      deleted: true,
      updatedAt: new Date().getTime(),
    })
    .where("id", id);

  logger.info("User session with id = %s deleted", id);
};
