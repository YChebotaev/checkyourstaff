import type { Account, SampleGroup } from "@checkyourstaff/persistence/types";

export type TokenPayoad = {
  tgUserId: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
};

export type AccountsResp = Account[];

export type StatsPollResult = {
  title: string;
  value: number;
  differencePercentage?: number;
  sampleGroupId?: number;
};

export type StatsGroup = {
  title: string;
  values: StatsPollResult[];
};

export type StatsResp = {
  general: StatsPollResult[];
  groups: StatsGroup[];
};

export type ChartsDataRespQuestion = {
  title: string;
  value: number;
};

export type ChartsDataRespSession = {
  date: string;
  values: ChartsDataRespQuestion[];
};

export type ChartsDataResp = ChartsDataRespSession[];

export type TextFeedbackValue = {
  id: number;
  date: string;
  text: string;
  question?: string;
  score?: number;
};

export type TextFeedbackSampleGroup = {
  title: string;
  values: TextFeedbackValue[];
};

export type TextFeedbackResp = TextFeedbackSampleGroup[];

export type AuthVerifyQuery = {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
};

export type AuthVerifyData = {
  valid: boolean;
  token?: string;
};

export type TestLoginData = {
  token: string
}

export type SampleGroupsData = SampleGroup[];
