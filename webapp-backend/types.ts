export type BotType = 'polling-bot' | 'control-bot'

export type VerifyBody = {
  initData: string;
  bot: "control-bot" | "polling-bot";
};

export type VerifyData = {
  valid: boolean;
};

export type CompleteRegistrationBody = {
  name: string;
  groupName: string;
  list: string;
  tgChatId: string;
  userId: string;
};

export type PollSessionData = {
  id: number;
  text: string;
  minScore: number;
  maxScore: number;
  textFeedbackRequestTreshold: number;
}[];

export type ClosePollSessionQuery = {
  pollSessionId: string;
  tgUserId: string;
};

export type ClosePollSessionBody = {
  finalFeedback?: string;
  answers: {
    id: number;
    score: number;
    textFeedback?: string;
  }[];
};
