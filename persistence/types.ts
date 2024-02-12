export type Account = {
  id: number;
  name: string | null;
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string | null;
};

export type User = {
  id: number;
  name: string | null; // Актуально для администраторов
  email: string | null; // Актуально для администраторов
  phone: string | null; // Актуально для администраторов
  username: string | null; // Данные из Телеграмма
  firstName: string | null; // Данные из Телеграмма
  lastName: string | null; // Данные из Телеграмма
  languageCode: string | null; // Данные из Телеграмма
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string | null;
};

export type AccountAdministrator = {
  id: number;
  accountId: number;
  userId: number;
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string | null;
};

export type SampleGroup = {
  id: number;
  accountId: number;
  name: string;
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string | null;
};

export type Responder = {
  id: number;
  sampleGroupId: number;
  userId: number;
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string | null;
};

export type Poll = {
  id: number;
  accountId: number;
  name: string;
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string | null;
};

export type PollQuestion = {
  id: number;
  accountId: number;
  pollId: number;
  aggregationIndex: number;
  text: string;
  minScore: number;
  maxScore: number;
  textFeedbackRequestTreshold: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type PollSession = {
  id: number;
  pollId: number;
  accountId: number;
  sampleGroupId: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type PollAnswer = {
  id: number;
  userId: number;
  pollQuestionId: number;
  pollSessionId: number;
  sampleGroupId: number;
  score: number;
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string | null;
};

export type TextFeedback = {
  id: number;
  userId: number;
  accountId: number;
  sampleGroupId: number;
  pollId: number;
  pollQuestionId: number | null;
  pollSessionId: number | null;
  text: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type PinCodeGenerator = {
  id: number;
  size: number; // 4
  accountId: number;
  sampleGroupId: number;
  generatedCount: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type PinCode = {
  id: number;
  accountId: number;
  sampleGroupId: number;
  code: string;
  used: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type MessageMetaTypes = "enter-pin" | "enter-free-form-feedback";

export type MessageMeta = {
  id: number;
  accountId: number | null;
  sampleGroupId: number | null;
  messageId: number; // Telegram message id
  tgChatId: number; // Telegram chat id
  userId: number;
  pollId: number | null;
  pollQuestionId: number | null;
  pollSessionId: number | null;
  responderId: number | null;
  type: MessageMetaTypes;
  deleted: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type ChatStateType =
  | "init"
  | "noop"
  | "enter-pin"
  | "enter-free-form-feedback";

export type ChatStatePayload = any;

export type ChatState<P extends ChatStatePayload = ChatStatePayload> = {
  name: ChatStateType;
  payload?: P;
};

export type UserSessionType = "control" | "polling";

export type UserSession<P extends ChatStatePayload = ChatStatePayload> = {
  id: number;
  type: UserSessionType;
  userId: number;
  tgChatId: number;
  tgUserId: number;
  chatState: ChatState<P>;
  deleted: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type ContactRecord = {
  type: 'email' | 'phone'
  value: string
}

export type Invite = {
  id: number;
  sampleGroupId: number;
  // email: string | null;
  // phone: string | null;
  contacts: ContactRecord[]
  deleted: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type JobTypes = "poll-session";

export type Job = {
  id: number;
  pollId: number;
  sampleGroupId: number;
  type: JobTypes;
  cron: string;
  timeZone: string;
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string | null;
};

export type Event<T> = {
  id: number;
  type: string;
  payload: T;
};
