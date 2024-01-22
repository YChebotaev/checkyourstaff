import type {
  StatsResp,
  ChartsDataResp,
  TextFeedbackResp,
  AccountsResp,
} from "@checkyourstaff/console-backend/types";

export type SelectAccountLoaderResult = {
  accounts: AccountsResp;
};

export type StatsLoaderResult = {
  stats: StatsResp;
};

export type ChartsLoaderResult = {
  sampleGroupId: number;
  chartsData: ChartsDataResp;
};

export type FeedbackLoaderResult = {
  feedbackData: TextFeedbackResp;
};
