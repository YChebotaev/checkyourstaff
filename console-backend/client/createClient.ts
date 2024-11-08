import axios from "axios";
import {
  type StatsResp,
  type AccountsResp,
  type ChartsDataResp,
  type SampleGroupsData,
  type TextFeedbackResp,
  type AuthVerifyData,
  type AuthVerifyQuery,
  TestLoginData,
} from "../types";

export const createClient = ({
  baseURL,
  getToken,
  onError
}: {
  baseURL: string;
  getToken(): string | undefined;
  onError?(error: any): void
}) => {
  const client = axios.create({
    baseURL,
  });

  client.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  if (onError) {
    client.interceptors.response.use(undefined, (error) => {
      onError(error)
    })
  }

  return {
    async authVerify({
      id,
      firstName,
      lastName,
      username,
      photoUrl,
      authDate,
      hash,
    }: {
      id: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      photoUrl?: string;
      authDate: string;
      hash: string;
    }) {
      const { data } = await client.get<AuthVerifyData>("/auth/verify", {
        params: {
          id,
          first_name: firstName,
          last_name: lastName,
          username,
          photo_url: photoUrl,
          auth_date: authDate,
          hash,
        } satisfies AuthVerifyQuery,
      });

      return data;
    },
    async authTest() {
      const { data } = await client.post<TestLoginData>('/auth/test-login')

      return data
    },
    async getAccounts() {
      const { data } = await client.get<AccountsResp>("/accounts");

      return data;
    },
    async getStats({ accountId }: { accountId: number }) {
      const { data } = await client.get<StatsResp>("/stats", {
        params: { accountId },
      });

      return data;
    },
    async getCharts({
      accountId,
      sampleGroupId,
    }: {
      accountId: number;
      sampleGroupId: number;
    }) {
      const { data } = await client.get<ChartsDataResp>("/charts", {
        params: { accountId, sampleGroupId },
      });

      return data;
    },
    async getSampleGroups({ accountId }: { accountId: number }) {
      const { data } = await client.get<SampleGroupsData>("/sampleGroups", {
        params: { accountId },
      });

      return data;
    },
    async getTextFeedback({ accountId }: { accountId: number }) {
      const { data } = await client.get<TextFeedbackResp>("/textFeedback", {
        params: { accountId },
      });

      return data;
    },
    async sendMessage({
      feedbackId,
      username,
      role,
    }: {
      feedbackId: number;
      username: string;
      role: string;
    }) {
      const { data } = await client.post("/sendMessage", {
        feedbackId,
        username,
        role,
      });

      return data;
    },
    async deleteFeedback({ feedbackId }: { feedbackId: number }) {
      const { data } = await client.post("/deleteFeedback", {
        feedbackId,
      });

      return data;
    },
  };
};

export type ConsoleBackendClient = ReturnType<typeof createClient>
