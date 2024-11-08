import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import {
  sampleGroupsGetByAccountId,
  textFeedbackDelete,
} from "@checkyourstaff/persistence";
import {
  logger,
  getCorsOrign,
  authVerify,
  getStats,
  getCharts,
  getTextFeedback,
  getAccountsOfUser,
  tokenGuard,
  accountGuard,
  sendMessageToTextFeedback,
  createToken,
} from ".";
import type { AuthVerifyQuery } from "../types";

export const createApp = async () => {
  const app = fastify({ loggerInstance: logger });

  await app.register(fastifyCors, {
    origin: getCorsOrign(),
    credentials: true,
  });
  await app.register(fastifySwagger as any, {
    swagger: {
      info: {
        title: 'Console Backend Service',
        description: '',
        version: '0.2.0'
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  })

  app.get<{
    Querystring: AuthVerifyQuery;
  }>("/auth/verify", {
    schema: {
      querystring: {
        type: "object",
        required: ["auth_date", "hash"],
        properties: {
          first_name: { type: "string" },
          last_name: { type: "string" },
          username: { type: "string" },
          photo_url: { type: "string" },
          auth_date: { type: "string" },
          hash: { type: "string" },
        },
      },
    },
    async handler({ query }) {
      const result = await authVerify(query);

      if (!result.valid) {
        logger.error("Auth verify hash is invalid: %s", JSON.stringify(query));
      }

      return result;
    },
  });

  if (process.env.ENABLE_TEST_ACCOUNT) {
    app.post('/auth/test-login', () => {
      const token = createToken({
        id: '350570845',
        first_name: 'Юра',
        last_name: 'Чеботаев',
        username: 'ychebotaev',
        photo_url: '--not-set--',
        auth_date: '--not-used-for-now--',
        hash: '--not-used-form-now--'
      })

      return { token }
    })
  }

  app.get("/accounts", async ({ headers }) => {
    const { tgUserId } = tokenGuard(headers);

    return getAccountsOfUser({ tgUserId });
  });

  app.get<{
    Querystring: {
      accountId: string;
    };
  }>("/stats", {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          accountId: { type: 'number' }
        }
      }
    }
  }, async ({ headers, query: { accountId: accountIdStr } }) => {
    const { tgUserId } = tokenGuard(headers);
    const accountId = Number(accountIdStr);

    await accountGuard({ tgUserId, accountId });

    return getStats({ accountId });
  });

  app.get<{
    Querystring: {
      accountId: string;
    };
  }>("/sampleGroups", async ({ headers, query: { accountId: accountIdStr } }) => {
    const { tgUserId } = tokenGuard(headers);
    const accountId = Number(accountIdStr);

    await accountGuard({ tgUserId, accountId });

    return sampleGroupsGetByAccountId(accountId);
  });

  app.get<{
    Querystring: {
      accountId: string;
      sampleGroupId: string;
    };
  }>(
    "/charts",
    async ({
      headers,
      query: { accountId: accountIdStr, sampleGroupId: sampleGroupIdStr },
    }) => {
      const { tgUserId } = tokenGuard(headers);
      const accountId = Number(accountIdStr);
      const sampleGroupId = Number(sampleGroupIdStr);

      await accountGuard({ tgUserId, accountId });

      return getCharts({ accountId, sampleGroupId });
    },
  );

  app.get<{
    Querystring: {
      accountId: string;
    };
  }>("/textFeedback", async ({ headers, query: { accountId: accountIdStr } }) => {
    const { tgUserId } = tokenGuard(headers);
    const accountId = Number(accountIdStr);

    await accountGuard({ tgUserId, accountId });

    return getTextFeedback({ accountId });
  });

  app.post<{
    Body: {
      feedbackId: string;
    };
  }>("/deleteFeedback", {
    schema: {
      body: {
        type: "object",
        required: ["feedbackId"],
        properties: {
          feedbackId: { type: "string" },
        },
      },
    },
    async handler({ headers, body: { feedbackId: feedbackIdStr } }) {
      tokenGuard(headers);

      // TODO: More sophisticated authorization control

      const feedbackId = Number(feedbackIdStr);

      await textFeedbackDelete(feedbackId);
    },
  });

  app.post<{
    Body: {
      feedbackId: string;
      role: string;
      username: string;
    };
  }>("/sendMessage", {
    schema: {
      body: {
        type: "object",
        required: ["feedbackId", "role", "username"],
        properties: {
          feedbackId: { type: "string" },
          role: { type: "string" },
          username: { type: "string" },
        },
      },
    },
    async handler({
      headers,
      body: { feedbackId: feedbackIdStr, role, username },
    }) {
      tokenGuard(headers);

      // TODO: More sophisticated authorization control

      const textFeedbackId = Number(feedbackIdStr);

      await sendMessageToTextFeedback({
        textFeedbackId,
        role,
        username,
      });
    },
  });

  await app.register(fastifySwaggerUi as any, {
    routePrefix: '/docs',
    uiConfig: {
      deepLinking: true
    }
  })

  return app
}
