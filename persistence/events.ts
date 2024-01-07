import { EventEmitter } from "node:events";
import { knex } from "./knex";
import { logger } from "./logger";
import type { Event } from "./types";

export const eventCreate = async <P>({
  type,
  payload,
}: {
  type: string;
  payload: P;
}) => {
  const [{ id }] = await knex
    .insert({
      type,
      payload: JSON.stringify(payload),
      createdAt: knex.fn.now(),
    })
    .into("events")
    .returning("id");

  logger.info(
    "Event created with type = %s and payload = %s",
    type,
    JSON.stringify(payload),
  );

  return id as number;
};

export const eventsGetSince = async <P>(since: Date): Promise<Event<P>[]> => {
  return knex
    .select("*")
    .from("events")
    .where("createdAt", ">=", since.toISOString())
    .andWhere(knex.raw("deleted <> FALSE"));
};

export const eventDelete = async (id: number) => {
  await knex("events")
    .update({
      deleted: true,
      updatedAt: knex.fn.now(),
    })
    .where("id", id);

  logger.info("Event with id = %s deleted", id);
};

export const createEventCreator = <OP, TP>(
  type: string,
  transformPayload?: (payload: OP) => TP,
) => {
  return (payload: any) => {
    return eventCreate({
      type,
      payload: transformPayload ? transformPayload(payload) : payload,
    });
  };
};

export const createEventProcessor = (pollInterval = 300) => {
  const emitter = new EventEmitter();
  let since = new Date();

  const intervalId = setInterval(async () => {
    const events = await eventsGetSince(since);

    since = new Date();

    for (const event of events) {
      emitter.emit(event.type, event.payload, () => eventDelete(event.id));
    }
  }, pollInterval);

  return Object.assign(emitter, {
    stop() {
      clearInterval(intervalId);
    },
  });
};
