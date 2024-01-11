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
  chatId: string;
  userId: string;
};

export type PollSessionData = {
  id: number;
  text: string;
  minScore: number;
  maxScore: number;
  textFeedbackRequestTreshold: number;
}[];

export type ClosePollSessionBody = {
  finalFeedback?: string;
  answers: {
    id: number;
    score: number;
    textFeedback?: string;
  }[];
};
