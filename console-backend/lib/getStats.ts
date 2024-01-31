import { groupBy, last, mapValues, union } from "lodash";
import plural from "plural-ru";
import {
  pollAnswersGetByPollQuestionIdAndPollSessionIdAndSampleGroupId,
  pollQuestionsGetByPollId,
  sampleGroupsGetByAccountId,
  pollAnswersGetByAndPollSessionIdAndSampleGroupId,
  pollAnswersGetByPollSessionId,
  pollSessionsGetByAccountId,
  pollSessionsGetLastTwoByAccountIdAndSampleGroupId,
  type PollAnswer,
  type PollQuestion,
} from "@checkyourstaff/persistence";
import { calculatePollAnswersAverage } from "@checkyourstaff/common/calculatePollAnswersAverage";
import type { StatsGroup, StatsPollResult } from "../types";

const getPollSessionsByAccountIdAndSampleGroupId = async (
  accountId: number,
  sampleGroupId: number,
) => {
  return pollSessionsGetLastTwoByAccountIdAndSampleGroupId(
    accountId,
    sampleGroupId,
  );
};

const getPollQuestions = async (pollId: number) => {
  return (await pollQuestionsGetByPollId(pollId)).sort((a, b) => a.id - b.id);
};

const pluralizeEmployees = (count: number) => {
  return plural(count, "Сотрудник", "Сотрудника", "Сотрудников");
};

export const getStats = async ({ accountId }: { accountId: number }) => {
  type GeneralAnswersRecord = {
    question: PollQuestion;
    answers: PollAnswer[];
  };

  const generalLastAnswers: GeneralAnswersRecord[] = [];
  const generalPrevAnswers: GeneralAnswersRecord[] = [];
  const groups: StatsGroup[] = [];
  const sampleGroups = await sampleGroupsGetByAccountId(accountId);

  for (const sampleGroup of sampleGroups) {
    const group: StatsGroup = {
      title: sampleGroup.name,
      values: [],
    };

    groups.push(group);

    const pollSessions = await getPollSessionsByAccountIdAndSampleGroupId(
      accountId,
      sampleGroup.id,
    );

    const lastSession = last(pollSessions);

    if (lastSession) {
      const prevSession = pollSessions[pollSessions.length - 2];
      const lastSessionQuestions = await getPollQuestions(lastSession.pollId);

      if (prevSession) {
        const prevSessionQuestions = await getPollQuestions(prevSession.pollId);

        const questionsIds = union(
          lastSessionQuestions.map(({ id }) => id),
          prevSessionQuestions.map(({ id }) => id),
        );

        for (const pollQuestionId of questionsIds) {
          const pollQuestion =
            lastSessionQuestions.find(({ id }) => pollQuestionId === id) ||
            prevSessionQuestions.find(({ id }) => pollQuestionId === id);

          if (!pollQuestion) {
            continue;
          }

          const lastPollAnswers =
            await pollAnswersGetByPollQuestionIdAndPollSessionIdAndSampleGroupId(
              pollQuestionId,
              lastSession.id,
              sampleGroup.id,
            );

          const lastPollAnswersAverage =
            calculatePollAnswersAverage(lastPollAnswers);

          const prevPollAnswers =
            await pollAnswersGetByPollQuestionIdAndPollSessionIdAndSampleGroupId(
              pollQuestionId,
              prevSession.id,
              sampleGroup.id,
            );

          const prevPollAnswersAverage =
            calculatePollAnswersAverage(prevPollAnswers);

          generalLastAnswers.push({
            question: pollQuestion,
            answers: lastPollAnswers,
          });
          generalPrevAnswers.push({
            question: pollQuestion,
            answers: prevPollAnswers,
          });

          group.values.push({
            sampleGroupId: sampleGroup.id,
            title: pollQuestion.text,
            value: lastPollAnswersAverage,
            differencePercentage: Math.round(
              (lastPollAnswersAverage / prevPollAnswersAverage - 1) * 100,
            ),
          });
        }
      } else {
        for (const pollQuestion of lastSessionQuestions) {
          const lastPollAnswers =
            await pollAnswersGetByPollQuestionIdAndPollSessionIdAndSampleGroupId(
              pollQuestion.id,
              lastSession.id,
              sampleGroup.id,
            );

          const lastPollAnswersAverage =
            calculatePollAnswersAverage(lastPollAnswers);

          generalLastAnswers.push({
            question: pollQuestion,
            answers: lastPollAnswers,
          });

          group.values.push({
            title: pollQuestion.text,
            value: lastPollAnswersAverage,
            sampleGroupId: sampleGroup.id,
          });
        }
      }
    }

    // #region подсчет количества участников опроса по группам
    if (lastSession) {
      const pollQuestions = await pollQuestionsGetByPollId(lastSession.pollId);
      const lastPollAnswers =
        await pollAnswersGetByAndPollSessionIdAndSampleGroupId(
          lastSession.id,
          sampleGroup.id,
        );
      const lastCount = lastPollAnswers.length / pollQuestions.length;
      const prevSession = pollSessions[pollSessions.length - 2];

      if (prevSession) {
        const prevPollAnswers =
          await pollAnswersGetByAndPollSessionIdAndSampleGroupId(
            prevSession.id,
            sampleGroup.id,
          );
        const prevCount = prevPollAnswers.length / pollQuestions.length;

        group.values.push({
          title: pluralizeEmployees(lastCount),
          value: lastCount,
          differencePercentage: Math.round((lastCount / prevCount - 1) * 100),
        });
      } else {
        group.values.push({
          title: pluralizeEmployees(lastCount),
          value: lastCount,
        });
      }
    } else {
      group.values.push({
        title: pluralizeEmployees(0),
        value: 0,
      });
    }
    // #endregion
  }

  const generalLastAnswersGroupdByQuestions = mapValues(
    groupBy(generalLastAnswers, ({ question }) => question.aggregationIndex),
    (items) => items.flatMap(({ answers }) => answers),
  );
  const generalPrevAnswersGroupdByQuestions = mapValues(
    groupBy(generalPrevAnswers, ({ question }) => question.aggregationIndex),
    (items) => items.flatMap(({ answers }) => answers),
  );
  const generalAnswersGroupsUnion = union(
    Object.keys(generalLastAnswersGroupdByQuestions),
    Object.keys(generalPrevAnswersGroupdByQuestions),
  );
  const general = generalAnswersGroupsUnion.map((groupId) => {
    const question =
      generalLastAnswers.find(
        ({ question }) => groupId === String(question.aggregationIndex),
      )?.question ||
      generalPrevAnswers.find(
        ({ question }) => groupId === String(question.aggregationIndex),
      )?.question;
    const prev = generalPrevAnswersGroupdByQuestions[groupId];
    const last = generalLastAnswersGroupdByQuestions[groupId];

    const lastAverage = calculatePollAnswersAverage(last);

    if (prev) {
      const prevAverage = calculatePollAnswersAverage(prev);

      return {
        title: question?.text,
        value: lastAverage,
        differencePercentage: Math.round((lastAverage / prevAverage - 1) * 100),
      } as StatsPollResult;
    } else {
      return {
        title: question?.text,
        value: lastAverage,
      };
    }
  });

  // #region подсчет количества участников опроса в общем
  const pollSessions = await pollSessionsGetByAccountId(accountId);
  const lastSession = last(pollSessions);

  if (lastSession) {
    const pollQuestions = await pollQuestionsGetByPollId(lastSession.pollId);
    const prevSession = pollSessions[pollSessions.length - 2];
    const lastPollAnswers = await pollAnswersGetByPollSessionId(lastSession.id);
    const lastCount = lastPollAnswers.length / pollQuestions.length;

    if (prevSession) {
      const prevPollAnswers = await pollAnswersGetByPollSessionId(
        prevSession.id,
      );
      const prevCount = prevPollAnswers.length / pollQuestions.length;

      general.push({
        title: pluralizeEmployees(lastCount),
        value: lastCount,
        differencePercentage: Math.round((lastCount / prevCount - 1) * 100),
      });
    } else {
      general.push({
        title: pluralizeEmployees(lastCount),
        value: lastCount,
      });
    }
  } else {
    general.push({
      title: pluralizeEmployees(0),
      value: 0,
    });
  }
  // #endregion

  return {
    general,
    groups,
  };
};
