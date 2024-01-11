import { UnrecoverableError } from "bullmq";
import {
  pollGet,
  sampleGroupGet,
  respondersGetBySampleGroupId,
  pollQuestionsGetByPollId,
  pollSessionCreate,
  pollSessionGet,
  userSessionGetByUserId,
} from "@checkyourstaff/persistence";
import { logger } from "./logger";
import { notifyPollTelegramQueue } from "./notifyPollTelegramQueue";
import { createPollSessionURL } from "./generatePollSessionURL";

const webappUrl = process.env["WEBAPP_URL"];

if (!webappUrl) {
  logger.fatal("WEBAPP_URL environment variable must be provided");

  process.exit(1);
}

export const spinPoll = async (pollId: number, sampleGroupId: number) => {
  const poll = await pollGet(pollId);
  const sampleGroup = await sampleGroupGet(sampleGroupId);
  const responders = await respondersGetBySampleGroupId(sampleGroupId);
  const pollQuestions = await pollQuestionsGetByPollId(pollId);

  if (!poll) {
    logger.warn("Poll with id = %s not found or deleted", pollId);

    throw new UnrecoverableError(
      `Poll with id = ${pollId} not found or deleted`,
    );
  }

  if (!sampleGroup) {
    logger.warn(
      "Sample group with id = %s not found or deleted",
      sampleGroupId,
    );

    throw new UnrecoverableError(
      `Sample group with id = ${sampleGroupId} not found or deleted`,
    );
  }

  if (pollQuestions.length && responders.length) {
    const pollSessionId = await pollSessionCreate({
      pollId,
      accountId: poll.accountId,
      sampleGroupId,
      /** @todo: Remove pollingState completely */
      pollingState: responders.reduce(
        (state, responder) =>
          Object.assign(state, {
            [responder.id]: pollQuestions.map(({ id }) => id),
          }),
        {},
      ),
    });
    const pollSession = await pollSessionGet(pollSessionId);

    if (!pollSession) {
      logger.error("Poll session id = %s not found or deleted", pollSessionId);

      throw new UnrecoverableError(
        `Poll session id = ${pollSessionId} not found or deleted`,
      );
    }

    await notifyPollTelegramQueue.addBulk(
      await Promise.all(
        responders.map(async (responder) => {
          const userSession = await userSessionGetByUserId(responder.userId);

          if (!userSession) {
            logger.error(
              "User session by userId = %s not found or deleted",
              responder.userId,
            );

            throw new UnrecoverableError(
              `User session by userId = ${responder.userId} not found or deleted`,
            );
          }

          const pollSessionURL = createPollSessionURL({
            webappUrl,
            fromBot: "polling-bot",
            responderId: responder.id,
            pollSessionId,
          });

          return {
            name: "notify-poll-telegram",
            data: {
              chatId: userSession.chatId,
              pollSessionURL: pollSessionURL.toString(),
              text: "Пройти опрос",
            },
            opts: {
              attempts: 3,
              backoff: {
                type: "exponential",
                delay: 5000,
              },
            },
          };
        }),
      ),
    );
  }
};
