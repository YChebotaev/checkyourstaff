import { PollAnswer } from "@checkyourstaff/persistence";

export const calculatePollAnswersAverage = (pollAnswers: PollAnswer[]) => {
  const sum = pollAnswers.reduce((sum, { score }) => sum + score, 0);

  return sum / pollAnswers.length;
};
