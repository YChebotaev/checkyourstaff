import axios from "axios";
import type {
  StatsResp,
  AccountsResp,
  ChartsDataResp,
  SampleGroupsData,
  TextFeedbackResp,
  AuthVerifyData,
  AuthVerifyQuery,
} from "../types";

export const createClient = ({
  baseURL,
  getToken,
}: {
  baseURL: string;
  getToken(): string | undefined;
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
    async getAccounts() {
      const { data } = await client.get<AccountsResp>("/accounts");

      return data;
    },
    async getStats() {
      const { data } = await client.get<StatsResp>("/stats");

      return data;
    },
    async getCharts() {
      const { data } = await client.get<ChartsDataResp>("/charts");

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
